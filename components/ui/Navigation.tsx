import React, { useState } from 'react';
import { HospitalIcon, UserIcon, DoctorIcon } from '../Icons';
import ThemeSwitcher from '../ThemeSwitcher';

// Navigation Item Interface
interface NavItem {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  badge?: number;
}

// Professional Header Component
interface HeaderProps {
  user: {
    name: string;
    role: string;
    avatar?: string;
  };
  onLogout: () => void;
  notifications?: number;
}

export const ProfessionalHeader: React.FC<HeaderProps> = ({ 
  user, 
  onLogout, 
  notifications = 0 
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getRoleDisplayName = (role: string) => {
    const roleMap = {
      'super_admin': 'System Administrator',
      'hospital_admin': 'Hospital Administrator',
      'doctor': 'Medical Doctor',
      'patient': 'Patient'
    };
    return roleMap[role as keyof typeof roleMap] || role;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
      case 'hospital_admin':
        return <HospitalIcon className="w-5 h-5" />;
      case 'doctor':
        return <DoctorIcon className="w-5 h-5" />;
      case 'patient':
        return <UserIcon className="w-5 h-5" />;
      default:
        return <UserIcon className="w-5 h-5" />;
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <HospitalIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  MediMinder AI
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Medical Compliance System
                </p>
              </div>
            </div>
          </div>

          {/* Right side menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            {notifications > 0 && (
              <button className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <span className="sr-only">Notifications</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5V9a6 6 0 00-12 0v3l-5 5h5a3 3 0 006 0z" />
                </svg>
                <span className="absolute top-0 right-0 block h-2 w-2 bg-red-400 rounded-full transform translate-x-1 -translate-y-1"></span>
              </button>
            )}

            {/* Theme Switcher */}
            <ThemeSwitcher />

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 text-sm rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  {user.avatar ? (
                    <img className="w-8 h-8 rounded-full" src={user.avatar} alt={user.name} />
                  ) : (
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      {getRoleIcon(user.role)}
                    </div>
                  )}
                  <div className="text-left hidden sm:block">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {getRoleDisplayName(user.role)}
                    </div>
                  </div>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {getRoleDisplayName(user.role)}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      // Add profile navigation here
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      // Add settings navigation here
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Settings
                  </button>
                  <hr className="border-gray-200 dark:border-gray-700 my-1" />
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Breadcrumb Component
interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && (
              <svg className="w-6 h-6 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {item.current ? (
              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                {item.label}
              </span>
            ) : (
              <button className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium">
                {item.label}
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Tab Navigation Component
interface TabProps {
  tabs: Array<{
    id: string;
    label: string;
    count?: number;
    icon?: React.ReactNode;
  }>;
  activeTab: string;
  onChange: (tabId: string) => void;
}

export const TabNavigation: React.FC<TabProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                activeTab === tab.id
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};