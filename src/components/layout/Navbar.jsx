import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.jsx';
import {
  Menu,
  X,
  BookOpen,
  Trophy,
  Settings,
  User,
  LogOut,
  Flame,
  Bell,
  Search,
  Home,
  Sun,
  Moon,
} from 'lucide-react';

const Navbar = () => {
  const { currentUser, theme, toggleTheme, googleSignIn, logOut } = useAppContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3); // Mock data
  const location = useLocation();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/article', label: 'Read', icon: BookOpen },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-indigo-600 text-white shadow-lg dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-xl font-bold">EditorialChain</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-indigo-700 text-white'
                    : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
                } dark:hover:bg-gray-700`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Desktop User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                <button
                  onClick={toggleTheme}
                  className="p-2 text-indigo-100 hover:text-white hover:bg-indigo-700 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>

                <div className="flex items-center space-x-2 bg-indigo-700 dark:bg-gray-700 px-3 py-1 rounded-full">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium">{currentUser.streak || 0}</span>
                </div>

                <button className="relative p-2 text-indigo-100 hover:text-white hover:bg-indigo-700 dark:hover:bg-gray-700 rounded-md transition-colors">
                  <Bell className="w-5 h-5" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </button>

                <button className="p-2 text-indigo-100 hover:text-white hover:bg-indigo-700 dark:hover:bg-gray-700 rounded-md transition-colors">
                  <Search className="w-5 h-5" />
                </button>

                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 focus:outline-none p-2 rounded-md hover:bg-indigo-700 dark:hover:bg-gray-700 transition-colors"
                  >
                    <img
                      src={currentUser?.photoURL || '/default-avatar.png'}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-indigo-300 hover:border-white transition duration-200"
                    />
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={closeDropdown}></div>
                      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-20 border border-gray-200 dark:border-gray-700">
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-900 dark:text-white font-medium">
                            {currentUser?.displayName || 'Anonymous User'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {currentUser?.email}
                          </p>
                        </div>

                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
                          onClick={closeDropdown}
                        >
                          <User className="w-4 h-4 mr-3" />
                          <span>View Profile</span>
                        </Link>

                        <Link
                          to="/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
                          onClick={closeDropdown}
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          <span>Settings</span>
                        </Link>

                        <div className="border-t border-gray-200 dark:border-gray-700 mt-1">
                          <button
                            onClick={logOut}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 transition duration-200"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={googleSignIn}
                className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Login with Google
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-indigo-100 hover:text-white hover:bg-indigo-700 rounded-md transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-indigo-700 dark:bg-gray-700 rounded-lg mt-2">
              {currentUser && (
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="text-sm font-medium">
                      Streak: {currentUser.streak || 0} days
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-indigo-100 hover:text-white">
                      <Bell className="w-5 h-5" />
                      {notifications > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {notifications}
                        </span>
                      )}
                    </button>
                    <button className="p-1 text-indigo-100 hover:text-white">
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-indigo-600 text-white'
                      : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}

              <div className="border-t border-indigo-600 dark:border-gray-600 pt-2">
                {currentUser ? (
                  <>
                    <div className="px-3 py-2">
                      <p className="text-sm text-indigo-200 dark:text-gray-300 font-medium">
                        {currentUser?.displayName || 'Anonymous User'}
                      </p>
                      <p className="text-xs text-indigo-300 dark:text-gray-400 truncate">
                        {currentUser?.email}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={closeMobileMenu}
                      className="flex items-center space-x-2 px-3 py-2 text-indigo-100 hover:bg-indigo-600 hover:text-white rounded-md transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span>View Profile</span>
                    </Link>
                    <button
                      onClick={logOut}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-red-300 hover:bg-red-600 hover:text-white rounded-md transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      googleSignIn();
                      closeMobileMenu();
                    }}
                    className="flex items-center justify-center space-x-2 w-full mx-auto px-3 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                  >
                    <span>Login with Google</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;