import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Checkbox, CssBaseline, FormControlLabel, Grid, Link, Paper, Typography } from '@mui/material';
import StyledTextField from '../components/material/StyledTextField';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MessageContainer from '../flash/FlashMessageContainer';
import { useFlashMessage } from '../flash/FlashMessageContext';
import { useTheme } from '@mui/material/styles';
import ToSAgreementButton from '../components/ToSAgreementButton';
import StyledButton from '../components/material/StyledButton';
import Layout from '../components/Layout';
import { useAuth } from '../util/AuthContext';


const Register = () => {
    // Step control
    const [step, setStep] = useState(1);
    const [agreed, setAgreed] = useState(false);
    const navigate = useNavigate();
    const { addFailMessage, addMessage } = useFlashMessage();
    const theme = useTheme();
    const { fetchBackendApiWithContext } = useAuth();

    // Form state management
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userEmail: '',
        userPassword: '',
        confirmationPassword: '',
        isProfessional: false
    });

    // Handle form input changes
    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        const { userPassword, confirmationPassword } = formData;

        if (userPassword !== confirmationPassword) {
            addMessage({ message: 'Passwords do not match.', status: 'error', flash_id: 'register', animation: 'shake' });
            return;
        }

        if (!agreed) {
            addMessage({ message: 'You must first agree to the Terms of Service.', status: 'error', flash_id: 'register', animation: 'shake' });
            return;
        }

        try {
            const data = await fetchBackendApiWithContext('/register', {
                method: 'POST',
                data: formData
            });

            if (data.fancy_flash) {
                console.log("Register data has flash messages:", data.fancy_flash);
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
            addFailMessage(error, 'register');
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
                                Register for an Account
                            </Typography>
                            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: '100%' }}>
                                {step === 1 && (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', mb: theme.spacingFactor.half, gap: theme.spacingFactor.half }}>
                                        <StyledTextField
                                            id='firstName'
                                            label='First Name'
                                            name='firstName'
                                            value={formData.firstName}
                                            required
                                            fullWidth
                                            onChange={handleInputChange}
                                        />
                                        <StyledTextField
                                            id='lastName'
                                            label='Last Name'
                                            name='lastName'
                                            value={formData.lastName}
                                            required
                                            fullWidth
                                            onChange={handleInputChange}
                                        />
                                        <FormControlLabel
                                            control={<Checkbox name="isProfessional" checked={formData.isProfessional} onChange={handleInputChange} sx={{ color: 'black' }} />}
                                            label="Professional Account"
                                            sx={{
                                                '& .MuiTypography-root': { color: theme.palette.text.primary },
                                            }}
                                        />
                                        <StyledButton
                                            children = 'Next'
                                            fullWidth
                                            onClick = {() => setStep(2)}
                                        />
                                    </Box>
                                )}
                                {step === 2 && (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', mb: theme.spacingFactor.half, gap: theme.spacingFactor.half }}>
                                        <StyledTextField
                                            id='userEmail'
                                            label='Email Address'
                                            name='userEmail'
                                            value={formData.userEmail}
                                            required
                                            fullWdith
                                            onChange={handleInputChange}
                                        />
                                        <StyledTextField
                                            id='userPassword'
                                            label='Password'
                                            name='userPassword'
                                            value={formData.userPassword}
                                            type='password'
                                            required
                                            fullWdith
                                            onChange={handleInputChange}
                                        />
                                        <StyledTextField
                                            id='confirmationPassword'
                                            label='Confirm Password'
                                            name='confirmationPassword'
                                            value={formData.confirmationPassword}
                                            type='password'
                                            required
                                            fullWdith
                                            onChange={handleInputChange}
                                        />
                                        <ToSAgreementButton agreed={agreed} setAgreed={setAgreed} />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <StyledButton
                                                children = 'Back'
                                                style = 'secondary'
                                                onClick = {() => setStep(1)}
                                                sx={{ flexGrow: 1, mr: 1 }}
                                            />
                                            <StyledButton
                                                children = 'Register'
                                                type = 'submit'
                                                sx = {{ flexGrow: 1, ml: 1 }}
                                            />
                                        </Box>
                                    </Box>
                                )}
                                <MessageContainer flash_id="register" maxMessages={1} />
                                <Grid container justifyContent="flex-end">
                                    <Grid item>
                                        <Link href="/login" variant="body2" sx={{ color: theme.palette.text.primary }}>
                                            Already have an account? Sign in
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
};

export default Register;
