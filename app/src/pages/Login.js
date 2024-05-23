import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CssBaseline, Link, Paper, Box, Grid, Avatar, Typography, FormControl, useTheme } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MessageContainer from '../flash/FlashMessageContainer';
import { useFlashMessage } from '../flash/FlashMessageContext';
import { useAuth } from '../util/AuthContext';
import StyledTextField from '../components/material/StyledTextField';
import StyledButton from '../components/material/StyledButton';
import Layout from '../components/Layout';


function Login() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { addFailMessage, addMessage, clearMessages } = useFlashMessage();
    const theme = useTheme();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const data = await login(email, password);
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
                    navigate('/profile');
                    clearMessages('login');
                }, 3000);
            }
        } catch (error) {
            addFailMessage(error, 'login');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout alignTop='align'>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CssBaseline />
                <Grid container component="main" sx={{ flex: 1 }}>
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        sx={{
                            backgroundImage: 'url(https://source.unsplash.com/random?real-estate)',
                            backgroundRepeat: 'no-repeat',
                            backgroundColor: (t) => (t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]),
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            zIndex: -1
                        }}
                    />
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        component={Paper}
                        elevation={6}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            backgroundColor: theme.palette.background.default,
                            borderTopRightRadius: theme.borderRadius.single,
                            borderBottomRightRadius: theme.borderRadius.single
                        }}
                    >
                        <Box
                            sx={{
                                width: '70%',
                                maxWidth: '400px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                p: theme.spacingFactor.single,
                                borderRadius: theme.borderRadius.quarter,
                                boxShadow: 3,
                                backgroundColor: theme.palette.background.paper,
                            }}
                        >
                            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography variant="h6" component="h1" sx={{ mb: theme.spacingFactor.single, fontWeight: 'bold', color: theme.palette.primary.main }}>
                                Sign in
                            </Typography>
                            <Box
                                component="form"
                                noValidate
                                onSubmit={handleSubmit}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column', 
                                    width: '100%',
                                    gap: theme.spacingFactor.half,
                                    backgroundColor: theme.palette.background.paper
                                }}
                            >
                                <FormControl fullWidth>
                                    <StyledTextField
                                        id='email'
                                        label='Email Address'
                                        name='email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </FormControl>
                                <FormControl fullWidth>
                                    <StyledTextField
                                        id='password'
                                        label='Password'
                                        name='password'
                                        value={password}
                                        type='password'
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </FormControl>
                                <StyledButton
                                    children = 'Sign In'
                                    type = 'submit'
                                    fullWidth
                                    disabled={isSubmitting}
                                />
                                <MessageContainer flash_id="login" maxMessages={1} />
                                <Grid container sx={{ flexWrap: 'nowrap', alignItems: 'center' }}>
                                    <Grid item sx={{ flexGrow: 1, color: theme.palette.text.primary }}>
                                        <Link href="/password/request-new" variant="body2" sx={{ color: theme.palette.text.primary, display: 'inline-flex' }}>
                                            Forgot password?
                                        </Link>
                                    </Grid>
                                    <Grid item sx={{ flexShrink: 0, color: theme.palette.text.primary, textAlign: 'right' }}>
                                        <Link href="/register" variant="body2" sx={{ color: theme.palette.text.primary, display: 'inline-flex' }}>
                                            Don't have an account? Sign Up
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    );
}

export default Login;
