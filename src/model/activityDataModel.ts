import * as db from '../db';

interface ActivityData {
  id: string;
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
  externalId: string,
  userId: string,
  name: string,
  type: string,
  distance: number,
  activityDateTime: number,
  elapsedTime: number,
  elevationGain: number,
): Promise<void> {
  await db.pool.query(
    `INSERT INTO ${TABLE_NAME}(id, user_id, name, type, distance, activity_datetime, elapsed_time, elevation_gain) VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
    [externalId, userId, name, type, distance, activityDateTime, elapsedTime, elevationGain],
  );
}

export async function getUserActivities(userId: string): Promise<ActivityData[]> {
  const results = await db.pool.query(
    `SELECT id, user_id, name, type, distance, DATE(activity_datetime) as activity_date, elapsed_time, elevation_gain FROM ${TABLE_NAME} where user_id = $1`,
    [userId],
  );
  return results.rows;
}
