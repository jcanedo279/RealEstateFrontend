import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Container,
    List,
    ListItem,
    ListItemText,
    Divider,
    useTheme
} from '@mui/material';
import StyledButton from './material/StyledButton';


const ConfirmationPopup = ({ open, handleClose, handleAgree }) => {
    const theme = useTheme();

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Terms of Service</DialogTitle>
            <DialogContent dividers>
                <Container>
                    <Typography variant="h6" gutterBottom>1. Acceptance of Terms</Typography>
                    <Typography variant="body1" paragraph>
                        By accessing this website, you accept these terms and conditions. Do not continue to use Real Estate Rover if you do not agree to take all of the terms and conditions stated on this page.
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" gutterBottom>2. Services Provided</Typography>
                    <Typography variant="body1" paragraph>
                        Real Estate Rover provides real estate data analysis and investment insights. These services are provided "as is" and "as available" without any warranties of any kind.
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" gutterBottom>3. User Responsibilities</Typography>
                    <List>
                        <ListItem>
                            <ListItemText primary="Users must provide accurate and up-to-date information when using our services." />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Users are responsible for maintaining the confidentiality of their account information and password." />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Users must not use our services for any illegal or unauthorized purposes." />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Users agree not to engage in any activity that disrupts or interferes with our services." />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Users must comply with all applicable laws and regulations in connection with their use of our services." />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Users agree not to reproduce, duplicate, copy, sell, trade, resell, or exploit for any commercial purposes any portion of the services provided by Real Estate Rover." />
                        </ListItem>
                    </List>
                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" gutterBottom>4. Data Usage and Retention</Typography>
                    <Typography variant="body1" paragraph>
                        We collect and use your personal data as described in our Privacy Policy. By using our services, you consent to such processing and you warrant that all data provided by you is accurate.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        We will retain your personal data only for as long as is necessary for the purposes set out in our Privacy Policy.
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" gutterBottom>5. Intellectual Property Rights</Typography>
                    <Typography variant="body1" paragraph>
                        Other than the content you own, under these Terms, Real Estate Rover and/or its licensors own all the intellectual property rights and materials contained on this website. You are granted a limited license only for purposes of viewing the material contained on this website.
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" gutterBottom>6. Account Termination</Typography>
                    <Typography variant="body1" paragraph>
                        We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Users may terminate their accounts at any time by contacting Real Estate Rover support. Upon termination, all provisions of these Terms which by their nature should survive termination shall survive, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" gutterBottom>7. Limited Liability</Typography>
                    <Typography variant="body1" paragraph>
                        In no event shall Real Estate Rover, nor any of its officers, directors, and employees, be liable for anything arising out of or in any way connected with your use of this website, whether such liability is under contract, tort, or otherwise, and Real Estate Rover, including its officers, directors, and employees shall not be liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this website.
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" gutterBottom>8. Dispute Resolution</Typography>
                    <Typography variant="body1" paragraph>
                        Any disputes arising out of or relating to these Terms of Service, the Website, or our services shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. Any such dispute shall be arbitrated on an individual basis, and shall not be consolidated in any arbitration with any claim or controversy of any other party.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        The arbitration shall be conducted in [Your City, State], and judgment on the arbitration award may be entered into any court having jurisdiction thereof.
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" gutterBottom>9. Governing Law</Typography>
                    <Typography variant="body1" paragraph>
                        These Terms shall be governed and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" gutterBottom>10. Changes to These Terms</Typography>
                    <Typography variant="body1" paragraph>
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" gutterBottom>11. Contact Us</Typography>
                    <Typography variant="body1" paragraph>
                        If you have any questions about these Terms, please contact us at [Your Contact Information].
                    </Typography>
                </Container>
            </DialogContent>
            <DialogActions>
                <StyledButton
                    children='Decline'
                    style='secondary'
                    onClick={handleClose}
                />
                <StyledButton
                    children='Agree'
                    onClick={handleAgree}
                />
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationPopup;
