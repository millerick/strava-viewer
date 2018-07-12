import * as React from 'react';
import { Route } from 'react-router-dom';
import { Sidepanel } from './Components/Sidepanel/Sidepanel';

export class AppRouter extends React.Component<any, any> {
  render() {
    return (
      <div>
        <Route exact path="/" component={Sidepanel} />
        <Route exact path="/:activityType" component={Sidepanel} />
      </div>
    );
  }
}
