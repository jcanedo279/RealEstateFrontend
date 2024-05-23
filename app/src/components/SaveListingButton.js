import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';
import { useAuth } from '../util/AuthContext';


const SaveButton = ({ propertyId, initialSavedState }) => {
    const [isSaved, setIsSaved] = useState(initialSavedState);
    const { authState, fetchBackendApiWithContext } = useAuth();

    const toggleSave = async () => {
        console.log("Toggling save state for property ID: ", propertyId);
        try {
            const data = await fetchBackendApiWithContext('toggle-save', {
                method: 'POST',
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
        <Tooltip title={isSaved ? 'Unsave' : 'Save'} arrow>
            <span>
                <IconButton
                    onClick={toggleSave}
                    color={isSaved ? 'primary' : 'default'}
                    disabled={!authState.isAuthSession}
                    aria-label={isSaved ? 'Unsave' : 'Save'}
                    sx={{
                        '&:focus': {
                            backgroundColor: 'transparent'
                        }
                    }}
                >
                    {isSaved ? <Star /> : <StarBorder />}
                </IconButton>
            </span>
        </Tooltip>
    );
};

export default SaveButton;
