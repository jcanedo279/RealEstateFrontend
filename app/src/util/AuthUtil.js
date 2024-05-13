import fetchBackendApi from './Util';


const CSRF_ACCESS_TOKEN_KEY = 'csrf_access_token';
const CSRF_REFRESH_TOKEN_KEY = 'csrf_refresh_token';
const SESSION_INFO_KEY = 'session_info';

export const getCsrfAccessToken = () => localStorage.getItem(CSRF_ACCESS_TOKEN_KEY);
export const getCsrfRefreshToken = () => localStorage.getItem(CSRF_REFRESH_TOKEN_KEY);

const getSessionInfo = () => {
    const sessionInfoString = localStorage.getItem(SESSION_INFO_KEY);
    return sessionInfoString ? JSON.parse(sessionInfoString) : null;
};

export const getAccessExpires = () => getSessionInfo()?.access_expires;
export const getRefreshExpires = () => getSessionInfo()?.refresh_expires;
export const getStatus = () => getSessionInfo()?.status;


export function hasExpired(datetimeStr) {
    // ISO 8601 formatted datetime string.
    return new Date(datetimeStr) < new Date();
}

function setClientData(token_key, token) {
    localStorage.setItem(token_key, token);
}

function clearClientData(token_key) {
    localStorage.removeItem(token_key);
}

export const isAuthSession = () => getStatus() === 'authenticated';

export const isAccessValid = () => {
    const accessExpires = getAccessExpires();
    return accessExpires && !hasExpired(accessExpires);
};

export const isRefreshValid = () => {
    const refreshExpires = getRefreshExpires();
    return refreshExpires && !hasExpired(refreshExpires);
};

export const isSessionValid = () => {
    if (!getSessionInfo()) return false;
    return isAuthSession() ? isAccessValid() && isRefreshValid() : isAccessValid();
};

const clearServerTokens = async () => {
    try {
        await fetchBackendApi('/clean-session', {method: 'POST', });
        console.log('Tokens cleared on the server');
    } catch (error) {
        console.error('Error clearing tokens on server:', error);
    }
};

function updateSessionInfo(newSessionInfo) {
    const existingSessionInfo = getSessionInfo() || {};
    const updatedSessionInfo = { ...existingSessionInfo, ...newSessionInfo };
    setClientData(SESSION_INFO_KEY, JSON.stringify(updatedSessionInfo));
}

// Start a session, clean up the previous session.
export function startSession(session_info, csrf_access_token, csrf_refresh_token=null) {
    clearClientData(CSRF_ACCESS_TOKEN_KEY);
    clearClientData(CSRF_REFRESH_TOKEN_KEY);
    setClientData(CSRF_ACCESS_TOKEN_KEY, csrf_access_token);
    if (csrf_refresh_token) {
        setClientData(CSRF_REFRESH_TOKEN_KEY, csrf_refresh_token);
    }
    updateSessionInfo(session_info);
}

export const startAuthSession = async (email, password) => {
    try {
        const data = await fetchBackendApi('/start-auth-session', {
            method: 'POST',
            data: { user_email: email, user_password: password }
        });
        const session_data = data.session_data;
        if (session_data && session_data.session_info && session_data.csrf_access_token && session_data.csrf_refresh_token) {
            startSession(session_data.session_info, session_data.csrf_access_token, session_data.csrf_refresh_token);
        }
        return data;
    } catch (error) {
        console.error('Error starting authenticated session: ', error.message);
        return null;
    }
};

// Start an anonymous session, clean up the authorized session.
export const startAnonSession = async () => {
    if (!isAuthSession() && isAccessValid()) {
        console.log('Anonymous session already exists, no need to start one.')
        return true
    }
    try {
        await clearServerTokens();
        const data = await fetchBackendApi('/start-anon-session', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        console.log("Anon session data is: ", data);
        const session_data = data.session_data;
        if (session_data && session_data.session_info && session_data.csrf_access_token) {
            startSession(session_data.session_info, session_data.csrf_access_token);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error starting anonymous session:', error);
        return false;
    }
};

const fallbackAnonSession = async () => {
    console.log('Falling back on anonymous session.');
    await startAnonSession();
}

// Refresh an authenticated session after the access token expires.
export const refreshAuthSession = async () => {
    if (!isRefreshValid()) {
        console.error('No valid refresh token available.');
        await fallbackAnonSession();
        return false;
    }

    try {
        const csrf_refresh_token = getCsrfRefreshToken();
        const data = await fetchBackendApi('/refresh-auth-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrf_refresh_token
            }
        });
        const session_data = data.session_data;
        if (session_data.session_info && session_data.csrf_access_token) {
            startSession(session_data.session_info, session_data.csrf_access_token, csrf_refresh_token);
            return true;
        }
        await fallbackAnonSession();
        return false;
    } catch (error) {
        console.error('Error refreshing authenticated session:', error);
        await fallbackAnonSession();
        return false;
    }
};

// Refresh session token based on type (anonymous or authenticated)
export const refreshSessionIfNeeded = async () => {
    if (!isSessionValid()) {
        console.log('Session is not valid, re-validating...')
        return getStatus() === 'authenticated' ? await refreshAuthSession() : await startAnonSession();
    }
    return true;
};

export const maybeGetCsrfToken = async (refresh=false) => {
    // Ensure the session is valid.
    const isSessionValid = await refreshSessionIfNeeded();
    if (!isSessionValid) {
        throw new Error("Unable to validate session.");
    }

    const csrfToken = refresh ? getCsrfRefreshToken() : getCsrfAccessToken();
    if (!csrfToken) {
        throw new Error("Request csrf token unavailable. Please refresh the page.");
    }
    return csrfToken;
}
