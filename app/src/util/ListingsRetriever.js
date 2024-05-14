import React, { useState, useEffect } from 'react';
import TableTooltip from '../components/TableTooltip';
import SaveButton from '../components/SaveListingButton';
import { useAuth } from '../util/AuthContext';
import fetchBackendApi from '../util/Util';
import MessageContainer from '../flash/FlashMessageContainer';
import { useFlashMessage } from '../flash/FlashMessageContext';

import '../styles/Table.css'


const ListingsRetriever = ({ route, formData, shouldFetch, onDataFetched, emptyResponseMessage }) => {
    const [triggerFetch, setTriggerFetch] = useState(false);
    const [listings, setListings] = useState([]);
    const [totalProperties, setTotalProperties] = useState(0);
    const [descriptions, setDescriptions] = useState({});

    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [tooltipInfo, setTooltipInfo] = useState({ show: false, content: {}, position: {} });
    const { getCsrfToken } = useAuth();
    const { addFailMessage, addMessage, clearMessages } = useFlashMessage();

    useEffect(() => {
        if (triggerFetch) {
            fetchData();
        }
    }, [triggerFetch]);

    useEffect(() => {
        if (shouldFetch) {
            setTriggerFetch(true);
        }
    }, [shouldFetch, currentPage]);

    useEffect(() => {
        if (listings && listings.length > 0) {
            clearMessages('listings');
        } else {
            addMessage({ message: emptyResponseMessage, status: 'info', flash_id: 'listings', animation: 'fadeIn' });
        }
    }, [listings]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const completeFormData = {
                ...formData,
                current_page: currentPage
            };

            const data = await fetchBackendApi(route, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': await getCsrfToken()
                },
                data: JSON.stringify(completeFormData)
            });

            setListings(data.properties);

            setTotalPages(data.total_pages);
            setTotalProperties(data.total_properties);
            setDescriptions(data.descriptions);
            if (onDataFetched) {
                // Optional callback from parent controller for further actions
                onDataFetched();
            }
        } catch (error) {
            addFailMessage(error, 'listings');
        } finally {
            setLoading(false);
            setTriggerFetch(false);
        }
    };

    // Handle pagination
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
            setTriggerFetch(true);
        }
    };

    const handleMouseEnter = (event, key) => {
        setTooltipInfo({
            show: true,
            content: { key, description: descriptions[key] },
            position: { x: event.clientX, y: event.clientY }
        });
    };

    const handleMouseLeave = () => {
        setTooltipInfo({ show: false, content: {}, position: {} });
    };

    if (loading) {
        return (
            <div className='container'>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div>
            <MessageContainer flash_id="listings" maxMessages={1} width={'70%'} />

            {listings.length > 0 && (<>
                <div className='total-count'>
                    <i class="fas fa-home"></i>
                    <span>Total Properties: {totalProperties}</span>
                </div>

                <div className="scrolling-content">
                    <table className="highlight table-bordered table-striped">
                        <thead>
                            <tr>
                                {Object.keys(listings[0]).map(key => (
                                    key !== "property_url" && key !== "zpid" && (
                                        <th key={key}
                                            onMouseEnter={(e) => handleMouseEnter(e, key)}
                                            onMouseLeave={handleMouseLeave}>
                                            {key} </th>
                                    )
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {listings.map((listing, index) => (
                                <tr key={index}>
                                    {Object.entries(listing).map(([key, value]) => (
                                        key !== "property_url" && key !== "zpid" && (
                                            <td key={`${key}-${index}`}
                                                onMouseEnter={(e) => handleMouseEnter(e, key)}
                                                onMouseLeave={handleMouseLeave}>
                                            {key === 'Image' && value ? (
                                                <a href={listing['property_url']} target="_blank" rel="noopener noreferrer">
                                                    <img src={value} alt="Property" style={{ maxHeight: '150px', maxWidth: '150px' }} />
                                                </a>
                                            ) : key === 'Save' ? (
                                                <SaveButton propertyId={listing.zpid} initialSavedState={value} />
                                            ) : value}
                                            </td>
                                        )
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Results Navigation and Page Indicator */}
                <div className="navigation-wrapper">
                    <div className="navigation-buttons container" style={{ visibility: totalPages > 1 ? 'visible' : 'hidden' }}>
                        {currentPage > 1 &&
                            <button className="btn waves-effect main-color navigation-button" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                        }
                        <span className="pagination-space">Page {currentPage}</span>
                        {currentPage < totalPages &&
                            <button className="btn waves-effect main-color navigation-button" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                        }
                    </div>
                </div>

                <TableTooltip show={tooltipInfo.show} position={tooltipInfo.position} content={tooltipInfo.content} />
            </>)}
        </div>
    );
};

export default ListingsRetriever;
