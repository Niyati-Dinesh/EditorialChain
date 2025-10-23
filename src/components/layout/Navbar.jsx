import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
    <nav className="bg-indigo-600 text-white p-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">EditorialChain</Link>
        <div className="space-x-6">
            <Link to="/article" className="hover:underline">Read</Link>
            <Link to="/leaderboard" className="hover:underline">Leaderboard</Link>
            <Link to="/settings" className="hover:underline">Settings</Link>
        </div>
    </nav>
);
export default Navbar;
