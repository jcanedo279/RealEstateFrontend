import React from 'react';
import { AuthProvider } from './util/AuthContext';
import { FlashMessageProvider } from './flash/FlashMessageContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthRoute } from './util/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Search from './pages/Search';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Profile from './pages/Profile';
import Saved from './pages/Saved';
import Register from './pages/Register';
import Test from './misc_pages/Test';
import AccountVerification from './misc_pages/EmailVerification';
import PasswordRequestNew from './misc_pages/PasswordRequestNew';
import PasswordSetNew from './misc_pages/PasswordSetNew';

import './App.css';


const App = () => {
  return (
    <AuthProvider>
      <FlashMessageProvider>
        <Layout>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              {/* User routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<AuthRoute element={Profile} />} />
              <Route path="/logout" element={<AuthRoute element={Logout} />} />
              {/* Listing routes */}
              <Route path="/explore" element={<Explore />} />
              <Route path="/search" element={<Search />} />
              <Route path="/saved" element={<AuthRoute element={Saved} />} />
              {/* Misc routes */}
              <Route path="/email/verify/:token" element={<AccountVerification />} />
              <Route path="/password/request-new" element={<PasswordRequestNew />} />
              <Route path="/password/set-new/:token" element={<PasswordSetNew />} />
              {/* Test routes */}
              <Route path="/test" element={<Test />} />
            </Routes>
          </Router>
        </Layout>
      </FlashMessageProvider>
    </AuthProvider>
  );
};

export default App;
