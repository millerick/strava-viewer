import * as _ from 'lodash';
import * as express from 'express';
import * as path from 'path';
import * as request from 'request-promise-native';
import * as credentials from './credentials';
import * as utils from './utils';
import * as activityController from './controller/activityController';

const ATHLETE_DATA: any[] = [];

const baseRequest = request.defaults({
  baseUrl: 'https://www.strava.com/api/v3/',
  headers: {
    Authorization: `Bearer ${credentials.accessToken}`,
  },
  json: true,
});

const CLIENT_DIR = path.join(__dirname, '../build/dist');
console.log(CLIENT_DIR);

const app = express();

app.use(async (req, res, next) => {
  if (ATHLETE_DATA.length === 0) {
    for (let page = 1; page < 100; page++) {
      console.log(page);
      const allActivities = await baseRequest.get('athlete/activities', {
        qs: {
          page,
          per_page: 50,
        },
      });
      if (allActivities.length > 0) {
        _.each(allActivities, activity =>
          ATHLETE_DATA.push({
            name: activity.name,
            type: activity.type,
            distance: utils.convertMetersToMiles(activity.distance),
            date: activity.start_date_local.split('T')[0],
            elapsedTime: activity.elapsed_time,
            elevationGain: utils.convertMetersToFeet(activity.total_elevation_gain),
            averageSpeed: activity.average_speed,
          }),
        );
      } else {
        break;
      }
    }
  }
  next();
});

app.get('/api/total', (req, res) => {
  const activityTypeTotals = {};
  _.each(ATHLETE_DATA, activity => {
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
  res.send(activityController.filterActivityType(ATHLETE_DATA, req.params.activityType));
});

app.get('/api/aggregate/:activityType', (req, res) => {
  res.send(activityController.aggregateActivityType(ATHLETE_DATA, req.params.activityType));
});

app.get('/assets/:fileName', (req, res) => res.sendFile(path.join(CLIENT_DIR, req.params.fileName)));

app.get('*', (req, res) => res.sendFile(path.join(CLIENT_DIR, 'index.html')));

app.listen(3000, () => console.log('App listening on port 3000!'));
