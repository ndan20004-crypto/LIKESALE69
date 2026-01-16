import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { SiteContentProvider } from './contexts/SiteContentContext';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import LandingPage from './components/LandingPage';

function App() {
  // Persist app auth so Admin can access /admin even after refresh.
  // (Previously App state reset => Admin couldn't open upload QR page.)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return (
      localStorage.getItem('app_isAuthenticated') === 'true' ||
      localStorage.getItem('isAuthenticated') === 'true'
    );
  });
  const [isAdmin, setIsAdmin] = useState(() => {
    const app = localStorage.getItem('app_isAdmin') === 'true';
    if (app) return true;
    try {
      const raw = localStorage.getItem('userData');
      if (!raw) return false;
      const u = JSON.parse(raw);
      return String(u?.role || '').toLowerCase() === 'admin';
    } catch {
      return false;
    }
  });

  const handleLogin = (asAdmin = false) => {
    setIsAuthenticated(true);
    setIsAdmin(asAdmin);

    // Persist for refresh / direct navigation.
    localStorage.setItem('app_isAuthenticated', 'true');
    localStorage.setItem('app_isAdmin', asAdmin ? 'true' : 'false');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);

    localStorage.removeItem('app_isAuthenticated');
    localStorage.removeItem('app_isAdmin');
  };

  return (
    <DataProvider>
      <AuthProvider>
        <SiteContentProvider>
          <Router>
            <Routes>
            <Route 
              path="/" 
              element={
                isAuthenticated ? (
                  isAdmin ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />
                ) : (
                  <LandingPageWrapper />
                )
              } 
            />
            <Route 
              path="/login" 
              element={
                isAuthenticated ? (
                  isAdmin ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              } 
            />
            <Route 
              path="/register" 
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} 
            />
            <Route 
              path="/forgot-password" 
              element={<ForgotPassword />} 
            />
            <Route 
              path="/dashboard/*" 
              element={
                isAuthenticated && !isAdmin ? (
                  <Dashboard onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />
            <Route 
              path="/admin/*" 
              element={
                isAuthenticated && isAdmin ? (
                  <AdminDashboard onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />
            </Routes>
          </Router>
        </SiteContentProvider>
      </AuthProvider>
    </DataProvider>
  );
}

function LandingPageWrapper() {
  const navigate = useNavigate();

  return (
    <LandingPage
      onNavigateToLogin={() => navigate('/login')}
      onNavigateToRegister={() => navigate('/register')}
    />
  );
}

export default App;