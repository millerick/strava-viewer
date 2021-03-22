import * as express from 'express';
import * as session from 'express-session';
import * as connectPGSession from 'connect-pg-simple';

import * as config from '../config';
import * as db from '../db';
import * as configController from '../controller/configController';

const pgSession = connectPGSession(session);

export async function wrappedSessionMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> {
  const secret = await configController.getSessionSecret();
  session({
    store: new pgSession({
      pool: db.pool,
    }),
    name: config.SESSION_COOKIE,
    secret,
    resave: false,
    cookie: {
      secure: config.SECURE_COOKIES,
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60 * 1000, // one year
    },
  })(req, res, next);
}
