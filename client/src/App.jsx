import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { JobsList } from './pages/JobsList';
import { CreateJob } from './pages/CreateJob';
import { JobDetails } from './pages/JobDetails';
import { CandidatesList } from './pages/CandidatesList';
import { CandidateProfile } from './pages/CandidateProfile';
import { CompareCandidates } from './pages/CompareCandidates';
import { InterviewPrep } from './pages/InterviewPrep';
import { AdminPanel } from './pages/AdminPanel';
import { Profile } from './pages/Profile';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Application Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <JobsList />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs/create"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CreateJob />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <JobDetails />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/candidates"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CandidatesList />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/candidates/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CandidateProfile />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/candidates/compare"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CompareCandidates />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/interview/:candidateId"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <InterviewPrep />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Profile />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <MainLayout>
                  <AdminPanel />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
