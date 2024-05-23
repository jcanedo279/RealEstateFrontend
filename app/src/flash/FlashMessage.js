import React from 'react';
import { Alert, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';

import '../styles/FancyFlash.css';


const iconMapping = {
    success: <CheckIcon fontSize="inherit" />,
    warning: <WarningIcon fontSize="inherit" />,
    error: <ErrorIcon fontSize="inherit" />,
    info: <InfoIcon fontSize="inherit" />,
    fail: <ErrorIcon fontSize="inherit" />,
};

const FlashMessage = ({ message, status, onClose, animation, width = '100%' }) => {
    return (
        <Alert
            severity={status}
            variant="outlined"
            icon={iconMapping[status]}
            action={
                <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={onClose}
                    sx={{ borderRadius: '50%' }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            }
            className={`fancy-flash ${status} ${animation}`}
            sx={{ width, display: 'flex', alignItems: 'center' }}
        >
            <Typography
                sx={{
                    fontWeight: 'bold',
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                {message}
            </Typography>
        </Alert>
    );
};

export default FlashMessage;
