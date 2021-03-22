import * as React from 'react';
import axios from 'axios';

import { Sidepanel } from '../Sidepanel/Sidepanel';
import { Mainpanel } from '../Mainpanel/Mainpanel';

export class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loggedInFlag: false,
    };
  }

  async componentDidMount() {
    const loggedInCheck = await axios.get('/check-login');
    this.setState({
      loggedInFlag: loggedInCheck.data.loggedInFlag,
    });
  }

  render() {
    const activityType = this.props.match && this.props.match.params ? this.props.match.params.activityType : undefined;
    return (
      <div id="app">
        <Sidepanel loggedInFlag={this.state.loggedInFlag} />
        <Mainpanel key={activityType} activityType={activityType} />
      </div>
    );
  }
}
