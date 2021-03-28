import * as _ from 'lodash';
import axios from 'axios';

import * as utils from '../utils';
import * as activityDataModel from '../model/activityDataModel';
import * as userController from '../controller/userController';

// TODO: put all logic to pull a bearer and refresh token in this file

/**
 * Retrieves data from the Strava API using a bearer token and the athleteId.
 * @param bearerToken Bearer token used by the Strava API
 * @param athleteId Id of the athlete within Strava matching the bearer token.
 */
export async function getAthleteData(bearerToken: string, userId: string): Promise<void> {
  const pageSize = 50;
  const shouldPull = await userController.shouldPullData(userId);
  if (!shouldPull) {
    return;
  }
  const pullAfter = utils.convertToEpoch(await activityDataModel.getLatestActivityTimestamp(userId));
  for (let page = 1; page < 100; page++) {
    console.log(`Fetching page ${page} for id ${userId}`);
    const allActivities = await axios({
      method: 'GET',
      url: 'https://www.strava.com/api/v3/athlete/activities',
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
      params: {
        page,
        after: pullAfter,
        per_page: pageSize,
      },
    });
    if (allActivities.data.length > 0) {
      _.each(allActivities.data, async (activity) => {
        await activityDataModel.insertOne(
          userId,
          activity.name,
          activity.type,
          utils.convertMetersToMiles(activity.distance),
          activity.start_date_local,
          activity.elapsed_time,
          utils.convertMetersToFeet(activity.total_elevation_gain),
        );
      });
    }
    if (allActivities.data.length < pageSize) {
      break;
    }
  }
  await userController.setLastPullTime(userId);
}
