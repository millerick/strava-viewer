import * as _ from 'lodash';
import * as utils from '../utils';
import { ActivityData } from '../model/activityDataModel';

/**
 * Filters activities to a specific activity type
 * @param allActivities Array of activities
 * @param activityType ActivityType to filter to.
 */
export function filterActivityType(allActivities: ActivityData[], activityType: ActivityType): ActivityData[] {
  return _.filter(allActivities, (activity) => activity.type === activityType);
}

/**
 * Perform aggregations on an array of activities after filtering to a specific ActivityType
 * @param allActivities Array of activities.
 * @param activityType ActivityType to filter to.
 */
export function aggregateActivityType(allActivities: ActivityData[], activityType: ActivityType): any {
  const filteredActivities = filterActivityType(allActivities, activityType);
  const activityAggregates = {};
  const keys = _.reverse(
    _.sortedUniq(_.map(filteredActivities, (activity) => utils.getDateStringFromDate(activity.activity_date))),
  );
  _.each(
    keys,
    (key) =>
      (activityAggregates[key] = {
        distance: 0,
        elevationGain: 0,
        elapsedTime: 0,
      }),
  );
  _.each(filteredActivities, (activity) => {
    const dateKey = utils.getDateStringFromDate(activity.activity_date);
    activityAggregates[dateKey].distance += activity.distance;
    activityAggregates[dateKey].elevationGain += activity.elevation_gain;
    activityAggregates[dateKey].elapsedTime += activity.elapsed_time;
  });
  const series = [];
  series.push({
    metric: 'Distance',
    unit: 'Miles',
    series: _.map(keys, (key) => [key, activityAggregates[key].distance]),
  });
  series.push({
    metric: 'Elevation Gain',
    unit: 'Feet',
    series: _.map(keys, (key) => [key, activityAggregates[key].elevationGain]),
  });
  series.push({
    metric: 'Elapsed Time',
    unit: 'Seconds',
    series: _.map(keys, (key) => [key, activityAggregates[key].elapsedTime]),
  });
  return series;
}
