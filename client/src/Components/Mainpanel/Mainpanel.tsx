import * as React from 'react';
require('./Mainpanel.scss');

export class Mainpanel extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      activityType: this.props.activityType,
    };
  }

  render() {
    if (this.state.activityType === undefined) {
      return <div id="mainpanel" className="Mainpanel" />;
    }
    return (
      <div id="mainpanel" className="Mainpanel">
        Look here {this.state.activityType}!
      </div>
    );
  }
}
