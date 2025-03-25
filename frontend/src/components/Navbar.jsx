import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
<nav className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4 shadow-md w-full">

            <ul className="flex space-x-6 justify-center">

                <li>
                    <Link to="/" className="font-bold hover:text-gray-200 transition duration-300">Home</Link>
                </li>
                <li>
                    <Link to="/register" className="hover:text-gray-200 transition duration-300">Register</Link>
                </li>
                <li>
                    <Link to="/login" className="hover:text-gray-200 transition duration-300">Login</Link>
                </li>
                <li>
                    <Link to="/upload" className="hover:text-gray-200 transition duration-300">Upload Document</Link>
                </li>
                 <li>
                    <Link to="/verify" className="hover:text-gray-200 transition duration-300">Verify Document</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
