import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Slider,
    FormControlLabel,
    Switch,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    useTheme
} from '@mui/material';
import { useAuth } from '../util/AuthContext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StyledTextField from '../components/material/StyledTextField';
import StyledButton from '../components/material/StyledButton';
import StyledNumberTextField from '../components/material/StyledNumberTextField';
import ListingsRetriever from '../util/ListingsRetriever';
import Layout from '../components/Layout';


// Function to display percentage label on slider.
const formatLabelWithPercentage = (value) => {
    return (
        <span>
            <Typography variant="body2" component="span">
                {value}%
            </Typography>
        </span>
    );
};


const Explore = () => {
    const [propertyFormData, setPropertyFormData] = useState({
        region: 'ANY_AREA',
        property_address: '',
        is_saved: false,
        home_type: 'ANY',
        min_year_built: '',
        max_year_built: '',
        min_price: '',
        max_price: '',
        city: '',
        down_payment_percentage: 5,
        is_waterfront: false,
        is_advanced_search: false,
        is_cashflowing: false,
        index_ticker: 'O',
        sortBy: 'CoC',
        sortOrder: 'asc',
        override_annual_mortgage_rate: '',
        num_properties_per_page: '10',
    });
    const [expandedAccordion, setExpandedAccordion] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [shouldFetch, setShouldFetch] = useState(false);
    const { authState: { isAuthSession } } = useAuth();
    const theme = useTheme();

    const handleInputChange = (event) => {
        const { id, name, value, type, checked } = event.target;
        setPropertyFormData(prevPropertyFormData => ({
            ...prevPropertyFormData,
            [id || name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsSubmitted(true);
        setShouldFetch(true);
    };

    const handleAccordionOpen = (accordion) => (event, isExpanded) => {
        setExpandedAccordion(isExpanded ? accordion : false);
    };

    return (
        <Layout>
            <Box sx={{ maxWidth: '50%', mx: 'auto', mb: isSubmitted ? 0 : theme.spacingFactor.single }}>
                <Paper sx={{ p: theme.spacingFactor.single }}>
                    <Typography variant="h4" sx={{ mb: theme.spacingFactor.single, textAlign: 'center' }}>
                        Explore Properties
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: theme.borderRadius.quarter,
                            boxShadow: 'none',
                            overflow: 'hidden', // Ensures the corners are properly rounded
                            '&:first-of-type': {
                                borderTopLeftRadius: theme.borderRadius.quarter,
                                borderTopRightRadius: theme.borderRadius.quarter,
                            },
                            '&:last-of-type': {
                                borderBottomLeftRadius: theme.borderRadius.quarter,
                                borderBottomRightRadius: theme.borderRadius.quarter,
                            },
                            '&.MuiAccordion-root:before': {
                                display: 'none',
                            },
                            // '&:before': {
                            //     display: 'none',
                            // },
                            mb: 1,
                            gap: theme.spacing(2)
                        }}
                    >
                        <div>
                            {/* House Options */}
                            <Accordion
                                expanded={expandedAccordion === 'houseOptions'}
                                onChange={handleAccordionOpen('houseOptions')}
                                sx={{
                                    backgroundColor: theme.palette.background.default,
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="advanced-options-content"
                                    id="advanced-options-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold' }}>House Options</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box
                                        sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(2) }}
                                    >
                                        <FormControl fullWidth>
                                            <InputLabel id="home_type-label" sx={{ color: theme.palette.text.primary }}>Home Type</InputLabel>
                                            <Select
                                                labelId="home_type-label"
                                                id="home_type"
                                                label="Home Type"
                                                name="home_type"
                                                value={propertyFormData.home_type}
                                                onChange={handleInputChange}
                                                sx={{ color: theme.palette.text.primary }}
                                            >
                                                <MenuItem value="ANY">Any</MenuItem>
                                                <MenuItem value="LOT">Lot</MenuItem>
                                                <MenuItem value="SINGLE_FAMILY">Single Family</MenuItem>
                                                <MenuItem value="TOWNHOUSE">Townhouse</MenuItem>
                                                <MenuItem value="CONDO">Condo</MenuItem>
                                                <MenuItem value="MULTI_FAMILY">Multi Family</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <Box sx={{ display: 'flex', gap: theme.spacing(2) }}>
                                            <FormControl fullWidth>
                                                <StyledTextField
                                                    id="min_year_built"
                                                    label="Min Year Built"
                                                    name="min_year_built"
                                                    value={propertyFormData.min_year_built}
                                                    fullWidth
                                                    onChange={handleInputChange}
                                                />
                                            </FormControl>

                                            <FormControl fullWidth>
                                                <StyledTextField
                                                    id="max_year_built"
                                                    label="Max Year Built"
                                                    name="max_year_built"
                                                    value={propertyFormData.max_year_built}
                                                    fullWidth
                                                    onChange={handleInputChange}
                                                />
                                            </FormControl>
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: theme.spacing(2) }}>
                                            <FormControl fullWidth>
                                                <StyledTextField
                                                    id="min_price"
                                                    label="Min Price"
                                                    name="min_price"
                                                    value={propertyFormData.min_price}
                                                    fullWidth
                                                    onChange={handleInputChange}
                                                />
                                            </FormControl>

                                            <FormControl fullWidth>
                                                <StyledTextField
                                                    id="max_price"
                                                    label="Max Price"
                                                    name="max_price"
                                                    value={propertyFormData.max_price}
                                                    fullWidth
                                                    onChange={handleInputChange}
                                                />
                                            </FormControl>
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: theme.spacing(2) }}>
                                            <FormControl fullWidth>
                                                <StyledTextField
                                                    id="min_bedrooms"
                                                    label="Min Bedrooms"
                                                    name="min_bedrooms"
                                                    value={propertyFormData.min_bedrooms}
                                                    fullWidth
                                                    onChange={handleInputChange}
                                                />
                                            </FormControl>

                                            <FormControl fullWidth>
                                                <StyledTextField
                                                    id="max_bedrooms"
                                                    label="Max Bedrooms"
                                                    name="max_bedrooms"
                                                    value={propertyFormData.max_bedrooms}
                                                    fullWidth
                                                    onChange={handleInputChange}
                                                />
                                            </FormControl>
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: theme.spacing(2) }}>
                                            <FormControl fullWidth>
                                                <StyledTextField
                                                    id="min_bathrooms"
                                                    label="Min Bathrooms"
                                                    name="min_bathrooms"
                                                    value={propertyFormData.min_bathrooms}
                                                    fullWidth
                                                    onChange={handleInputChange}
                                                />
                                            </FormControl>

                                            <FormControl fullWidth>
                                                <StyledTextField
                                                    id="max_bathrooms"
                                                    label="Max Bathrooms"
                                                    name="max_bathrooms"
                                                    value={propertyFormData.max_bathrooms}
                                                    fullWidth
                                                    onChange={handleInputChange}
                                                />
                                            </FormControl>
                                        </Box>

                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    id="is_waterfront"
                                                    name="is_waterfront"
                                                    checked={propertyFormData.is_waterfront}
                                                    onChange={handleInputChange}
                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                    sx={{ color: theme.palette.text.primary }}
                                                />
                                            }
                                            label={propertyFormData.is_waterfront ? 'Waterfront Only' : 'Include Non-Waterfront'}
                                        />
                                    </Box>
                                </AccordionDetails>
                            </Accordion>


                            {/* Location Options */}
                            <Accordion
                                expanded={expandedAccordion === 'locationOptions'}
                                onChange={handleAccordionOpen('locationOptions')}
                                sx={{
                                    backgroundColor: theme.palette.background.default,
                                    '&:before': {
                                        display: 'none',
                                    },
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="advanced-options-content"
                                    id="advanced-options-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold' }}>Location Options</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box
                                        sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(2) }}
                                    >
                                        <FormControl fullWidth>
                                            <InputLabel id="region-label" sx={{ color: theme.palette.text.primary }}>Region</InputLabel>
                                            <Select
                                                labelId="region-label"
                                                id="region"
                                                label="Region"
                                                name="region"
                                                value={propertyFormData.region}
                                                onChange={handleInputChange}
                                                sx={{ color: theme.palette.text.primary }}
                                            >
                                                <MenuItem value="ANY_AREA">Any</MenuItem>
                                                <MenuItem value="LAKELAND_AREA">Lakeland Area</MenuItem>
                                                <MenuItem value="SOUTH_FLORIDA_AREA">South Florida Area</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <FormControl fullWidth>
                                            <StyledTextField
                                                id='city'
                                                label='City Name'
                                                name='city'
                                                value={propertyFormData.city}
                                                fullWidth
                                                onChange={handleInputChange}
                                            />
                                        </FormControl>

                                        <FormControl fullWidth>
                                            <StyledTextField
                                                id='property_address'
                                                label='Property Address'
                                                name='property_address'
                                                value={propertyFormData.property_address}
                                                onChange={handleInputChange}
                                            />
                                        </FormControl>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>

                            {/* Financing Options */}
                            <Accordion
                                expanded={expandedAccordion === 'financingOptions'}
                                onChange={handleAccordionOpen('financingOptions')}
                                sx={{
                                    backgroundColor: theme.palette.background.default,
                                    '&:before': {
                                        display: 'none',
                                    },
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="advanced-options-content"
                                    id="advanced-options-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold' }}>Financing Options</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box
                                        sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(2) }}
                                    >
                                        <FormControl fullWidth>
                                            <Typography>Down Payment Percentage</Typography>
                                            <Slider
                                                value={propertyFormData.down_payment_percentage}
                                                onChange={handleInputChange}
                                                name="down_payment_percentage"
                                                min={0}
                                                max={100}
                                                valueLabelDisplay="auto"
                                                valueLabelFormat={value => <>{formatLabelWithPercentage(value)}</>}
                                                sx={{ color: theme.palette.text.primary }}
                                            />
                                        </FormControl>

                                        <FormControl fullWidth>
                                            <StyledNumberTextField
                                                id="override_annual_mortgage_rate"
                                                label="Override Mortgage Rate (Annual)"
                                                name="override_annual_mortgage_rate"
                                                value={propertyFormData.override_annual_mortgage_rate}
                                                fullWidth
                                                onChange={handleInputChange}
                                            />
                                        </FormControl>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>

                            {/* Sorting Options */}
                            <Accordion
                                expanded={expandedAccordion === 'sortingOptions'}
                                onChange={handleAccordionOpen('sortingOptions')}
                                sx={{
                                    backgroundColor: theme.palette.background.default,
                                    '&:before': {
                                        display: 'none',
                                    },
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="advanced-options-content"
                                    id="advanced-options-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold' }}>Sorting And More Filter Options</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box
                                        sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(2) }}
                                    >
                                        <Box sx={{ display: 'flex', gap: theme.spacing(2) }}>
                                            <FormControl fullWidth>
                                                <InputLabel id="sortBy-label" sx={{ color: theme.palette.text.primary }}>Sort By</InputLabel>
                                                <Select
                                                    labelId="sortBy-label"
                                                    id="sortBy"
                                                    label="Sort By"
                                                    name="sortBy"
                                                    value={propertyFormData.sortBy}
                                                    onChange={handleInputChange}
                                                    sx={{ color: theme.palette.text.primary }}
                                                >
                                                    <MenuItem value="Price">Listing Price</MenuItem>
                                                    <MenuItem value="Rent Estimate">Rent Estimate</MenuItem>
                                                    <MenuItem value="Rental Income">Rental Income</MenuItem>
                                                    <MenuItem value="Gross Rent Multiplier">Gross Rent Multiplier</MenuItem>
                                                    <MenuItem value="CoC">Cash on Cash Returns</MenuItem>
                                                    <MenuItem value="Cap Rate">Capitilization Rate</MenuItem>
                                                    <MenuItem value="Breakeven Price">Breakeven Price</MenuItem>
                                                </Select>
                                            </FormControl>

                                            <FormControl fullWidth>
                                                <InputLabel id="sortOrder-label" sx={{ color: theme.palette.text.primary }}>Sort Order</InputLabel>
                                                <Select
                                                    labelId="sortOrder-label"
                                                    id="sortOrder"
                                                    label="Sort Order"
                                                    name="sortOrder"
                                                    value={propertyFormData.sortOrder}
                                                    onChange={handleInputChange}
                                                    sx={{ color: theme.palette.text.primary }}
                                                >
                                                    <MenuItem value="asc">Ascending</MenuItem>
                                                    <MenuItem value="desc">Descending</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Box>

                                        {isAuthSession && (
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        id="is_saved"
                                                        name="is_saved"
                                                        checked={propertyFormData.is_saved}
                                                        onChange={handleInputChange}
                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                        sx={{ color: theme.palette.text.primary }}
                                                    />
                                                }
                                                label={propertyFormData.is_saved ? 'Show All Properties' : 'Show Saved Properties'}
                                            />
                                        )}
                                    </Box>
                                </AccordionDetails>
                            </Accordion>

                            {/* Advanced Options */}
                            <Accordion
                                expanded={expandedAccordion === 'advancedOptions'}
                                onChange={handleAccordionOpen('advancedOptions')}
                                sx={{
                                    backgroundColor: theme.palette.background.default,
                                    '&:not(:last-child)': {
                                        borderBottom: 'none',
                                    },
                                    '&.MuiAccordion-root:before': {
                                        display: 'none',
                                    },
                                    '&:before': {
                                        display: 'none',
                                    },
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="advanced-options-content"
                                    id="advanced-options-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', flexGrow: 1 }}>Advanced Options</Typography>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                id="is_advanced_search"
                                                name="is_advanced_search"
                                                checked={propertyFormData.is_advanced_search}
                                                onChange={handleInputChange}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                                sx={{ color: theme.palette.text.primary }}
                                            />
                                        }
                                        label={propertyFormData.is_advanced_search ? 'Disable Advanced Search' : 'Enable Advanced Search'}
                                    />
                                </AccordionSummary>
                                {propertyFormData.is_advanced_search ? (
                                    <AccordionDetails>
                                        <Box
                                            sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(2) }}
                                        >
                                            <FormControl fullWidth>
                                                <InputLabel id="index_ticker-label" sx={{ color: theme.palette.text.primary }}>Comparative Index</InputLabel>
                                                <Select
                                                    labelId="index_ticker-label"
                                                    id="index_ticker"
                                                    label="Comparative Index"
                                                    name="index_ticker"
                                                    value={propertyFormData.index_ticker}
                                                    onChange={handleInputChange}
                                                    sx={{ color: theme.palette.text.primary }}
                                                >
                                                    <MenuItem value="O">Realty Income [REIT]</MenuItem>
                                                    <MenuItem value="PLD">Prologis [REIT]</MenuItem>
                                                    <MenuItem value="AMT">American Tower [REIT]</MenuItem>
                                                    <MenuItem value="WELL">Welltower [REIT]</MenuItem>
                                                    <MenuItem value="SPG">Simon Property Group [REIT]</MenuItem>
                                                    <MenuItem value="^GSPC">S&P 500 [US Large Cap Index]</MenuItem>
                                                    <MenuItem value="BTC-USD">Bitcoin [Crypto Currency]</MenuItem>
                                                </Select>
                                            </FormControl>

                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        id="is_cashflowing"
                                                        name="is_cashflowing"
                                                        checked={propertyFormData.is_cashflowing}
                                                        onChange={handleInputChange}
                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                        sx={{ color: theme.palette.text.primary }}
                                                    />
                                                }
                                                label={propertyFormData.is_cashflowing ? 'Cashflowing Only' : 'Include Non-Cashflowing'}
                                            />
                                        </Box>
                                    </AccordionDetails>
                                ) : (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', p: theme.spacing(2) }}>
                                        <Typography>Enable advanced search to display technical property analysis and configure advanced options.</Typography>
                                    </Box>
                                )}
                            </Accordion>
                        </div>

                        <StyledButton
                            children = 'Explore Properties'
                            fullWidth
                            type = 'submit'
                        />
                    </Box>
                </Paper>
            </Box>

            {isSubmitted && (
                <ListingsRetriever
                    route='explore'
                    propertyFormData={propertyFormData}
                    shouldFetch={shouldFetch}
                    onDataFetched={() => setShouldFetch(false)}
                    emptyResponseMessage='No properties match the given criteria.'
                />
            )}
        </Layout>
    );
};

export default Explore;
