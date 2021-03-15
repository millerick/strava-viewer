import * as _ from 'lodash';
import * as db from '../db';

export interface ActivityData {
  user_id: string;
  name: string;
  type: string;
  distance: number;
  activity_date: Date;
  elapsed_time: number;
  elevation_gain: number;
}

interface ActivityTotals {
  activityType: string;
  distance: number;
  elevationGain: number;
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
    `INSERT INTO ${TABLE_NAME}(user_id, name, type, distance, activity_datetime, elapsed_time, elevation_gain) VALUES($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING`,
    [userId, name, type, distance, activityDateTime, elapsedTime, elevationGain],
  );
}

export async function getUserActivities(userId: string): Promise<ActivityData[]> {
  const results = await db.pool.query(
    `SELECT user_id, name, type, distance, DATE(activity_datetime) as activity_date, elapsed_time, elevation_gain FROM ${TABLE_NAME} WHERE user_id = $1 ORDER BY activity_datetime DESC`,
    [userId],
  );
  return results.rows;
}

export async function getUserActivitiesByType(userId: string, type: string): Promise<ActivityData[]> {
  const results = await db.pool.query(
    `SELECT user_id, name, type, distance, DATE(activity_datetime) as activity_date, elapsed_time, elevation_gain FROM ${TABLE_NAME} WHERE user_id = $1 AND type = $2 ORDER BY activity_datetime DESC`,
    [userId, type],
  );
  return results.rows;
}

export async function getLatestActivityTimestamp(userId: string): Promise<Date | undefined> {
  const results = await db.pool.query(
    `SELECT MAX(activity_datetime) as activity_datetime FROM ${TABLE_NAME} WHERE user_id = $1`,
    [userId],
  );
  if (results.rows.length !== 0 && !_.isNil(results.rows[0].activity_datetime)) {
    return results.rows[0].activity_datetime;
  }
  return undefined;
}

export async function aggregateActivityTypeTotals(userId: string): Promise<ActivityTotals[]> {
  const results = await db.pool.query(
    `SELECT type, SUM(elevation_gain) as elevation_gain, SUM(distance) as distance FROM ${TABLE_NAME} WHERE user_id = $1 GROUP BY type`,
    [userId],
  );
  if (results.rows.length !== 0 && !_.isNil(results.rows[0].distance)) {
    return results.rows.map((activityTotal) => {
      return {
        activityType: activityTotal.type,
        distance: activityTotal.distance,
        elevationGain: activityTotal.elevation_gain,
      };
    });
  }
  return [];
}
