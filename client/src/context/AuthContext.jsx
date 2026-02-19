import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const userJSON = localStorage.getItem('user');

      // Only proceed if both token and user data string exist
      if (token && userJSON) {
        const userData = JSON.parse(userJSON); // This can still fail if userJSON is not valid JSON
        setUser(userData);
        setIsAuthenticated(true);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      // If parsing fails, the data is corrupt. Clear it out.
      console.error('Failed to parse user data from local storage:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    // Defensive check: only proceed if we have valid data
    if (!userData || !token) {
        console.error("Login function called with invalid data");
        return;
    }
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    delete api.defaults.headers.common['Authorization'];
  };

  if (loading) {
    return <div>Loading...</div>; // Or a proper spinner component
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
