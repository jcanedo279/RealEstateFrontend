import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Paper, Typography, Container, useTheme } from '@mui/material';
import { useFlashMessage } from '../flash/FlashMessageContext';
import MessageContainer from '../flash/FlashMessageContainer';
import Layout from '../components/Layout';
import { useAuth } from '../util/AuthContext';


const EmailVerification = () => {
    const { addFailMessage, addMessage } = useFlashMessage();
    const navigate = useNavigate();
    const { token } = useParams();
    const { fetchBackendApiWithContext } = useAuth();
    const theme = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                addMessage({
                    message: "Verification failed. We couldn't find a verification token in the link you followed. Please request a new verification email.",
                    status: 'error',
                    flash_id: 'email-verify',
                    animation: 'shake'
                });
                return;
            }
        
            try {
                const data = await fetchBackendApiWithContext(`email/verify/${token}`, { method: 'POST' });
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
                        navigate('/login');
                    }, 3000);
                }
            } catch (error) {
                addFailMessage(error, 'email-verify');
            }
        };
    
        fetchData();
    }, [token]);

    return (
        <Layout>
            <Container maxWidth="sm">
                <Paper
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        bgcolor: 'background.paper',
                        p: theme.spacingFactor.single,
                        borderRadius: 2,
                        boxShadow: 3,
                    }}
                >
                    <Typography variant="h4" sx={{ mb: theme.spacingFactor.half }}>
                        Email Verification
                    </Typography>
                    <MessageContainer flash_id="email-verify" maxMessages={1} />
                </Paper>
            </Container>
        </Layout>
    );
};

export default EmailVerification;
