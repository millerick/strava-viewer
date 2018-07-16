import * as React from 'react';
import * as _ from 'lodash';
import './Table.scss';

export class TableRow extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      headers: this.props.headers,
      fieldMapping: this.props.fieldMapping,
      data: this.props.data,
    };
  }

  render() {
    const rowData = _.map(this.state.headers, header => this.state.data[this.state.fieldMapping[header]]);
    return (
      <tr>
        {rowData.map((dataPoint: any, idx: number) => {
          return (
            <td className="TableCell" key={idx}>
              {typeof dataPoint === 'number' ? dataPoint.toFixed(2) : dataPoint}
            </td>
          );
        })}
      </tr>
    );
  }
}
