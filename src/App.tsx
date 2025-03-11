import React from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { NotificationProvider } from './components/Notifications/NotificationProvider';
import { PWAPrompt } from './components/PWAPrompt';
import { Register } from './pages/onboarding/Register.tsx';
import { ResetPassword } from './pages/onboarding/ResetPassword.tsx';
import { CompleteProfile } from './pages/dashboard/CompleteProfile.tsx';
import { ForgotPassword } from './pages/onboarding/ForgotPassword.tsx';
import { WebSite } from './pages/WebSite.tsx';
import { InfluencerLanding } from './pages/website/InfluencerLanding.tsx';
import { AdvertiserLanding } from './pages/website/AdvertiserLanding.tsx';
import { CampaignDetails } from './pages/dashboard/CampaignDetails';
import { LandingPage } from './pages/website/LandingPage.tsx';
import { SocialMetrics } from './pages/dashboard/profile/SocialMetrics';
import { Notifications } from './pages/dashboard/Notifications';
import { authService } from './services/authService.ts';
import {Login} from "./pages/onboarding/Login.tsx";
import {Terms} from "./pages/website/Terms.tsx";
import {ConfirmeEmail} from "./pages/onboarding/ConfirmeEmail.tsx";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(authService.isAuthenticated());
  
  React.useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(authService.isAuthenticated());
    };

    checkAuth();
    // Check authentication status periodically
    const interval = setInterval(checkAuth, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
      return null;
    }

    return <>{children}</>;
  };

  // If user is on root path and not authenticated, show landing page
  if (location.pathname === '/' && !isAuthenticated) {
    return <LandingPage />;
  } else if (location.pathname === '/influencer' && !isAuthenticated) {
    return <InfluencerLanding />;
  } else if (location.pathname === '/advertiser' && !isAuthenticated) {
    return <AdvertiserLanding />;
  }

  return (
    <NotificationProvider>
      <PWAPrompt />
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={
          isAuthenticated ? (
            <Navigate to="/dashboard" />
          ) : (
            <Navigate to={`/login${location.search}`} />
          )
        } />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLogin={(view) => {
          setIsAuthenticated(authService.isAuthenticated());
          navigate(`/${view}`);
        }} />} />
        <Route path="/redefinir-senha" element={<ResetPassword />} />
        <Route path="/verificar-email" element={<ConfirmeEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/dashboard/*" element={
          <ProtectedRoute>
            <WebSite />
          </ProtectedRoute>
        } />
      </Routes>
    </div> 
    </NotificationProvider>
  );
}

export default App;