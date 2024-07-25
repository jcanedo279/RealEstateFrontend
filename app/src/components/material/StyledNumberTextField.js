import React from 'react';
import StyledTextField from './StyledTextField';


const StyledNumberTextField = ({
  id,
  label,
  name,
  value = '',
  // Destructure additional text field parameters.
  ...textFieldParams
}) => {
  const handleKeyDown = (e) => {
    // Allow only numbers, one dot, and backspace/delete
    if (
      !/[0-9]/.test(e.key) &&
      e.key !== '.' &&
      e.key !== 'Backspace' &&
      e.key !== 'Delete' &&
      e.key !== 'ArrowLeft' &&
      e.key !== 'ArrowRight' &&
      e.key !== 'Tab'
    ) {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    const regex = /^\d*\.?\d*$/;

    if (regex.test(value)) {
      textFieldParams.onChange(e);
    }
  };

  const inputProps = {
    inputMode: 'decimal',
    pattern: '^\\d*\\.?\\d*$',
  };

  return (
    <StyledTextField
      id={id}
      label={label}
      name={name}
      value={value}
      inputProps={inputProps}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      // Spread additional text field parameters.
      {...textFieldParams}
    />
  );
};

export default StyledNumberTextField;
