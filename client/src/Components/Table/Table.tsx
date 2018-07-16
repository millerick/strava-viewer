import * as React from 'react';
import axios from 'axios';
import './Table.scss';

import { TableRow } from './TableRow';

export class Table extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      activityType: this.props.activityType,
      headers: this.props.headers,
      fieldMapping: this.props.fieldMapping,
      data: [],
    };
  }

  async componentDidMount() {
    const detailResponse = await axios.get(`/api/details/${this.state.activityType}`);
    this.setState({ data: detailResponse.data });
  }

  render() {
    return (
      <table className="DataTable">
        <tr>
          {this.state.headers.map((header: string, idx: number) => {
            return (
              <th className="TableHeader" key={idx}>
                {header}
              </th>
            );
          })}
        </tr>
        {this.state.data.map((dataPoint: any, idx: number) => {
          return (
            <TableRow key={idx} headers={this.state.headers} fieldMapping={this.state.fieldMapping} data={dataPoint} />
          );
        })}
      </table>
    );
  }
}
