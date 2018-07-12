import * as React from 'react';
import axios from 'axios';
require('./Sidepanel.scss');

import { SidepanelContainer } from './SidepanelContainer';

export class Sidepanel extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: {},
    };
  }

  async componentDidMount() {
    const totalResponse = await axios.get('/api/total');
    this.setState({ data: totalResponse.data });
  }

  render() {
    return (
      <div id="sidepanel" className="Sidepanel">
        {Object.keys(this.state.data).map(activityType => {
          return <SidepanelContainer activityType={activityType} activityTotals={this.state.data[activityType]} />;
        })}
      </div>
    );
  }
}
