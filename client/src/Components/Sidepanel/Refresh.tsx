import * as React from 'react';
import './Sidepanel.scss';

export class Refresh extends React.Component<any, any> {
  render() {
    return (
      <div className="LogInOutButton">
        <a href="/api/refresh">Refresh Data</a>
      </div>
    );
  }
}
