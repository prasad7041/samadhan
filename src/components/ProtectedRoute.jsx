import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — Wraps routes that require authentication.
 *
 * @param {React.ReactNode} children - The protected component
 * @param {string[]} allowedRoles - Roles permitted to access (e.g., ['citizen'])
 */
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, role, loading } = useAuth();

  // Still restoring session from localStorage
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but wrong role → redirect to their own dashboard
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    const dashboardMap = {
      citizen: '/citizenDashboard',
      authority: '/authority/dashboard',
      admin: '/admin',
    };
    return <Navigate to={dashboardMap[role] || '/login'} replace />;
  }

  return children;
}
