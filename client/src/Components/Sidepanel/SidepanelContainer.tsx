import * as React from 'react';
import './Sidepanel.scss';

export class SidepanelContainer extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      activityType: props.activityTotals.activityType,
      totalDistance: props.activityTotals.distance,
      totalElevationGain: props.activityTotals.elevationGain,
    };
  }

  render() {
    const route = `/${this.state.activityType}`;
    return (
      <div className="SidepanelContainer">
        <a href={route}>
          {this.state.activityType}
          <br />
          Distance: {this.state.totalDistance.toFixed(2)} mi
          <br />
          Elevation: {this.state.totalElevationGain.toFixed(2)} ft
        </a>
      </div>
    );
  }
}
