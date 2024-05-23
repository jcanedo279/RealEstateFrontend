import React from 'react';
import { IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';


const StyledIconButton = ({
    children,
    style = 'primary',
    fontWeight = 'bold',
    sx = {},
    // Additional button parameters.
    ...buttonParams
}) => {
    const theme = useTheme();
    const isPrimary = style === 'primary';

    const textColor = theme.palette.text.secondary;
    const defaultBackgroundColor = isPrimary ? theme.palette.primary.main : theme.palette.background.default;
    const defaultOutlineColor = isPrimary ? theme.palette.primary.dark : theme.palette.primary.main;

    const styles = {
        backgroundColor: defaultBackgroundColor,
        color: textColor,
        borderColor: defaultOutlineColor,
        '&:hover': {
            backgroundColor: defaultOutlineColor,
            borderColor: defaultOutlineColor,
        },
        '&:focus': {
            backgroundColor: defaultBackgroundColor,
            borderColor: defaultOutlineColor,
        },
        '&:focus:hover': {
            backgroundColor: defaultOutlineColor,
            borderColor: defaultOutlineColor,
        },
        // Apply additional styles.
        fontWeight: fontWeight,
        ...sx
    };

    return (
        <IconButton
            variant={isPrimary ? 'contained' : 'outlined'}
            sx={styles}
            // Destructure additional button parameters.
            {...buttonParams}
        >
            {children}
        </IconButton>
    );
};

export default StyledIconButton;
