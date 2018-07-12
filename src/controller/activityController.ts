import * as _ from 'lodash';
import * as utils from '../utils';

export function filterActivityType(allActivities: any[], activityType: string): any[] {
  return _.filter(allActivities, activity => activity.type === activityType);
}

export function aggregateActivityType(allActivities: any[], activityType: string): any {
  const filteredActivities = filterActivityType(allActivities, activityType);
  const activityAggregates = {};
  _.each(filteredActivities, activity => {
    if (_.isNil(activityAggregates[activity.date])) {
      activityAggregates[activity.date] = {
        distance: 0,
        elevationGain: 0,
      };
    }
    activityAggregates[activity.date].distance += utils.convertMetersToMiles(activity.distance);
    activityAggregates[activity.date].elevationGain += utils.convertMetersToFeet(activity.elevationGain);
  });
  return activityAggregates;
}
