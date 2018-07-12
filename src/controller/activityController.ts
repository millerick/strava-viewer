import * as _ from 'lodash';
import * as utils from '../utils';

export function filterActivityType(allActivities: any[], activityType: string): any[] {
  return _.filter(allActivities, activity => activity.type === activityType);
}

export function aggregateActivityType(allActivities: any[], activityType: string): any {
  const filteredActivities = filterActivityType(allActivities, activityType);
  const activityAggregates = {};
  const keys = _.reverse(_.sortedUniq(_.map(filteredActivities, activity => activity.date)));
  _.each(
    keys,
    key =>
      (activityAggregates[key] = {
        distance: 0,
        elevationGain: 0,
      }),
  );
  _.each(filteredActivities, activity => {
    activityAggregates[activity.date].distance += utils.convertMetersToMiles(activity.distance);
    activityAggregates[activity.date].elevationGain += utils.convertMetersToFeet(activity.elevationGain);
  });
  const series = [];
  series.push({
    metric: 'Distance',
    unit: 'Miles',
    series: _.map(keys, key => [key, activityAggregates[key].distance]),
  });
  series.push({
    metric: 'Elevation Gain',
    unit: 'Feet',
    series: _.map(keys, key => [key, activityAggregates[key].elevationGain]),
  });
  return series;
}
