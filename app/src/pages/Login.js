import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Forms.css';
import { useAuth } from '../util/AuthContext';
import MessageContainer from '../flash/FlashMessageContainer';
import { useFlashMessage } from '../flash/FlashMessageContext';


function Login() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { addFailMessage, addMessage } = useFlashMessage();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const data = await login(email, password);
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
                    navigate('/profile');
                }, 3000);
            }
        } catch (error) {
            addFailMessage(error, 'login');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container login-container">
            <div className="login-box">
                <h2 className="login-title center">Login to Your Account</h2>
                <div className="spacer"></div>
                <form id="loginForm" className="login-form" onSubmit={handleSubmit}>
                    <div className="input-field">
                        <input
                            id="email"
                            type="email"
                            name="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <label htmlFor="email">Email</label>
                    </div>
                    <div className="input-field">
                        <input
                            id="password"
                            type="password"
                            name="password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <label htmlFor="password">Password</label>
                    </div>
                    <button id="loginBtn" className="btn waves-effect waves-light main-color" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <MessageContainer flash_id="login" maxMessages={1} />
                <div className="center">
                    Don't have an account? <a href="/register">Register here</a>
                    <br />
                    Forgot your password? <a href="/reset-password-request">Reset it</a>
                </div>
            </div>
        </div>
    );
}

export default Login;
