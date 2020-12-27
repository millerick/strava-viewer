import * as React from 'react';
import * as Cookies from 'js-cookie';
import * as _ from 'lodash';
import axios from 'axios';
import './Sidepanel.scss';

import { SidepanelContainer } from './SidepanelContainer';
import { Logout } from './Logout';
import { Login } from './Login';

export class Sidepanel extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    console.log(Cookies.get('stravaViewerUser'))
    this.state = {
      data: {},
      loggedInFlag: !_.isNil(Cookies.get('stravaViewerUser')),
    };
  }

  async componentDidMount() {
    const totalResponse = await axios.get('/api/total');
    this.setState({ data: totalResponse.data });
  }

  render() {
    const keys = _.keys(this.state.data);
    const orderedKeys = _.sortBy(keys, key => -this.state.data[key].distance);
    return (
      <div id="sidepanel" className="Sidepanel">
        {orderedKeys.map((activityType, idx) => {
          return <SidepanelContainer key={idx} activityTotals={this.state.data[activityType]} />;
        })}
        {this.state.loggedInFlag ? <Logout /> : <Login />}
      </div>
    );
  }
}
