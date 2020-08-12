import * as _ from 'lodash';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';
import * as request from 'request-promise-native';
import * as url from 'url';

import * as credentials from './credentials';
import * as utils from './utils';
import * as activityController from './controller/activityController';

const ATHLETE_DATA = {};

const CLIENT_DIR = path.join(__dirname, '../build/dist');

const app = express();

async function getAthleteData(bearerToken: string, athleteEmail: string) {
  if (!_.has(ATHLETE_DATA, athleteEmail)) {
    ATHLETE_DATA[athleteEmail] = [];
  } else {
    return;
  }
  for (let page = 1; page < 100; page++) {
    console.log(`Fetching page ${page} for ${athleteEmail}`);
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
      _.each(allActivities, activity => {
        const dataPoint = {
          name: activity.name,
          type: activity.type,
          distance: utils.convertMetersToMiles(activity.distance),
          date: activity.start_date_local.split('T')[0],
          elapsedTime: activity.elapsed_time,
          elevationGain: utils.convertMetersToFeet(activity.total_elevation_gain),
          averageSpeed: activity.average_speed,
        };
        ATHLETE_DATA[athleteEmail].push(dataPoint);
      });
    } else {
      break;
    }
  }
}

app.use(cookieParser());

app.use(function(req, res, next) {
  const cookieUser = req.cookies.stravaViewerUser;
  if (req.url.startsWith('/api') || req.url.startsWith('/assets')) {
    next();
    return;
  }
  if (_.isNil(cookieUser) || _.isNil(ATHLETE_DATA[cookieUser])) {
    res.redirect(
      url.format({
        pathname: 'https://www.strava.com/oauth/authorize',
        query: {
          client_id: credentials.clientID,
          redirect_uri: 'http://localhost:3000/api/oauth/redirect',
          response_type: 'code',
          approval_prompt: 'auto',
          scope: 'profile:read_all,activity:read_all',
        },
      }),
    );
  }
  next();
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
  await getAthleteData(oauthData.access_token, oauthData.athlete.email);
  res.cookie('stravaViewerUser', oauthData.athlete.email, { maxAge: 3600000, httpOnly: true, path: '/' });
  res.redirect(
    url.format({
      pathname: 'http://localhost:3000/',
    }),
  );
});

app.get('/api/logout', (req, res) => {
  res.clearCookie('stravaViewerUser');
  res.redirect(
    url.format({
      pathname: 'https://www.strava.com/logout',
    }),
  );
});

app.get('/api/total', (req, res) => {
  const cookieUser = req.cookies.stravaViewerUser;
  const activityTypeTotals = {};
  _.each(ATHLETE_DATA[cookieUser], activity => {
    if (_.isNil(activityTypeTotals[activity.type])) {
      activityTypeTotals[activity.type] = {
        distance: 0,
        elevationGain: 0,
      };
    }
    activityTypeTotals[activity.type].distance += activity.distance;
    activityTypeTotals[activity.type].elevationGain += activity.elevationGain;
  });
  const outputTotals: any[] = [];
  _.each(_.keys(activityTypeTotals), activityType => {
    outputTotals.push({
      distance: activityTypeTotals[activityType].distance,
      elevationGain: activityTypeTotals[activityType].elevationGain,
      activityType,
    });
  });
  res.send(outputTotals);
});

app.get('/api/details/:activityType', (req, res) => {
  const cookieUser = req.cookies.stravaViewerUser;
  res.send(activityController.filterActivityType(ATHLETE_DATA[cookieUser], req.params.activityType as ActivityType));
});

app.get('/api/aggregate/:activityType', (req, res) => {
  const cookieUser = req.cookies.stravaViewerUser;
  res.send(activityController.aggregateActivityType(ATHLETE_DATA[cookieUser], req.params.activityType as ActivityType));
});

app.get('/assets/:fileName', (req, res) => res.sendFile(path.join(CLIENT_DIR, req.params.fileName)));

app.get('*', (req, res) => res.sendFile(path.join(CLIENT_DIR, 'index.html')));

app.listen(3000, () => console.log('App listening on port 3000!'));
