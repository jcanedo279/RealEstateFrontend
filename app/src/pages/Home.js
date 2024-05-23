import React, { useState } from 'react';

import MessageContainer from '../flash/FlashMessageContainer';
import { useFlashMessage } from '../flash/FlashMessageContext';
import { Box, CssBaseline, Grid, Link, Paper, Typography, Container } from '@mui/material';
import StyledTextField from '../components/material/StyledTextField';
import StyledButton from '../components/material/StyledButton';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../util/AuthContext';
import Layout from '../components/Layout';


function Home() {
    const [userEmail, setUserEmail] = useState('');
    const [issueDescription, setIssueDescription] = useState('');
    const { addFailMessage, addMessage } = useFlashMessage();
    const theme = useTheme();
    const { fetchBackendApiWithContext } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission
      
        const reportFormData = {
          user_email: userEmail,
          issue_description: issueDescription
        };
      
        try {
            const data = await fetchBackendApiWithContext('report/app-issue', {
                method: 'POST',
                data: JSON.stringify(reportFormData)
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
                setUserEmail('');
                setIssueDescription('');
            }
        } catch (error) {
            addFailMessage(error, 'report');
        }
      };

      return (
        <Layout alignTop='align'>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
                <CssBaseline />

                {/* Hero Section */}
                <Box
                    sx={{
                        position: 'relative',
                        backgroundImage: 'url(https://source.unsplash.com/random?real-estate)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        color: '#fff',
                        py: 15,
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderBottomLeftRadius: theme.borderRadius.single,
                        borderBottomRightRadius: theme.borderRadius.single
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            borderBottomLeftRadius: theme.borderRadius.single,
                        borderBottomRightRadius: theme.borderRadius.single
                        }}
                    />
                    <Container maxWidth="md" sx={{ zIndex: 1 }}>
                        <Box sx={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: theme.borderRadius.quarter, p: 3 }}>
                            <Typography variant="h2" component="h2" gutterBottom sx={{ color: theme.palette.primary.main }}>
                                Welcome to Real Estate Rover
                            </Typography>
                            <Typography variant="h5" component="p" sx={{ color: theme.palette.text.primary }}>
                                Unlock Intelligent Real Estate Investment Decisions with Real Estate Rover.
                                Harness the power of data science and AI with Real Estate Rover, your one-stop platform for real estate analysis and investment insights.
                            </Typography>
                        </Box>
                    </Container>
                </Box>

                {/* Floating Container */}
                <Container component="main" maxWidth="lg" sx={{ zIndex: 2 }}>
                    <Paper elevation={6} sx={{ mt: -theme.spacingFactor.single, mb: theme.spacingFactor.single, p: theme.spacingFactor.single, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: theme.borderRadius.quarter }}>
                        
                        {/* Features Section */}
                        <Box sx={{ mt: theme.spacingFactor.single, mb: theme.spacingFactor.single, textAlign: 'center' }}>
                            <Grid container spacing={theme.spacingFactor.single}>
                                <Grid item xs={12} sm={4}>
                                    <Paper elevation={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', p: theme.spacingFactor.single, textAlign: 'center', boxShadow: 1 }}>
                                        <Typography variant="h4" component="h2">
                                            5,000+
                                        </Typography>
                                        <Typography variant="h6" component="p">
                                            Active Listings
                                        </Typography>
                                        <Typography variant="body2" component="p">
                                            Access a vast database of active real estate listings across various regions.
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Paper elevation={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', p: theme.spacingFactor.single, textAlign: 'center', boxShadow: 1 }}>
                                        <Typography variant="h4" component="h2">
                                            3
                                        </Typography>
                                        <Typography variant="h6" component="p">
                                            Analysis Tools
                                        </Typography>
                                        <Typography variant="body2" component="p">
                                            Leverage our in-depth market analysis tools to stay ahead of trends and make informed decisions.
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Paper elevation={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', p: theme.spacingFactor.single, textAlign: 'center', boxShadow: 1 }}>
                                        <Typography variant="h4" component="h2">
                                            10+
                                        </Typography>
                                        <Typography variant="h6" component="p">
                                            Visualization Methods
                                        </Typography>
                                        <Typography variant="body2" component="p">
                                            Explore diverse data visualization methods to gain insights into real estate trends and aggregate data by municipality.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* How It Works Section */}
                        <Box sx={{ mb: theme.spacingFactor.single, textAlign: 'center' }}>
                            <Paper elevation={3} sx={{ p: theme.spacingFactor.single, boxShadow: 1 }}>
                                <Typography variant="h2" component="h1" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                                    How It Works
                                </Typography>
                                <Typography variant="body1" component="p" gutterBottom>
                                    Start by using our Explore feature to sift through market trends and historical data or use our Direct Search to look up specific properties. Here’s how you can benefit:
                                </Typography>
                                <ul style={{ listStyleType: 'none', paddingLeft: 0, textAlign: 'left', display: 'inline-block', marginTop: '8px' }}>
                                    <li className="custom-li" style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                        <i className="fas fa-chart-bar" style={{ marginRight: '8px' }}></i>
                                        <Link href="/explore" color="inherit">
                                            <Typography variant="body1">
                                                <strong>Explore:</strong> Analyze broader market trends to identify areas with high growth potential.
                                            </Typography>
                                        </Link>
                                    </li>
                                    <li className="custom-li" style={{ display: 'flex', alignItems: 'center' }}>
                                        <i className="fas fa-search" style={{ marginRight: '8px' }}></i>
                                        <Link href="/search" color="inherit">
                                            <Typography variant="body1">
                                                <strong>Direct Search:</strong> Instantly retrieve detailed information on any listed property.
                                            </Typography>
                                        </Link>
                                    </li>
                                </ul>
                            </Paper>
                        </Box>

                        {/* Why Use Our Platform Section */}
                        <Box sx={{ mb: theme.spacingFactor.single, textAlign: 'center' }}>
                            <Paper elevation={3} sx={{ p: theme.spacingFactor.single, boxShadow: 1 }}>
                                <Typography variant="h2" component="h1" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                                    Why Use Our Platform?
                                </Typography>
                                <Typography variant="body1" component="p" gutterBottom>
                                    Our platform simplifies the complexity of real estate data to provide you with easy-to-understand insights and actionable advice. By integrating comprehensive market data and predictive analytics, we enable you to:
                                </Typography>
                                <ul style={{ listStyleType: 'none', paddingLeft: 0, textAlign: 'left', display: 'inline-block', marginTop: '8px' }}>
                                    <li className="custom-li" style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                        <i className="fas fa-chart-line" style={{ marginRight: '8px' }}></i>
                                        <Typography variant="body1">
                                            Evaluate investment viability through intuitive visualizations and automated analysis.
                                        </Typography>
                                    </li>
                                    <li className="custom-li" style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                        <i className="fas fa-clock" style={{ marginRight: '8px' }}></i>
                                        <Typography variant="body1">
                                            Access real-time data to stay ahead in fast-moving markets.
                                        </Typography>
                                    </li>
                                    <li className="custom-li" style={{ display: 'flex', alignItems: 'center' }}>
                                        <i className="fas fa-balance-scale" style={{ marginRight: '8px' }}></i>
                                        <Typography variant="body1">
                                            Compare potential investments against market benchmarks to make informed decisions.
                                        </Typography>
                                    </li>
                                </ul>
                            </Paper>
                        </Box>

                        {/* Contact Section */}
                        <Box sx={{ textAlign: 'center' }}>
                            <Paper elevation={3} sx={{ p: theme.spacingFactor.single, boxShadow: 1 }}>
                                <Typography variant="h2" component="h1" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                                    Contact Us
                                </Typography>
                                <Typography variant="body1" component="p" sx={{ mb: theme.spacingFactor.single }}>
                                    Our features are currently in an experimental phase. If you encounter any issues, please let us know by filling out the form below.
                                </Typography>
                                <Box sx={{ textAlign: 'left', p: theme.spacingFactor.single, borderRadius: theme.borderRadius.quarter, boxShadow: 3, backgroundColor: 'white' }}>
                                    {/* Contact Form for Reporting Issues */}
                                    <Box component="form" onSubmit={handleSubmit} sx={{  display: 'flex', flexDirection: 'column', gap: theme.spacingFactor.half }}>
                                        <StyledTextField
                                            id='user_email'
                                            label='Your Email'
                                            name='user_email'
                                            value={userEmail}
                                            required
                                            fullWidth
                                            onChange={(e) => setUserEmail(e.target.value)}
                                        />
                                        <StyledTextField
                                            id='issue_description'
                                            label='Describe the Issue'
                                            name='issue_description'
                                            value={issueDescription}
                                            required
                                            fullWidth
                                            multiline
                                            rows={4}
                                            onChange={(e) => setIssueDescription(e.target.value)}
                                        />
                                        <StyledButton
                                            children = 'Report Issue'
                                            style = 'secondary'
                                            fullWidth
                                            type = 'submit'
                                        />
                                        
                                        <MessageContainer flash_id="report" maxMessages={1} />
                                    </Box>
                                </Box>
                            </Paper>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </Layout>
    );
}

export default Home;
