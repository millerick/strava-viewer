import * as express from 'express';
import * as path from 'path';
import * as url from 'url';

import * as credentials from '../credentials';
import * as config from '../config';

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
  res.send({
    loggedInFlag: req.userId !== undefined,
  });
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
