import React, { useState, useEffect } from 'react';
import ListingsRetriever from '../util/ListingsRetriever';
import M from 'materialize-css';

import '../styles/Forms.css';

const Explore = () => {
    const [formData, setFormData] = useState({
        region: 'ANY_AREA',
        home_type: 'ANY',
        year_built: '2000',
        max_price: '1000000',
        city: '',
        is_waterfront: false,
        is_cashflowing: false,
        num_properties_per_page: '10',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [shouldFetch, setShouldFetch] = useState(false);

    useEffect(() => {
        M.AutoInit();
        setTimeout(() => M.updateTextFields(), 0);
    }, []);

    const handleInputChange = (event) => {
        const { id, value, type, checked } = event.target;
        setFormData(prevFormData => {
            const updatedFormData = {
                ...prevFormData,
                [id]: type === 'checkbox' ? checked : value
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

                <div className="input-field form-element">
                    <select id="region" name="region" value={formData.region} onChange={handleInputChange} >
                        <option value="ANY_AREA">Any</option>
                        <option value="LAKELAND_AREA">Lakeland Area</option>
                        <option value="SOUTH_FLORIDA_AREA">South Florida Area</option>
                    </select>
                    <label htmlFor="region">Region:</label>
                </div>

                <div className="input-field form-element">
                    <select id="home_type" name="home_type" value={formData.home_type} onChange={handleInputChange} >
                        <option value="ANY">Any</option>
                        <option value="LOT">Lot</option>
                        <option value="SINGLE_FAMILY">Single Family</option>
                        <option value="TOWNHOUSE">Townhouse</option>
                        <option value="CONDO">Condo</option>
                        <option value="MULTI_FAMILY">Multi Family</option>
                    </select>
                    <label htmlFor="home_type">Home Type:</label>
                </div>

                <div className="input-field form-element">
                    <label htmlFor="year_built">Year Built:</label>
                    <input type="number" id="year_built" name="year_built" value={formData.year_built} onChange={handleInputChange} />
                </div>

                <div className="input-field form-element">
                    <label htmlFor="max_price">Max Purchase Price:</label>
                    <input type="number" id="max_price" name="max_price" value={formData.max_price} onChange={handleInputChange} />
                </div>

                <div className="input-field form-element">
                    <label htmlFor="city">City Name (Optional):</label>
                    <input type="text" id="city" name="city" value={formData.city} />
                </div>

                <div className="input-field">
                    <div className="switch form-element">
                        <label>
                            All
                            <input type="checkbox" id="is_waterfront" checked={formData.is_waterfront} onChange={handleInputChange} />
                            <span className="lever"></span>
                            Waterfront Only
                        </label>
                    </div>
                </div>

                <div className="input-field">
                    <div className="switch form-element">
                        <label>
                            All
                            <input type="checkbox" id="is_cashflowing" checked={formData.is_cashflowing} onChange={handleInputChange} />
                            <span className="lever"></span>
                            Positive Cashflow Only
                        </label>
                    </div>
                </div>

                <div className="input-field form-element">
                    <label htmlFor="num_properties_per_page">Number of Properties Per Page:</label>
                    <input type="number" id="num_properties_per_page" name="num_properties_per_page" value={formData.num_properties_per_page} onChange={handleInputChange} />
                </div>


                {/* Submit Button */}
                <button className="btn waves-effect waves-light main-color" type="submit">
                    <i className="material-icons center">Explore Properties</i>
                </button>
            </form>

            {/* Conditionally render ListingsRetriever if the form has been submitted */}
            {isSubmitted && (
                <ListingsRetriever
                    route='explore'
                    formData={formData}
                    shouldFetch={shouldFetch}
                    onDataFetched={() => setShouldFetch(false)}
                    emptyResponseMessage='No properties match the given criteria.'
                />
            )}
        </div>
    );
};

export default Explore;
