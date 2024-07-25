import React, { useState } from 'react';
import { List, ListItem, ListItemText, IconButton, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PropertyForm from './PropertyForm'; // Ensure you import or define PropertyForm similarly to the previous example

const PropertyList = ({ properties, setProperties, calculateResults }) => {
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [editOpen, setEditOpen] = useState(false);
    const [isEditingNewProperty, setIsEditingNewProperty] = useState(false);

    const handleEditOpen = (property, isNew = false) => {
        setSelectedProperty(property);
        setEditOpen(true);
        setIsEditingNewProperty(isNew);
    };

    const handleEditClose = () => {
        setEditOpen(false);
        setIsEditingNewProperty(false);
    };

    const handlePropertyChange = (field, value) => {
        setSelectedProperty({ ...selectedProperty, [field]: value });
    };

    const handlePropertySave = () => {
        if (isEditingNewProperty) {
            setProperties([...properties, { ...selectedProperty, id: Math.random() }]); // Assign a unique id
        } else {
            setProperties(properties.map(p => p.id === selectedProperty.id ? selectedProperty : p));
        }
        handleEditClose();
    };

    const handleAddProperty = () => {
        handleEditOpen({ name: '', address: '' }, true);
    };

    const handleRemoveProperty = (id) => {
        setProperties(properties.filter(p => p.id !== id));
    };

    return (
        <>
            <Button variant="contained" onClick={handleAddProperty} sx={{ mb: 2 }}>
                Add Property
            </Button>
            <List>
                {properties.map((property) => (
                    <ListItem key={property.id} secondaryAction={
                        <>
                            <IconButton edge="end" onClick={() => handleEditOpen(property)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton edge="end" onClick={() => handleRemoveProperty(property.id)} color="error">
                                <DeleteIcon />
                            </IconButton>
                        </>
                    }>
                        <ListItemText primary={property.name} secondary={property.address} />
                    </ListItem>
                ))}
            </List>
            {selectedProperty && (
                <PropertyForm
                    open={editOpen}
                    handleClose={handleEditClose}
                    property={selectedProperty}
                    handleChange={handlePropertyChange}
                    handleSave={handlePropertySave}
                />
            )}
        </>
    );
};

export default PropertyList;
