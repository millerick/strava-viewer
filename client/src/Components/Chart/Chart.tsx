import * as React from 'react';
import * as _ from 'lodash';
import * as d3 from 'd3';
import './Chart.scss';

export class Chart extends React.Component<any, any> {
  node: any;

  constructor(props: any) {
    super(props);
    this.state = props.series;
    this.createChart = this.createChart.bind(this);
  }

  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate() {
    this.createChart();
  }

  createChart() {
    const node = this.node;
    const chart = d3.select(node).append('g').attr('transform', `translate(${50},${50})`);
    const dataMax = d3.max(_.map(this.state.series, (point) => point[1]));
    const xScale = d3
      .scaleBand()
      .domain(_.map(this.state.series, (point) => point[0]))
      .rangeRound([0, 900])
      .padding(0.1);
    const yScale = d3.scaleLinear().domain([dataMax, 0]).range([0, 300]);
    chart
      .selectAll('rect')
      .data(_.map(this.state.series, (point) => point[1]))
      .enter()
      .append('rect');
    chart
      .selectAll('rect')
      .data(_.map(this.state.series, (point) => point[1]))
      .exit()
      .remove();
    chart
      .selectAll('rect')
      .data(this.state.series)
      .attr('class', 'bar')
      .attr('x', (d: any[]) => {
        const res: number | undefined = xScale(d[0]);
        if (res !== undefined) return res;
        return 0;
      })
      .attr('y', (d: any[]) => yScale(d[1]))
      .attr('height', (d: any[]) => 300 - yScale(d[1]))
      .attr('width', xScale.bandwidth());
    chart.append('g').call(d3.axisLeft(yScale).ticks(10));
    chart
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text(`${this.state.metric} (${this.state.unit})`);
    chart
      .append('g')
      .call(d3.axisBottom(xScale))
      .attr('transform', 'translate(0,300)')
      .selectAll('text')
      .attr('y', 10)
      .attr('x', -35)
      .attr('transform', 'rotate(-35)');
  }

  render() {
    return <svg ref={(node) => (this.node = node)} height={400} width={1000} />;
  }
}
