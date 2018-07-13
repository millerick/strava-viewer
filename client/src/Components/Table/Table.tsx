import * as React from 'react';
import axios from 'axios';
require('./Table.scss');

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
        <th>
          {this.state.headers.map((header: string, idx: number) => {
            return (
              <td className="TableCell" key={idx}>
                {header}
              </td>
            );
          })}
        </th>
        {this.state.data.map((dataPoint: any, idx: number) => {
          return (
            <TableRow key={idx} headers={this.state.headers} fieldMapping={this.state.fieldMapping} data={dataPoint} />
          );
        })}
      </table>
    );
  }
}
