import * as React from 'react';
import { Route } from 'react-router-dom';

class Tmp extends React.Component<any, any> {
  render() {
    return <h1>Hit!</h1>;
  }
}

export class AppRouter extends React.Component<any, any> {
  render() {
    return (
      <div>
        <Route exact path="/" component={Tmp} />
        <Route exact path="/foo" component={Tmp} />
      </div>
    );
  }
}
