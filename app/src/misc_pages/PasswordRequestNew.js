import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import fetchBackendApi from '../util/Util';
import MessageContainer from '../flash/FlashMessageContainer';
import { useFlashMessage } from '../flash/FlashMessageContext';
import { useAuth } from '../util/AuthContext';

import '../styles/FancyFlash.css'; // Ensure this file is available in your project


const PasswordRequestNew = ({ currentUser }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const { addFailMessage, addMessage } = useFlashMessage();
    const { getCsrfToken } = useAuth();

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
            const data = await fetchBackendApi('/password/request-new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': await getCsrfToken()
                },
                data: { userEmail: email }
            });

            if (data.fancy_flash) {
                console.log("Password request new data has flash messages:", data.fancy_flash);
                data.fancy_flash.forEach(message => addMessage({
                    message: message.message,
                    status: message.status,
                    flash_id: message.flash_id,
                    animation: message.animation
                }));
            }
            
            // To check for a success message to navigate after showing the message
            const successMessage = data.fancy_flash.find(msg => msg.status === 'success');
            if (successMessage) {
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        } catch (error) {
            addFailMessage(error, 'password-request-new');
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
            </form>
            <MessageContainer flash_id="password-request-new" maxMessages={1} />
            <div>
                <div className="spacer"></div>
                <a href="/login">Return to login</a>
            </div>
        </div>
    );
};

export default PasswordRequestNew;
