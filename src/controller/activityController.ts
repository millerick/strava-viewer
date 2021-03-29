import * as _ from 'lodash';
import * as utils from '../utils';
import { ActivityData } from '../model/activityDataModel';

type MetricName = 'Distance' | 'Elevation Gain' | 'Elapsed Time';
type MetricUnit = 'Miles' | 'Feet' | 'Seconds';

interface SeriesItem {
  metric: MetricName;
  unit: MetricUnit;
  series: [string, number][];
}

interface AggregateItem {
  distance: number;
  elevationGain: number;
  elapsedTime: number;
}

/**
 * Perform aggregations on an array of activities after filtering to a specific ActivityType
 * @param allActivities Array of activities.
 * @param activityType ActivityType to filter to.
 */
export function aggregateActivityType(allActivities: ActivityData[]): SeriesItem[] {
  const activityAggregates: { [key: string]: AggregateItem } = {};
  const keys = _.reverse(
    _.sortedUniq(_.map(allActivities, (activity) => utils.getDateStringFromDate(activity.activity_date))),
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
  _.each(allActivities, (activity) => {
    const dateKey = utils.getDateStringFromDate(activity.activity_date);
    activityAggregates[dateKey].distance += activity.distance;
    activityAggregates[dateKey].elevationGain += activity.elevation_gain;
    activityAggregates[dateKey].elapsedTime += activity.elapsed_time;
  });
  const series = [];
  series.push({
    metric: 'Distance' as MetricName,
    unit: 'Miles' as MetricUnit,
    series: _.map(keys, (key): [string, number] => [key, activityAggregates[key].distance]),
  });
  series.push({
    metric: 'Elevation Gain' as MetricName,
    unit: 'Feet' as MetricUnit,
    series: _.map(keys, (key): [string, number] => [key, activityAggregates[key].elevationGain]),
  });
  series.push({
    metric: 'Elapsed Time' as MetricName,
    unit: 'Seconds' as MetricUnit,
    series: _.map(keys, (key): [string, number] => [key, activityAggregates[key].elapsedTime]),
  });
  return series;
}
