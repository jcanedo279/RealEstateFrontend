import React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const StyledSelect = ({
    id,
    label,
    name,
    value = '',
    selectOptions = [],
    sx = {},
    // Destructure additional text field parameters.
    ...selectParams
}) => {
    const theme = useTheme();

    const styles = {
        '& .MuiInputLabel-root': { color: theme.palette.text.primary },
        '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: theme.palette.primary.main },
        '&:hover fieldset': { borderColor: theme.palette.primary.main },
        '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
        },
        ...sx,
    };

    return (
        <FormControl variant="outlined" fullWidth>
            {label && <InputLabel id={`${id}-label`} sx={{ color: theme.palette.text.primary }}>{label}</InputLabel>}
            <Select
                id={id}
                name={name}
                value={value}
                label={label}
                sx={styles}
                labelId={`${id}-label`}
                {...selectParams}
            >
                {selectOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default StyledSelect;