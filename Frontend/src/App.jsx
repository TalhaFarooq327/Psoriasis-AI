import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

/* Shared */
import Navbar from './components/Navbar';
import Footer from './components/Footer';

/* Landing page sections */
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import QuickInsight from './components/QuickInsight';
import EarlyDetection from './components/EarlyDetection';
import Reviews from './components/Reviews';
import AIDermatologist from './components/AIDermatologist';
import Statistics from './components/Statistics';
import FAQs from './components/FAQs';

/* Auth pages */
import Login from './pages/Login';
import Register from './pages/Register';

/* Analysis workflow */
import SkinAnalysis from './pages/SkinAnalysis';

/* User dashboard pages */
import UserDashboard from './pages/user/UserDashboard';
import AnalysisHistory from './pages/user/AnalysisHistory';
import DoctorReviews from './pages/user/DoctorReviews';
import UserProfile from './pages/user/UserProfile';

/* Doctor dashboard pages */
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import Patients from './pages/doctor/Patients';
import PendingReviews from './pages/doctor/PendingReviews';
import ReviewDetail from './pages/doctor/ReviewDetail';
import ReviewHistory from './pages/doctor/ReviewHistory';
import DoctorProfile from './pages/doctor/DoctorProfile';

import './App.css';

/* ── Landing page ── */
const LandingPage = () => (
  <main>
    <Hero />
    <HowItWorks />
    <AIDermatologist />
    <QuickInsight />
    <EarlyDetection />
    <Reviews />
    <Statistics />
    <FAQs />
  </main>
);

/* ── Protected route — redirect to login if not authenticated ── */
const ProtectedRoute = ({ children, requireRole }) => {
  const { isAuthenticated, isDoctor, isUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole === 'doctor' && !isDoctor) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireRole === 'user' && !isUser) {
    return <Navigate to="/doctor/dashboard" replace />;
  }

  return children;
};

/* ── Smart /dashboard redirect: user → /dashboard, doctor → /doctor/dashboard ── */
const DashboardRedirect = () => {
  const { isAuthenticated, isDoctor } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isDoctor) return <Navigate to="/doctor/dashboard" replace />;
  return <Navigate to="/dashboard" replace />;
};

function AppRoutes() {
  return (
    <>
      {/* Navbar is OUTSIDE Routes — always visible on every page */}
      <Navbar />

      <Routes>
        {/* ── Landing ── */}
        <Route path="/" element={
          <div className="app">
            <LandingPage />
            <Footer />
          </div>
        } />

        {/* ── Auth ── */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── Skin Analysis (protected) ── */}
        <Route path="/analyze" element={
          <ProtectedRoute>
            <SkinAnalysis />
          </ProtectedRoute>
        } />

        {/* ── Smart redirect from /go or old /dashboard placeholder ── */}
        <Route path="/go" element={<DashboardRedirect />} />

        {/* ════ USER DASHBOARD ROUTES ════ */}
        <Route path="/dashboard" element={
          <ProtectedRoute requireRole="user">
            <UserDashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/history" element={
          <ProtectedRoute requireRole="user">
            <AnalysisHistory />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/reviews" element={
          <ProtectedRoute requireRole="user">
            <DoctorReviews />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/profile" element={
          <ProtectedRoute requireRole="user">
            <UserProfile />
          </ProtectedRoute>
        } />

        {/* ════ DOCTOR DASHBOARD ROUTES ════ */}
        <Route path="/doctor/dashboard" element={
          <ProtectedRoute requireRole="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/doctor/patients" element={
          <ProtectedRoute requireRole="doctor">
            <Patients />
          </ProtectedRoute>
        } />
        <Route path="/doctor/pending-reviews" element={
          <ProtectedRoute requireRole="doctor">
            <PendingReviews />
          </ProtectedRoute>
        } />
        <Route path="/doctor/review/:id" element={
          <ProtectedRoute requireRole="doctor">
            <ReviewDetail />
          </ProtectedRoute>
        } />
        <Route path="/doctor/review-history" element={
          <ProtectedRoute requireRole="doctor">
            <ReviewHistory />
          </ProtectedRoute>
        } />
        <Route path="/doctor/profile" element={
          <ProtectedRoute requireRole="doctor">
            <DoctorProfile />
          </ProtectedRoute>
        } />

        {/* ── Catch-all ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
