import React, { useState, useMemo } from 'react';
import { Box, Typography, Modal, FormControlLabel, Switch, Select, MenuItem, Chip, useTheme } from '@mui/material';
import StyledSelect from '../components/material/StyledSelect';
import StyledButton from '../components/material/StyledButton';
import StyledTextField from '../components/material/StyledTextField';
import DistributionPlot from './DistributionPlot';
import StyledNumberTextField from '../components/material/StyledNumberTextField';

const GraphAnalysisOverlay = ({ open, onClose, selectedPropertyData, propertyFormData }) => {
    const theme = useTheme();
    const [aggregatePairs, setAggregatePairs] = useState([{ aggregateBy: '', aggregateWith: '' }]);
    const [visualizeOptions, setVisualizeOptions] = useState([]);
    const [useFilteredData, setUseFilteredData] = useState(true);
    const [showHistogram, setShowHistogram] = useState(false);
    const [numBins, setNumBins] = useState(10);
    const [graphFormData, setGraphFormData] = useState(null);
    const [isFetching, setIsFetching] = useState(false);

    const aggregateOptions = ['Zip Code', 'City', 'Home Type'];
    const filterOptions = ['Price', 'Rent Estimate', 'Living Area (sq ft)', 'Lot Size (sq ft)', 'Home Features Score'];
    const homeTypeOptions = ['ANY', 'LOT', 'SINGLE_FAMILY', 'TOWNHOUSE', 'CONDO', 'MULTI_FAMILY'];

    const handleAggregateChange = (index, key, value) => {
        const newAggregatePairs = [...aggregatePairs];
        newAggregatePairs[index][key] = value;
        setAggregatePairs(newAggregatePairs);
    };

    const handleAddAggregate = () => {
        setAggregatePairs([...aggregatePairs, { aggregateBy: '', aggregateWith: '' }]);
    };

    const handleRemoveAggregate = (index) => {
        const newAggregatePairs = [...aggregatePairs];
        newAggregatePairs.splice(index, 1);
        setAggregatePairs(newAggregatePairs);
    };

    const handleVisualizeChange = (event) => {
        const { value } = event.target;
        if (value.length <= 2) {
            setVisualizeOptions(value);
        }
    };

    const handleSubmit = () => {
        const newGraphFormData = {
            ...propertyFormData,
            aggregates: aggregatePairs.filter(pair => pair.aggregateBy && pair.aggregateWith),
            visualizeOptions: visualizeOptions.filter(option => option),
            useFilteredData,
            bins: numBins,
        };
        setGraphFormData(newGraphFormData);
        setIsFetching(true);
        setShowHistogram(true);
    };

    const memoizedHistogram = useMemo(() => {
        if (showHistogram && graphFormData) {
            return (
                <Box mt={4}>
                    <DistributionPlot 
                      graphFormData={graphFormData} 
                      propertyData={selectedPropertyData} 
                      isFetching={isFetching}
                      setIsFetching={setIsFetching}
                    />
                </Box>
            );
        }
        return null;
    }, [showHistogram, graphFormData, selectedPropertyData, isFetching]);

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="comparative-analysis-title">
            <Box
                sx={{
                    width: '80%',
                    height: '80%',
                    margin: 'auto',
                    mt: '5%',
                    bgcolor: theme.palette.background.paper,
                    boxShadow: 24,
                    p: 4,
                    overflowY: 'auto', // Ensure the content is scrollable if it overflows
                }}
            >
                <Typography id="comparative-analysis-title" variant="h6" component="h2" gutterBottom>
                    Comparative Analysis
                </Typography>

                {selectedPropertyData ? (
                    <Box>
                        <Typography variant="body1">
                            Property ID: {selectedPropertyData.zpid}
                        </Typography>
                        <Typography variant="body1">
                            Is Advanced Search: {propertyFormData.is_advanced_search ? 'Yes' : 'No'}
                        </Typography>

                        <Box sx={{ gap: theme.spacing(2) }}>
                            <>
                                {aggregatePairs.map((pair, index) => (
                                    <Box key={index} display="flex" flexDirection="row" alignItems="center" sx={{ gap: theme.spacing(2), mb: 2 }}>
                                        <StyledSelect
                                            id={`aggregateBy-${index}`}
                                            name="aggregateBy"
                                            label="Aggregate By"
                                            value={pair.aggregateBy}
                                            onChange={(e) => handleAggregateChange(index, 'aggregateBy', e.target.value)}
                                            selectOptions={aggregateOptions}
                                        />
                                        {pair.aggregateBy === 'City' && (
                                            <StyledTextField
                                                id={`aggregateWith-${index}`}
                                                name="aggregateWith"
                                                label="City"
                                                value={pair.aggregateWith}
                                                onChange={(e) => handleAggregateChange(index, 'aggregateWith', e.target.value)}
                                                sx={{ flexGrow: 1 }}
                                            />
                                        )}
                                        {pair.aggregateBy === 'Home Type' && (
                                            <StyledSelect
                                                id={`aggregateWith-${index}`}
                                                name="aggregateWith"
                                                label="Home Type"
                                                value={pair.aggregateWith}
                                                onChange={(e) => handleAggregateChange(index, 'aggregateWith', e.target.value)}
                                                selectOptions={homeTypeOptions}
                                                sx={{ flexGrow: 1 }}
                                            />
                                        )}
                                        {pair.aggregateBy === 'Zip Code' && (
                                            <StyledTextField
                                                id={`aggregateWith-${index}`}
                                                name="aggregateWith"
                                                label="Zip Code"
                                                type="number"
                                                value={pair.aggregateWith}
                                                onChange={(e) => handleAggregateChange(index, 'aggregateWith', e.target.value)}
                                                sx={{ flexGrow: 1 }}
                                            />
                                        )}
                                        <StyledButton
                                            children='Remove'
                                            style='secondary'
                                            fullHeight
                                            onClick={() => handleRemoveAggregate(index)}
                                        />
                                    </Box>
                                ))}
                            </>
                            <StyledButton
                                children='Add Aggregate'
                                style='secondary'
                                onClick={handleAddAggregate}
                            />
                        </Box>

                        <Typography variant="h6" sx={{ mt: 4 }}>Visualize Data By</Typography>
                        <Box display="flex" flexDirection="row" alignItems="center" sx={{ gap: theme.spacing(2), mb: 4 }}>
                            <Select
                                id="visualizeBy-select"
                                multiple
                                value={visualizeOptions}
                                onChange={handleVisualizeChange}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </Box>
                                )}
                                sx={{ flexGrow: 1 }}
                            >
                                {filterOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={useFilteredData}
                                    onChange={(e) => setUseFilteredData(e.target.checked)}
                                />
                            }
                            label="Use Filtered Data"
                        />
                        
                        <StyledNumberTextField
                            label="Number of Bins"
                            type="number"
                            value={numBins}
                            onChange={(e) => setNumBins(Number(e.target.value))}
                        />

                        <Box mt={4}>
                            <StyledButton
                                children='Submit'
                                type='submit'
                                onClick={handleSubmit}
                            />
                        </Box>

                        {memoizedHistogram}
                    </Box>
                ) : (
                    <Typography variant="body1">Loading...</Typography>
                )}
            </Box>
        </Modal>
    );
};

export default GraphAnalysisOverlay;
