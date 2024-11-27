import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  DashboardOutlined,
  PeopleOutlined,
  SecurityOutlined,
  AdminPanelSettingsOutlined,
  AccountCircleOutlined,
  KeyOutlined,
  LogoutOutlined,
} from '@mui/icons-material';

function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
    { path: '/users', label: 'Users', icon: <PeopleOutlined /> },
    { path: '/roles', label: 'Roles', icon: <AdminPanelSettingsOutlined /> },
    { path: '/permissions', label: 'Permissions', icon: <KeyOutlined /> },
    { path: '/profile', label: 'Profile', icon: <AccountCircleOutlined /> },
  ];

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-gray-800">
          {/* Logo */}
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
            <SecurityOutlined className="h-8 w-8 text-white" />
            <span className="ml-2 text-xl font-semibold text-white">Admin Panel</span>
          </div>

          {/* Navigation */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <span className={`mr-3 h-6 w-6 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Logout Button */}
            <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
              <button
                onClick={logout}
                className="flex-shrink-0 w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <LogoutOutlined className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar; 