import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Context ─────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Custom Hook ─────────────────────────────────────────────
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ─── Provider ────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); // true while restoring session

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('samadhan_token');
      const savedUser = localStorage.getItem('samadhan_user');
      const savedRole = localStorage.getItem('samadhan_role');

      if (savedToken && savedUser && savedRole) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setRole(savedRole);
      }
    } catch (err) {
      // Corrupted localStorage — clear everything
      localStorage.removeItem('samadhan_token');
      localStorage.removeItem('samadhan_user');
      localStorage.removeItem('samadhan_role');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Login — store auth state in memory + localStorage.
   * @param {string} newToken - JWT token
   * @param {Object} newUser - User data from API
   * @param {string} newRole - 'citizen' | 'authority' | 'admin'
   */
  const login = useCallback((newToken, newUser, newRole) => {
    setToken(newToken);
    setUser(newUser);
    setRole(newRole);

    localStorage.setItem('samadhan_token', newToken);
    localStorage.setItem('samadhan_user', JSON.stringify(newUser));
    localStorage.setItem('samadhan_role', newRole);
  }, []);

  /**
   * Logout — clear all auth state.
   */
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setRole(null);

    localStorage.removeItem('samadhan_token');
    localStorage.removeItem('samadhan_user');
    localStorage.removeItem('samadhan_role');
  }, []);

  /**
   * Update user data (e.g., after profile edit).
   * @param {Object} updatedUser
   */
  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('samadhan_user', JSON.stringify(updatedUser));
  }, []);

  const isAuthenticated = !!token;

  const value = {
    user,
    token,
    role,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
