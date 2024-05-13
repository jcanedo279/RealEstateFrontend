import React from 'react';

import '../styles/FancyFlash.css';


const FlashMessage = ({ message, status, onClose, animation, width }) => {
    return (
        <div className={`fancy-flash ${status} ${animation || ''}`} style={{ width: width }}>
            {message}
            <button className='fancy-flash-button' onClick={onClose}>X</button>
        </div>
    );
};

export default FlashMessage;
