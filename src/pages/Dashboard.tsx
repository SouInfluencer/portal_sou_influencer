import React from 'react';
import { BarChart3, Users, Calendar, MessageSquare, Settings, Crown, CreditCard, UserCircle, PlusCircle, Share2, Building2, Bell, Search, ChevronDown, LogOut, Menu, X, Sparkles } from 'lucide-react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/auth';
import { Campaigns } from './dashboard/Campaigns';
import { Schedule } from './dashboard/Schedule';
import { Profile } from './dashboard/Profile';
import { Messages } from './dashboard/Messages';
import { Settings as SettingsPage } from './dashboard/Settings';
import { CampaignDetails } from './dashboard/CampaignDetails';
import { NewCampaign } from './dashboard/NewCampaign';
import { Plan } from './dashboard/Plan';
import { Payments } from './dashboard/Payments';
import { SocialNetworks } from './dashboard/SocialNetworks';
import { InfluencerList } from './dashboard/InfluencerList'; 

export function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCampaignId, setSelectedCampaignId] = React.useState<number | null>(null);
  const [selectedInfluencerId, setSelectedInfluencerId] = React.useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSelectCampaign = (id: number) => {
    setSelectedCampaignId(id);
    navigate('campaigns');
  };
  
  const handleViewProfile = (id: string) => {
    setSelectedInfluencerId(id);
    navigate('profile');
  };
  
  const handleNewCampaign = () => {
    navigate('new-campaign');
  };
  
  const user = {
    name: 'João Silva',
    email: 'joao@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  };
  
  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 relative">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-200 to-indigo-300 rounded-full opacity-20 blur-[100px]" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full opacity-20 blur-[100px]" />
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full opacity-20 blur-[100px]" />
      </div>

      {/* Top Bar */}
      <div className="fixed top-0 right-0 left-80 h-16 bg-white/80 backdrop-blur-sm border-b border-gray-100/80 z-50 flex items-center px-8 shadow-sm">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100/80"
        >
          {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <div className="flex-1 flex items-center">
          <div className="max-w-lg w-full lg:max-w-xs relative">
          </div>
        </div>
        <div className="ml-4 flex items-center space-x-4">
          <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-lg transition-all duration-200">
            <span className="sr-only">Ver notificações</span>
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
          </button>
          
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-1.5 rounded-lg hover:bg-gray-100/80 transition-all duration-200"
            >
              <img
                className="h-8 w-8 rounded-full ring-2 ring-white shadow-sm"
                src={user.imageUrl}
                alt=""
              />
              <div className="hidden md:flex md:items-center">
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{user.name}</span>
                <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
              </div>
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Seu Perfil</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Configurações</a>
                <div className="border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:flex-shrink-0">
        {/* Sidebar */}
        <div className="flex flex-col w-80 bg-white/90 backdrop-blur-sm border-r border-gray-100/80 shadow-lg">
          <div className="flex flex-col flex-grow pt-8 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-200 group">
                  <Building2 className="h-6 w-6 text-white" />
                  <Sparkles className="absolute h-3 w-3 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-700">
                  Sou Influencer
                </span>
              </div>
            </div>
            <div className="mt-10 flex-grow flex flex-col">
              <div className="px-6 mb-8">
                <div className="flex items-center">
                  <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                  <div className="ml-3">
                    <button
                      onClick={() => navigate('profile')}
                      className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors duration-200 focus:outline-none"
                    >
                      {user.name}
                    </button>
                    <p className="text-xs text-gray-500 mt-0.5">Influenciador</p>
                  </div>
                </div>
              </div>
              <nav className="flex-1 px-4 space-y-2">
                  <button
                    onClick={() => navigate('profile')}
                    className={`w-full text-left ${
                      location.pathname.endsWith('profile') || location.pathname === '/dashboard/'
                        ? 'bg-gradient-to-r from-indigo-50 to-indigo-50/50 text-indigo-600 shadow-sm border border-indigo-100/50 scale-[1.02]'
                        : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 border border-transparent hover:border-gray-200'
                    } group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-sm`}
                  >
                    <UserCircle className="mr-3 flex-shrink-0 h-5 w-5" />
                    Minha Página
                  </button>
                  <button
                    onClick={() => navigate('campaigns')}
                    className={`w-full text-left ${
                      location.pathname.endsWith('campaigns')
                        ? 'bg-gradient-to-r from-indigo-50 to-indigo-50/50 text-indigo-600 shadow-sm scale-[1.02]'
                        : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 hover:border-gray-200'
                    } group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-sm border border-transparent`}
                  >
                    <Users className="mr-3 flex-shrink-0 h-5 w-5" />
                    Campanhas
                  </button>
                  <button
                    onClick={() => navigate('new-campaign')}
                    className={`w-full text-left ${
                      location.pathname.endsWith('new-campaign')
                        ? 'bg-gradient-to-r from-indigo-50 to-indigo-50/50 text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900'
                    } group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02]`}
                  >
                    <PlusCircle className="mr-3 flex-shrink-0 h-5 w-5" />
                    Nova Campanha
                  </button>
                  <button
                    onClick={() => navigate('schedule')}
                    className={`w-full text-left ${
                      location.pathname.endsWith('schedule')
                        ? 'bg-gradient-to-r from-indigo-50 to-indigo-50/50 text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900'
                    } group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02]`}
                  >
                    <Calendar className="mr-3 flex-shrink-0 h-5 w-5" />
                    Agenda
                  </button>
                  <button
                    onClick={() => navigate('messages')}
                    className={`w-full text-left ${
                      location.pathname.endsWith('messages')
                        ? 'bg-gradient-to-r from-indigo-50 to-indigo-50/50 text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900'
                    } group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02]`}
                  >
                    <MessageSquare className="mr-3 flex-shrink-0 h-5 w-5" />
                    Mensagens
                  </button>
                  <button
                    onClick={() => navigate('payments')}
                    className={`w-full text-left ${
                      location.pathname.endsWith('payments')
                        ? 'bg-gradient-to-r from-indigo-50 to-indigo-50/50 text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900'
                    } group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02]`}
                  >
                    <CreditCard className="mr-3 flex-shrink-0 h-5 w-5" />
                    Pagamentos
                  </button>
                  <button
                    onClick={() => navigate('social-networks')}
                    className={`w-full text-left ${
                      location.pathname.endsWith('social-networks')
                        ? 'bg-gradient-to-r from-indigo-50 to-indigo-50/50 text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900'
                    } group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02]`}
                  >
                    <Share2 className="mr-3 flex-shrink-0 h-5 w-5" />
                    Redes Sociais
                  </button>
                  <button
                    onClick={() => navigate('influencers')}
                    className={`w-full text-left ${
                      location.pathname.endsWith('influencers')
                        ? 'bg-gradient-to-r from-indigo-50 to-indigo-50/50 text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900'
                    } group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02]`}
                  >
                    <Users className="mr-3 flex-shrink-0 h-5 w-5" />
                    Influenciadores
                  </button>
                  <button
                    onClick={() => navigate('plan')}
                    className={`w-full text-left ${
                      location.pathname.endsWith('plan')
                        ? 'bg-gradient-to-r from-indigo-50 to-indigo-50/50 text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900'
                    } group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02]`}
                  >
                    <Crown className="mr-3 flex-shrink-0 h-5 w-5" />
                    Meu Plano
                  </button>
                  <button
                    onClick={() => navigate('settings')}
                    className={`w-full text-left ${
                      location.pathname.endsWith('settings')
                        ? 'bg-gradient-to-r from-indigo-50 to-indigo-50/50 text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900'
                    } group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02]`}
                  >
                    <Settings className="mr-3 flex-shrink-0 h-5 w-5" />
                    Configurações
                  </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden pt-16">
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
          <Routes>
            <Route path="campaigns" element={<Campaigns onSelectCampaign={handleSelectCampaign} />} />
            <Route path="new-campaign" element={<NewCampaign onBack={() => navigate('campaigns')} />} />
            <Route path="schedule" element={<Schedule onSelectCampaign={handleSelectCampaign} />} />
            <Route path="messages" element={<Messages />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="plan" element={<Plan />} />
            <Route path="social-networks" element={<SocialNetworks />} />
            <Route path="payments" element={<Payments />} />
            <Route path="influencers" element={<InfluencerList onViewProfile={handleViewProfile} />} />
            <Route path="profile" element={<Profile />} />
            <Route path="/" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}