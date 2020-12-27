import * as React from 'react';
import './Sidepanel.scss';

export class Login extends React.Component<any, any> {
  render() {
    return (
      <div className="LogInOutButton">
        <a href="/login">Login (with Strava OAuth)</a>
      </div>
    );
  }
}
