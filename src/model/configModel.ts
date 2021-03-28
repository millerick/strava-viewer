import * as db from '../db';

interface ConfigData {
  config_key: string;
  config_value: string;
}

const TABLE_NAME = 'config';

/**
 * Retrieves configuration data from the database for a given config.
 * @param configKey
 */
export async function get(configKey: string): Promise<ConfigData> {
  const queryResults = await db.pool.query(`SELECT config_key, config_value FROM ${TABLE_NAME} WHERE config_key = $1`, [
    configKey,
  ]);
  return queryResults.rows[0];
}
