import * as userModel from '../model/userModel';
import * as utils from '../utils';

/**
 * Checks to see if a user exists in our system for the input Strava userId
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
): Promise<string> {
  const userAlreadyExists = await userExistsByStravaId(stravaUserId);
  if (!userAlreadyExists) {
    return userModel.insert(stravaUserId, sessionId, refreshToken, bearerToken, stravaUserName);
  } else {
    return userModel.updateByStravaUserId(stravaUserId, sessionId, refreshToken, bearerToken, stravaUserName);
  }
}

/**
 * Returns a boolean indicating whether or not the Strava data should be pulled again.
 * Whether or not to pull is based on the last time data was successfully pulled.
 * @param id
 */
export async function shouldPullData(id: string): Promise<boolean> {
  const lastPullDateTime = await userModel.getLastPullTime(id);
  if (lastPullDateTime === undefined) {
    return true;
  }
  return utils.moreThanAnHourAgo(lastPullDateTime);
}

/**
 * Simple functions to expose directly from the model
 */

export const getUserBySessionId = userModel.getUserBySessionId;
export const getUserByUserId = userModel.getUser;
export const setSessionByStravaId = userModel.setSessionByStravaId;
export const setLastPullTime = userModel.setLastPullTime;
