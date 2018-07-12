import * as React from 'react';
require('./App.scss');

import { Sidepanel } from '../Sidepanel/Sidepanel';

export class App extends React.Component<any, any> {
  render() {
    return (
      <div id="app">
        <Sidepanel />
        <div id="mainpanel" className="Mainpanel">
          Look here!
        </div>
      </div>
    );
  }
}
