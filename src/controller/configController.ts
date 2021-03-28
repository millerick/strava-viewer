import * as configModel from '../model/configModel';

let SESSION_SECRET: string | undefined;

/**
 * Retrieves the session secret from the database and caches it for use the next time the function is called.
 */
export async function getSessionSecret(): Promise<string> {
  if (SESSION_SECRET === undefined) {
    SESSION_SECRET = (await configModel.get('session_secret')).config_value;
  }
  return SESSION_SECRET;
}
