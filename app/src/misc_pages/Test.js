import React, { useEffect } from 'react';

import { useFlashMessage } from '../flash/FlashMessageContext';
import MessageContainer from '../flash/FlashMessageContainer';
import Layout from '../components/Layout';
import { useAuth } from '../util/AuthContext';


const BackendDataComponent = () => {
    const { addFailMessage, addMessage } = useFlashMessage();
    const { fetchBackendApiWithContext } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchBackendApiWithContext('test');
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
        <Layout>
            <h1>Response from Backend:</h1>
            <MessageContainer flash_id="test" maxMessages={1} />
        </Layout>
    );
};

export default BackendDataComponent;
