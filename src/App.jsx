import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Import Landing & Login (assuming they are in your components folder)
import LandingPage from './LandingPage';
import Authentication from './Authentication';

// Citizen Portal Components (from your citizen folder)
import CitizenDashboard from './citizen/CitizenDashboard';
import RaiseComplaint from './citizen/RaiseComplaint'; 
import CitizenProfile from './citizen/CitizenProfile';
import MyReports from './citizen/MyReports';
import NearbyIssues from './citizen/NearbyIssues';
import ResolvedIssues from './citizen/ResolvedIssues';
import Rewards from './citizen/Rewards'; 


//authority
import AuthorityDashboard from './authority/AuthorityDashboard';
import AssignedTasks from './authority/AssignedTasks';
import AuthorityProfile from './authority/AuthorityProfile';
import AuthorityPerformance from './authority/Performance';
//admin
import AdminDashboard from './admin/AdminDashboard';  
import AuditLogs from './admin/AuditLogs';  
import DepartmentOversight from './admin/DepartmentOversight';  
import UserManagement from './admin/UserManagement';  


         

function App() {
  return (
    <Router>
      <div className="antialiased text-slate-900 bg-slate-50 selection:bg-indigo-100 selection:text-indigo-700">
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Authentication />} />

            {/* Citizen Portal Routes */}
            <Route path="/citizenDashboard" element={<CitizenDashboard />} />
            <Route path="/citizen/raise" element={<RaiseComplaint />} />
            {/* citizen navigation*/}
            <Route path="/citizen/profile" element={<CitizenProfile />} />
            <Route path="/citizen/myreports" element={<MyReports />} />
            <Route path="/citizen/nearbyissues" element={<NearbyIssues />} />
            <Route path="/citizen/resolvedissues" element={<ResolvedIssues />} />
            <Route path="/citizen/rewards" element={<Rewards />} />
            { /* authority */}
            <Route path="/authority" element={<AuthorityDashboard />} />
            {/* Authority Routes */}

            <Route path="/authority/dashboard" element={<AuthorityDashboard />} />
            <Route path="/authority/tasks" element={<AssignedTasks />} />
            <Route path="/authority/performance" element={<AuthorityPerformance />} />
            <Route path="/authority/profile" element={<AuthorityProfile />} />

            {/* Admin Routes  */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/auditlogs" element={<AuditLogs />} />
            <Route path="/admin/departmentoversight" element={<DepartmentOversight />} />
            <Route path="/admin/usermanagement" element={<UserManagement />} />

          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;