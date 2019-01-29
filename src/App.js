import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Search from './tomtom/Search.js';
import { loadScript } from './tomtom/functions.js';

import './sdk/map.css';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    loadScript();
  }

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Search />
      </React.Fragment>
    );
  }
}

export default App;
