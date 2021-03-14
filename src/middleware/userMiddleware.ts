import * as express from 'express';
import * as userController from '../controller/userController';

export async function attachUserMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const user = await userController.getUserBySessionId(req.sessionID);
  if (user !== undefined) {
    req.userId = user.id;
  }
  next();
}
