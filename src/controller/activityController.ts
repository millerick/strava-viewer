import * as _ from 'lodash';

/**
 * Filters activities to a specific activity type
 * @param allActivities Array of activities
 * @param activityType ActivityType to filter to.
 */
export function filterActivityType(allActivities: any[], activityType: ActivityType): any[] {
  return _.filter(allActivities, (activity) => activity.type === activityType);
}

/**
 * Perform aggregations on an array of activities after filtering to a specific ActivityType
 * @param allActivities Array of activities.
 * @param activityType ActivityType to filter to.
 */
export function aggregateActivityType(allActivities: any[], activityType: ActivityType): any {
  const filteredActivities = filterActivityType(allActivities, activityType);
  const activityAggregates = {};
  const keys = _.reverse(_.sortedUniq(_.map(filteredActivities, (activity) => activity.date)));
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
    activityAggregates[activity.date].distance += activity.distance;
    activityAggregates[activity.date].elevationGain += activity.elevationGain;
    activityAggregates[activity.date].elapsedTime += activity.elapsedTime;
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
