// @flow
import * as React from 'react';
//import Autosuggest from 'react-autosuggest';
import { isEmpty, debounce } from 'lodash';

import Autosuggest from './Autosuggest.js';
import apiKey from './apiKey.js';
import { addTomtom } from './functions.js';


type Props = {
  tomtom: Object,
};

type State = {
  results: Array,
  value: string,
};

class Search extends React.Component<Props, State> {
  state = {
    results: [],
    value: 'washingto',
    suggestions: [],
  };

  static getSuggestionValue(suggestedResult) {
    const { name } = suggestedResult;
    return name;
  }

  static renderSuggestion(suggestedResult) {
    const { name } = suggestedResult;

    return (
      <div>{name}</div>
    );
  }

  static filterResults(result) {
    if (isEmpty(result)) {
      return {};
    }

    const { address } = result;
    const { freeformAddress, country } = address;

    return {
      name: `${freeformAddress} ${country}`,
    };
  }

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.runSearch = this.runSearch.bind(this);
    this.runSearch = debounce(this.runSearch, 100);
    this.clearSuggestions = this.clearSuggestions.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { tomtom } = prevProps;

    if (isEmpty(tomtom)) {
      this.init();
    }
  }

  onChange(event) {
    const { currentTarget } = event;
    const { value } = currentTarget;

    this.setState({ value });
  }


  onSuggestionsFetchRequested({ value }) {
    const { results, value: oldValue } = this.state;
    const suggestions = results.map(result => Search.filterResults(result));

    if (oldValue.trim() !== value.trim()) {
      this.runSearch(value);
    }

    this.setState({
      suggestions,
    });
  }


  init() {
    const { tomtom } = this.props;

    this.tomtom = tomtom;
  }


  runSearch(value: string) {
    if (isEmpty(this.tomtom)) {
      console.log('had to bail. tomtom is no no');
      return;
    }

    this.tomtom.fuzzySearch({
      key: apiKey,
      typeahead: true,
      countrySet: 'US',
    })
      .query(value)
      .go()
      .then((results) => {
        const suggestions = results.map(result => Search.filterResults(result));
        console.log(results, suggestions);

        this.setState({
          results,
          suggestions,
        });
      })
      .catch((error) => {
        console.log('error', error);
      });
  }


  clearSuggestions() {
    this.setState({
      suggestions: [],
    });
  }


  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      value,
      placeholder: 'find location',
      onChange: this.onChange,
    };

    return (
      <div>
        { /* <input onChange={this.onChange} placeholder="Find any location..." value={value} /> */ }

        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.clearSuggestions}
          getSuggestionValue={Search.getSuggestionValue}
          renderSuggestion={Search.renderSuggestion}
          inputProps={inputProps}
        />
      </div>
    );
  }
}

export default addTomtom(Search);
