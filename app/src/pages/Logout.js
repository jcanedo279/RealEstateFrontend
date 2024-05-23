import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../util/AuthContext';


function Logout() {
    const navigate = useNavigate();
    const { logout, fetchBackendApiWithContext } = useAuth();

    useEffect(() => {
        const logout_request = async () => {
            try {
                await fetchBackendApiWithContext('/clean-session', { method: 'POST' });
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
