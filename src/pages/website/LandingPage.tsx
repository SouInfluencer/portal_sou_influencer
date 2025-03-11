import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Building2,
  Sparkles,
  // Globe2,
  Rocket,
  Shield,
  ChevronRight,
  BarChart2,
  Award,
  Menu,
  X,
  Star
} from 'lucide-react';
import logoRetangulo from '@/assets/logo_retangulo_light.svg';
import logoLetter from '@/assets/logo_letter_light.svg';

// Add keyframes for gradient animation
const styles = `
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 8s ease infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
`;

export function LandingPage() {
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = React.useState<'influencer' | 'advertiser' | null>(null);
  const [hoveredCard, setHoveredCard] = React.useState<'influencer' | 'advertiser' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const headerRef = React.useRef<HTMLElement>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Add styles to document
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Trigger mount animation
    setMounted(true);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // Close mobile menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-20 blur-[100px] transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-20' : 'translate-y-12 opacity-0'}`} />
          <div className={`absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full opacity-20 blur-[100px] transition-all duration-1000 delay-300 ${mounted ? 'translate-x-0 opacity-20' : '-translate-x-12 opacity-0'}`} />
          <div className={`absolute -bottom-40 right-1/3 w-96 h-96 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full opacity-20 blur-[100px] transition-all duration-1000 delay-500 ${mounted ? 'translate-y-0 opacity-20' : 'translate-y-12 opacity-0'}`} />
        </div>

        {/* Header with Logo */}
        <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100/80">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex h-16 sm:h-20 items-center justify-between">
              {/* Logo */}
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div
                      className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-200 group">
                    <img width={188} alt="Logo" src={logoRetangulo}/>
                  </div>
                  <img width={188} alt="Logo" src={logoLetter}/>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex md:items-center md:space-x-6">
                <div className="flex items-center space-x-2">
                  <button
                      onClick={() => navigate('/login')}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100/80 transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  >
                    Entrar
                  </button>
                  <button
                      onClick={() => navigate('/register')}
                      className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md transition-all duration-200 min-w-[44px] min-h-[44px] transform hover:scale-[1.02]"
                  >
                    Criar Conta
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
                >
                  <span className="sr-only">Abrir menu</span>
                  {mobileMenuOpen ? (
                      <X className="block h-6 w-6" />
                  ) : (
                      <Menu className="block h-6 w-6" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden transform transition-all duration-300 ease-in-out ${
                mobileMenuOpen
                    ? 'translate-x-0 opacity-100 h-screen'
                    : 'translate-x-full opacity-0 h-0'
            }`}>
              <div className="pt-2 pb-3 space-y-1">
                <div className="flex flex-col items-center space-y-4 p-4">
                  <button
                      onClick={() => {
                        navigate('/login');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-center text-gray-600 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100/80 transition-colors duration-200"
                  >
                    Entrar
                  </button>
                  <button
                      onClick={() => {
                        navigate('/register');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Criar Conta
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
          {/* Hero Section */}
          <div className="text-center mb-12 relative pt-16">
            <div className="flex items-center justify-center space-x-2 text-blue-600 mb-6">
              <Sparkles className="h-5 w-5" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase">Bem-vindo à nossa plataforma</span>
            </div>
            <h1 className={`text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 sm:mb-8 px-2 sm:px-0 transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              <span className="block mb-2">Qual é o seu perfil?</span>
              <span className="block bg-gradient-to-r from-blue-600 via-blue-500 to-blue-500 text-transparent bg-clip-text animate-gradient">
              Selecione abaixo
            </span>
            </h1>
            <p className={`max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed mb-8 sm:mb-12 px-4 transition-all duration-1000 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              Precisamos entender melhor seu perfil para direcioná-lo à experiência mais adequada
            </p>
          </div>

          {/* Profile Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto mb-16">
            {/* Advertiser Card */}
            <button
                onClick={() => {
                  setSelectedProfile('advertiser');
                  navigate('/advertiser');
                }}
                onMouseEnter={() => setHoveredCard('advertiser')}
                onMouseLeave={() => setHoveredCard(null)}
                className={`group relative rounded-2xl border-2 p-5 sm:p-8 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl touch-manipulation ${
                    selectedProfile === 'advertiser'
                        ? 'border-blue-500 bg-blue-50 shadow-xl'
                        : 'border-gray-200 bg-white shadow-lg'
                }`}>
              <div className="flex flex-col items-start text-left">
                <div className="flex items-center justify-between w-full mb-4 sm:mb-6 gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg transform transition-transform duration-300 ${
                      hoveredCard === 'advertiser' ? 'scale-110' : ''
                  }`}>
                    <Building2 className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex items-center min-h-[44px]">
                    <span className="text-sm font-medium text-blue-600 mr-2">Escolher</span>
                    <ChevronRight className={`h-5 w-5 text-blue-500 transform transition-transform duration-300 ${
                        selectedProfile === 'advertiser' ? 'translate-x-2' : 'group-hover:translate-x-2'
                    }`} />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Sou Anunciante</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Busco influenciadores para promover meu negócio</p>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm sm:text-base text-gray-600">Match com influenciadores verificados</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-gray-600">Gestão completa de campanhas</span>
                  </div>
                  <div className="flex items-center">
                    <Rocket className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-gray-600">ROI e métricas em tempo real</span>
                  </div>
                </div>
                <div className="mt-6 w-full">
                </div>
              </div>
              {/* Hover Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl transition-opacity duration-300 ${
                  hoveredCard === 'advertiser' ? 'opacity-100' : 'opacity-0'
              }`} />
            </button>

            {/* Influencer Card */}
            <button
                onClick={() => {
                  setSelectedProfile('influencer');
                  navigate('/influencer');
                }}
                onMouseEnter={() => setHoveredCard('influencer')}
                onMouseLeave={() => setHoveredCard(null)}
                className={`group relative rounded-2xl border-2 p-5 sm:p-8 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl touch-manipulation ${
                    selectedProfile === 'influencer'
                        ? 'border-blue-500 bg-blue-50 shadow-xl'
                        : 'border-gray-200 bg-white shadow-lg'
                }`}
            >
              <div className="flex flex-col items-start text-left">
                <div className="flex items-center justify-between w-full mb-4 sm:mb-6 gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg transform transition-transform duration-300 ${
                      hoveredCard === 'influencer' ? 'scale-110' : ''
                  }`}>
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex items-center min-h-[44px]">
                    <span className="text-sm font-medium text-blue-600 mr-2">Escolher</span>
                    <ChevronRight className={`h-5 w-5 text-blue-500 transform transition-transform duration-300 ${
                        selectedProfile === 'influencer' ? 'translate-x-2' : 'group-hover:translate-x-2'
                    }`} />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Sou Influenciador</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Quero me conectar com anunciantes e criar conteúdo patrocinado</p>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-amber-400 mr-2" />
                    <span className="text-sm sm:text-base text-gray-600">Receba propostas de anunciantes relevantes</span>
                  </div>
                  <div className="flex items-center">
                    <BarChart2 className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-600">Gerencie campanhas em um só lugar</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-gray-600">Pagamentos seguros e garantidos</span>
                  </div>
                </div>
              </div>
              {/* Hover Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl transition-opacity duration-300 ${
                  hoveredCard === 'influencer' ? 'opacity-100' : 'opacity-0'
              }`} />
            </button>
          </div>

          {/* Stats Section - Mobile Optimized */}
          {/*<div className="mt-12 sm:mt-16">*/}
          {/*  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">*/}
          {/*    <div className="bg-white px-6 py-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">*/}
          {/*      <dt className="flex items-center justify-center">*/}
          {/*        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white mb-4">*/}
          {/*          <Users className="h-6 w-6 animate-float" />*/}
          {/*        </div>*/}
          {/*      </dt>*/}
          {/*      <dd className="text-center">*/}
          {/*        <p className="text-3xl font-extrabold text-gray-900 mb-2">15K+</p>*/}
          {/*        <p className="text-sm text-gray-500">Influenciadores ativos</p>*/}
          {/*      </dd>*/}
          {/*    </div>*/}

          {/*    <div className="bg-white px-6 py-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">*/}
          {/*      <dt className="flex items-center justify-center">*/}
          {/*        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white mb-4">*/}
          {/*          <Globe2 className="h-6 w-6 animate-float" />*/}
          {/*        </div>*/}
          {/*      </dt>*/}
          {/*      <dd className="text-center">*/}
          {/*        <p className="text-3xl font-extrabold text-gray-900 mb-2">45K+</p>*/}
          {/*        <p className="text-sm text-gray-500">Campanhas realizadas</p>*/}
          {/*      </dd>*/}
          {/*    </div>*/}

          {/*    <div className="bg-white px-6 py-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">*/}
          {/*      <dt className="flex items-center justify-center">*/}
          {/*        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 text-white mb-4">*/}
          {/*          <Building2 className="h-6 w-6 animate-float" />*/}
          {/*        </div>*/}
          {/*      </dt>*/}
          {/*      <dd className="text-center">*/}
          {/*        <p className="text-3xl font-extrabold text-gray-900 mb-2">2.5K+</p>*/}
          {/*        <p className="text-sm text-gray-500">Anunciantes parceiros</p>*/}
          {/*      </dd>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
      </div>
  );
}