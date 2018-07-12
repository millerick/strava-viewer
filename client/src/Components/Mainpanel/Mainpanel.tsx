import * as React from 'react';
import axios from 'axios';
require('./Mainpanel.scss');

export class Mainpanel extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      activityType: this.props.activityType,
      series: [],
    };
  }

  async componentDidMount() {
    const aggregateResponse = await axios.get(`/api/aggregate/${this.state.activityType}`);
    this.setState({ series: aggregateResponse.data });
  }

  render() {
    if (this.state.activityType === undefined || this.state.series.length === 0) {
      return <div id="mainpanel" className="Mainpanel" />;
    }
    return (
      <div id="mainpanel" className="Mainpanel">
        {JSON.stringify(this.state.series)}
      </div>
    );
  }
}
