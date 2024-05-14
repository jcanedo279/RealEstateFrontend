import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFlashMessage } from '../flash/FlashMessageContext';
import fetchBackendApi from '../util/Util';
import MessageContainer from '../flash/FlashMessageContainer';

import '../styles/FancyFlash.css';


function PasswordSetNew() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();
    const { addFailMessage, addMessage } = useFlashMessage();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        console.log("Sending new request :>");
        try {
            const data = await fetchBackendApi(`/password/set-new/${token}`, {
                method: 'POST',
                data: { new_password: newPassword }
            });

            if (data.fancy_flash) {
                console.log("Password set new data has flash messages:", data.fancy_flash);
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
            addFailMessage(error, 'password-set-new');
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <label htmlFor="new_password">New Password:</label>
                <input type="password" id="new_password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                <label htmlFor="confirm_password">Confirm Password:</label>
                <input type="password" id="confirm_password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                <button type="submit" className="btn">Update Password</button>
            </form>
            <MessageContainer flash_id="password-set-new" maxMessages={1} />
        </div>
    );
}

export default PasswordSetNew;
