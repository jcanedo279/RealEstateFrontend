import axios from 'axios';


const NGINX_URL = process.env.REACT_APP_NGINX_URL;

const api = axios.create({
    baseURL: `${NGINX_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

/**
 * Utility function to handle API requests via Axios.
 * @param {string} route - The specific API route (relative to baseURL).
 * @param {object} options - Additional Axios request options (e.g., method, headers, data).
 * @param {string} [csrfToken] - Optional CSRF token to include in the request headers.
 * @returns {object} - The parsed response data from the server.
 * @throws {Error} - Error message extracted from the response or a default error.
 */
async function fetchBackendApi(route, options = {}, csrfToken = '', responseCallback=null) {
    try {
        // Set a default request method to 'GET' if not provided
        const { method = 'GET', headers = {}, ...restOptions } = options;

        // Create a new set of headers, adding the CSRF token if present
        const finalHeaders = {
            ...headers,
            ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
        };

        // Make the Axios request using the given route and options
        const response = await api({
            url: route,
            method,
            headers: finalHeaders,
            ...restOptions,
        });

        return response.data;
    } catch (error) {
        // Extract and throw a more specific error message, or provide a generic message
        const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
        throw new Error(errorMessage);
    }
}

export default fetchBackendApi;
