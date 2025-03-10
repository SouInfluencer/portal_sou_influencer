export function Dashboard() {
   const navigate = useNavigate();
   const location = useLocation();
   const [searchParams] = useSearchParams();
   const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(authService.isAuthenticated());
   const [showUserMenu, setShowUserMenu] = React.useState(false);
   const [showMobileMenu, setShowMobileMenu] = React.useState(false);
   const userMenuRef = React.useRef<HTMLDivElement>(null);
   const [activeMenuItem, setActiveMenuItem] = React.useState('profile');
 
   const handleLogout = () => {
     authService.logout();
     navigate('/login');
   };
 
   React.useEffect(() => {
     // Set active menu item based on current path
     const path = location.pathname.split('/').pop() || 'profile';
     setActiveMenuItem(path);
   }, [location]);

   React.useEffect(() => {
     function handleClickOutside(event: MouseEvent) {
       if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
         setShowUserMenu(false);
       }
     }
     document.addEventListener('mousedown', handleClickOutside);
     return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);
 
   const user = {
     name: 'João Silva',
     email: 'joao@example.com',
     imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
   };
   
   return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
       {/* Background Decorative Elements */}
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute -top-40 -right-40 w-[30rem] h-[30rem] bg-gradient-to-br from-blue-200/40 to-blue-300/40 rounded-full opacity-20 blur-[120px] animate-pulse" />
         <div className="absolute top-1/2 -left-40 w-[35rem] h-[35rem] bg-gradient-to-br from-purple-200/40 to-purple-300/40 rounded-full opacity-20 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
         <div className="absolute -bottom-40 right-1/3 w-[28rem] h-[28rem] bg-gradient-to-br from-pink-200/40 to-pink-300/40 rounded-full opacity-20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
       </div>

       {/* Top Bar */}
      <div className="fixed top-0 right-0 left-0 lg:left-80 h-16 bg-white/90 backdrop-blur-sm border-b border-gray-100/80 z-50 flex items-center px-4 lg:px-8 shadow-sm">
         {/* Mobile Menu Button */}
         <button
           onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
         >
           {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
         </button>

        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center ml-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md">
            <Building2 className="h-5 w-5 text-white" />
          </div>
        </div>

         <div className="flex-1 flex items-center">
           <div className="max-w-lg w-full lg:max-w-xs relative">
           </div>
         </div>
        <div className="ml-4 flex items-center space-x-2 sm:space-x-4">
           <NotificationBell />
           
           <div className="relative" ref={userMenuRef}>
             <button
               onClick={() => setShowUserMenu(!showUserMenu)}
               className="flex items-center space-x-3 p-1.5 rounded-lg hover:bg-gray-100/80 transition-all duration-200 group"
             >
               <img
                 className="h-9 w-9 rounded-full ring-2 ring-white shadow-sm group-hover:ring-blue-200 transition-all duration-200"
                 src={user.imageUrl}
                 alt=""
               />
               <div className="hidden md:flex md:items-center">
                 <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">{user.name}</span>
                 <ChevronDown className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
               </div>
             </button>

             {/* User Menu Dropdown */}
             {showUserMenu && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-56 rounded-xl bg-white py-1 shadow-xl ring-1 ring-black/5 focus:outline-none transform opacity-0 scale-95 animate-in slide-in-from-top-1 duration-100">
                 <div className="px-4 py-3 border-b border-gray-100">
                   <p className="text-sm font-medium text-gray-900">{user.name}</p>
                   <p className="text-xs text-gray-500 truncate">{user.email}</p>
                 </div>
                 <a href="#" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                   <div className="flex items-center">
                     <User className="h-4 w-4 mr-3 text-gray-400" />
                     Seu Perfil
                   </div>
                 </a>
                 <a href="#" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                   <div className="flex items-center">
                     <Settings className="h-4 w-4 mr-3 text-gray-400" />
                     Configurações
                   </div>
                 </a>
                 <div className="border-t border-gray-100">
                   <button
                     onClick={handleLogout}
                     className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                   >
                     <div className="flex items-center">
                       <LogOut className="h-4 w-4 mr-3 text-red-500" />
                       Sair
                     </div>
                   </button>
                 </div>
               </div>
             )}
           </div>
         </div>
       </div>

      {/* Mobile Sidebar */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true" onClick={() => setShowMobileMenu(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white focus:outline-none">
            <div className="absolute top-0 right-0 -mr-12 pt-4">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setShowMobileMenu(false)}
              >
                <span className="sr-only">Fechar menu</span>
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700">
                    Sou Influencer
                  </span>
                </div>
              </div>
              <nav className="mt-8 space-y-2 px-4">
                {[
                  { name: 'Minha Página', icon: UserCircle, path: 'profile' },
                  { name: 'Campanhas', icon: Users, path: 'campaigns' },
                  { name: 'Redes Sociais', icon: Share2, path: 'social-networks' },
                  { name: 'Nova Campanha', icon: PlusCircle, path: 'new-campaign' },
                  { name: 'Agenda', icon: Calendar, path: 'schedule' },
                  { name: 'Mensagens', icon: MessageSquare, path: 'messages' },
                  { name: 'Pagamentos', icon: CreditCard, path: 'payments' },
                  { name: 'Meu Plano', icon: Crown, path: 'plan' },
                  { name: 'Configurações', icon: Settings, path: 'settings' }
                ].map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(`/dashboard/${item.path}`);
                      setActiveMenuItem(item.path);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full ${
                      activeMenuItem === item.path
                        ? 'bg-blue-50 text-blue-600 border-blue-100'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div>
                  <img
                    className="inline-block h-10 w-10 rounded-full"
                    src={user.imageUrl}
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-gray-700">{user.name}</p>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-red-600 hover:text-red-700 group flex items-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

       <div className="hidden lg:flex lg:flex-shrink-0">
         {/* Sidebar */}
         <div className="flex flex-col w-80 bg-white/95 backdrop-blur-sm border-r border-gray-100/80 shadow-lg">
           <div className="flex flex-col flex-grow pt-8 pb-4 overflow-y-auto">
             <div className="flex items-center flex-shrink-0 px-6">
               <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-200 group cursor-pointer">
                   <Building2 className="h-6 w-6 text-white" />
                   <Sparkles className="absolute h-3 w-3 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                 </div>
                 <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700">
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
                       className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200 focus:outline-none group"
                     >
                       {user.name}
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
                       activeMenuItem === 'profile'
                         ? 'bg-gradient-to-r from-blue-50 to-blue-50/50 text-blue-600 shadow-sm border border-blue-100/50 scale-[1.02]'
                         : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 border border-transparent hover:border-gray-200'
                     } group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-sm relative overflow-hidden`}
                   >
                     <div className="absolute inset-0 bg-gradient-to-r from-blue-100/0 via-blue-100/30 to-blue-100/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                     <UserCircle className="mr-3 flex-shrink-0 h-5 w-5" />
                     Minha Página
                   </button>
                   {/* Similar updates for other navigation buttons */}
               </nav>
             </div>
           </div>
         </div>
       </div>

       {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden pt-16 relative w-full">
         <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
           <Routes>
             <Route path="campaigns" element={<Campaigns onSelectCampaign={handleSelectCampaign} />} />
             <Route path="profile" element={<Profile />} />
             <Route path="/" element={<Profile />} />
             <Route path="new-campaign" element={<NewCampaign onBack={() => navigate('/dashboard/campaigns')} />} />
             <Route path="schedule" element={<Schedule onSelectCampaign={handleSelectCampaign} />} />
             <Route path="messages" element={<Messages />} />
             <Route path="settings" element={<SettingsPage />} />
             <Route path="plan" element={<Plan />} />
             <Route path="social-networks" element={<SocialNetworks />} />
             <Route path="payments" element={<Payments />} />
             <Route path="influencers" element={<InfluencerList onViewProfile={handleViewProfile} />} />
           </Routes>
         </main>
       </div>
     </div>
   );
}