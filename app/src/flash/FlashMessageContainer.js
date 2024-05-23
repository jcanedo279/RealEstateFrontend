import React from 'react';
import { useFlashMessage } from './FlashMessageContext';
import { Box } from '@mui/material';
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

    // If there are no messages, return null to prevent rendering
    if (!messages[flash_id] || messages[flash_id].length === 0) {
        return null;
    }

    return (
        <Box className="fancy-flash-container" sx={{ width: '100%' }}>
            {(messages[flash_id] || []).slice(-maxMessages).map((msg) => (
                <FlashMessage
                    key={msg.id}
                    {...msg}
                    onClose={() => removeMessage(flash_id, msg.id)}
                    width={width}
                />
            ))}
        </Box>
    );
};

export default MessageContainer;