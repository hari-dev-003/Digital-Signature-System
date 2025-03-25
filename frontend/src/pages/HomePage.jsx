import React from 'react';

const HomePage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to Digital Signature System</h1>
            <p className="text-lg text-gray-700 mb-6">Your one-stop solution for secure digital signatures.</p>
            <a href="/register" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition duration-300">Get Started</a>
        </div>
    );
};


export default HomePage;
