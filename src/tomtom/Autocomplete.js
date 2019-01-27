import * as React from 'react';
import { deburr } from 'lodash';
import Downshift from 'downshift';
import { withStyles } from '@material-ui/core/styles';
import Textfield from '@material-ui/core/Textfield';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';


const suggestions = [
  { label: 'Afghanistan' },
  { label: 'Aland Islands' },
  { label: 'Albania' },
  { label: 'Algeria' },
  { label: 'American Samoa' },
  { label: 'Andorra' },
  { label: 'Angola' },
  { label: 'Anguilla' },
  { label: 'Antarctica' },
  { label: 'Antigua and Barbuda' },
  { label: 'Argentina' },
  { label: 'Armenia' },
  { label: 'Aruba' },
  { label: 'Australia' },
  { label: 'Austria' },
  { label: 'Azerbaijan' },
  { label: 'Bahamas' },
  { label: 'Bahrain' },
  { label: 'Bangladesh' },
  { label: 'Barbados' },
  { label: 'Belarus' },
  { label: 'Belgium' },
  { label: 'Belize' },
  { label: 'Benin' },
  { label: 'Bermuda' },
  { label: 'Bhutan' },
  { label: 'Bolivia, Plurinational State of' },
  { label: 'Bonaire, Sint Eustatius and Saba' },
  { label: 'Bosnia and Herzegovina' },
  { label: 'Botswana' },
  { label: 'Bouvet Island' },
  { label: 'Brazil' },
  { label: 'British Indian Ocean Territory' },
  { label: 'Brunei Darussalam' },
];

function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <Textfield
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput,
        },
        ...InputProps,
      }}

      {...other}
    />
  );
}

type renderSuggestionProps = {
  highlightedIndex: number,
  index: number,
  itemProps: Object,
  selectedItem: string,
  suggestion: {
    label: string,
  }
};

function renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }: renderSuggestionProps) {
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.label}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500: 400,
      }}
    >
      {suggestion.label}
    </MenuItem>
  );
}


function getSuggestions(value) {
  const inputValue = deburr(value.trim().toLowerCase());
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0 
    ? []
    : suggestions.filter((suggestion) => {
      const keep = count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

      if (keep) {
        count += 1;
      }

      return keep;
    });
}

type AutocompleteProps = {
  classes: {},
};

class DownshiftMultiple extends React.Component<AutocompleteProps> {
  state = {
    inputValue: '',
    selectedItem: [],
  };

  handleKeyDown = (event) => {
    const { inputValue, selectedItem } = this.state;

    if (selectedItem.length && !inputValue.length && event.key === 'Backspace') {
      this.setState({
        selectedItem: selectedItem.slice(0, selectedItem.length -1),
      });
    }
  };

  handleInputChange = (event) => {
    this.setState({
      inputValue: event.target.value,
    });
  };


  handleChange = (item) => {
    let { selectedItem } = this.state;

    if (selectedItem.indexOf(item) === -1) {
      selectedItem = [...selectedItem, item];
    }

    this.setState({
      inputValue: '',
      selectedItem,
    });
  };

  handleDelete = (item) => {
    this.setState((state) => {
      const selectedItem = [...state.selectedItem];
      selectedItem.splice(selectedItem.indexOf(item), 1);

      return {
        selectedItem,
      };
    });
  };

  render() {
    const { classes } = this.props;
    const { inputValue, selectedItem } = this.state;

    return (
      <Downshift
        id="downshift-multiple"
        inputValue={inputValue}
        onChange={this.handleChange}
        selectedItem={selectedItem}
      >
        {({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue: inputValue2,
          selectedItem: selectedItem2,
          highlightedIndex,
        }) => (
          <div className={classes.container}>
            {renderInput({
              fullWidth: true,
              classes,
              InputProps: getInputProps({
                startAdornment: selectedItem.map(item => (
                  <Chip
                    key={item}
                    tabIndex={-1}
                    label={item}
                    className={classes.chip}
                    onDelete={this.handleDelete(item)}
                  />
                )),
                onChange: this.handleInputChange,
                onKeyDown: this.handleKeyDown,
                placeholder: 'Select multiple countries',
              }),
              label: 'Label',
            })}
            {isOpen ? (
              <Paper className={classes.paper} square>
                {getSuggestions(inputValue2).map((suggestion, index) => (
                  renderSuggestion({
                    suggestion,
                    index,
                    itemProps: getItemProps({ item: suggestion.label }),
                    highlightedIndex,
                    selectedItem: selectedItem2,
                  })
                ))}
              </Paper>
            ) : null}
          </div>
        )}
      </Downshift>
    );
  }
}


const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 250,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
});

let popperNode;

type IntergrationDownshiftProps = {
  classes: {},
};

function IntergrationDownshift(props: IntergrationDownshiftProps) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <Downshift id="downshift-simple">
        {({
          getInputProps,
          getItemProps,
          getMenuProps,
          highlightedIndex,
          inputValue,
          isOpen,
          selectedItem,
        }) => (
          <div className={classes.container}>
            {renderInput({
              fullWidth: true,
              classes,
              InputProps: getInputProps({
                placeholder: 'Search a country ',
              }),
            })}
            <div {...getItemProps()}>
              {isOpen ? (
                <Paper className={classes.paper} square>
                  {getSuggestions(inputValue).map((suggestion, index) => (
                    renderSuggestion({
                      suggestion,
                      index,
                      itemProps: getItemProps({ item: suggestion.label }),
                      highlightedIndex,
                      selectedItem,
                    })
                  ))}
                </Paper>
              ) : null}
            </div>
          </div>
        )}
      </Downshift>
      <div className={classes.divider} />
      <DownshiftMultiple classes={classes} />
      <div className={classes.divider} />
      <Downshift id="downshift-popper">
        {({
          getInputProps,
          getItemProps,
          getMenuProps,
          highlightedIndex,
          inputValue,
          isOpen,
          selectedItem,
        }) => (
          <div className={classes.container}>
            {renderInput({
              fullWidth: true,
              classes,
              InputProps: getInputProps({
                placeholder: 'With Popper',
              }),
              ref: node => {
                popperNode = node;
              },
            })}
            <Popper open={isOpen} anchorEl={popperNode}>
              <div {...(isOpen ? getMenuProps({}, { suppressRefError: true }) : {})}>
                <Paper 
                  square
                  style={{ marginTop: 8, width:popperNode ? popperNode.clientWidth : null }}
                >
                {getSuggestions(inputValue).map((suggestion, index) => (
                  renderSuggestion({
                    suggestion,
                    index,
                    itemProps: getItemProps({ item: suggestion.label }),
                    highlightedIndex,
                    selectedItem,
                  })
                ))}
                </Paper>
              </div>
            </Popper>
          </div>
        )}
      </Downshift>
    </div>
  );
}

export default withStyles(styles)(IntergrationDownshift);
