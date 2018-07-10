import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppRouter } from './Router';
import { BrowserRouter } from 'react-router-dom';

class Main extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<Main />, document.getElementById('root'));
