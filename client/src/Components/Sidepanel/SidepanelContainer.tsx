import * as React from 'react';
require('./Sidepanel.scss');

export class SidepanelContainer extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      activityType: props.activityType,
      totalDistance: props.activityTotals.distance,
      totalElevationGain: props.activityTotals.elevationGain,
    };
  }

  render() {
    return (
      <div className="SidepanelContainer">
        {this.state.activityType}
        <br />
        Distance: {this.state.totalDistance.toFixed(2)} mi<br />
        Elevation: {this.state.totalElevationGain.toFixed(2)} ft
      </div>
    );
  }
}
