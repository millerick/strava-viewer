import * as React from 'react';
import './Sidepanel.scss';

export class PoweredByStrava extends React.Component<any, any> {
  render() {
    return (
      <div className="PoweredBy">
        <img src="/assets/api_logo_pwrdBy_strava_horiz_white.svg" />
      </div>
    );
  }
}
