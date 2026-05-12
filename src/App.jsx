import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Auth
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './LandingPage';
import Authentication from './Authentication';

// Citizen Portal
import CitizenDashboard from './citizen/CitizenDashboard';
import RaiseComplaint from './citizen/RaiseComplaint';
import CitizenProfile from './citizen/CitizenProfile';
import MyReports from './citizen/MyReports';
import NearbyIssues from './citizen/NearbyIssues';
import ResolvedIssues from './citizen/ResolvedIssues';
import Rewards from './citizen/Rewards';

// Authority Portal
import AuthorityDashboard from './authority/AuthorityDashboard';
import AssignedTasks from './authority/AssignedTasks';
import AuthorityProfile from './authority/AuthorityProfile';
import AuthorityPerformance from './authority/Performance';

// Admin Portal
import AdminDashboard from './admin/AdminDashboard';
import AuditLogs from './admin/AuditLogs';
import DepartmentOversight from './admin/DepartmentOversight';
import UserManagement from './admin/UserManagement';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="antialiased text-slate-900 bg-slate-50 selection:bg-indigo-100 selection:text-indigo-700">
          <AnimatePresence mode="wait">
            <Routes>
              {/* ═══ Public Routes ═══ */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Authentication />} />

              {/* ═══ Citizen Routes ═══ */}
              <Route path="/citizenDashboard" element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <CitizenDashboard />
                </ProtectedRoute>
              } />
              <Route path="/citizen/raise" element={
                // <ProtectedRoute allowedRoles={['citizen']}>
                <RaiseComplaint />
                // </ProtectedRoute>
              } />
              <Route path="/citizen/profile" element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <CitizenProfile />
                </ProtectedRoute>
              } />
              <Route path="/citizen/myreports" element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <MyReports />
                </ProtectedRoute>
              } />
              <Route path="/citizen/nearbyissues" element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <NearbyIssues />
                </ProtectedRoute>
              } />
              <Route path="/citizen/resolvedissues" element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <ResolvedIssues />
                </ProtectedRoute>
              } />
              <Route path="/citizen/rewards" element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <Rewards />
                </ProtectedRoute>
              } />

              {/* ═══ Authority Routes ═══ */}
              <Route path="/authority" element={
                <ProtectedRoute allowedRoles={['authority']}>
                  <AuthorityDashboard />
                </ProtectedRoute>
              } />
              <Route path="/authority/dashboard" element={
                <ProtectedRoute allowedRoles={['authority']}>
                  <AuthorityDashboard />
                </ProtectedRoute>
              } />
              <Route path="/authority/tasks" element={
                <ProtectedRoute allowedRoles={['authority']}>
                  <AssignedTasks />
                </ProtectedRoute>
              } />
              <Route path="/authority/performance" element={
                <ProtectedRoute allowedRoles={['authority']}>
                  <AuthorityPerformance />
                </ProtectedRoute>
              } />
              <Route path="/authority/profile" element={
                <ProtectedRoute allowedRoles={['authority']}>
                  <AuthorityProfile />
                </ProtectedRoute>
              } />

              {/* ═══ Admin Routes ═══ */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/auditlogs" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AuditLogs />
                </ProtectedRoute>
              } />
              <Route path="/admin/departmentoversight" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DepartmentOversight />
                </ProtectedRoute>
              } />
              <Route path="/admin/usermanagement" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserManagement />
                </ProtectedRoute>
              } />
            </Routes>
          </AnimatePresence>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;