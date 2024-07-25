import React, { useState, useEffect, useRef } from 'react';
import {
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Button,
    Box,
    TableCell,
    TablePagination,
    tablePaginationClasses,
    styled,
    useTheme
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SaveButton from '../components/SaveListingButton';
import TableTooltip from '../components/TableTooltip';
import GraphAnalysisOverlay from '../graphing/GraphAnalysisOverlay';
import LoadingComponent from '../components/Loading';
import { useFlashMessage } from '../flash/FlashMessageContext';
import { useAuth } from '../util/AuthContext';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    textAlign: 'center',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

const StyledTablePagination = styled(TablePagination)`
  & .${tablePaginationClasses.toolbar} {
    background-color: #e0e0e0;
    display: flex;
    gap: 10px;
    flex-direction: row;
    align-items: center;
    text-align: center;
    width: 100%;
  }

  & .${tablePaginationClasses.selectLabel}, 
  & .${tablePaginationClasses.selectRoot} {
    margin: 0;
    font-weight: bold;
  }

  & .${tablePaginationClasses.spacer} {
    display: none;
  }

  & .pagination-center {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
  }

  & .${tablePaginationClasses.displayedRows} {
    margin: auto;
    align-text: center;
    font-weight: bold;
  }

  & .${tablePaginationClasses.actions} {
    margin-right: 20px;
    padding-left: 50px;
    display: flex;
  }
`;

const ListingsRetriever = ({ route, propertyFormData, shouldFetch, onDataFetched, emptyResponseMessage }) => {
    const [triggerFetch, setTriggerFetch] = useState(false);
    const [listings, setListings] = useState([]);
    const [totalProperties, setTotalProperties] = useState(0);
    const [descriptions, setDescriptions] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0); // CurrentPage now starts from 0.
    const [tooltipInfo, setTooltipInfo] = useState({ show: false, content: {}, position: {} });
    const { addFailMessage, addMessage, clearMessages } = useFlashMessage();
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const hoveredCellRef = useRef(null);
    const { fetchBackendApiWithContext } = useAuth();
    const theme = useTheme();

    const [overlayOpen, setOverlayOpen] = useState(false);
    const [selectedPropertyData, setSelectedPropertyData] = useState(null);

    useEffect(() => {
        if (triggerFetch) {
            fetchData();
        }
    }, [triggerFetch]);

    useEffect(() => {
        if (shouldFetch) {
            setTriggerFetch(true);
        }
    }, [shouldFetch, currentPage, rowsPerPage]);

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
            const newPropertyFormData = {
                ...propertyFormData,
                current_page: currentPage + 1, // Send currentPage as 1-based index
                num_properties_per_page: rowsPerPage,
            };

            const data = await fetchBackendApiWithContext(route, {
                method: 'POST',
                data: JSON.stringify(newPropertyFormData),
            });

            setListings(data.properties);
            setTotalProperties(data.total_properties);
            setDescriptions(data.descriptions);
            if (onDataFetched) {
                onDataFetched();
            }
        } catch (error) {
            addFailMessage(error, 'listings');
        } finally {
            setLoading(false);
            setTriggerFetch(false);
        }
    };

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
        setTriggerFetch(true);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(event.target.value);
        setCurrentPage(0); // Reset to first page
        setTriggerFetch(true);
    };

    const handleMouseEnter = (event, key, description) => {
        if (hoveredCellRef.current !== key) {
            hoveredCellRef.current = key;
            setTooltipInfo({
                show: true,
                content: { key, description },
                position: { x: event.clientX, y: event.clientY },
            });
        }
    };

    const handleMouseLeave = () => {
        setTooltipInfo({ show: false, content: {}, position: {} });
        hoveredCellRef.current = null;
    };

    const handleOverlayOpen = (zpid) => {
        setSelectedPropertyData(listings.find((listing) => listing.zpid === zpid));
        setOverlayOpen(true);
    };

    const handleOverlayClose = () => {
        setOverlayOpen(false);
        setSelectedPropertyData(null);
    };

    if (loading) {
        return <LoadingComponent />;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: theme.spacingFactor.single, gap: theme.spacingFactor.single }}>
            <Box
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                p={theme.spacingFactor.single}
                bgcolor="#f0f0f0"
                borderRadius={1}
            >
                <HomeIcon sx={{ marginRight: theme.spacingFactor.half }} />
                <Typography variant="h6" fontWeight="bold">
                    Total Properties: {totalProperties}
                </Typography>
            </Box>

            {listings.length > 0 && (
                <Box sx={{ width: '100%'}}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {Object.keys(listings[0]).map(
                                        (key) =>
                                            key !== 'property_url' &&
                                            key !== 'zpid' && (
                                                <StyledTableCell
                                                    key={key}
                                                    sx={{ fontWeight: 'bold', backgroundColor: '#e0e0e0' }}
                                                    onMouseEnter={(e) => handleMouseEnter(e, key, descriptions[key])}
                                                    onMouseLeave={handleMouseLeave}
                                                >
                                                    {key}
                                                </StyledTableCell>
                                            ),
                                    )}
                                    <StyledTableCell
                                        sx={{ fontWeight: 'bold', backgroundColor: '#e0e0e0' }}
                                    >
                                        Analysis
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {listings.map((listing, index) => (
                                    <TableRow key={index} hover>
                                        {Object.entries(listing).map(
                                            ([key, value]) =>
                                                key !== 'property_url' &&
                                                key !== 'zpid' && (
                                                    <StyledTableCell
                                                        key={`${key}-${index}`}
                                                        onMouseEnter={(e) => handleMouseEnter(e, key, descriptions[key])}
                                                        onMouseLeave={handleMouseLeave}
                                                    >
                                                        {key === 'Image' && value ? (
                                                            <a
                                                                href={listing['property_url']}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <img
                                                                    src={value}
                                                                    alt="Property"
                                                                    style={{ maxHeight: '150px', maxWidth: '150px' }}
                                                                />
                                                            </a>
                                                        ) : key === 'Save' ? (
                                                            <SaveButton propertyId={listing.zpid} initialSavedState={value} />
                                                        ) : (
                                                            value
                                                        )}
                                                    </StyledTableCell>
                                                ),
                                        )}
                                        <StyledTableCell>
                                            <Button variant="contained" color="primary" onClick={() => handleOverlayOpen(listing.zpid)}>
                                                Analyze
                                            </Button>
                                        </StyledTableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        bottom={0}
                        left={0}
                        right={0}
                        bgcolor="white"
                        paddingBottom={2}
                        borderTop="none"
                        zIndex={1000}
                    >
                        <StyledTablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            colSpan={3}
                            count={totalProperties}
                            rowsPerPage={rowsPerPage}
                            page={currentPage}
                            slotProps={{
                                select: {
                                    'aria-label': 'rows per page',
                                },
                                actions: {
                                    showFirstButton: true,
                                    showLastButton: true,
                                },
                            }}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            labelRowsPerPage="Rows per page:"
                            sx={{ width: '100%' }}
                        />
                    </Box>

                    <TableTooltip show={tooltipInfo.show} position={tooltipInfo.position} content={tooltipInfo.content} />

                    <GraphAnalysisOverlay open={overlayOpen} onClose={handleOverlayClose} selectedPropertyData={selectedPropertyData} propertyFormData={propertyFormData} />
                </Box>
            )}
        </Box>
    );
};

export default ListingsRetriever;
