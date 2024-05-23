import internalFetchBackendApi from './Util';


const CSRF_ACCESS_TOKEN_KEY = 'csrf_access_token';
const CSRF_REFRESH_TOKEN_KEY = 'csrf_refresh_token';
const SESSION_INFO_KEY = 'session_info';

const getCsrfAccessToken = () => localStorage.getItem(CSRF_ACCESS_TOKEN_KEY);
const getCsrfRefreshToken = () => localStorage.getItem(CSRF_REFRESH_TOKEN_KEY);

const getSessionInfo = () => {
    const sessionInfoString = localStorage.getItem(SESSION_INFO_KEY);
    return sessionInfoString ? JSON.parse(sessionInfoString) : null;
};

const getAccessExpires = () => getSessionInfo()?.access_expires;
const getRefreshExpires = () => getSessionInfo()?.refresh_expires;
const getStatus = () => getSessionInfo()?.status;


function setClientData(token_key, token) {
    localStorage.setItem(token_key, token);
}

function clearClientData(token_key) {
    localStorage.removeItem(token_key);
}

export const isAuthSession = () => getStatus() === 'authenticated';

function hasExpired(datetimeStr) {
    // ISO 8601 formatted datetime string.
    return new Date(datetimeStr) < new Date();
}

const isAccessValid = () => {
    const accessExpires = getAccessExpires();
    return accessExpires && !hasExpired(accessExpires);
};

const isRefreshValid = () => {
    const refreshExpires = getRefreshExpires();
    return refreshExpires && !hasExpired(refreshExpires);
};

const isSessionValid = () => {
    if (!getSessionInfo()) return false;
    return isAccessValid();
};

function updateSessionInfo(newSessionInfo) {
    const existingSessionInfo = getSessionInfo() || {};
    const updatedSessionInfo = { ...existingSessionInfo, ...newSessionInfo };
    setClientData(SESSION_INFO_KEY, JSON.stringify(updatedSessionInfo));
}

// Start a session, clean up the previous session.
function startSession(session_info, csrf_access_token, csrf_refresh_token=null) {
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
        const data = await internalFetchBackendApi('/start-auth-session', {
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
        const data = await internalFetchBackendApi('/start-anon-session', { method: 'GET' });
        console.log("Anon session data is: ", data);
        const session_data = data.session_data;
        if (session_data && session_data.session_info && session_data.csrf_access_token) {
            startSession(session_data.session_info, session_data.csrf_access_token);
            return true;
        }
    } catch (error) {
        console.error('Error starting anonymous session:', error);
    }
    return false;
};

const fallbackAnonSession = async () => {
    console.log('Falling back on anonymous session.');
    await startAnonSession();
}

// Refresh an authenticated session after the access token expires.
const refreshAuthSession = async () => {
    try {
        const data = await fetchBackendApi('/refresh-auth-session', { method: 'POST' }, true);
        const session_data = data.session_data;
        if (session_data.session_info && session_data.csrf_access_token) {
            startSession(session_data.session_info, session_data.csrf_access_token, session_data.csrf_refresh_token);
            return true;
        }
    } catch (error) {
        console.error('Error refreshing authenticated session:', error);
    }
    return await fallbackAnonSession();
};

// Refresh session token based on type (anonymous or authenticated)
const refreshSessionIfNeeded = async () => {
    if (!isSessionValid()) {
        console.log('Session is not valid, re-validating...')
        return (isAuthSession() && isRefreshValid()) ? await refreshAuthSession() : await startAnonSession();
    }
    return true;
};

const maybeGetCsrfToken = async () => {
    // Ensure the session is valid.
    const isSessionValid = await refreshSessionIfNeeded();
    if (!isSessionValid) {
        throw new Error("Unable to validate session.");
    }

    const csrfToken = getCsrfAccessToken();
    if (!csrfToken) {
        throw new Error("Request csrf token unavailable. Please refresh the page.");
    }
    return csrfToken;
}

export const fetchBackendApi = async (route, options = {}, refresh = false) => {
    // In the future, handle maybeGetCsrfToken failures better.

    // Dynamically add the CSRF token to the headers in options.
    const updatedHeaders = {
        ...options.headers,
        'Content-Type': 'application/json',
        // To avoid an infinite loop when dynamically fetching the csrf token, we conditionally force the refresh token.
        'X-CSRF-Token': refresh ? getCsrfRefreshToken() : await maybeGetCsrfToken()
    };
    const updatedOptions = {
        ...options,
        headers: updatedHeaders,
    };

    return internalFetchBackendApi(route, updatedOptions);
};
