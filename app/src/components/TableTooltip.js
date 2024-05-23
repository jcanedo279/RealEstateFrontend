import React, { useEffect, useRef, useState } from 'react';
import { Popper, Typography, Box } from '@mui/material';


const TableTooltip = ({ show, content, position }) => {
    const tooltipRef = useRef(null);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        if (show) {
            setAnchorEl({
                clientWidth: 0,
                clientHeight: 0,
                getBoundingClientRect: () => ({
                    top: position.y,
                    left: position.x,
                    right: position.x,
                    bottom: position.y,
                    width: 0,
                    height: 0,
                }),
            });
        } else {
            setAnchorEl(null);
        }
    }, [show, position]);

    return (
        <Popper
            open={show}
            anchorEl={anchorEl}
            placement="top-start"
            modifiers={[
                {
                    name: 'offset',
                    options: {
                        offset: [10, 10],
                    },
                },
                {
                    name: 'preventOverflow',
                    options: {
                        boundary: 'viewport',
                    },
                },
            ]}
        >
            <Box
                ref={tooltipRef}
                sx={{
                    p: 2,
                    backgroundColor: '#f9f9f9',
                    border: '1px solid #ddd',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                    borderRadius: 2,
                    minWidth: 250,
                    maxWidth: 350,
                    overflow: 'hidden',
                    whiteSpace: 'pre-wrap',
                }}
            >
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontWeight: 'bold',
                        marginBottom: 1,
                        backgroundColor: '#f0f0f0',
                        padding: '4px 8px',
                        borderRadius: '4px',
                    }}
                >
                    {content.key}
                </Typography>
                {content.description && (
                    <Typography variant="body2" sx={{ color: '#555' }}>
                        {content.description}
                    </Typography>
                )}
            </Box>
        </Popper>
    );
};

export default TableTooltip;
