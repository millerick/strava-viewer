import * as React from 'react';
import * as _ from 'lodash';
import axios from 'axios';
import './Sidepanel.scss';

import { SidepanelContainer } from './SidepanelContainer';
import { Logout } from './Logout';
import { Login } from './Login';
import { Refresh } from './Refresh';

export class Sidepanel extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: {},
      loggedInFlag: false,
    };
  }

  async componentDidMount() {
    const [totalResponse, loggedInCheck] = await Promise.all([
      axios.get('/api/total'),
      axios.get('/check-login'),
    ]);
    this.setState({
      data: totalResponse.data,
      loggedInFlag: loggedInCheck.data.loggedInFlag,
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
        {this.state.loggedInFlag && <Refresh /> /* Display refresh button only when logged in */}
        {this.state.loggedInFlag ? <Logout /> : <Login />}
      </div>
    );
  }
}
