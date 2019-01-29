// @flow
import * as React from 'react';
import { isEmpty, debounce } from 'lodash';
import apiKey from './apiKey.js';
import { withTomtom } from './functions.js';
import Autocomplete from './Autocomplete.js';
import Map from './Map.js';

type searchProps = {
  tomtom: Object,
};


type searchState = {
  results: Array,
  value: string,
  classes: {},
};


class Search extends React.Component<searchProps, searchState> {
  static filterResults(result, index) {
    if (isEmpty(result)) {
      return {};
    }

    const { address } = result;
    const { freeformAddress, country } = address;

    return {
      index,
      name: freeformAddress,
    };
  }

  popperNode = false;

  results = [];

  inputValue = '';

  state = {
    suggestions: [],
  };


  constructor(props) {
    super(props);

    this.runSearch = debounce(this.runSearch, 250);
  }


  getSuggestions = (value) => {
    const oldValue = this.inputValue;
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    if (inputLength > 2 && oldValue !== inputValue) {
      this.inputValue = oldValue;
      this.runSearch(inputValue);
    }
  };


  runSearch = (value: string) => {
    const { tomtom } = this.props;

    if (isEmpty(tomtom)) {
      console.log('had to bail. tomtom is no no');
      return;
    }

    console.log('searching for ', value);

    tomtom.fuzzySearch({
      key: apiKey,
      typeahead: true,
      countrySet: 'US',
    })
      .query(value)
      .go()
      .then((results) => {
        this.results = results;
        console.log(results);
        const suggestions = results.map((result, index) => Search.filterResults(result, index));
        this.setState({ suggestions });

        console.log(results);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };


  setSelectedValue = (selectedItem) => {
    const { suggestions } = this.state;
    const index = suggestions.findIndex(suggestion => suggestion.name === selectedItem);

    console.log('selectedItem', selectedItem, index, this.results[index]);
  }


  render() {
    const { suggestions } = this.state;

    return (
      <div>
        <Autocomplete
          setValue={this.getSuggestions}
          suggestions={suggestions}
          setSelectedValue={this.setSelectedValue}
        />
        <Map />
      </div>
    );
  }
}

export default withTomtom(Search);
