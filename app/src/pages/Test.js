import React, { useState, useEffect } from 'react';

const BackendDataComponent = () => {
    const [backendResponse, setBackendResponse] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/test')  // Adjust the URL based on your setup, e.g., process.env.REACT_APP_BACKEND_URL + '/test'
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data from the backend');
                }
                return response.json();
            })
            .then(data => {
                setBackendResponse(data.message);
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error!', error);
                setError(error.message);
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <h1>Response from Backend:</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <p>{backendResponse || "No response from backend"}</p>
            )}
        </div>
    );
};

export default BackendDataComponent;
