import React from 'react';

import heroImage from '../assets/images/home_scott_webb.webp';
import investImage from '../assets/images/invest_tierra_mallorca.webp';
import nightstandImage from '../assets/images/nightstand_benjamin_voros.webp';

import '../styles/Home.css';
import '../styles/Forms.css';

function Home() {
    return (
        <main className="container">
            <section className="hero-section" style={{ backgroundImage: `url(${heroImage})` }}>
                <div className="hero-content text-center">
                    <h1>Welcome to Profit Prophet</h1>
                    <p>Unlock Intelligent Real Estate Investment Decisions with Profit Prophet...</p>
                </div>
            </section>

            <div className="spacer"></div>

            <section className="hero-section" style={{ backgroundImage: `url(${investImage})` }}>
                <div className="hero-content text-center">
                    <h2>How It Works</h2>
                    <p>Start by using our Explore feature to sift through market trends...</p>
                </div>
            </section>

            <div className="spacer"></div>

            <section className="hero-section" style={{ backgroundImage: `url(${nightstandImage})` }}>
                <div className="hero-content text-center">
                    <h2>Ready to Dive In?</h2>
                    <p>Whether you're assessing a single property or exploring broader market dynamics...</p>
                </div>
            </section>
        </main>
    );
}

export default Home;
