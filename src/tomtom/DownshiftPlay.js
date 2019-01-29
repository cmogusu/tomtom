import React from 'react';
import Downshift from 'downshift';

const items = [
  { value: 'apple' },
  { value: 'pear' },
  { value: 'orange' },
  { value: 'grape' },
  { value: 'banana' },
  { value: 'mango' },
  { value: 'pineaple' },
];

function DownshiftPlay() {
  const onChange = (selection) => {
    console.log(selection);
  };

  return (
    <Downshift
      onChange={onChange}
      itemToString={item => (item ? item.value : '')}
    >
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        isOpen,
        inputValue,
        highlightedIndex,
        selectedItem,
      }) => (
        <div>
          <label {...getLabelProps()}>Enter a fruit</label>
          <input {...getInputProps()} />
          <ul {...getMenuProps()}>
            {isOpen
              ? items
                .filter(item => !inputValue || item.value.includes(inputValue))
                .map((item, index) => (
                  <li
                    {...getItemProps({
                      key: item.value,
                      index,
                      item,
                      style: {
                        backgroundColor: highlightedIndex === index ? 'lightgray' : 'white',
                        fontWeight: selectedItem === item ? 'bold' : 'normal',
                      },
                    })}
                  >
                    {item.value}
                  </li>
                ))
              : null
            }
          </ul>
        </div>
      )}
    </Downshift>
  );
}

export default DownshiftPlay;
