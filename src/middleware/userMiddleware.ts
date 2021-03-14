import * as express from 'express';
import * as userController from '../controller/userController';

/**
 * Middleware to attach the userId to the request object based on the sessionId that is
 * currently attached to the request object.
 * @param req
 * @param res
 * @param next
 */
export async function attachUserMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> {
  const user = await userController.getUserBySessionId(req.sessionID);
  if (user !== undefined) {
    req.userId = user.id;
  }
  next();
}
