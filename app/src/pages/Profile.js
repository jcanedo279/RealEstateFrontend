import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../util/AuthContext';
import fetchBackendApi from '../util/Util';


const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { getCsrfToken, authState: { isAuthSession } } = useAuth();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await fetchBackendApi('/profile', {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': await getCsrfToken()
                    }
                });
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
        <div className="container">
            <h1 className="profile-title">Your Profile</h1>
            <div className="profile-details">
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>First Name:</strong> {user?.first_name}</p>
                <p><strong>Last Name:</strong> {user?.last_name}</p>
            </div>
        </div>
    );
};

export default Profile;
