import React from 'react';
import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';


const StyledButton = ({
    children,
    style = 'primary',
    textStyle = 'primary',
    fontWeight = 'bold',
    sx = {},
    // Additional button parameters.
    ...buttonParams
}) => {
    const theme = useTheme();
    const isPrimary = style === 'primary';
    const isTextPrimary = textStyle === 'primary';

    const defaultBackgroundColor = isPrimary ? theme.palette.primary.main : theme.palette.background.default;
    const primaryTextColor = isPrimary ? theme.palette.text.primary : theme.palette.primary.main;
    const defaultTextColor = isTextPrimary ? primaryTextColor : theme.palette.text.secondary;
    const defaultOutlineColor = isPrimary ? theme.palette.primary.dark : theme.palette.primary.main;

    const styles = {
        backgroundColor: defaultBackgroundColor,
        color: defaultTextColor,
        borderColor: defaultOutlineColor,
        '&:hover': {
            backgroundColor: defaultOutlineColor,
            color: theme.palette.text.secondary,
            borderColor: defaultOutlineColor,
        },
        '&:focus': {
            backgroundColor: defaultBackgroundColor,
            color: defaultTextColor,
            borderColor: defaultOutlineColor,
        },
        '&:focus:hover': {
            backgroundColor: defaultOutlineColor,
            color: theme.palette.text.secondary,
            borderColor: defaultOutlineColor,
        },
        // Apply additional styles.
        fontWeight: fontWeight,
        ...sx
    };

    return (
        <Button
            variant={isPrimary ? 'contained' : 'outlined'}
            sx={styles}
            // Destructure additional button parameters.
            {...buttonParams}
        >
            {children}
        </Button>
    );
};

export default StyledButton;
