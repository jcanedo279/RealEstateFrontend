import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import fetchBackendApi from '../util/Util';
import { useFlashMessage } from '../flash/FlashMessageContext';
import MessageContainer from '../flash/FlashMessageContainer';


const EmailVerification = () => {
    const { addFailMessage, addMessage } = useFlashMessage();
    const navigate = useNavigate();
    const { token } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                addMessage({
                    message: "Verification failed. We couldn't find a verification token in the link you followed. Please request a new verification email.",
                    status: 'error',
                    flash_id: 'email-verify',
                    animation: 'shake'
                });
                return;
            }
        
            try {
                const data = await fetchBackendApi(`/email/verify/${token}`, { method: 'POST' });
                if (data.fancy_flash) {
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
                addFailMessage(error, 'email-verify');
            }
        };
    
        fetchData();
    }, [token]);

    return (
        <div className="container">
            <h1>Email Verification</h1>
            <MessageContainer flash_id="email-verify" maxMessages={1} />
        </div>
    );
};

export default EmailVerification;
