import * as configModel from '../model/configModel';

let SESSION_SECRET: string | undefined;

export async function getSessionSecret(): Promise<string> {
  if (SESSION_SECRET === undefined) {
    SESSION_SECRET = (await configModel.get('session_secret')).config_value;
  }
  return SESSION_SECRET;
}
