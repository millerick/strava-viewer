import * as React from 'react';
import './Sidepanel.scss';

export class Logout extends React.Component<any, any> {
  render() {
    return (
      <div className="LogInOutButton">
        <a href="/api/logout">Logout</a>
      </div>
    );
  }
}
