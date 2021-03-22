import * as React from 'react';
import * as _ from 'lodash';
import axios from 'axios';
import './Sidepanel.scss';

import { SidepanelContainer } from './SidepanelContainer';
import { Logout } from './Logout';
import { Login } from './Login';
import { Refresh } from './Refresh';
import { PoweredByStrava } from './PoweredByStrava';

export class Sidepanel extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: {},
      loggedInFlag: undefined,
    };
  }

  async componentDidMount() {
    const [totalResponse, loggedInCheck] = await Promise.all([axios.get('/api/total'), axios.get('/check-login')]);
    console.log(loggedInCheck.data.loggedInFlag);
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
        <PoweredByStrava />
        {this.state.loggedInFlag && <Refresh /> /* Display refresh button only when logged in */}
        {this.state.loggedInFlag === true && <Logout />}
        {this.state.loggedInFlag === false && <Login />}
      </div>
    );
  }
}
