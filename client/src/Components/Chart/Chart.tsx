import * as React from 'react';
// import * as d3 from 'd3';

export class Chart extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = props.series;
  }

  render() {
    return (
      <div>
        {this.state.metric} {this.state.unit}
      </div>
    );
  }
}
