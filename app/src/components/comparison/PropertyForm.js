import React from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import StyledTextField from '../material/StyledTextField';

const PropertyForm = ({ open, handleClose, property, handleChange, handleSave }) => {
    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md">
            <DialogTitle>Edit Property</DialogTitle>
            <DialogContent>
                <StyledTextField
                    margin="dense"
                    label="Property Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={property.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                />
                <StyledTextField
                    margin="dense"
                    label="Monthly Rental Estimate"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={property.monthlyRentalEstimate}
                    onChange={(e) => handleChange('monthlyRentalEstimate', e.target.value)}
                />
                <StyledTextField
                    margin="dense"
                    label="Purchase Price"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={property.purchasePrice}
                    onChange={(e) => handleChange('purchasePrice', e.target.value)}
                />
                <StyledTextField
                    margin="dense"
                    label="Down Payment Percentage"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={property.downPaymentPercentage}
                    onChange={(e) => handleChange('downPaymentPercentage', e.target.value)}
                />
                <StyledTextField
                    margin="dense"
                    label="Annual Property Tax Rate (%)"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={property.annualPropertyTaxRate}
                    onChange={(e) => handleChange('annualPropertyTaxRate', e.target.value)}
                />
                <StyledTextField
                    margin="dense"
                    label="Monthly HOA Fees"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={property.monthlyHoa}
                    onChange={(e) => handleChange('monthlyHoa', e.target.value)}
                />
                <StyledTextField
                    margin="dense"
                    label="Monthly Homeowners Insurance"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={property.monthlyHomeownersInsurance}
                    onChange={(e) => handleChange('monthlyHomeownersInsurance', e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PropertyForm;
