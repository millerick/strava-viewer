import * as React from 'react';
import axios from 'axios';
require('./Mainpanel.scss');

import { Chart } from '../Chart/Chart';

export class Mainpanel extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      activityType: props.activityType,
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
        {this.state.series.map((series: any, idx: number) => {
          return <Chart key={idx} series={series} />;
        })}
      </div>
    );
  }
}
