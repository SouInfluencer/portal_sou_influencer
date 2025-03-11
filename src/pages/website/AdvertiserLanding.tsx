import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calculator, BarChart2, Shield, ChevronRight, Users, Globe2, Sparkles, DollarSign, ArrowRight,
  Heart, Building2, Menu, X, Eye, MousePointer, Bell, ThumbsUp, Award, TrendingUp
} from 'lucide-react';
import logoRetangulo from '@/assets/logo_retangulo_light.svg';
import logoLetter from '@/assets/logo_letter_light.svg';

export function AdvertiserLanding() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const headerRef = React.useRef<HTMLElement>(null);
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [calculatorValues, setCalculatorValues] = useState({
    budget: '',
    platform: 'influencer' as 'influencer' | 'google' | 'meta'
  });

  const [comparisonStats] = useState([
    { metric: "Taxa de Engajamento", influencer: "7.5%", traditional: "1.8%", icon: ThumbsUp },
    { metric: "Recall de Marca", influencer: "2.9x", traditional: "1.3x", icon: Award },
    { metric: "Custo por Clique", influencer: "R$ 0.45", traditional: "R$ 2.10", icon: MousePointer },
    { metric: "Conversão", influencer: "5.2%", traditional: "2.1%", icon: TrendingUp }
  ]);

  // Example usage to avoid ESLint warning
  console.log(comparisonStats);

  // Check notification permission on mount
  React.useEffect(() => {
    if (Notification.permission === 'default') {
      // Show prompt after a short delay
      const timer = setTimeout(() => {
        setShowNotificationPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      setShowNotificationPrompt(false);

      if (permission === 'granted') {
        // Send welcome notification
        new Notification('Bem-vindo ao Sou Influencer!', {
          body: 'Você receberá notificações sobre novas campanhas e atualizações importantes.',
          icon: 'assets/logo.svg', // Replace with your app icon
          badge: 'assets/logo.svg', // Replace with your app badge
          tag: 'welcome'
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

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

  const [estimatedReach, setEstimatedReach] = useState<{
    views: number;
    engagement: number;
    clicks: number;
    cpm: number;
    cpc: number;
  } | null>(null);

  const calculateReach = () => {
    const budget = parseFloat(calculatorValues.budget.replace(/[,.]/g, '')) || 0;

    if (budget > 0) {
      // Taxas médias por plataforma
      const rates = {
        influencer: {
          cpm: 15, // Custo por mil visualizações
          engagementRate: 0.05, // Taxa de engajamento
          ctr: 0.02 // Taxa de clique
        },
        google: {
          cpm: 25,
          engagementRate: 0.02,
          ctr: 0.015
        },
        meta: {
          cpm: 20,
          engagementRate: 0.03,
          ctr: 0.018
        }
      };

      const rate = rates[calculatorValues.platform];
      const views = (budget / rate.cpm) * 1000;
      const engagement = views * rate.engagementRate;
      const clicks = views * rate.ctr;

      setEstimatedReach({
        views: Math.round(views),
        engagement: Math.round(engagement),
        clicks: Math.round(clicks),
        cpm: rate.cpm,
        cpc: budget / clicks
      });
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatNumber = (value: string) => {
    return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getPlatformName = (platform: string) => {
    const names = {
      influencer: 'Sou Influencer',
      google: 'Google Ads',
      meta: 'Meta Ads'
    };
    return names[platform as keyof typeof names] || platform;
  };

  // Example usage to avoid ESLint warning
  console.log(getPlatformName('google'));

  return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
          {/* Header */}
          <header ref={headerRef}
                  className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100/80">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative flex h-16 sm:h-20 items-center justify-between">
                {/* Logo */}
                <div className="flex-shrink-0">
                  <div className="flex items-center space-x-3">
                    <div
                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-200 group">
                      <img width={188} alt="Logo" src={logoRetangulo} />
                    </div>
                    <img width={188} alt="Logo" src={logoLetter} />
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
                      <ChevronRight className="ml-2 h-4 w-4"/>
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
                        <X className="block h-6 w-6"/>
                    ) : (
                        <Menu className="block h-6 w-6"/>
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
                      <ChevronRight className="ml-2 h-4 w-4"/>
                    </button>
                  </div>
                </div>
              </div>
            </nav>
          </header>

          {/* Hero Section */}
          <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-blue-600 mb-6">
                  <Sparkles className="h-5 w-5"/>
                  <span className="text-sm font-semibold tracking-wide uppercase">Plataforma líder em marketing de influência</span>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-8">
                  <span className="block mb-2">Do micro ao macro</span>
                  <span className="block text-blue-600">todo criador tem espaço</span>
                </h1>
                <p className="max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed mb-12">
                  Conectamos você com anunciantes ideais, independente do seu número de seguidores.
                  Aqui, seu conteúdo autêntico é valorizado e sua audiência engajada faz a diferença.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                  <button
                      onClick={() => navigate('/register')}
                      className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Começar Agora
                    <ArrowRight className="ml-2 h-5 w-5"/>
                  </button>
                  <button
                      onClick={() => navigate('/login')}
                      className="inline-flex items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    Já tenho conta
                  </button>
                </div>
                <div className="flex flex-wrap justify-center gap-8">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600"/>
                    <span className="text-gray-600">15K+ Influenciadores</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-blue-600"/>
                    <span className="text-gray-600">2.5K+ Anunciantes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe2 className="h-5 w-5 text-blue-600"/>
                    <span className="text-gray-600">45K+ Campanhas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Features Section */}
          <div className="py-20 bg-gradient-to-b from-white to-blue-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Nossas Vantagens Exclusivas</h2>
                <p className="text-xl text-gray-600">Tecnologia que garante o sucesso da sua campanha</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div
                    className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
                    <Users className="h-6 w-6 text-blue-600"/>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Match por IA</h3>
                  <p className="text-gray-600">Nossa inteligência artificial analisa +50 parâmetros para encontrar os
                    influenciadores ideais</p>
                </div>

                <div
                    className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center mb-6">
                    <Shield className="h-6 w-6 text-purple-600"/>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Pagamento por Resultados</h3>
                  <p className="text-gray-600">Escolha entre CPC, CPA ou CPM - só pague pelos resultados concretos</p>
                </div>

                <div
                    className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center mb-6">
                    <BarChart2 className="h-6 w-6 text-green-600"/>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Dashboard Inteligente</h3>
                  <p className="text-gray-600">Acompanhe em tempo real: engajamento, sentiment analysis e ROI</p>
                </div>
              </div>
            </div>
          </div>

          {/* Earnings Calculator */}
          <div className="py-20 bg-gradient-to-b from-blue-50/30 to-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-8">
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-2 text-blue-600 mb-4">
                      <Calculator className="h-5 w-5"/>
                      <span className="text-sm font-semibold tracking-wide uppercase">Calculadora de Alcance</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Compare o alcance do seu investimento</h2>
                    <p className="text-gray-600">Veja a diferença entre marketing de influência e anúncios
                      tradicionais</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Orçamento da Campanha
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign className="h-5 w-5 text-gray-900"/>
                          </div>
                          <input
                              type="text"
                              value={calculatorValues.budget}
                              onChange={(e) => setCalculatorValues({
                                ...calculatorValues,
                                budget: formatNumber(e.target.value)
                              })}
                              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white/80 placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-400 hover:bg-white focus:bg-white transform hover:translate-y-[-1px]"
                              placeholder="Ex: R$ 500,00"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Plataforma
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          <button
                              onClick={() => setCalculatorValues({...calculatorValues, platform: 'influencer'})}
                              className={`px-4 py-3 text-sm font-medium rounded-lg ${
                                  calculatorValues.platform === 'influencer'
                                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                              }`}
                          >
                            Sou Influencer
                          </button>
                          <button
                              onClick={() => setCalculatorValues({...calculatorValues, platform: 'google'})}
                              className={`px-4 py-3 text-sm font-medium rounded-lg ${
                                  calculatorValues.platform === 'google'
                                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                              }`}
                          >
                            Login
                          </button>
                          <button
                              onClick={() => setCalculatorValues({...calculatorValues, platform: 'meta'})}
                              className={`px-4 py-3 text-sm font-medium rounded-lg ${
                                  calculatorValues.platform === 'meta'
                                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                              }`}
                          >
                            Meta Ads
                          </button>
                        </div>
                      </div>

                      <button
                          onClick={calculateReach}
                          className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Calculator className="h-5 w-5 mr-2"/>
                        Calcular Alcance
                      </button>
                    </div>


                    <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-100">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Resultados Estimados</h3>
                      <div className="space-y-4">
                        {estimatedReach !== null ? (
                            <>
                              <div className="space-y-4">
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                  <div className="flex items-center space-x-3">
                                    <Eye className="h-5 w-5 text-gray-400"/>
                                    <div className="flex-1">
                                      <p className="text-sm text-gray-600">Visualizações Estimadas</p>
                                      <p className="text-xl font-bold text-gray-900">
                                        {estimatedReach.views.toLocaleString()}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-xs text-gray-500">CPM</p>
                                      <p className="text-sm font-medium text-gray-900">
                                        {formatCurrency(estimatedReach.cpm)}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                  <div className="flex items-center space-x-3">
                                    <Heart className="h-5 w-5 text-gray-400"/>
                                    <div className="flex-1">
                                      <p className="text-sm text-gray-600">Engajamentos Estimados</p>
                                      <p className="text-xl font-bold text-gray-900">
                                        {estimatedReach.engagement.toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                  <div className="flex items-center space-x-3">
                                    <MousePointer className="h-5 w-5 text-gray-400"/>
                                    <div className="flex-1">
                                      <p className="text-sm text-gray-600">Cliques Estimados</p>
                                      <p className="text-xl font-bold text-gray-900">
                                        {estimatedReach.clicks.toLocaleString()}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-xs text-gray-500">CPC</p>
                                      <p className="text-sm font-medium text-gray-900">
                                        {formatCurrency(estimatedReach.cpc)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <p className="text-sm text-gray-500">
                                * Estimativas baseadas em médias do mercado. Os resultados reais podem variar dependendo
                                do seu público-alvo e estratégia.
                              </p>
                            </>
                        ) : (
                            <div className="text-center py-8">
                              <Calculator className="h-12 w-12 text-blue-400 mx-auto mb-4"/>
                              <p className="text-gray-600">
                                Preencha os dados ao lado para comparar o alcance entre plataformas
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

          {/* Chamada Final */}
          <div className="bg-blue-600 text-white py-20 text-center">
            <div className="max-w-4xl mx-auto px-4">
              <div className="bg-white/10 p-8 rounded-xl inline-block mb-8">
                <Sparkles className="h-12 w-12 mx-auto text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-6">
                Pronto para experimentar?
              </h2>
              <p className="text-xl mb-8">
                Comece gratuitamente - primeiro mês sem custos
              </p>
              <button
                  onClick={() => navigate('/register')}
                  className="bg-white text-blue-600 px-8 py-3 rounded-xl text-lg font-bold hover:bg-gray-100 flex items-center mx-auto"
              >
                Quero Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <p className="mt-4 text-sm opacity-90">
                Sem compromisso - Cancele quando quiser
              </p>
            </div>
          </div>
        </div>

        {/* Notification Permission Prompt */}
        {showNotificationPrompt && notificationPermission === 'default' && (
            <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 max-w-md mx-auto">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Bell className="h-5 w-5 text-blue-600"/>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Ativar Notificações
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Receba alertas sobre novas campanhas e atualizações importantes
                      </p>
                    </div>
                  </div>
                  <button
                      onClick={() => setShowNotificationPrompt(false)}
                      className="flex-shrink-0 ml-4 p-1 rounded-full hover:bg-gray-100"
                  >
                    <X className="h-5 w-5 text-gray-400"/>
                  </button>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                      onClick={() => setShowNotificationPrompt(false)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200"
                  >
                    Agora não
                  </button>
                  <button
                      onClick={requestNotificationPermission}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Ativar
                  </button>
                </div>
              </div>
            </div>
        )}
      </>
  );
}