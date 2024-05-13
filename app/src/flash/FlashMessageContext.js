import React, { createContext, useContext, useState } from 'react';

const FlashMessageContext = createContext();

export const useFlashMessage = () => useContext(FlashMessageContext);

export const FlashMessageProvider = ({ children }) => {
    const [messages, setMessages] = useState({});

    const addMessage = ({ message, status, flash_id, animation }) => {
        const newMessage = {
            id: Date.now(),
            message,
            status,
            animation
        };
        setMessages(prev => ({
            ...prev,
            [flash_id]: [...(prev[flash_id] || []), newMessage]
        }));
    };

    const addFailMessage = (error, flash_id) => {
        const error_message = error.message ? ': ' + error.message + '.' : '.'
        addMessage({
            message: 'Unable to fetch from backend' + error_message,
            status: 'fail',
            flash_id: flash_id
        });
    };

    const removeMessage = (flash_id, id) => {
        setMessages(prev => ({
            ...prev,
            [flash_id]: prev[flash_id].filter(msg => msg.id !== id)
        }));
    };

    const clearMessages = (flash_id) => {
        setMessages(prev => ({
            ...prev,
            [flash_id]: []
        }));
    };

    return (
        <FlashMessageContext.Provider value={{ addFailMessage, addMessage, removeMessage, clearMessages, messages }}>
            {children}
        </FlashMessageContext.Provider>
    );
};