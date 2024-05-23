import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFlashMessage } from '../flash/FlashMessageContext';
import MessageContainer from '../flash/FlashMessageContainer';
import {
    Box,
    Paper,
    FormControl,
    Typography,
    useTheme
} from '@mui/material';
import Layout from '../components/Layout';
import StyledTextField from '../components/material/StyledTextField';
import StyledButton from '../components/material/StyledButton';
import { useAuth } from '../util/AuthContext';


const PasswordSetNew = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();
    const { addFailMessage, addMessage } = useFlashMessage();
    const { fetchBackendApiWithContext } = useAuth();
    const theme = useTheme();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const data = await fetchBackendApiWithContext(`password/set-new/${token}`, {
                method: 'POST',
                data: { new_password: newPassword }
            });

            if (data.fancy_flash) {
                data.fancy_flash.forEach(message => addMessage({
                    message: message.message,
                    status: message.status,
                    flash_id: message.flash_id,
                    animation: message.animation
                }));
            }
            
            const successMessage = data.fancy_flash.find(msg => msg.status === 'success');
            if (successMessage) {
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        } catch (error) {
            addFailMessage(error, 'password-set-new');
        }
    };

    return (
        <Layout>
            <Box>
                <Paper sx={{ p: theme.spacingFactor.single, mx: 'auto', maxWidth: '400px' }}>
                    <Typography variant="h4" sx={{ mb: theme.spacingFactor.single, textAlign: 'center' }}>
                        Set New Password
                    </Typography>
                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacingFactor.half }}>
                                <FormControl fullWidth>
                                    <StyledTextField
                                        id='new_password'
                                        label='New Password'
                                        name='new_password'
                                        value={newPassword}
                                        required
                                        onChange={e => setNewPassword(e.target.value)}
                                    />
                                </FormControl>
                                <FormControl fullWidth>
                                    <StyledTextField
                                        id='confirm_password'
                                        label='Confirm Password'
                                        name='confirm_password'
                                        value={confirmPassword}
                                        required
                                        onChange={e => setConfirmPassword(e.target.value)}
                                    />
                                </FormControl>

                                <StyledButton
                                    children='Update Password'
                                    type='submit'
                                    fullWith
                                />
                            </Box>
                    </form>
                    <MessageContainer flash_id="password-set-new" maxMessages={1} />
                </Paper>
            </Box>
        </Layout>
    );
}

export default PasswordSetNew;
