import React from "react";
import { Link } from "react-router-dom";
import { Sun, Moon, Menu, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Header({ toggleDarkMode, isDarkMode, toggleSidebar }) {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between p-4 h-16">
        {/* Mobile menu button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Placeholder to balance the flex layout on larger screens */}
        <div className="hidden lg:block lg:w-0 flex-1"></div>

        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-slate-500"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {isAuthenticated ? (
            // User is logged in
            <div className="flex items-center space-x-3">
              <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-200">
                Welcome, {user?.name || "User"}
              </span>
              <button
                onClick={logout}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-slate-500"
                aria-label="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            // User is logged out
            <div className="hidden md:flex items-center space-x-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
