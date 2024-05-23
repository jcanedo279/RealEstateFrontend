import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {
    isAuthSession,
    startAnonSession,
    startAuthSession,
    fetchBackendApi
} from './AuthUtil';


export const AuthContext = createContext({
    authState: { isAuthSession: isAuthSession() },
    login: () => {},
    logout: () => {},
    fetchBackendApiWithContext: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        isAuthSession: isAuthSession()
    });

    const login = async (email, password) => {
        const data = await startAuthSession(email, password);
        setAuthState({ isAuthSession: isAuthSession() });
        return data;
    };

    const logout = async () => {
        const data = await startAnonSession();
        setAuthState({ isAuthSession: isAuthSession() });
        return data;
    };

    const fetchBackendApiWithContext = async (route, options = {}) => {
        const data = await fetchBackendApi(route, options);
        setAuthState({ isAuthSession: isAuthSession() });
        return data;
    }

    useEffect(() => {
        setAuthState({
            isAuthSession: isAuthSession()
        });
    }, [login, logout, fetchBackendApiWithContext]);

    return (
        <AuthContext.Provider value={{ authState, login, logout, fetchBackendApiWithContext }}>
            {children}
        </AuthContext.Provider>
    );
};


// A component to handle route protection
export const AuthRoute = ({ element: Element, ...rest }) => {
    const location = useLocation();
    const { authState: { isAuthSession } } = useAuth();

    if (!isAuthSession) {
        console.log('Not authenticated, redirecting...');
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return <Element {...rest} />;
};
