import * as _ from 'lodash';
import * as express from 'express';
import * as session from 'express-session';
import * as connectPGSession from 'connect-pg-simple';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';
import * as request from 'request-promise-native';
import * as url from 'url';

import * as credentials from './credentials';
import * as utils from './utils';
import * as activityController from './controller/activityController';
import * as config from './config';
import * as db from './db';
import * as userController from './controller/userController';
import * as userMiddleware from './middleware/userMiddleware';
import * as activityDataModel from './model/activityDataModel';

const pgSession = connectPGSession(session);

const CLIENT_DIR = path.join(__dirname, '../build/dist');

const app = express();

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

/**
 * Retrieves data from the Strava API using a bearer token and the athleteId.
 * @param bearerToken Bearer token used by the Strava API
 * @param athleteId Id of the athlete within Strava matching the bearer token.
 */
async function getAthleteData(bearerToken: string, userId: string) {
  // TODO: limit this pull to just information that has been added since the last pull
  for (let page = 1; page < 100; page++) {
    console.log(`Fetching page ${page} for id ${userId}`);
    const allActivities = await request('https://www.strava.com/api/v3/athlete/activities', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
      qs: {
        page,
        per_page: 50,
      },
      json: true,
    });
    if (allActivities.length > 0) {
      _.each(allActivities, async (activity) => {
        await activityDataModel.insertOne(
          activity.external_id,
          userId,
          activity.name,
          activity.type,
          utils.convertMetersToMiles(activity.distance),
          activity.start_date_local,
          activity.elapsed_time,
          utils.convertMetersToFeet(activity.total_elevation_gain),
        );
      });
    } else {
      break;
    }
  }
}

app.use(cookieParser());

/**
 * TODO: separate into private and public routes
 */
app.use(
  session({
    store: new pgSession({
      pool: db.pool,
    }),
    name: config.SESSION_COOKIE,
    secret: 'keyboard cat', // TODO: change to a secret
    resave: false,
    cookie: {
      secure: config.SECURE_COOKIES,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // one day
    },
  }),
);

app.use(userMiddleware.attachUserMiddleware);

app.get('/login', async (req, res) => {
  if (req.userId === undefined) {
    res.redirect(
      url.format({
        pathname: 'https://www.strava.com/oauth/authorize',
        query: {
          client_id: credentials.clientID,
          redirect_uri: `${config.BASE_PATH}/api/oauth/redirect`,
          response_type: 'code',
          approval_prompt: 'auto',
          scope: 'activity:read_all',
        },
      }),
    );
  } else {
    res.redirect(
      url.format({
        pathname: config.BASE_PATH,
      }),
    );
  }
});

app.get('/check-login', async (req, res) => {
  res.send({
    loggedInFlag: req.userId !== undefined,
  });
});

app.get('/api/oauth/redirect', async (req, res) => {
  const oauthData = await request('https://www.strava.com/oauth/token', {
    method: 'POST',
    body: {
      client_id: credentials.clientID,
      client_secret: credentials.clientSecret,
      code: req.query.code,
    },
    json: true,
  });
  const athleteId = oauthData.athlete.id;
  const bearerToken = oauthData.access_token;
  await userController.addUser(
    athleteId,
    req.sessionID,
    oauthData.refresh_token,
    bearerToken,
    oauthData.athlete.username,
  );
  const user = await userController.getUserBySessionId(req.sessionID);
  await getAthleteData(bearerToken, user!.id);
  res.redirect(
    url.format({
      pathname: config.BASE_PATH,
    }),
  );
});

/**
 * TODO: Make a router and give it its own middleware for the API routes
 */

app.get('/api/refresh', async (req, res) => {
  if (req.userId === undefined) {
    res.status(500);
    res.send();
    return;
  }
  const user = await userController.getUserByUserId(req.userId);
  if (user && user.bearer_token) {
    await getAthleteData(user!.bearer_token, req.userId);
    res.redirect(
      url.format({
        pathname: config.BASE_PATH,
      }),
    );
  } else {
    res.status(500);
    res.send();
    return;
  }
});

app.get('/api/logout', (req, res) => {
  res.clearCookie(config.SESSION_COOKIE);
  res.redirect(
    url.format({
      pathname: config.BASE_PATH,
    }),
  );
});

app.get('/api/total', async (req, res) => {
  if (req.userId === undefined) {
    res.status(500);
    res.send();
    return;
  }
  const activityTypeTotals = {};
  const athleteData = await activityDataModel.getUserActivities(req.userId);
  _.each(athleteData, (activity) => {
    if (_.isNil(activityTypeTotals[activity.type])) {
      activityTypeTotals[activity.type] = {
        distance: 0,
        elevation_gain: 0,
      };
    }
    activityTypeTotals[activity.type].distance += activity.distance;
    activityTypeTotals[activity.type].elevationGain += activity.elevation_gain;
  });
  const outputTotals: any[] = [];
  _.each(_.keys(activityTypeTotals), (activityType) => {
    outputTotals.push({
      distance: activityTypeTotals[activityType].distance,
      elevationGain: activityTypeTotals[activityType].elevation_gain,
      activityType,
    });
  });
  res.send(outputTotals);
});

app.get('/api/details/:activityType', async (req, res) => {
  if (req.userId === undefined) {
    res.status(500);
    res.send();
    return;
  }
  const athleteData = await activityDataModel.getUserActivities(req.userId);
  res.send(activityController.filterActivityType(athleteData, req.params.activityType as ActivityType));
});

app.get('/api/aggregate/:activityType', async (req, res) => {
  if (req.userId === undefined) {
    res.status(500);
    res.send();
    return;
  }
  const athleteData = await activityDataModel.getUserActivities(req.userId);
  res.send(activityController.aggregateActivityType(athleteData, req.params.activityType as ActivityType));
});

app.get('/assets/:fileName', (req, res) => res.sendFile(path.join(CLIENT_DIR, req.params.fileName)));

app.get('*', (req, res) => res.sendFile(path.join(CLIENT_DIR, 'index.html')));

app.listen(3000, async () => {
  console.log('App listening on port 3000!');
});
