import * as db from '../db';

interface UserData {
  id: string;
  strava_user_id?: string;
  refresh_token?: string;
  bearer_token?: string;
  strava_user_name?: string;
  session_id?: string;
  last_pull_datetime?: Date;
}

const TABLE_NAME = 'users';

export async function insert(
  stravaUserId: string,
  sessionId: string,
  refreshToken: string,
  bearerToken: string,
  stravaUserName: string,
): Promise<string> {
  const queryResults = await db.pool.query(
    `INSERT INTO ${TABLE_NAME}(strava_user_id, session_id, refresh_token, bearer_token, strava_user_name)
  VALUES($1, $2, $3, $4, $5)
  RETURNING id`,
    [stravaUserId, sessionId, refreshToken, bearerToken, stravaUserName],
  );
  return queryResults.rows[0].id;
}

export async function updateByStravaUserId(
  stravaUserId: string,
  sessionId: string,
  refreshToken: string,
  bearerToken: string,
  stravaUserName: string,
): Promise<void> {
  await db.pool.query(
    `UPDATE ${TABLE_NAME} SET session_id=$1, refresh_token=$2, bearer_token=$3, strava_user_name=$4 WHERE strava_user_id=$5`,
    [sessionId, refreshToken, bearerToken, stravaUserName, stravaUserId],
  );
}

export async function getUser(id: string): Promise<UserData | undefined> {
  const queryResults = await db.pool.query(`SELECT * FROM ${TABLE_NAME} WHERE id=$1`, [id]);
  return queryResults.rows[0];
}

export async function getUserByStravaId(stravaUserId: string): Promise<UserData | undefined> {
  const queryResults = await db.pool.query(`SELECT * FROM ${TABLE_NAME} WHERE strava_user_id=$1`, [stravaUserId]);
  return queryResults.rows[0];
}

export async function getUserBySessionId(sessionId: string): Promise<UserData | undefined> {
  const queryResults = await db.pool.query(`SELECT * FROM ${TABLE_NAME} WHERE session_id=$1`, [sessionId]);
  if (queryResults.rows.length === 0) {
    return undefined;
  }
  return queryResults.rows[0];
}

export async function getSession(sessionId: string): Promise<void> {
  const queryResults = await db.pool.query(`SELECT * FROM ${TABLE_NAME} WHERE session_id=$1`, [sessionId]);
  if (queryResults.rows.length !== 0) {
    throw new Error('Session not found');
  }
}

export async function setSessionByStravaId(stravaId: string, sessionId: string): Promise<void> {
  await db.pool.query(`UPDATE ${TABLE_NAME} SET session_id=$1 WHERE strava_user_id=$2`, [sessionId, stravaId]);
}

export async function setLastPullTime(id: string): Promise<void> {
  await db.pool.query(`UPDATE ${TABLE_NAME} SET last_pull_datetime = NOW() WHERE id=$1`, [id]);
}

export async function getLastPullTime(id: string): Promise<Date | undefined> {
  const queryResults = await db.pool.query(`SELECT last_pull_datetime FROM ${TABLE_NAME} WHERE id=$1`, [id]);
  if (queryResults.rows.length === 0) {
    return undefined;
  } else if (queryResults.rows[0].last_pull_datetime === null) {
    return undefined;
  }
  return queryResults.rows[0].last_pull_datetime;
}
