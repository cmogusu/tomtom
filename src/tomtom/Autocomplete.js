import * as React from 'react';
import Downshift from 'downshift';
import { withStyles } from '@material-ui/core/styles';
import Textfield from '@material-ui/core/TextField';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';


function renderInput(inputProps) {
  const {
    InputProps,
    classes,
    ref,
    ...other
  } = inputProps;

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
  itemProps: {},
  selectedItem: string,
  suggestion: {
    label: string,
  }
};

function renderSuggestion({
  suggestion,
  index,
  itemProps,
  highlightedIndex,
  selectedItem,
}: renderSuggestionProps) {
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(suggestion.name) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={index}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      {suggestion.name}
    </MenuItem>
  );
}


const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 'auto',
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
  suggestions: Array<{}>,
  setValue: Function,
  setSelectedValue: Function,
  classes: {},
};

function IntergrationDownshift(props: IntergrationDownshiftProps) {
  const {
    classes,
    suggestions,
    setValue,
    setSelectedValue,
  } = props;

  const onChange = (event) => {
    const { currentTarget } = event;
    const { value } = currentTarget;

    setValue(value);
  };

  return (
    <div className={classes.root}>
      <Downshift id="downshift-popper" onChange={setSelectedValue}>
        {({
          getInputProps,
          getItemProps,
          getMenuProps,
          highlightedIndex,
          isOpen,
          selectedItem,
        }) => (
          <div className={classes.container}>
            {renderInput({
              fullWidth: true,
              classes,
              InputProps: getInputProps({
                onChange,
                placeholder: 'With Popper',
              }),
              ref: (node) => {
                popperNode = node;
              },
            })}
            <Popper open={isOpen} anchorEl={popperNode}>
              <div {...(isOpen ? getMenuProps({}, { suppressRefError: true }) : {})}>
                <Paper
                  square
                  style={{ marginTop: 8, width: popperNode ? popperNode.clientWidth : null }}
                >
                  {suggestions.map((suggestion, index) => (
                    renderSuggestion({
                      suggestion,
                      index,
                      itemProps: getItemProps({ item: suggestion.name }),
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
