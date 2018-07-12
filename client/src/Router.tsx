import * as React from 'react';
import { Route } from 'react-router-dom';
import { App } from './Components/App/App';

export class AppRouter extends React.Component<any, any> {
  render() {
    return (
      <div id="router">
        <Route exact path="/" component={App} />
        <Route exact path="/:activityType" component={App} />
      </div>
    );
  }
}
