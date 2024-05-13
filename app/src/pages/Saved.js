import React, { useEffect, useState } from 'react';
import ListingsRetriever from '../util/ListingsRetriever';
import M from 'materialize-css';

import '../styles/Forms.css';

const Results = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [shouldFetch, setShouldFetch] = useState(false);

    useEffect(() => {
        M.AutoInit();
        fetchData();  // Fetch data immediately when the component mounts
    }, []);

    const fetchData = () => {
        setIsSubmitted(true);  // Assuming you want to set isSubmitted when fetching initially
        setShouldFetch(true);
    };

    return (
        <div>
            <div className="scrolling-content">
                <div className="fullscreen-div-padding" id="resultsTable">
                    {isSubmitted && (
                        <ListingsRetriever
                            route='saved'
                            shouldFetch={shouldFetch}
                            onDataFetched={() => setShouldFetch(false)}
                            emptyResponseMessage='No saved properties on your account.'
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Results;
