import React, { useState } from 'react';
import { 
  Search, 
  Menu,
  X
} from 'lucide-react';

import Sidebar from '../components/SideBar';
import { Outlet } from 'react-router-dom';

// Header Component
const Header = ({ onMenuClick, isMobileMenuOpen }) => {
  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search datasets..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-20 w-full transition-all"
            style={{ focusRingColor: '#9FB3DF' }}
          />
        </div>
      </div>
    </header>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF1D5' }}>
      <div className="flex">
        <Sidebar 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />
         
        <div className="flex-1 flex flex-col min-w-0">
          <Header 
            onMenuClick={toggleMobileMenu} 
            isMobileMenuOpen={isMobileMenuOpen} 
          />
          
          {/* This is where child routes render */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;