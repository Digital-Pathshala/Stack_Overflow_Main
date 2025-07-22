import React from 'react';
import dp1 from '../../assets/dp1.jpg';
import { Search, ShieldUser, Inbox, Trophy } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="bg-white border-b border-gray-300 shadow-sm w-full z-10">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src={dp1} alt="Logo" className="w-10 h-10 rounded-full" />
          <span className="font-bold text-xl">
            <span style={{ color: '#1db954' }}>Digital</span> <span className="font-normal">Pathsala</span>
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4 text-gray-600">
          <Inbox />
          <ShieldUser />
          <Trophy />
          <button className="p-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
