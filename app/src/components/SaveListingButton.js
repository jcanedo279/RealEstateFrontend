import React, { useState } from 'react';
import { useAuth } from '../util/AuthContext';
import fetchBackendApi from '../util/Util';

import '../styles/Table.css'

const SaveButton = ({ propertyId, initialSavedState }) => {
    const [isSaved, setIsSaved] = useState(initialSavedState);
    const { authState, getCsrfToken } = useAuth();

    const toggleSave = async () => {
        console.log("Toggling save state for property ID: ", propertyId);
        try {
            const data = await fetchBackendApi('toggle-save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': await getCsrfToken()
                },
                data: JSON.stringify({ propertyId })
            });
            if (data.success) {
                setIsSaved(!isSaved);
            } else {
                alert(data.error || 'Failed to toggle save state.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <button
            className={`save-btn ${isSaved ? 'saved' : 'unsaved'}`}
            onClick={toggleSave}
            disabled={!authState.isAuthSession}
        >
            <i className={`${isSaved ? 'fas fa-star' : 'far fa-star'}`}></i>
            {isSaved ? ' Unsave' : ' Save'}
        </button>
    );
};

export default SaveButton;
