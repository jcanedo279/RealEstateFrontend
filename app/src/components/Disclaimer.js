import React, { useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import StyledButton from './material/StyledButton';
import { useTheme } from '@mui/material/styles';


const Disclaimer = () => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const disclaimerText = `
        <p><strong>Disclaimer:</strong><br>
        Real Estate Rover is a real estate data analysis and investment insights platform. The data, analytics, and visualizations provided on this platform, including but not limited to property listings, rental income estimates, price estimates, breakeven prices, comparative prices, adjusted cash-on-cash returns, and various property metrics visualizations (clustering, correlatory, distributional, histograms, etc.), are intended for informational purposes only.</p>
        
        <p><strong>Accuracy of Data:</strong> While we strive to provide accurate and up-to-date information, we do not guarantee the completeness, accuracy, or reliability of the data presented. The data is sourced from various third-party providers and may be subject to errors, omissions, and changes without notice. Users should independently verify any information before making any investment decisions.</p>
        
        <p><strong>Investment Risk:</strong> Real estate investments carry inherent risks, including but not limited to market fluctuations, property-specific risks, and changes in economic conditions. Past performance is not indicative of future results. Users should conduct their own due diligence and consult with financial, legal, and other professional advisors before making any investment decisions.</p>
        
        <p><strong>No Financial Advice:</strong> The information provided on Real Estate Rover does not constitute financial, legal, or investment advice. We do not endorse or recommend any specific properties, investments, or strategies. Users are solely responsible for their investment decisions.</p>
        
        <p><strong>Graphs and Visualizations:</strong> The graphical representations and visualizations of property metrics are based on the data available to us and are intended to assist users in understanding trends and patterns. These visualizations are not predictions or guarantees of future performance.</p>
        
        <p><strong>Limitation of Liability:</strong> Real Estate Rover, its affiliates, and its data providers shall not be liable for any direct, indirect, incidental, consequential, or any other type of damages resulting from the use of, or the inability to use, the information, data, or services provided by this platform. This includes, but is not limited to, damages for loss of profits, business interruption, or loss of information, even if Real Estate Rover has been advised of the possibility of such damages.</p>
        
        <p><strong>User Responsibility:</strong> Users are responsible for maintaining the confidentiality of their account information, including their username and password, and for all activities that occur under their account. Users agree to immediately notify Real Estate Rover of any unauthorized use of their account or any other breach of security.</p>
        
        <p><strong>Data Usage:</strong> Users agree not to reproduce, duplicate, copy, sell, trade, resell, or exploit for any commercial purposes any portion of the data, use of the data, or access to the data provided by Real Estate Rover. Unauthorized use of the data may result in termination of access to the platform and may be subject to legal action.</p>
        
        <p><strong>Third-Party Links:</strong> The platform may contain links to third-party websites or services that are not owned or controlled by Real Estate Rover. Real Estate Rover has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites or services. Users acknowledge and agree that Real Estate Rover shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.</p>
        
        <p><strong>Governing Law:</strong> This disclaimer and any disputes arising out of or related to the use of this platform shall be governed by and construed in accordance with the laws of the jurisdiction in which Real Estate Rover operates, without regard to its conflict of law principles.</p>
        
        <p>By using Real Estate Rover, you acknowledge and agree to the terms of this disclaimer. If you do not agree with any part of this disclaimer, you should not use our services.</p>
    `;

    return (
        <div>
            <StyledButton
                children = 'View Disclaimer'
                style = 'secondary'
                sx = {{ mt: 3 }}
                onClick = {handleOpen}
            />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ textAlign: 'center' }}>Disclaimer</DialogTitle>
                <DialogContent>
                    <DialogContentText
                        sx={{ color: theme.palette.text.primary }}
                        dangerouslySetInnerHTML={{ __html: disclaimerText }}
                    />
                </DialogContent>
                <DialogActions>
                    <StyledButton
                        children = 'Close'
                        style = 'secondary'
                        sx = {{ mt: 3 }}
                        onClick = {handleClose}
                    />
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Disclaimer;
