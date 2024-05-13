import React, { useState, useEffect, useRef } from 'react';
import '../styles/TableTooltip.css'

const Tooltip = ({ show, content, position }) => {
    const tooltipRef = useRef(null);
    const [adjustedPosition, setAdjustedPosition] = useState(position);

    useEffect(() => {
        if (show && tooltipRef.current) {
            const tooltipNode = tooltipRef.current;
            const tooltipWidth = tooltipNode.offsetWidth;
            const tooltipHeight = tooltipNode.offsetHeight;
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
      
            // Check for horizontal overflow
            const overflowRight = position.x + tooltipWidth + 10 > windowWidth;
            const newX = overflowRight ? position.x - tooltipWidth - 10 : position.x + 15;
      
            // Check for vertical overflow
            const overflowBottom = position.y + tooltipHeight + 10 > windowHeight;
            const newY = overflowBottom ? position.y - tooltipHeight - 10 : position.y + 15;
      
            setAdjustedPosition({ x: newX, y: newY });
        }
    }, [position, show, tooltipRef]);

    const tooltipStyle = {
        position: 'fixed',
        top: `${adjustedPosition.y}px`,
        left: `${adjustedPosition.x}px`,
        visibility: show ? 'visible' : 'hidden',
        display: show ? 'block' : 'none', // Ensures the tooltip is not considered in layout when not shown
        zIndex: '1000', // Ensure tooltip is on top
    };

    return (
        <div ref={tooltipRef} className="global-tooltip" style={tooltipStyle}>
            <div className="tooltip-header">{content.key}</div>
            {content.description && <div className="tooltip-body">{content.description}</div>}
        </div>
    );
};

export default Tooltip;
