import * as _ from 'lodash';
import * as express from 'express';

import * as cookieParser from 'cookie-parser';
import * as path from 'path';
import axios from 'axios';
import * as url from 'url';

import * as credentials from './credentials';
import * as utils from './utils';
import * as activityController from './controller/activityController';
import * as config from './config';
import * as userController from './controller/userController';
import * as userMiddleware from './middleware/userMiddleware';
import * as sessionMiddleware from './middleware/sessionMiddleware';
import * as activityDataModel from './model/activityDataModel';

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
  const pageSize = 50;
  const latestActivityDatetime = await activityDataModel.getLatestActivityTimestamp(userId);
  let pullAfter = 0;
  if (latestActivityDatetime !== undefined) {
    pullAfter = Math.floor(latestActivityDatetime.getTime() / 1000) + 1;
  }
  for (let page = 1; page < 100; page++) {
    console.log(`Fetching page ${page} for id ${userId}`);
    const allActivities = await axios({
      method: 'GET',
      url: 'https://www.strava.com/api/v3/athlete/activities',
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
      params: {
        page,
        after: pullAfter,
        per_page: pageSize,
      },
    });
    if (allActivities.data.length > 0) {
      _.each(allActivities, async (activity) => {
        await activityDataModel.insertOne(
          userId,
          activity.name,
          activity.type,
          utils.convertMetersToMiles(activity.distance),
          activity.start_date_local,
          activity.elapsed_time,
          utils.convertMetersToFeet(activity.total_elevation_gain),
        );
      });
    }
    if (allActivities.data.length < pageSize) {
      break;
    }
  }
}

app.use(cookieParser());

/**
 * Middlewares that we maintain
 */
app.use(sessionMiddleware.wrappedSessionMiddleware);
app.use(userMiddleware.attachUserMiddleware);

/**
 * TODO: separate into private and public routes
 */
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
  const response = await axios({
    method: 'POST',
    url: 'https://www.strava.com/oauth/token',
    data: {
      client_id: credentials.clientID,
      client_secret: credentials.clientSecret,
      code: req.query.code,
    },
  });
  const oauthData = response.data;
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
  const athleteTotals = await activityDataModel.aggregateActivityTypeTotals(req.userId);
  res.send(athleteTotals);
});

app.get('/api/details/:activityType', async (req, res) => {
  if (req.userId === undefined) {
    res.status(500);
    res.send();
    return;
  }
  const athleteData = await activityDataModel.getUserActivitiesByType(req.userId, req.params.activityType);
  res.send(athleteData);
});

app.get('/api/aggregate/:activityType', async (req, res) => {
  if (req.userId === undefined) {
    res.status(500);
    res.send();
    return;
  }
  const athleteData = await activityDataModel.getUserActivitiesByType(req.userId, req.params.activityType);
  res.send(activityController.aggregateActivityType(athleteData));
});

app.get('/assets/:fileName', (req, res) => res.sendFile(path.join(CLIENT_DIR, req.params.fileName)));

app.get('*', (req, res) => res.sendFile(path.join(CLIENT_DIR, 'index.html')));

app.listen(3000, async () => {
  console.log('App listening on port 3000!');
});
