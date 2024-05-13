import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../util/AuthContext';
import fetchBackendApi from '../util/Util';

function Logout() {
    const navigate = useNavigate();
    const { getCsrfToken, logout } = useAuth();

    useEffect(() => {
        const logout_request = async () => {
            try {
                await fetchBackendApi('/clean-session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': await getCsrfToken()
                    }
                });
                logout();
            } catch (error) {
                console.error('Logout failed', error.message);
                navigate('/login');
            }
        };

        logout_request();
    }, [navigate]);

    return null;  // Or a spinner while waiting to logout
}

export default Logout;
