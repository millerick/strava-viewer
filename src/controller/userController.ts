import * as userModel from '../model/userModel';

// async function userExistsById(id: string): Promise<boolean> {
//   const user = await userModel.getUser(id);
//   return user !== undefined;
// }

async function userExistsByStravaId(stravaUserId: string): Promise<boolean> {
  const user = await userModel.getUserByStravaId(stravaUserId);
  return user !== undefined;
}

export async function addUser(
  stravaUserId: string,
  sessionId: string,
  refreshToken: string,
  bearerToken: string,
  stravaUserName: string,
): Promise<void> {
  const userAlreadyExists = await userExistsByStravaId(stravaUserId);
  if (!userAlreadyExists) {
    await userModel.insert(stravaUserId, sessionId, refreshToken, bearerToken, stravaUserName);
  }
}

export const getUserBySessionId = userModel.getUserBySessionId;
export const setSessionByStravaId = userModel.setSessionByStravaId;
