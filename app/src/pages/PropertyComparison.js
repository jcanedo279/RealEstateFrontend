import React, { useState } from 'react';
import { Box, Grid, Paper, Typography, Button, useTheme } from '@mui/material';
import PropertyList from '../components/comparison/PropertyList';
import Layout from '../components/Layout';
import { useAuth } from '../util/AuthContext';
import StyledTextField from '../components/material/StyledTextField';

const PropertyComparison = () => {
    const theme = useTheme();
    const { fetchBackendApiWithContext } = useAuth();
    const [annualInterestRate, setAnnualInterestRate] = useState(6.281);
    const [leftProperties, setLeftProperties] = useState([]);
    const [rightProperties, setRightProperties] = useState([]);
    const [leftResults, setLeftResults] = useState([]);
    const [rightResults, setRightResults] = useState([]);

    function transformDictListToList(data) {
        // Initialize an array to hold the transformed rows
        let transformed = [];
    
        // Assuming all column objects have the same length and the same index keys
        // Get the first column to determine the length and indices
        const indices = Object.keys(data.list_id);
    
        // Iterate over indices to construct each row object
        transformed = indices.map(index => {
            const row = {};
            for (const key in data) {
                row[key] = data[key][index];
            }
            return row;
        });
    
        return transformed;
    }

    const handleCompareResults = async () => {
        const formattedLeftProperties = leftProperties.map(property => ({
            list_id: 1,
            purchase_price: parseFloat(property.purchasePrice),
            down_payment_percentage: parseFloat(property.downPaymentPercentage),
            annual_property_tax_rate: parseFloat(property.annualPropertyTaxRate),
            monthly_hoa: parseFloat(property.monthlyHoa),
            monthly_homeowners_insurance: parseFloat(property.monthlyHomeownersInsurance),
            monthly_restimate: parseFloat(property.monthlyRentalEstimate)
        }));
    
        const formattedRightProperties = rightProperties.map(property => ({
            list_id: 2,
            purchase_price: parseFloat(property.purchasePrice),
            down_payment_percentage: parseFloat(property.downPaymentPercentage),
            annual_property_tax_rate: parseFloat(property.annualPropertyTaxRate),
            monthly_hoa: parseFloat(property.monthlyHoa),
            monthly_homeowners_insurance: parseFloat(property.monthlyHomeownersInsurance),
            monthly_restimate: parseFloat(property.monthlyRentalEstimate)
        }));
    
        // Prepare the request data with correctly formatted and typed properties
        const requestData = {
            left_properties: formattedLeftProperties,
            right_properties: formattedRightProperties,
            annual_interest_rate: parseFloat(annualInterestRate)
        };

        console.log("request data", requestData);

        const result = await fetchBackendApiWithContext('/compare', {
            method: 'POST',
            data: JSON.stringify(requestData),
        });
        const parsedResults = transformDictListToList(result);
        setLeftResults(parsedResults.filter(result => result.list_id === 1));
        setRightResults(parsedResults.filter(result => result.list_id === 2));
        console.log("compare results", result);
    };

    return (
        <Layout alignTop='align'>
            <Box sx={{ flexGrow: 1, padding: 3 }}>
                <StyledTextField
                    label="Annual Interest Rate (%)"
                    type="number"
                    value={annualInterestRate}
                    onChange={(e) => setAnnualInterestRate(parseFloat(e.target.value))}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={6} sx={{ padding: theme.spacing(2) }}>
                            <PropertyList properties={leftProperties} setProperties={setLeftProperties} />
                            {leftResults.map((result, index) => (
                                <Box key={index} sx={{ marginBottom: 2 }}>
                                    <Typography variant="h6">Portfolio 1:</Typography>
                                    <Typography>Purchase Price: {result.purchase_price}</Typography>
                                    <Typography>Monthly Costs: {result.monthly_costs.toFixed(2)}</Typography>
                                    <Typography>Cash Invested: {result.cash_invested.toFixed(2)}</Typography>
                                </Box>
                            ))}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={6} sx={{ padding: theme.spacing(2) }}>
                            <PropertyList properties={rightProperties} setProperties={setRightProperties} />
                            {rightResults.map((result, index) => (
                                <Box key={index} sx={{ marginBottom: 2 }}>
                                    <Typography variant="h6">Portfolio 2:</Typography>
                                    <Typography>Purchase Price: {result.purchase_price}</Typography>
                                    <Typography>Monthly Costs: {result.monthly_costs.toFixed(2)}</Typography>
                                    <Typography>Cash Invested: {result.cash_invested.toFixed(2)}</Typography>
                                </Box>
                            ))}
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={handleCompareResults} sx={{ mt: 2 }}>
                            Compare Portfolios
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    );
};

export default PropertyComparison;