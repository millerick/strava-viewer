import * as express from 'express';
import * as path from 'path';
import axios from 'axios';
import * as url from 'url';

import * as credentials from './credentials';
import * as activityController from './controller/activityController';
import * as config from './config';
import * as userController from './controller/userController';
import * as userMiddleware from './middleware/userMiddleware';
import * as sessionMiddleware from './middleware/sessionMiddleware';
import * as activityDataModel from './model/activityDataModel';
import * as publicRouter from './router/publicRouter';
import * as strava from './external/strava';

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
 * Middlewares that we maintain
 */
app.use(sessionMiddleware.wrappedSessionMiddleware);
app.use(userMiddleware.attachUserMiddleware);

/**
 * Public routes
 */
app.use(publicRouter.routes);

/**
 * TODO: separate into private and public routes
 */
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
  const userId = await userController.addUser(
    athleteId,
    req.sessionID,
    oauthData.refresh_token,
    bearerToken,
    oauthData.athlete.username,
  );
  await strava.getAthleteData(bearerToken, userId);
  res.redirect(
    url.format({
      pathname: config.BASE_PATH,
    }),
  );
});

/**
 * TODO: Make a router and give it its own middleware for the API routes
 */

app.get('/api/total', async (req, res) => {
  if (req.userId === undefined) {
    res.send([]);
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

/**
 * The fall through must be last
 */
app.get('*', (req, res) => res.sendFile(path.join(config.CLIENT_DIR, 'index.html')));

app.listen(3000, async () => {
  console.log('App listening on port 3000!');
});
