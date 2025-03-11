import React from 'react';
import {
  User,
  Users,
  Calendar,
  MessageSquare,
  Settings,
  Crown,
  CreditCard,
  UserCircle,
  PlusCircle,
  Share2,
  Building2,
  Bell,
  Search,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Sparkles,
  UserRoundPlusIcon, Edit, Home, Target, Star, CheckCircle
} from 'lucide-react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { NotificationProvider } from '../components/Notifications/NotificationProvider';
import { ProfileCompletionAlert } from '../components/ProfileCompletionAlert';
import { NotificationBell } from '../components/Notifications/NotificationBell';
import { authService } from '../services/authService.ts';
import { Campaigns } from './dashboard/Campaigns';
import { Schedule } from './dashboard/Schedule';
import { Profile } from './dashboard/Profile';
import { Messages } from './dashboard/Messages';
import { Settings as SettingsPage } from './dashboard/Settings';
import { NewCampaign } from './dashboard/NewCampaign';
import { Plan } from './dashboard/Plan';
import { Payments } from './dashboard/Payments';
import { SocialNetworks } from './dashboard/SocialNetworks';
import { InfluencerList } from './dashboard/InfluencerList';
import logoRetangulo from '@/assets/logo_retangulo_light.svg';
import logoLetter from '@/assets/logo_letter_light.svg';
import {Notifications} from "./dashboard/Notifications.tsx";
import {CompleteProfile} from "./dashboard/CompleteProfile.tsx";

export function WebSite() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(authService.isAuthenticated());
  const [user] = React.useState<ReturnType<typeof authService.getUser>>(authService.getUser());
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);
  const mobileMenuRef = React.useRef<HTMLDivElement>(null);
  const [selectedInfluencerId, setSelectedInfluencerId] = React.useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = React.useState<Array<{name: string; path: string}>>([]);
  const [activeRoute, setActiveRoute] = React.useState('');
  const [showProfileAlert, setShowProfileAlert] = React.useState(true);

  // Update breadcrumbs when location changes
  React.useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const newBreadcrumbs = pathSegments.map((segment, index) => ({
      name: segment.charAt(0).toUpperCase() + segment.slice(1),
      path: '/' + pathSegments.slice(0, index + 1).join('/')
    }));
    setBreadcrumbs(newBreadcrumbs);
    setActiveRoute(pathSegments[pathSegments.length - 1] || 'dashboard/profile');
  }, [location]);
  const [selectedCampaignId, setSelectedCampaignId] = React.useState<number | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleSelectCampaign = (id: number) => {
    setSelectedCampaignId(id);
    navigate(`/dashboard/campaign/${id}`);
  };

  const handleViewProfile = (id: string) => {
    setSelectedInfluencerId(id);
    navigate(`/dashboard/influencer/${id}`);
  };

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setShowUserMenu(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setShowMobileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigationItems = [
    { name: 'Minha Página', icon: Home, path: 'profile' },
    { name: 'Campanhas', icon: Target, path: 'campaigns' },
    { name: 'Redes Sociais', icon: Share2, path: 'social-networks' },
    { name: 'Influencers', icon: Users, path: 'influencers' },
    { name: 'Pagamentos', icon: CreditCard, path: 'payments' },
    { name: 'Meu Plano', icon: Crown, path: 'plan' },
    ...(user?.completeRegistration
        ? [{ name: 'Configurações', icon: Settings, path: 'settings' }]
        : []),
    ...(!user?.completeRegistration
        ? [{ name: 'Completar Cadastro', icon: CheckCircle, path: 'complete-profile' }]
        : []),
  ];

  return (
      <div className="h-screen flex overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative">
        <NotificationProvider>
          {/* Profile Completion Alert */}
          {showProfileAlert && (
              <div className="fixed inset-0 z-[100]">
                <ProfileCompletionAlert
                    onClose={() => setShowProfileAlert(false)}
                    className="z-[100]" // Adicione esta prop se necessário
                />
              </div>
          )}

          {/* Decorative Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-20 blur-[100px]" />
            <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full opacity-20 blur-[100px]" />
            <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full opacity-20 blur-[100px]" />
          </div>

          {/* Top Bar */}
          <div className="fixed top-0 right-0 left-0 lg:left-80 h-16 bg-white/80 backdrop-blur-sm border-b border-gray-100/80 z-50 flex items-center px-4 lg:px-8 shadow-sm">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 transition-colors duration-200 min-h-[44px] min-w-[44px]"
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center ml-3 mr-auto">
              <div className="flex items-center space-x-3">
              </div>
            </div>

            {/* Mobile Search Toggle */}
            <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-auto hidden lg:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                </div>
              </div>
            </form>

            <div className="ml-4 flex items-center space-x-4">
              <NotificationBell />

              <div className="relative inline-block text-left" ref={userMenuRef}>
                <div>
                  <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="group flex items-center space-x-3 p-1.5 rounded-lg hover:bg-gray-100/80 transition-all duration-200 min-h-[44px] min-w-[44px] relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/30 to-blue-50/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <div className="relative">
                      <img
                          className="h-8 w-8 rounded-full ring-2 ring-white shadow-sm group-hover:ring-blue-200 transition-all duration-200"
                          src={user?.imageUrl ?? 'https://firebasestorage.googleapis.com/v0/b/sou-influencer.firebasestorage.app/o/logo_retangular.png?alt=media&token=c62a5fbf-0d39-49fd-8f8f-52df3dce9bf6'}
                          alt={user?.firstName ?? ''}
                      />
                      <div className="absolute -bottom-1 -right-1">
                        <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-green-500 ring-2 ring-white" />
                      </div>
                    </div>
                    <div className="hidden md:flex md:items-center">
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">{user?.firstName ?? ''}</span>
                      <ChevronDown className={`ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                </div>

                {/* User Menu Dropdown */}
                {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-64 rounded-xl bg-white shadow-xl ring-1 ring-black/5 focus:outline-none z-50 animate-in slide-in-from-top-1 duration-100 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100/80">
                        <div className="flex items-center space-x-3">
                          <img
                              src={user?.imageUrl ?? 'https://firebasestorage.googleapis.com/v0/b/sou-influencer.firebasestorage.app/o/logo_retangular.png?alt=media&token=c62a5fbf-0d39-49fd-8f8f-52df3dce9bf6'}
                              alt={user?.firstName ?? ''}
                              className="h-10 w-10 rounded-full ring-2 ring-white shadow-sm"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.firstName ?? ''}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email ?? ''}</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-2">
                        <button
                            onClick={() => navigate('/dashboard/profile')}
                            className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 group relative"
                        >
                          <User className="h-4 w-4 mr-3 text-gray-400" />
                          <span className="flex-1">Perfil</span>
                          <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-200" />
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/30 to-blue-50/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        </button>
                        <button
                            onClick={() => navigate('/dashboard/settings')}
                            className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 group relative"
                        >
                          <Settings className="h-4 w-4 mr-3 text-gray-400" />
                          <span className="flex-1">Configurações</span>
                          <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-200" />
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/30 to-blue-50/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        </button>
                      </div>
                      <div className="border-t border-gray-100">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 group relative"
                        >
                          <LogOut className="h-4 w-4 mr-3 text-red-500" />
                          <span className="flex-1">Sair</span>
                          <ChevronRight className="h-4 w-4 text-red-400 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-200" />
                          <div className="absolute inset-0 bg-gradient-to-r from-red-50/0 via-red-50/30 to-red-50/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        </button>
                      </div>
                    </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Sidebar */}
          <div
              ref={mobileMenuRef}
              className={`lg:hidden fixed inset-0 z-[60] transform transition-all duration-300 ease-in-out ${
                  showMobileMenu ? 'translate-x-0' : '-translate-x-full'
              }`}
          >
            <div
                className={`fixed inset-0 bg-gray-900/60 backdrop-blur-[3px] transition-all duration-500 ease-in-out ${
                    showMobileMenu ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={() => setShowMobileMenu(false)}
            />
            <div
                className={`relative flex flex-col w-[85%] max-w-sm h-screen bg-white/95 backdrop-blur-sm focus:outline-none shadow-2xl transform transition-all duration-500 ease-out ${
                    showMobileMenu ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                }`}
            >
              <div className="absolute top-0 right-0 -mr-12 pt-4">
                <button
                    className="ml-1 flex items-center justify-center h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    onClick={() => setShowMobileMenu(false)}
                >
                  <span className="sr-only">Fechar menu</span>
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-none overscroll-contain pt-6 pb-4 px-6">
                <div className="flex items-center space-x-3">
                  <img width={40} alt="Logo" src={logoRetangulo} />
                  <img width={150} alt="Logo" src={logoLetter} />
                </div>
                <nav className="mt-8 space-y-2.5">
                  <div className="pb-20">
                    {[
                      { name: 'Minha Página', icon: Home, path: 'profile' },
                      { name: 'Campanhas', icon: Target, path: 'campaigns' },
                      { name: 'Redes Sociais', icon: Share2, path: 'social-networks' },
                      { name: 'Influencers', icon: Users, path: 'influencers' },
                      { name: 'Pagamentos', icon: CreditCard, path: 'payments' },
                      { name: 'Meu Plano', icon: Crown, path: 'plan' },
                      ...(user?.completeRegistration
                          ? [{ name: 'Configurações', icon: Settings, path: 'settings' }]
                          : []),
                      ...(!user?.completeRegistration
                          ? [{ name: 'Completar Cadastro', icon: CheckCircle, path: 'complete-profile' }]
                          : []),
                    ].map((item) => (
                        <button
                            key={item.path}
                            onClick={() => {
                              navigate(item.path === 'new-campaign' ? '/dashboard/new-campaign' : `/dashboard/${item.path}`);
                              setShowMobileMenu(false);
                            }}
                            className={`w-full group relative overflow-hidden transform transition-all duration-200 ${
                                location.pathname.endsWith(item.path)
                                    ? 'bg-gradient-to-r from-blue-50 to-blue-50/50 text-blue-600 shadow-sm border border-blue-100/50 scale-[1.02]'
                                    : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 border border-transparent hover:border-gray-200'
                            } flex items-center px-4 py-3.5 text-sm font-medium rounded-xl hover:scale-[1.02] hover:shadow-sm active:scale-[0.98]`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/0 via-blue-100/30 to-blue-100/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                          <item.icon className="mr-3 h-5 w-5" />
                          {item.name}
                        </button>
                    ))}
                  </div>
                </nav>
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex border-t border-gray-200/80 p-6 bg-gradient-to-b from-transparent to-white/80">
                <div className="flex items-center">
                  <img
                      className="inline-block h-12 w-12 rounded-full ring-2 ring-white shadow-lg transform transition-transform duration-200 hover:scale-105"
                      src={
                          user?.imageUrl ||
                          'https://firebasestorage.googleapis.com/v0/b/sou-influencer.firebasestorage.app/o/logo_retangular.png?alt=media&token=c62a5fbf-0d39-49fd-8f8f-52df3dce9bf6'
                      }
                      alt=""
                  />
                  <div className="ml-4">
                    <p className="text-base font-medium text-gray-700">{user?.firstName || ''}</p>
                    <button
                        onClick={handleLogout}
                        className="mt-1 text-sm font-medium text-red-600 hover:text-red-700 group flex items-center px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all duration-200 active:scale-95"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                      <ChevronRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="hidden lg:flex lg:flex-shrink-0">
            {/* Sidebar */}
            <div className="flex flex-col w-80 bg-white/95 backdrop-blur-sm border-r border-gray-100/80 shadow-lg">
              <div className="flex flex-col flex-grow pt-8 pb-4 overflow-y-auto">
                <div className="flex items-center flex-shrink-0 px-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center space-x-3">
                      <img width={40} alt="Logo" src={logoRetangulo}/>
                      <img width={150} alt="Logo" src={logoLetter}/>
                    </div>
                  </div>
                </div>
                <div className="mt-10 flex-grow flex flex-col">
                  <div className="px-6 mb-8">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-full" src={user?.imageUrl || 'https://firebasestorage.googleapis.com/v0/b/sou-influencer.firebasestorage.app/o/logo_retangular.png?alt=media&token=c62a5fbf-0d39-49fd-8f8f-52df3dce9bf6'} alt=""/>
                      <div className="ml-3">
                        <button
                            onClick={() => navigate('profile')}
                            className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200 focus:outline-none group"
                        >
                          {user?.firstName || 'Usuário'}
                          <div className="h-0.5 w-0 bg-blue-600 group-hover:w-full transition-all duration-200"></div>
                        </button>
                        <p className="text-xs text-gray-500 mt-0.5">Influenciador</p>
                      </div>
                    </div>
                  </div>
                  <nav className="flex-1 px-4 space-y-2">
                    <button
                        onClick={() => navigate('profile')}
                        className={`w-full text-left ${
                            location.pathname.includes('profile') || location.pathname === '/dashboard/'
                                ? 'bg-gradient-to-r from-blue-50 to-blue-50/50 text-blue-600 shadow-sm border border-blue-100/50 scale-[1.02]'
                                : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 border border-transparent hover:border-gray-200'
                        } group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-sm relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/0 via-blue-100/30 to-blue-100/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      <Home className="mr-3 flex-shrink-0 h-5 w-5" />
                      Minha Página
                    </button>
                    {navigationItems.slice(1).map((item) => (
                        <button
                            key={item.path}
                            onClick={() => navigate(`/dashboard/${item.path}`)}
                            className={`w-full text-left ${
                                location.pathname.includes(item.path)
                                    ? 'bg-gradient-to-r from-blue-50 to-blue-50/50 text-blue-600 shadow-sm border border-blue-100/50 scale-[1.02]'
                                    : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 border border-transparent hover:border-gray-200'
                            } group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-sm relative overflow-hidden`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/0 via-blue-100/30 to-blue-100/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                          <item.icon className="mr-3 flex-shrink-0 h-5 w-5" />
                          {item.name}
                        </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden pt-16 relative w-full">
            <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
              {/* Breadcrumbs */}
              {breadcrumbs.length > 0 && (
                  <nav className="bg-white/50 backdrop-blur-sm border-b border-gray-100/80 px-4 sm:px-6 lg:px-8 py-3">
                    <ol className="flex items-center space-x-4">
                      {breadcrumbs.map((item, index) => (
                          <li key={item.path} className="flex items-center">
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                            <button
                                onClick={() => navigate(item.path)}
                                className={`ml-4 ${
                                    index === breadcrumbs.length - 1
                                        ? 'text-blue-600 font-medium'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                              {item.name}
                            </button>
                          </li>
                      ))}
                    </ol>
                  </nav>
              )}

              <Routes>
                <Route path="complete-profile" element={<CompleteProfile/>} />
                <Route path="complete-profile" element={<CompleteProfile/>} />
                <Route path="notifications" element={<Notifications/>} />
                <Route path="social-networks/:id/metrics" element={<NewCampaign onBack={() => navigate('/dashboard/profile')} />} />
                <Route path="campaign/:id" element={<Campaigns onSelectCampaign={handleSelectCampaign} />} />
                <Route path="campaigns" element={<Campaigns onSelectCampaign={handleSelectCampaign} />} />
                <Route path="new-campaign" element={<NewCampaign onBack={() => navigate('/dashboard/campaigns')} />} />
                <Route path="schedule" element={<Schedule onSelectCampaign={handleSelectCampaign} />} />
                <Route path="messages" element={<Messages />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="plan" element={<Plan />} />
                <Route path="social-networks" element={<SocialNetworks />} />
                <Route path="payments" element={<Payments />} />
                <Route path="influencers" element={<InfluencerList onViewProfile={handleViewProfile} />} />
                <Route path="profile" element={<Profile />} />
                <Route path="/" element={<Profile />} />
                <Route path="/dashboard" element={<Profile />} />
              </Routes>
            </main>
          </div>
        </NotificationProvider>
      </div>
  );
}