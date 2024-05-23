import React, { useState } from 'react';
import {
    Box,
    useTheme
} from '@mui/material';
import StyledButton from './material/StyledButton';
import ToSAgreement from './ToSAgreement';


const ToSAgreementButton = ({ agreed, setAgreed }) => {
    const [openPopup, setOpenPopup] = useState(false);
    const theme = useTheme();

    const handleOpenPopup = () => {
        setOpenPopup(true);
    };

    const handleAgree = () => {
        setAgreed(true);
        setOpenPopup(false);
    };

    const handleDecline = () => {
        setAgreed(false);
        setOpenPopup(false);
    };

    return (
        <Box>
            <StyledButton
                children={agreed ? 'Agreed to Terms of Service' : 'Agree to Terms of Service'}
                style='secondary'
                onClick={handleOpenPopup}
            />

            <ToSAgreement
                open={openPopup}
                handleClose={handleDecline}
                handleAgree={handleAgree}
            />
        </Box>
    );
};

export default ToSAgreementButton;
