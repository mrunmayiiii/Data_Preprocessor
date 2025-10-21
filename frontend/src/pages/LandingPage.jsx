import React, { useState, useEffect } from 'react';
import { ChevronRight, Database, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { features } from '../utils/data';
const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF1D5' }}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#9FB3DF' }}>
                  <Database className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-gray-900">DataVault</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">
                Home
              </a>
              <a href="#features" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">
                Features
              </a>
              <a href="#about" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">
                About
              </a>
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 hover:shadow-md"
                  style={{ backgroundColor: '#9FB3DF' }}
                >
                  Sign Up
                </Link>
              </div>
            </div>
            
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden px-6 pb-4">
            <div className="space-y-2 bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
              <a href="#home" className="block text-gray-700 hover:text-gray-900 text-sm">Home</a>
              <a href="#features" className="block text-gray-700 hover:text-gray-900 text-sm">Features</a>
              <a href="#about" className="block text-gray-700 hover:text-gray-900 text-sm">About</a>
              <div className="pt-2 flex items-center gap-3">
                <Link to="/login" className="text-gray-700 hover:text-gray-900 text-sm">Login</Link>
                <Link
                  to="/signup"
                  className="ml-auto px-4 py-2 rounded-lg text-sm font-medium text-white"
                  style={{ backgroundColor: '#9FB3DF' }}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-24 pb-16 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight">
                Professional{' '}
                <span className="font-medium" style={{ color: '#9FB3DF' }}>
                  Dataset Management
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                A sophisticated platform designed for researchers, analysts, and organizations 
                who require reliable and efficient data management solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/signup"
                  className="px-8 py-4 rounded-lg text-base font-medium text-white flex items-center space-x-2 hover:shadow-lg transition-all duration-200"
                  style={{ backgroundColor: '#9FB3DF' }}
                >
                  <span>Get Started</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4">
              Essential Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
              Comprehensive tools designed for professional data management workflows
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {features.map((feature, index) => {
                const Icon = feature.icon; // 👈 use it as a component
                return (
                  <div key={feature.id} className="p-8 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300" style={{ backgroundColor: 'rgba(189, 221, 228, 0.2)' }}>
                    <div className="mb-4 p-3 rounded-lg inline-block" style={{ backgroundColor: 'rgba(158, 198, 243, 0.3)' }}>
                      <Icon className="w-6 h-6 text-[#9FB3DF]" /> {/* 👈 render here */}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed font-light">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer id="about" className="bg-white border-t border-gray-100 py-12 px-6 lg:px-8" style={{ backgroundColor: 'rgba(189, 221, 228, 0.2)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#9FB3DF' }}>
                  <Database className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-gray-900">DataVault</span>
              </div>
              <p className="text-gray-600 mb-4 max-w-md font-light">
                Professional dataset management platform for modern organizations.
              </p>
            </div>
            <div>
              <h3 className="text-gray-900 font-medium mb-4">Product</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors font-light">Features</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors font-light">Pricing</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors font-light">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-gray-900 font-medium mb-4">Support</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors font-light">Help Center</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors font-light">Contact</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors font-light">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-8 pt-8 text-center text-gray-500">
            <p className="font-light">&copy; 2025 DataVault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;