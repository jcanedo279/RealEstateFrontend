import React, { useEffect, useState } from 'react';
import ListingsRetriever from '../util/ListingsRetriever';
import Layout from '../components/Layout';

import '../styles/Forms.css';

const Saved = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [shouldFetch, setShouldFetch] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        setIsSubmitted(true);  // Assuming you want to set isSubmitted when fetching initially
        setShouldFetch(true);
    };

    return (
        <Layout alignTop = 'align'>
            {isSubmitted && (
                <ListingsRetriever
                    route='saved'
                    shouldFetch={shouldFetch}
                    onDataFetched={() => setShouldFetch(false)}
                    emptyResponseMessage='No saved properties on your account.'
                />
            )}
        </Layout>
    );
};

export default Saved;
