import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DocumentUploadPage from './pages/DocumentUploadPage';
import VerificationPage from './pages/VerificationPage';
import Navbar from './components/Navbar';

function App() {
    return (
        <Router>
            <Navbar />
            <div className="container">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/upload" element={<DocumentUploadPage />} />
                    <Route path="/verify" element={<VerificationPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
