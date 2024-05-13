import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import fetchBackendApi from '../util/Util';

import '../styles/FancyFlash.css'; // Ensure this file is available in your project


const ResetPasswordRequest = ({ currentUser }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success', 'error', etc.

    // Determine if the user is authenticated
    const isAuthenticated = currentUser && currentUser.email;

    useEffect(() => {
        if (isAuthenticated) {
            setEmail(currentUser.email);
            handleSubmit({ preventDefault: () => {} }); // Simulate form submission for authenticated users
        }
    }, [isAuthenticated, currentUser]);

    const handleInputChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const data = await fetchBackendApi(
                '/reset-password-request',
                {
                    method: 'POST',
                    data: { email }
                }
            );

            setMessage(data.msg);
            setMessageType(data.error);
            if (data.status == 'success') {
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            console.error('Unable to fetch from backend: ', error.message);
            setMessage('An unexpected error occurred. Please try again.');
            setMessageType('error');
        }

    };

    return (
        <div className="container">
            <h1>Reset Your Password</h1>
            <form onSubmit={handleSubmit}>
                {isAuthenticated ? (
                    <p>Your password reset link will be sent to your registered email: {currentUser.email}</p>
                ) : (
                    <>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            placeholder="Enter your email"
                            value={email}
                            onChange={handleInputChange}
                        />
                        <div className="spacer"></div>
                        <button type="submit" className="btn">Send Reset Link</button>
                    </>
                )}
                <div className={`message-container ${messageType}`}>
                    <p>{message}</p>
                </div>
            </form>
            <div>
                <div className="spacer"></div>
                <a href="/login">Return to login</a>
            </div>
        </div>
    );
};

export default ResetPasswordRequest;
