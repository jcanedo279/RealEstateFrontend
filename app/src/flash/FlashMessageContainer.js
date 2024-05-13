import React from 'react';
import { useFlashMessage } from './FlashMessageContext';
import FlashMessage from './FlashMessage';

import '../styles/FancyFlash.css';


const MessageContainer = ({ flash_id, maxMessages, width = "100%" }) => {
    const { messages, removeMessage } = useFlashMessage();

    // Control the number of messages to display and manage overflow
    React.useEffect(() => {
        const allMessages = messages[flash_id] || [];
        if (allMessages.length > maxMessages) {
            // Remove the oldest messages that exceed the max limit
            const messagesToRemove = allMessages.slice(0, allMessages.length - maxMessages);
            messagesToRemove.forEach(msg => removeMessage(flash_id, msg.id));
        }
    }, [messages, flash_id, maxMessages, removeMessage]);

    return (
        <div className="fancy-flash-container">
            {(messages[flash_id] || []).slice(-maxMessages).map((msg) => (
                <FlashMessage
                    key={msg.id}
                    {...msg}
                    onClose={() => removeMessage(flash_id, msg.id)}
                    width={width}
                />
            ))}
        </div>
    );
};

export default MessageContainer;