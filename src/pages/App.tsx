import React from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { NotificationProvider } from './dashboard/Notifications/NotificationProvider.tsx';
import { Register } from './onboarding/Register.tsx';
import { ResetPassword } from './onboarding/ResetPassword.tsx';
import { ForgotPassword } from './onboarding/ForgotPassword.tsx';
import { WebSite } from './website/WebSite.tsx';
import { authService } from '../services/authService.ts';
import {Login} from "./onboarding/Login.tsx";
import {Terms} from "./website/Terms.tsx";
import {ConfirmeEmail} from "./onboarding/ConfirmeEmail.tsx";
import InfluencerLanding from "./website/landing-page/InfluencerLanding.tsx";
import LandingPage from "./website/landing-page/LandingPage.tsx";
import AdvertiserLanding from "./website/landing-page/AdvertiserLanding.tsx";
import {About} from "./website/About.tsx";
import {Privacy} from "./website/Privacy.tsx";
import {Contact} from "./website/Contact.tsx";

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
      {/*<PWAPrompt />*/}
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
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contact" element={<Contact />} />
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