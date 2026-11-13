import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import HomePage from './pages/HomePage';
import ExploreStallsPage from './pages/ExploreStallsPage';
import StallDetailPage from './pages/StallDetailPage';
import PaymentGuidancePage from './pages/PaymentGuidancePage';
import PaymentHelpPage from './pages/PaymentHelpPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

// Protect dashboard routes — strictly stall owners only
function PrivateRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9F7] dark:bg-[#0c130f]">
        <div className="w-8 h-8 border-2 border-[#22C55E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  // Only authenticated stall owners can access the management dashboard
  return isAuthenticated && user?.role === 'owner' ? children : <Navigate to="/dashboard/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/stalls" element={<ExploreStallsPage />} />
      <Route path="/stalls/:id" element={<StallDetailPage />} />
      <Route path="/payment-guidance" element={<PaymentGuidancePage />} />
      <Route path="/payment-help" element={<PaymentHelpPage />} />
      <Route path="/about" element={<AboutPage />} />

      {/* Auth routes */}
      <Route path="/dashboard/login" element={<LoginPage />} />
      <Route path="/dashboard/register" element={<RegisterPage />} />

      {/* Protected dashboard */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
