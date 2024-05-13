import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';


const EmailVerification = () => {
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');
    const query = new URLSearchParams(useLocation().search);

    useEffect(() => {
        // Read the status and message from the URL parameters
        setStatus(query.get('status') || '');
        setMessage(query.get('message') || '');
    }, [query]);

    return (
        <div className="container">
            <h1>Email Verification</h1>
            {status && (
                <div className={`email-verification-message ${status}`}>
                    <p>{message}</p>
                </div>
            )}
            {status === 'success' && <a href="/login">Proceed to Login</a>}
        </div>
    );
};

export default EmailVerification;
