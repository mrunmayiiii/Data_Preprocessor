import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home,
  Upload,
  FileCheck,
  Database,
  X,
  LogOut,
  FileText
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    {
      name: 'Home',
      path: '/dashboard',
      icon: Home,
      exact: true
    },
    {
      name: 'View Datasets',
      path: '/dashboard/preprocess',
      icon: FileText,
      exact: true
    },
    {
      name: 'Upload Dataset',
      path: '/dashboard/upload',
      icon: Upload
    },
    {
      name: 'Preprocessed Datasets',
      path: '/dashboard/processed',
      icon: FileCheck
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('name');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
  className={`
    fixed lg:static inset-y-0 left-0 z-50
    w-64 min-h-screen bg-white border-r border-gray-200
    transform transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    flex flex-col overflow-hidden
  `}
>
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#9FB3DF' }}>
              <Database className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-light text-gray-900">DataVault</h1>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg
                  font-light transition-all
                  ${active 
                    ? 'text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
                style={active ? { backgroundColor: '#9FB3DF' } : {}}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all font-light"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;