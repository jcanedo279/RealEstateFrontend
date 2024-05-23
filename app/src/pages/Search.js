import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    FormControl,
    Typography,
    useTheme
} from '@mui/material';
import StyledTextField from '../components/material/StyledTextField';
import StyledButton from '../components/material/StyledButton';
import ListingsRetriever from '../util/ListingsRetriever';
import Layout from '../components/Layout';

const Search = () => {
    const [formData, setFormData] = useState({
        property_address: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [shouldFetch, setShouldFetch] = useState(false);
    const theme = useTheme();

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [id]: value
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
                        Search by Property Address
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{  display: 'flex', flexDirection: 'column', gap: theme.spacingFactor.half }}
                    >
                        <FormControl fullWidth>
                            <StyledTextField
                                id='property_address'
                                label='Enter Property Address'
                                name='property_address'
                                value={formData.property_address}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <StyledButton
                            children = 'Search by Address'
                            type = 'submit'
                            fullWidth
                        />
                    </Box>
                </Paper>
            </Box>

            {isSubmitted && (
                <ListingsRetriever
                    route='search'
                    formData={formData}
                    shouldFetch={shouldFetch}
                    onDataFetched={() => setShouldFetch(false)}
                    emptyResponseMessage='No properties match the given criteria.'
                />
            )}
        </Layout>
    );
};

export default Search;
