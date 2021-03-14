import * as db from '../db';

interface UserData {
  id: string;
  strava_user_id?: string;
  refresh_token?: string;
  bearer_token?: string;
  strava_user_name?: string;
  session_id?: string;
}

const TABLE_NAME = 'users';

export async function insert(
  stravaUserId: string,
  refreshToken: string,
  bearerToken: string,
  stravaUserName: string,
): Promise<string> {
  const queryResults = await db.pool.query(
    `INSERT INTO ${TABLE_NAME}(strava_user_id, refresh_token, bearer_token, strava_user_name)
  VALUES($1, $2, $3, $4)
  RETURNING id`,
    [stravaUserId, refreshToken, bearerToken, stravaUserName],
  );
  return queryResults.rows[0].id;
}

export async function getUser(id: string): Promise<UserData | undefined> {
  const queryResults = await db.pool.query(`SELECT * FROM ${TABLE_NAME} WHERE id=$1`, [id]);
  return queryResults.rows[0];
}

export async function getUserByStravaId(stravaUserId: string): Promise<UserData | undefined> {
  const queryResults = await db.pool.query(`SELECT * FROM ${TABLE_NAME} WHERE strava_user_id=$1`, [stravaUserId]);
  return queryResults.rows[0];
}

export async function getSession(sessionId: string): Promise<void> {
  const queryResults = await db.pool.query(`SELECT * FROM ${TABLE_NAME} WHERE session_id=$1`, [sessionId]);
  if (queryResults.rows.length !== 0) {
    throw new Error('Session not found');
  }
}

export async function setSession(id: string, sessionId: string): Promise<void> {
  await db.pool.query(`UPDATE ${TABLE_NAME} SET session_id=$1 WHERE id=$2`, [sessionId, id]);
}