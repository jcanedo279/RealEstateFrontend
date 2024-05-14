import React, { useEffect } from 'react';

import fetchBackendApi from '../util/Util';
import { useFlashMessage } from '../flash/FlashMessageContext';
import MessageContainer from '../flash/FlashMessageContainer';


const BackendDataComponent = () => {
    const { addFailMessage, addMessage } = useFlashMessage();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchBackendApi('/test');
                if (data.fancy_flash) {
                    data.fancy_flash.forEach(message => addMessage({
                        message: message.message,
                        status: message.status,
                        flash_id: message.flash_id,
                        animation: message.animation
                    }));
                }
            } catch (error) {
                addFailMessage(error, 'test');
            }
        };
    
        fetchData();
    }, []);

    return (
        <div className='container'>
            <h1>Response from Backend:</h1>
            <MessageContainer flash_id="test" maxMessages={1} />
        </div>
    );
};

export default BackendDataComponent;
