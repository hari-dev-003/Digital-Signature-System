import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
                username,
                email,
                password,
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-96 bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 text-center">
                        Register
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500 text-center">
                        Create an account to start signing documents.
                    </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                    <form onSubmit={handleRegister} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    required
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Link to="/login" className="text-sm text-blue-500 hover:underline">
                                Already have an account? Login
                            </Link>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Register
                            </button>
                        </div>
                    </form>
                    {message && <p className="mt-4 text-center text-red-500">{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
