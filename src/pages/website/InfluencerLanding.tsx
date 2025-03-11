import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, BarChart2, Shield, ChevronRight, Users, Globe2, Sparkles, DollarSign, ArrowRight, Target,
  Building2, Menu, X } from 'lucide-react';
import logoRetangulo from '@/assets/logo_retangulo_light.svg';
import logoLetter from '@/assets/logo_letter_light.svg';

// Add keyframes for animations
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

@keyframes pulse-ring {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1); opacity: 0.4; }
  100% { transform: scale(1.2); opacity: 0; }
}

.animate-pulse-ring {
  animation: pulse-ring 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out forwards;
}
`;

export function InfluencerLanding() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const headerRef = React.useRef<HTMLElement>(null);
  const [mounted, setMounted] = React.useState(false);
  const [calculatorValues, setCalculatorValues] = useState({
    followers: '',
    engagement: '',
    contentType: 'feed' as 'feed' | 'story' | 'reels'
  });
  const [estimatedEarnings, setEstimatedEarnings] = useState<number | null>(null);

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

  const calculateEarnings = () => {
    const followers = parseInt(calculatorValues.followers.replace(/,/g, ''));

    if (!isNaN(followers)) {
      // Base rate for Feed post
      const feedRate = followers * 0.035;

      // Calculate based on content type
      let estimated = feedRate;
      if (calculatorValues.contentType === 'story') {
        estimated = feedRate * 0.7; // 70% of Feed rate
      } else if (calculatorValues.contentType === 'reels') {
        estimated = feedRate * 1.5; // 150% of Feed rate
      }

      setEstimatedEarnings(Math.round(estimated));
    }
  };

  const formatNumber = (value: string) => {
    return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        {/* Header */}
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
              <div className="hidden md:flex md:items-center md:space-x-4">
                <div className="flex items-center space-x-4">
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

        {/* Hero Section */}
        <div className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 lg:pt-40 lg:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-blue-600 mb-6">
                <Sparkles className="h-5 w-5" />
                <span className={`text-sm font-semibold tracking-wide uppercase transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                Plataforma líder em marketing de influência
              </span>
              </div>
              <h1 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-8 transition-all duration-1000 delay-200 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <span className="block mb-2">Do micro ao macro</span>
                <span className="block text-blue-600">todo influencer tem valor</span>
              </h1>
              <p className={`max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed mb-12 transition-all duration-1000 delay-400 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                Conectamos você com as anunciantes ideais, independente do seu número de seguidores.
                Aqui, seu conteúdo autêntico é valorizado e sua audiência engajada faz a diferença.
              </p>
              <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 transition-all duration-1000 delay-600 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <button
                    onClick={() => navigate('/register')}
                    className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Começar Agora
                  <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200" />
                </button>
                <button
                    onClick={() => navigate('/login')}
                    className="inline-flex items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Já tenho conta
                </button>
              </div>
              <div className={`flex flex-wrap justify-center gap-8 transition-all duration-1000 delay-800 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600 animate-float" />
                  <span className="text-gray-600">15K+ Influenciadores</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-blue-600 animate-float" style={{ animationDelay: '0.2s' }} />
                  <span className="text-gray-600">2.5K+ Anunciantes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe2 className="h-5 w-5 text-blue-600 animate-float" style={{ animationDelay: '0.4s' }} />
                  <span className="text-gray-600">45K+ Campanhas</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 bg-gradient-to-b from-white to-blue-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Por que escolher nossa plataforma?</h2>
              <p className="text-xl text-gray-600">Tudo que você precisa para crescer como influenciador</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="relative h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6 group">
                  <Target className="h-6 w-6 text-blue-600" />
                  <div className="absolute inset-0 rounded-xl bg-blue-200 animate-pulse-ring opacity-0 group-hover:opacity-100" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Match Inteligente</h3>
                <p className="text-gray-600">Nossa IA encontra anunciantes perfeitos para seu perfil e nicho.</p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="relative h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center mb-6 group">
                  <BarChart2 className="h-6 w-6 text-purple-600" />
                  <div className="absolute inset-0 rounded-xl bg-purple-200 animate-pulse-ring opacity-0 group-hover:opacity-100" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Métricas Avançadas</h3>
                <p className="text-gray-600">Análise detalhada do seu desempenho e insights valiosos.</p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="relative h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center mb-6 group">
                  <Shield className="h-6 w-6 text-green-600" />
                  <div className="absolute inset-0 rounded-xl bg-green-200 animate-pulse-ring opacity-0 group-hover:opacity-100" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Pagamento Seguro</h3>
                <p className="text-gray-600">Receba seus pagamentos de forma segura e garantida.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Earnings Calculator */}
        <div className="py-12 sm:py-20 bg-gradient-to-b from-blue-50/30 to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8">
                <div className="text-center mb-6 sm:mb-8">
                  <div className="flex items-center justify-center space-x-2 text-blue-600 mb-4">
                    <Calculator className="h-5 w-5" />
                    <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase">Calculadora de Ganhos</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Calcule seu potencial de ganhos</h2>
                  <p className="text-sm sm:text-base text-gray-600">Descubra quanto você pode ganhar com base no seu alcance</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de Seguidores
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Users className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={calculatorValues.followers}
                            onChange={(e) => setCalculatorValues({
                              ...calculatorValues,
                              followers: formatNumber(e.target.value)
                            })}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white/80 placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-400 hover:bg-white focus:bg-white transform hover:translate-y-[-1px]"
                            placeholder="Ex: 10,000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Conteúdo
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                            onClick={() => setCalculatorValues({ ...calculatorValues, contentType: 'feed' })}
                            className={`px-4 py-3 text-sm font-medium rounded-lg ${
                                calculatorValues.contentType === 'feed'
                                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                            }`}
                        >
                          Feed Post
                        </button>
                        <button
                            onClick={() => setCalculatorValues({ ...calculatorValues, contentType: 'story' })}
                            className={`px-4 py-3 text-sm font-medium rounded-lg ${
                                calculatorValues.contentType === 'story'
                                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                            }`}
                        >
                          Story
                        </button>
                        <button
                            onClick={() => setCalculatorValues({ ...calculatorValues, contentType: 'reels' })}
                            className={`px-4 py-3 text-sm font-medium rounded-lg ${
                                calculatorValues.contentType === 'reels'
                                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                            }`}
                        >
                          Reels
                        </button>
                      </div>
                    </div>

                    <button
                        onClick={calculateEarnings}
                        className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Calculator className="h-5 w-5 mr-2" />
                      Calcular Ganhos
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-100">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Potencial de Ganhos</h3>
                    <div className="space-y-4">
                      {estimatedEarnings !== null ? (
                          <>
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Estimativa por post:</span>
                                <span className="text-2xl font-bold text-blue-600">
                              {estimatedEarnings.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              })}
                            </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500">
                              * Valores estimados com base em médias do mercado. Os ganhos reais podem variar.
                            </p>
                          </>
                      ) : (
                          <div className="text-center py-8">
                            <DollarSign className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                            <p className="text-gray-600">
                              Preencha os dados ao lado para calcular seu potencial de ganhos
                            </p>
                          </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-12 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Comece sua jornada como influenciador</h2>
            <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 border border-transparent text-base font-medium rounded-xl text-blue-600 bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-200 min-h-[44px]"
            >
              Criar Conta Grátis
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
  );
}