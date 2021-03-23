import * as _ from 'lodash';
import axios from 'axios';

import * as utils from '../utils';
import * as activityDataModel from '../model/activityDataModel';

// TODO: put all logic to pull a bearer and refresh token in this file

/**
 * Retrieves data from the Strava API using a bearer token and the athleteId.
 * @param bearerToken Bearer token used by the Strava API
 * @param athleteId Id of the athlete within Strava matching the bearer token.
 */
export async function getAthleteData(bearerToken: string, userId: string): Promise<void> {
  const pageSize = 50;
  const latestActivityDatetime = await activityDataModel.getLatestActivityTimestamp(userId);
  console.log(latestActivityDatetime);
  let pullAfter = 0;
  if (latestActivityDatetime !== undefined) {
    pullAfter = utils.convertToEpoch(latestActivityDatetime) + 1;
    // If the most recent activity is from within the last hour, then we do not need to pull data again
    // TODO: base this off of the last time a pull was attempted rather than the last activity date
    if (!utils.moreThanAnHourAgo(latestActivityDatetime)) {
      return;
    }
  }
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
}
