import * as React from 'react';
import * as _ from 'lodash';
import axios from 'axios';
import './Sidepanel.scss';

import { SidepanelContainer } from './SidepanelContainer';
import { Logout } from './Logout';
import { Login } from './Login';
import { Refresh } from './Refresh';
import { PoweredByStrava } from './PoweredByStrava';

interface SidepanelProps {
  loggedInFlag: boolean;
}

export class Sidepanel extends React.Component<SidepanelProps, any> {
  constructor(props: SidepanelProps) {
    super(props);
    this.state = {
      data: {},
    };
  }

  async componentDidMount() {
    const totalResponse = await axios.get('/api/total');
    this.setState({
      data: totalResponse.data,
    });
  }

  render() {
    const keys = _.keys(this.state.data);
    const orderedKeys = _.sortBy(keys, (key) => -this.state.data[key].distance);
    return (
      <div id="sidepanel" className="Sidepanel">
        {orderedKeys.map((activityType, idx) => {
          return <SidepanelContainer key={idx} activityTotals={this.state.data[activityType]} />;
        })}
        <div className="Divider" />
        <PoweredByStrava />
        {this.props.loggedInFlag && <Refresh /> /* Display refresh button only when logged in */}
        {this.props.loggedInFlag === true && <Logout />}
        {this.props.loggedInFlag === false && <Login />}
      </div>
    );
  }
}
