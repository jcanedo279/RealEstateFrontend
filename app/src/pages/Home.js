import React, { useState } from 'react';

import fetchBackendApi from '../util/Util';
import MessageContainer from '../flash/FlashMessageContainer';
import { useFlashMessage } from '../flash/FlashMessageContext';


import heroImage from '../assets/images/home_scott_webb.webp';
import investImage from '../assets/images/invest_tierra_mallorca.webp';
import nightstandImage from '../assets/images/nightstand_benjamin_voros.webp';

import '../styles/Home.css';
import '../styles/Forms.css';


function Home() {
    const [userEmail, setUserEmail] = useState('');
    const [issueDescription, setIssueDescription] = useState('');
    const { addFailMessage, addMessage } = useFlashMessage();

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission
      
        const reportFormData = {
          user_email: userEmail,
          issue_description: issueDescription
        };
      
        try {
            const data = await fetchBackendApi('/report/app-issue', {
                method: 'POST',
                data: JSON.stringify(reportFormData)
            });

            if (data.fancy_flash) {
                console.log("Register data has flash messages:", data.fancy_flash);
                data.fancy_flash.forEach(message => addMessage({
                    message: message.message,
                    status: message.status,
                    flash_id: message.flash_id,
                    animation: message.animation
                }));
            }
            
            // To check for a success message to navigate after showing the message
            const successMessage = data.fancy_flash.find(msg => msg.status === 'success');
            if (successMessage) {
                setUserEmail('');
                setIssueDescription('');
            }
        } catch (error) {
            addFailMessage(error, 'report');
        }
      };

    return (
        <main className="container">
            {/* Landing Section */}
            <section className="hero-section center" style={{ backgroundImage: `url(${heroImage})` }}>
                <div className="hero-content text-center">
                    <h1 className="center">Welcome to Real Estate Rover</h1>
                    <p className="flow-text">
                        Unlock Intelligent Real Estate Investment Decisions with Real Estate Rover.
                        Harness the power of data science and AI with Real Estate Rover, your one-stop platform for real estate analysis and investment insights.
                        Designed for both new investors and seasoned professionals, our platform helps you uncover investment opportunities and assess property potentials efficiently.
                    </p>
                </div>
            </section>

            <div className="spacer"></div>

            <section className="hero-section center" style={{ backgroundImage: `url(${investImage})` }}>
                {/* About Section */}
                <div className="hero-content text-center">
                    <h2 className="center">How It Works</h2>
                    <p className="flow-text">
                        Start by using our Explore feature to sift through market trends and historical data or use our Direct Search to look up specific properties.
                        Here’s how you can benefit:
                        <ul className="fa-ul">
                            <li className="custom-li"><a href="/explore"><span className="fa-li"><i className="fas fa-chart-bar"></i></span><strong>Explore:</strong> Analyze broader market trends to identify areas with high growth potential.</a></li>
                            <li className="custom-li"><a href="/search"><span className="fa-li"><i className="fas fa-search"></i></span><strong>Direct Search:</strong> Instantly retrieve detailed information on any listed property.</a></li>
                        </ul>
                    </p>
                </div>

                <div className="spacer"></div>

                {/* Why Use Our Platform Section */}
                <div className="hero-content text-center">
                    <h2 className="center">Why Use Our Platform?</h2>
                    <p className="flow-text">
                        Our platform simplifies the complexity of real estate data to provide you with easy-to-understand insights and actionable advice. By integrating comprehensive market data and predictive analytics, we enable you to:
                        <ul className="fa-ul">
                            <li className="custom-li"><span className="fa-li"><i className="fas fa-chart-line"></i></span>Evaluate investment viability through intuitive visualizations and automated analysis.</li>
                            <li className="custom-li"><span className="fa-li"><i className="fas fa-clock"></i></span>Access real-time data to stay ahead in fast-moving markets.</li>
                            <li className="custom-li"><span className="fa-li"><i className="fas fa-balance-scale"></i></span>Compare potential investments against market benchmarks to make informed decisions.</li>
                        </ul>
                    </p>
                </div>
            </section>

            <div className="spacer"></div>

            {/* Contact Section */}
            <section className="hero-section center" style={{ backgroundImage: `url(${nightstandImage})` }}>
                <div className="hero-content text-center">
                    <h2 className="center">Ready to Dive In?</h2>
                    <p className="flow-text">Whether you're assessing a single property or exploring broader market dynamics, our platform equips you with the tools to perform detailed analyses that drive your investment decisions. Get started today to transform the way you evaluate real estate.</p>
                </div>

                <div className="spacer"></div>

                <div className="hero-content text-center">
                    <h2 className="center">Contact Us</h2>
                    <p className="flow-text">
                        Our features are currently in an experimental phase. If you encounter any issues, please let us know by filling out the form below.
                        {/* Contact Form for Reporting Issues */}
                        <form id="issueReportForm" className="container" onSubmit={(e) => handleSubmit(e)}>
                            <div className="input-field">
                                <input id="user_email" type="email" name="user_email" required value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                                <label for="user_email">Your Email:</label>
                            </div>
                            <div className="input-field">
                            <textarea id="issue_description" className="materialize-textarea" name="issue_description" required value={issueDescription} onChange={(e) => setIssueDescription(e.target.value)} />
                                <label for="issue_description">Describe the Issue:</label>
                            </div>
                            <button id="reportIssueBtn" className="btn waves-effect waves-light main-color" type="submit">Report Issue</button>
                            <MessageContainer flash_id="report" maxMessages={1} />
                        </form>
                    </p>
                </div>
            </section>
        </main>

    );
}

export default Home;
