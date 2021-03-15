import * as db from '../db';

interface ActivityData {
  user_id: string;
  name: string;
  type: string;
  distance: number;
  activity_date: Date;
  elapsed_time: number;
  elevation_gain: number;
}

const TABLE_NAME = 'activity_data';

export async function insertOne(
  userId: string,
  name: string,
  type: string,
  distance: number,
  activityDateTime: number,
  elapsedTime: number,
  elevationGain: number,
): Promise<void> {
  await db.pool.query(
    `INSERT INTO ${TABLE_NAME}(id, user_id, name, type, distance, activity_datetime, elapsed_time, elevation_gain) VALUES($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING`,
    [userId, name, type, distance, activityDateTime, elapsedTime, elevationGain],
  );
}

export async function getUserActivities(userId: string): Promise<ActivityData[]> {
  const results = await db.pool.query(
    `SELECT user_id, name, type, distance, DATE(activity_datetime) as activity_date, elapsed_time, elevation_gain FROM ${TABLE_NAME} WHERE user_id = $1`,
    [userId],
  );
  return results.rows;
}

export async function getLatestActivityTimestamp(userId: string): Promise<Date | undefined> {
  const results = await db.pool.query(
    `SELECT MAX(activity_datetime) as activity_datetime FROM ${TABLE_NAME} WHERE user_id = $1`,
    [userId],
  );
  if (results.rows.length !== 0) {
    return results.rows[0].activity_datetime;
  }
  return undefined;
}
