import * as userModel from '../model/userModel';

/**
 *
 * @param stravaUserId The userId from Strava's systems
 */
async function userExistsByStravaId(stravaUserId: string): Promise<boolean> {
  const user = await userModel.getUserByStravaId(stravaUserId);
  return user !== undefined;
}

/**
 * Adds a user with the appropriate information if one does not already exist for the stravaUserId.
 * If a user does already exist, then it updates the other information.
 * @param stravaUserId
 * @param sessionId
 * @param refreshToken
 * @param bearerToken
 * @param stravaUserName
 */
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
  } else {
    await userModel.updateByStravaUserId(stravaUserId, sessionId, refreshToken, bearerToken, stravaUserName);
  }
}

export const getUserBySessionId = userModel.getUserBySessionId;
export const getUserByUserId = userModel.getUser;
export const setSessionByStravaId = userModel.setSessionByStravaId;
