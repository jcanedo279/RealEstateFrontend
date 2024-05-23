import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, FormControl, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFlashMessage } from '../flash/FlashMessageContext';
import MessageContainer from '../flash/FlashMessageContainer';
import StyledButton from '../components/material/StyledButton';
import StyledTextField from '../components/material/StyledTextField';
import Layout from '../components/Layout';
import { useAuth } from '../util/AuthContext';

const DeleteAccount = () => {
    const navigate = useNavigate();
    const { addFailMessage, addMessage } = useFlashMessage();
    const { fetchBackendApiWithContext } = useAuth();
    const [confirmationText, setConfirmationText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteAccount = async () => {
        console.log(confirmationText);
        if (confirmationText !== 'DELETE') {
            addMessage({
                message: 'Please type DELETE to confirm.',
                status: 'error', flash_id: 'delete-account', animation: 'shake'
            });
            return;
        }

        setIsDeleting(true);
        try {
            const data = await fetchBackendApiWithContext('delete-account', { method: 'DELETE' });

            if (data.fancy_flash) {
                data.fancy_flash.forEach(message => addMessage({
                    message: message.message,
                    status: message.status,
                    flash_id: message.flash_id,
                    animation: message.animation
                }));
            }

            // To check for a success message to navigate after showing the message
            const successMessage = data.fancy_flash.find(msg => msg.status === 'success');
            if (successMessage) {
                setTimeout(() => {
                    navigate('/logout');
                }, 3000);
            }
        } catch (error) {
            addFailMessage(error.message, 'delete-account');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Layout>
            <Box sx={{ p: 2, maxWidth: '50%', mx: 'auto', mt: 4 }}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Delete Account
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Warning: This action is irreversible. Deleting your account will remove all your data from our system.
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        To confirm, please type <strong>DELETE</strong> in the box below.
                    </Typography>

                    <FormControl fullWidth margin="normal">
                        <StyledTextField
                            id='confirmation_text'
                            label='Confirmation'
                            name='confirmation_text'
                            value={confirmationText}
                            fullWidth
                            onChange={(e) => setConfirmationText(e.target.value)}
                        />
                    </FormControl>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <StyledButton
                                startIcon={<DeleteIcon />}
                                children='Delete My Account'
                                disabled={isDeleting}
                                onClick={handleDeleteAccount}
                            />
                        </Grid>
                    </Grid>

                    <MessageContainer flash_id="delete-account" maxMessages={1} />
                </Paper>
            </Box>
        </Layout>
    );
};

export default DeleteAccount;
