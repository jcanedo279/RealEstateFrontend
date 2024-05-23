import React, { useState } from 'react';
import {
    Box,
    Paper,
    Checkbox,
    FormControl,
    FormControlLabel,
    Slider,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    useTheme
} from '@mui/material';
import StyledTextField from '../components/material/StyledTextField';
import StyledButton from '../components/material/StyledButton';
import ListingsRetriever from '../util/ListingsRetriever';
import Layout from '../components/Layout';


// Function to display percentage label on slider
const ValueLabelComponent = (props) => {
    const { children, value } = props;
    return (
        <span>
            {children}
            <Typography variant="body2" component="span" style={{ marginLeft: 8 }}>
                {value}%
            </Typography>
        </span>
    );
};


const Explore = () => {
    const [formData, setFormData] = useState({
        region: 'ANY_AREA',
        home_type: 'ANY',
        index_ticker: 'O',
        sortBy: 'CoC',
        sortOrder: 'asc',
        year_built: '',
        max_price: '',
        city: '',
        down_payment_percentage: 5,
        is_waterfront: false,
        is_cashflowing: false,
        num_properties_per_page: '10',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [shouldFetch, setShouldFetch] = useState(false);
    const theme = useTheme();

    const handleInputChange = (event) => {
        const { id, name, value, type, checked } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [id || name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsSubmitted(true);
        setShouldFetch(true);
    };

    return (
        <Layout>
            <Box sx={{ maxWidth: '50%', mx: 'auto' }}>
                <Paper sx={{ p: theme.spacingFactor.single }}>
                    <Typography variant="h4" sx={{ mb: theme.spacingFactor.single, textAlign: 'center' }}>
                        Explore Properties
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{  display: 'flex', flexDirection: 'column', gap: theme.spacingFactor.half }}
                    >
                        <FormControl fullWidth>
                            <InputLabel id="region-label" sx={{ color: theme.palette.text.primary }}>Region</InputLabel>
                            <Select
                                labelId="region-label"
                                id="region"
                                name="region"
                                value={formData.region}
                                onChange={handleInputChange}
                                label="Region"
                                sx={{ color: theme.palette.text.primary }}
                            >
                                <MenuItem value="ANY_AREA">Any</MenuItem>
                                <MenuItem value="LAKELAND_AREA">Lakeland Area</MenuItem>
                                <MenuItem value="SOUTH_FLORIDA_AREA">South Florida Area</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="home_type-label" sx={{ color: theme.palette.text.primary }}>Home Type</InputLabel>
                            <Select
                                labelId="home_type-label"
                                id="home_type"
                                name="home_type"
                                value={formData.home_type}
                                onChange={handleInputChange}
                                label="Home Type"
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

                        <FormControl fullWidth>
                            <InputLabel id="index_ticker-label" sx={{ color: theme.palette.text.primary }}>Comperative Index</InputLabel>
                            <Select
                                labelId="index_ticker-label"
                                id="index_ticker"
                                name="index_ticker"
                                value={formData.index_ticker}
                                onChange={handleInputChange}
                                label="Comperative Index"
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

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel id="sortBy-label" sx={{ color: theme.palette.text.primary }}>Sort By</InputLabel>
                                <Select
                                    labelId="sortBy-label"
                                    id="sortBy"
                                    name="sortBy"
                                    value={formData.sortBy}
                                    onChange={handleInputChange}
                                    label="Sort By"
                                    sx={{ color: theme.palette.text.primary }}
                                >
                                    <MenuItem value="Price">Price</MenuItem>
                                    <MenuItem value="Rent Estimate">Rent Estimate</MenuItem>
                                    <MenuItem value="Rental Income">Rental Income</MenuItem>
                                    <MenuItem value="Gross Rent Multiplier">Gross Rent Multiplier</MenuItem>
                                    <MenuItem value="CoC">CoC</MenuItem>
                                    <MenuItem value="Cap Rate">Cap Rate</MenuItem>
                                    <MenuItem value="Breakeven Price">Breakeven Price</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel id="sortOrder-label" sx={{ color: theme.palette.text.primary }}>Sort Order</InputLabel>
                                <Select
                                    labelId="sortOrder-label"
                                    id="sortOrder"
                                    name="sortOrder"
                                    value={formData.sortOrder}
                                    onChange={handleInputChange}
                                    label="Sort Order"
                                    sx={{ color: theme.palette.text.primary }}
                                >
                                    <MenuItem value="asc">Ascending</MenuItem>
                                    <MenuItem value="desc">Descending</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <FormControl fullWidth>
                            <Typography>Down Payment Percentage</Typography>
                            <Slider
                                value={formData.down_payment_percentage}
                                onChange={handleInputChange}
                                name="down_payment_percentage"
                                min={0}
                                max={100}
                                ValueLabelComponent={ValueLabelComponent}
                                valueLabelDisplay="auto"
                                sx={{ color: theme.palette.text.primary }}
                            />
                        </FormControl>

                        <FormControl fullWidth>
                            <StyledTextField
                                id='year_built'
                                label='Year Built'
                                name='year_built'
                                value={formData.year_built}
                                type='number'
                                onChange={handleInputChange}
                            />
                        </FormControl>

                        <FormControl fullWidth>
                            <StyledTextField
                                id='max_price'
                                label='Max Purchase Price'
                                name='max_price'
                                value={formData.max_price}
                                type='number'
                                onChange={handleInputChange}
                            />
                        </FormControl>

                        <FormControl fullWidth>
                            <StyledTextField
                                id='city'
                                label='City Name (Optional)'
                                name='city'
                                value={formData.city}
                                onChange={handleInputChange}
                            />
                        </FormControl>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    id="is_waterfront"
                                    name="is_waterfront"
                                    checked={formData.is_waterfront}
                                    onChange={handleInputChange}
                                    sx={{ color: theme.palette.text.primary }}
                                />
                            }
                            label="Waterfront Only"
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    id="is_cashflowing"
                                    name="is_cashflowing"
                                    checked={formData.is_cashflowing}
                                    onChange={handleInputChange}
                                    sx={{ color: theme.palette.text.primary }}
                                />
                            }
                            label="Positive Cashflow Only"
                        />

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
                    formData={formData}
                    shouldFetch={shouldFetch}
                    onDataFetched={() => setShouldFetch(false)}
                    emptyResponseMessage='No properties match the given criteria.'
                />
            )}
        </Layout>
    );
};

export default Explore;
