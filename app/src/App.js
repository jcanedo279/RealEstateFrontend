import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Test from './pages/Test';
import './App.css';

function App() {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<Home />} exact />
            <Route path="/test" element={<Test />} exact />
            {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
    </Router>
  );
}

export default App;
