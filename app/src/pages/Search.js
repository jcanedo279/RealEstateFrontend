import React, { useState, useEffect } from 'react';
import ListingsRetriever from '../util/ListingsRetriever';
import M from 'materialize-css';

import '../styles/Forms.css';

const Search = () => {
    const [formData, setFormData] = useState({
        property_address: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [shouldFetch, setShouldFetch] = useState(false);

    useEffect(() => {
        M.AutoInit();
        setTimeout(() => M.updateTextFields(), 0);
    }, []);

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData(prevFormData => {
            const updatedFormData = {
                ...prevFormData,
                [id]: value
            };
            return updatedFormData;
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsSubmitted(true);
        setShouldFetch(true);
    };

    return (
        <div>
            <form id="propertyForm" className="container" onSubmit={handleSubmit}>
                <div class="input-field form-element">
                    <input id="property_address" type="text" name="property_address" required onChange={handleInputChange} />
                    <label for="property_address">Enter Property Address:</label>
                </div>

                <button className="btn waves-effect waves-light main-color" type="submit">
                    <i className="material-icons center">Search by Address</i>
                </button>
            </form>

            {/* Conditionally render ListingsRetriever if the form has been submitted */}
            {isSubmitted && (
                <ListingsRetriever
                    route='search'
                    formData={formData}
                    shouldFetch={shouldFetch}
                    onDataFetched={() => setShouldFetch(false)}
                    emptyResponseMessage='No properties match the given criteria.'
                />
            )}
        </div>
    );
};

export default Search;
