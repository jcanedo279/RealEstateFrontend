import React from 'react';
import { TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';


const StyledTextField = ({
  id,
  label,
  name,
  value = '',
  sx = {},
  // Destructure additional text field parameters.
  ...textFieldParams
}) => {
  const theme = useTheme();

  const inputProps = {
    disableUnderline: true
  };

  const styles = {
      '& .MuiInputLabel-root': { color: theme.palette.text.primary },
      '& .MuiOutlinedInput-root': {
          '& fieldset': { borderColor: theme.palette.primary.main },
          '&:hover fieldset': { borderColor: theme.palette.primary.main },
          '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
          '& input': { padding: '0 12px' },
      },
      // Apply additional styles.
      ...sx
  };

  return (
      <TextField
          id={id}
          label={label}
          name={name}
          variant='outlined'
          inputProps={inputProps}
          sx={styles}
          // Spread additional text field parameters.
          {...textFieldParams}
      />
  );
};

export default StyledTextField;
