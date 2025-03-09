import React from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import { NotificationProvider } from './components/Notifications/NotificationProvider';
import { PWAPrompt } from './components/PWAPrompt';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { ResetPassword } from './pages/ResetPassword';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { InfluencerLanding } from './pages/InfluencerLanding';
import { AdvertiserLanding } from './pages/AdvertiserLanding';
import { NewCampaign } from './pages/dashboard/NewCampaign';
import { CampaignDetails } from './pages/dashboard/CampaignDetails';
import { LandingPage } from './pages/LandingPage';
import { SocialMetrics } from './pages/dashboard/profile/SocialMetrics';
import { Notifications } from './pages/dashboard/Notifications';
import { authService } from './services/auth';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/redefinir-senha" element={<ResetPassword />} />
        <Route path="/login" element={<Login onLogin={(view) => {
          setIsAuthenticated(authService.isAuthenticated());
          navigate(`/${view}`);
        }} />} />
        <Route path="/dashboard/*" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/campaign/:id" element={
          <ProtectedRoute>
            <CampaignDetails onBack={() => navigate('/dashboard/campaigns')} />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/notifications" element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/social-networks/:id/metrics" element={
          <ProtectedRoute>
            <SocialMetrics onBack={() => navigate('/dashboard/social-networks')} />
          </ProtectedRoute>
        } />
      </Routes>
    </div> 
    </NotificationProvider>
  );
}

export default App;