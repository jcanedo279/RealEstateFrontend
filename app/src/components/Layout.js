import React, { useEffect } from 'react';
import M from 'materialize-css';
import '../styles/Style.css'
import { useAuth } from '../util/AuthContext';


const Layout = ({ children }) => {
    const { authState: { isAuthSession } } = useAuth();

    useEffect(() => {
        // Initialize side navigation when component mounts
        const leftNavElems = document.querySelectorAll('.sidenav');
        M.Sidenav.init(leftNavElems);

        // Initialize right-side navigation when component mounts
        const rightNavElems = document.querySelectorAll('.sidenav-right');
        M.Sidenav.init(rightNavElems, { edge: 'right' });
    }, []);

    return (
        <div>
            {/* Main Navigation Sidebar */}
            <nav>
                <div className="nav-wrapper main-color">
                    <a href="#" data-target="slide-out" className="sidenav-trigger show-on-large sidenav-left">
                        <i className="material-icons">Menu</i>
                    </a>
                    <a href="/" className="brand-logo center">
                        <img src={`${process.env.PUBLIC_URL}/assets/images/logo_rounded_white.png`} alt="Logo" style={{ height: '40px', verticalAlign: 'middle', marginRight: '5px', marginBottom: '5px' }} />
                        Real Estate Rover
                    </a>
                    <a href="#" data-target="login-slide-out" className="sidenav-trigger right show-on-large sidenav-right">
                        <i className="material-icons">Account</i>
                    </a>
                </div>
            </nav>

            {/* Features Side Navigation (Left) */}
            <ul id="slide-out" className="sidenav sidenav-left">
                <li><a href="/">
                    <i className="fas fa-home left"></i>Home
                </a></li>
                <li><a href="/explore">
                    <i className="fas fa-globe-americas left"></i>
                    Explore
                </a></li>
                <li><a href="/search">
                    <i className="fas fa-search left"></i>
                    Property Search
                </a></li>
                {isAuthSession &&
                    <li><a href="/saved">
                        <i className="fas fa-heart left"></i>
                        Saved
                    </a></li>}
            </ul>

            {/* Login Side Navigation (Right) */}
            <ul id="login-slide-out" className="sidenav sidenav-right">
                {isAuthSession ? (
                    <>
                        <li><a href="/profile">
                            <i className="fas fa-user-circle left"></i>
                            Your Profile
                        </a></li>
                        <li><a href="/logout">
                            <i className="fas fa-sign-out-alt left"></i>
                            Logout
                        </a></li>
                    </>
                ) : (
                    <li><a href="/login">
                        <i className="fas fa-user left"></i>
                        Login
                    </a></li>
                )}
            </ul>
            
            {/* Page content */}
            <div>
                {/* Render the child components (route components) */}
                {children}
            </div>
        </div>
    );
};

export default Layout;
