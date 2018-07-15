import * as React from 'react';
require('./Sidepanel.scss');

export class Logout extends React.Component<any, any> {
  render() {
    return (
      <div className="Logout">
        <a href="/api/logout">Logout</a>
      </div>
    );
  }
}
