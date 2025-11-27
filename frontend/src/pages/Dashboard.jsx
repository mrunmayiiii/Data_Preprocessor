import React, { useState, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

// Header Component

import { User } from 'lucide-react';






// Main Dashboard Component
const Dashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Fetch name from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem('name');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF1D5' }}>
      <div className="flex">
        <Sidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        <div className="flex-1 flex flex-col min-w-0">
          

          {/* ✅ Welcome Section */}
          <div className="px-6 py-4 bg-white shadow-sm border-b border-gray-200">
            <h1 className="text-2xl font-light text-gray-800">
              Welcome, <span className="font-medium text-gray-900">{userName || 'User'}</span> 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Glad to have you back. Explore your datasets and insights.
            </p>
          </div>

          {/* Child routes render here */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
