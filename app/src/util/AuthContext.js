import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {
    isAuthSession,
    startAnonSession,
    startAuthSession,
    maybeGetCsrfToken
} from './AuthUtil';

export const AuthContext = createContext({
    authState: { isAuthSession: isAuthSession() },
    login: () => {},
    logout: () => {},
    getCsrfToken: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        isAuthSession: isAuthSession()
    });

    const login = async (email, password) => {
        return await startAuthSession(email, password);
    };

    const logout = async () => {
        return await startAnonSession();
    };

    const getCsrfToken = async () => {
        return await maybeGetCsrfToken();
    }

    useEffect(() => {
        setAuthState({
            isAuthSession: isAuthSession()
        });
    }, [login, logout, getCsrfToken]);

    return (
        <AuthContext.Provider value={{ authState, login, logout, getCsrfToken }}>
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
