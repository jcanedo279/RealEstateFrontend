import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../util/AuthContext';
import {
    Box,
    Button,
    Card,
    CardContent,
    CssBaseline,
    Grid,
    Typography,
    Link,
} from '@mui/material';
import Layout from '../components/Layout';
import Disclaimer from '../components/Disclaimer';
import Copyright from '../components/Copyright';
import { useTheme } from '@mui/material/styles';


const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { authState: { isAuthSession }, fetchBackendApiWithContext } = useAuth();
    const theme = useTheme();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await fetchBackendApiWithContext('/profile');
                console.log("Received data is: ", data);
                setUser(data);
            } catch (error) {
                console.error('Unable to fetch from backend:', error.message);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        if (isAuthSession) {
            console.log('Trying auth logic :>');
            fetchProfile();
        } else {
            navigate('/login');
        }
    }, [navigate]);

    if (loading) {
        return <div>Loading profile...</div>;
    }

    return (
        <Layout>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', mt: theme.spacing(4) }}>
                <CssBaseline />
                <Card sx={{ width: '80%', maxWidth: '800px', borderRadius: theme.shape.borderRadius, boxShadow: theme.shadows[3], p: theme.spacing(3) }}>
                    <CardContent>
                        <Typography variant="h4" component="h1" textAlign='center' sx={{ fontWeight: 'bold', mb: theme.spacing(3) }}>
                            Your Profile
                        </Typography>
                        <Grid container spacing={theme.spacing(3)} alignItems="flex-start">
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ textAlign: 'left' }}>
                                    <Typography variant="body1" sx={{ mb: theme.spacing(1) }}><strong>Email:</strong> {user?.email}</Typography>
                                    <Typography variant="body1" sx={{ mb: theme.spacing(1) }}><strong>Last Name:</strong> {user?.last_name}</Typography>
                                    <Typography variant="body1" sx={{ mb: theme.spacing(1) }}><strong>Address:</strong> {user?.address || 'N/A'}</Typography>
                                    <Typography variant="body1" sx={{ mb: theme.spacing(1) }}><strong>Saved Properties:</strong> {user?.saved_properties || 0}</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="body1" sx={{ mb: theme.spacing(1) }}><strong>First Name:</strong> {user?.first_name}</Typography>
                                    <Typography variant="body1" sx={{ mb: theme.spacing(1) }}><strong>Contact Number:</strong> {user?.contact_number || 'N/A'}</Typography>
                                    <Typography variant="body1" sx={{ mb: theme.spacing(1) }}><strong>Membership Status:</strong> {user?.membership_status || 'Free'}</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: theme.spacing(4), gap: theme.spacing(2) }}>
                            <Disclaimer />
                            <Copyright />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: theme.spacing(2) }}>
                            <Link href="/delete-account" variant="body2" sx={{ color: theme.palette.text.primary }}>
                                Delete account.
                            </Link>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Layout>
    );
};

export default Profile;
