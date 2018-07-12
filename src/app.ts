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
        },
      });
      if (allActivities.length > 0) {
        _.each(allActivities, activity =>
          ATHLETE_DATA.push({
            name: activity.name,
            type: activity.type,
            distance: activity.distance,
            date: new Date(activity.start_date_local.split('T')[0]),
            elapsedTime: activity.elapsed_time,
            elevationGain: activity.total_elevation_gain,
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

app.get('/test', async (req, res) => {
  _.each(ATHLETE_DATA, activity => console.log(activity));
  res.send(_.map(ATHLETE_DATA, activity => activity.name));
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
    activityTypeTotals[activity.type].distance += utils.convertMetersToMiles(activity.distance);
    activityTypeTotals[activity.type].elevationGain += utils.convertMetersToFeet(activity.elevationGain);
  });
  res.send(activityTypeTotals);
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
