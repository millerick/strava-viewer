import * as express from 'express';
import * as path from 'path';
import * as url from 'url';

import * as credentials from '../credentials';
import * as config from '../config';
import * as userController from '../controller/userController';
import * as strava from '../external/strava';

export const routes = express.Router();

routes.get('/login', async (req, res) => {
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

routes.get('/check-login', async (req, res) => {
  const response = {
    loggedInFlag: false,
  };
  if (req.userId !== undefined) {
    response.loggedInFlag = true;
    // Try repulling the data
    const user = await userController.getUserByUserId(req.userId);
    if (user && user.bearer_token) {
      await strava.getAthleteData(user.bearer_token, req.userId);
    }
  }
  res.send(response);
});

routes.get('/api/logout', (req, res) => {
  res.clearCookie(config.SESSION_COOKIE);
  res.redirect(
    url.format({
      pathname: config.BASE_PATH,
    }),
  );
});

routes.get('/assets/:fileName', (req, res) => res.sendFile(path.join(config.CLIENT_DIR, req.params.fileName)));
