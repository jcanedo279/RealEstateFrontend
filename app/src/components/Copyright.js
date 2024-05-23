import React, { useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import StyledButton from './material/StyledButton';
import { useTheme } from '@mui/material/styles';


const Copyright = () => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const copyrightText = `
        <p><strong>Copyright Notice:</strong></p>
        <p>© ${new Date().getFullYear()} Real Estate Rover. All rights reserved.</p>
        <p>
            The content displayed on this website, including but not limited to text, graphics, logos, images, software, and any other information (collectively, the "Content"), is the intellectual property of Real Estate Rover or its licensors. The Content is protected by United States and international copyright laws.
        </p>
        <p>
            You are granted a limited, non-exclusive, and non-transferable license to access and use the Content solely for your personal and non-commercial use. You may not download, copy, modify, reproduce, distribute, transmit, display, publish, sell, license, or create derivative works from the Content without the prior written consent of Real Estate Rover.
        </p>
        <p>
            Real Estate Rover respects the intellectual property rights of others. If you believe that your copyrighted material has been used on our website in a way that constitutes copyright infringement, please follow our DMCA Takedown Notice procedures as outlined in our Terms of Use.
        </p>
        <p>
            This website may contain links to third-party websites. These links are provided solely as a convenience to you and do not constitute an endorsement by Real Estate Rover of the content on such third-party websites. Real Estate Rover is not responsible for the content of linked third-party websites.
        </p>
        <p>
            Real Estate Rover reserves the right to modify these terms of use at any time without prior notice. Your continued use of this website following the posting of changes to these terms constitutes acceptance of those changes.
        </p>
    `;


    return (
        <div>
            <StyledButton
                children = 'View Copyright Notice'
                style = 'secondary'
                sx = {{  mt: 3 }}
                onClick = {handleOpen}
            />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ textAlign: 'center' }}>Copyright Notice</DialogTitle>
                <DialogContent>
                    <DialogContentText
                        sx={{ color: theme.palette.text.primary }}
                        dangerouslySetInnerHTML={{ __html: copyrightText }}
                    />
                </DialogContent>
                <DialogActions>
                    <StyledButton
                        children = 'Close'
                        style = 'secondary'
                        onClick = {handleClose}
                    />
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Copyright;
