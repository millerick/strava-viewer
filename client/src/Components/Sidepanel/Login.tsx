import * as React from 'react';
import './Sidepanel.scss';

export class Login extends React.Component<any, any> {
  render() {
    return (
      <div className="LogInOutButton">
        <a href="/login"><img src="/assets/btn_strava_connectwith_orange.svg" /></a>
      </div>
    );
  }
}
