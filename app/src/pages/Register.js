import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fetchBackendApi from '../util/Util';
import MessageContainer from '../flash/FlashMessageContainer';
import { useFlashMessage } from '../flash/FlashMessageContext';
import M from 'materialize-css';

import '../styles/Forms.css';
import '../styles/Register.css';


const Register = () => {
    // Step control
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const { addFailMessage, addMessage } = useFlashMessage();

    useEffect(() => {
        M.AutoInit();
        setTimeout(() => M.updateTextFields(), 0);
    }, []);

    // Form state management
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userEmail: '',
        userPassword: '',
        confirmationPassword: '',
        isProfessional: false
    });

    // Handle form input changes
    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        const { userPassword, confirmationPassword } = formData;

        if (userPassword !== confirmationPassword) {
            addMessage({ message: 'Passwords do not match.', status: 'error', flash_id: 'register', animation: 'shake' });
            return;
        }

        try {
            const data = await fetchBackendApi('/register', {
                method: 'POST',
                data: formData
            });

            if (data.fancy_flash) {
                console.log("Register data has flash messages:", data.fancy_flash);
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
            addFailMessage(error, 'register');
        }
    };

    // Navigation between form steps
    const showStep = (stepNumber) => {
        setStep(stepNumber);
        setTimeout(() => M.updateTextFields(), 0);
    };

    return (
        <div className="container login-container">
            <div className="login-box">
                <h2 className="login-title center">Register for an Account</h2>
                <div className="spacer"></div>
                <form className="login-form" onSubmit={handleSubmit}>
                    {step === 1 && (
                        <div>
                            <h2>Personal Information</h2>
                            <div className="form-element-spacer"></div>
                            <div className="input-field">
                                <input id="first_name" name="firstName" type="text" value={formData.firstName} onChange={handleInputChange} required />
                                <label htmlFor="first_name">First Name:</label>
                            </div>
                            <div className="input-field">
                                <input id="last_name" name="lastName" type="text" value={formData.lastName} onChange={handleInputChange} required />
                                <label htmlFor="last_name">Last Name:</label>
                            </div>
                            <label htmlFor="is_professional">Account Type:</label>
                            <div className="input-field">
                                <div className="switch form-element">
                                    <label>
                                        Personal
                                        <input type="checkbox" name="isProfessional" checked={formData.isProfessional} onChange={handleInputChange} id="is_professional" />
                                        <span className="lever"></span>
                                        Professional
                                    </label>
                                </div>
                            </div>
                            <div className="form-element-spacer"></div>
                        </div>
                    )}
                    {step === 2 && (
                        <div>
                            <h2>Account Credentials</h2>
                            <div className="form-element-spacer"></div>
                            <div className="input-field">
                                <input id="email" name="userEmail" type="email" value={formData.userEmail} onChange={handleInputChange} required />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="input-field">
                                <input id="password" name="userPassword" type="password" value={formData.userPassword} onChange={handleInputChange} required />
                                <label htmlFor="password">Password</label>
                            </div>
                            <div className="input-field">
                                <input id="confirmation_password" name="confirmationPassword" type="password" value={formData.confirmationPassword} onChange={handleInputChange} required />
                                <label htmlFor="confirmation_password">Confirm Password</label>
                            </div>
                            <div className="form-element-spacer"></div>
                        </div>
                    )}
                    <div className="form-controls">
                        <div className="button-group">
                            {step > 1 && (
                                <button type="button" className="btn waves-effect waves-light main-color margin-right" onClick={() => showStep(1)}>Back</button>
                            )}
                            {step < 2 && (
                                <button type="button" className="btn waves-effect waves-light main-color margin-right" onClick={() => showStep(2)}>Next</button>
                            )}
                            {step === 2 && (
                                <button type="submit" className="btn waves-effect waves-light main-color margin-right">Register</button>
                            )}
                        </div>
                        <div className="step-indicators">
                            <span className={`step-dot ${step === 1 ? 'active' : ''}`} id="dot1"></span>
                            <span className={`step-dot ${step === 2 ? 'active' : ''}`} id="dot2"></span>
                        </div>
                    </div>
                </form>
                <MessageContainer flash_id="register" maxMessages={1} />
                <div className="center">
                    Already have an account? <a href="/login">Log in</a>
                </div>
            </div>
        </div>
    );
};

export default Register;
