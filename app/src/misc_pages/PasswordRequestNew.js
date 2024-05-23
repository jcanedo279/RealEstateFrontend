import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Link, FormControl, useTheme } from '@mui/material';
import MessageContainer from '../flash/FlashMessageContainer';
import { useFlashMessage } from '../flash/FlashMessageContext';
import StyledTextField from '../components/material/StyledTextField';
import StyledButton from '../components/material/StyledButton';
import Layout from '../components/Layout';
import { useAuth } from '../util/AuthContext';


const PasswordRequestNew = ({ currentUser }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const { addFailMessage, addMessage } = useFlashMessage();
    const theme = useTheme();
    const { fetchBackendApiWithContext } = useAuth();

    // Determine if the user is authenticated
    const isAuthenticated = currentUser && currentUser.email;

    useEffect(() => {
        if (isAuthenticated) {
            setEmail(currentUser.email);
            handleSubmit({ preventDefault: () => {} }); // Simulate form submission for authenticated users
        }
    }, [isAuthenticated, currentUser]);

    const handleInputChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const data = await fetchBackendApiWithContext('password/request-new', {
                method: 'POST',
                data: { userEmail: email }
            });

            if (data.fancy_flash) {
                console.log("Password request new data has flash messages:", data.fancy_flash);
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
                    navigate('/login');
                }, 3000);
            }
        } catch (error) {
            addFailMessage(error, 'password-request-new');
        }

    };

    return (
        <Layout>
            <Container maxWidth="sm">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        bgcolor: 'background.paper',
                        gap: theme.spacingFactor.half,
                        borderRadius: theme.shape.borderRadius,
                        boxShadow: 3,
                        p: theme.spacingFactor.single
                    }}
                >
                    <Typography variant="h4" sx={{ mb: theme.spacingFactor.half }}>
                        Reset Your Password
                    </Typography>
                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        {isAuthenticated ? (
                            <Typography variant="body1">
                                Your password reset link will be sent to your registered email: {currentUser.email}
                            </Typography>
                        ) : (
                            <>
                                <FormControl fullWidth>
                                    <StyledTextField
                                        id="email"
                                        label="Enter your email"
                                        name="email"
                                        value={email}
                                        fullWidth
                                        onChange={handleInputChange}
                                        sx={{ mb: theme.spacingFactor.half }}
                                    />
                                </FormControl>
                                <StyledButton
                                    children='Send Reset Link'
                                    type='submit'
                                    fullWidth
                                />
                            </>
                        )}
                    </form>
                    <MessageContainer flash_id="password-request-new" maxMessages={1} />
                    <Box>
                        <Link href="/login" underline="hover" sx={{ color: theme.palette.text.primary }}>
                            Return to login
                        </Link>
                    </Box>
                </Box>
            </Container>
        </Layout>
    );
};

export default PasswordRequestNew;
