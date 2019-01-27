import React, { Component } from 'react';
import Search from './tomtom/Search.js';
import TestAutoSuggest from './tomtom/TestAutosuggest.js';
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
        <TestAutoSuggest />
        <Search />
      </React.Fragment>
    );
  }
}

export default App;
