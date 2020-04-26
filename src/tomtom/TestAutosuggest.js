import React from 'react';
import Autosuggest from 'react-autosuggest';

const languages = [{
  name: 'c',
  year: 1972,
}, {
  name: 'Elm',
  year: 2012,
}, {
  name: 'crow',
  year: 2034,
}, {
  name: 'cabbage',
  year: 1212,
}, {
  name: 'congeu',
  year: 2435,
}, {
  name: 'ckerew',
  year: 2372,
}, {
  name: 'czech',
  year: 1992,
}];

const getSuggestions = (value) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : languages.filter(lang => (
    lang.name.toLowerCase().slice(0, inputLength) === inputValue));
};

const getSuggestionValue = (suggestion) => {
  console.log('suggested', suggestion);
  return suggestion.name;
};

const renderSuggestion = suggestion => (
  <div>
    {suggestion.name}
    {suggestion.year}
  </div>
);

class TestAutosuggest extends React.Component {
  state = {
    value: '',
    suggestions: [],
  }

  onChange = (event, { newValue }) => {
    console.log('onChange', newValue);
    this.setState({ value: newValue });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    const { value:v } = this.state;
    console.log('fetch', value,v);
    this.setState({
      suggestions: getSuggestions(value),
    });
  };

  onSuggestionsClearRequested = () => {
    console.log('clear');
    this.setState({
      suggestions: [],
    });
  }

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'tired placeholder',
      value,
      onChange: this.onChange,
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}

export default TestAutosuggest;
