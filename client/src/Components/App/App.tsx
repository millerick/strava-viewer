import * as React from 'react';

import { Sidepanel } from '../Sidepanel/Sidepanel';
import { Mainpanel } from '../Mainpanel/Mainpanel';

export class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    const activityType = props.match && props.match.params ? props.match.params.activityType : undefined;
    this.state = {
      activityType,
    };
  }

  render() {
    return (
      <div id="app">
        <Sidepanel />
        <Mainpanel activityType={this.state.activityType} />
      </div>
    );
  }
}
