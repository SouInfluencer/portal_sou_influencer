import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Star, BarChart2, Shield, ChevronRight, Users, Globe2, Award, Sparkles, DollarSign, MessageSquare, Calendar, CheckCircle, ArrowRight, TrendingUp, Zap, Rocket, Target, Heart, Building2 } from 'lucide-react';

export function InfluencerLanding() {
  const navigate = useNavigate();
  const [calculatorValues, setCalculatorValues] = useState({
    followers: '',
    engagement: '',
    contentType: 'feed' as 'feed' | 'story' | 'reels'
  });
  const [estimatedEarnings, setEstimatedEarnings] = useState<number | null>(null);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center shadow-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-700">
                Sou Influencer
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-sm hover:shadow-md transition-all duration-200"
              >
                Criar Conta
                <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-indigo-600 mb-6">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-semibold tracking-wide uppercase">Plataforma líder em marketing de influência</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-8">
              <span className="block mb-2">Do micro ao macro</span>
              <span className="block text-indigo-600">todo criador tem espaço</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed mb-12">
              Conectamos você com as marcas ideais, independente do seu número de seguidores. 
              Aqui, seu conteúdo autêntico é valorizado e sua audiência engajada faz a diferença.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
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
                <Users className="h-5 w-5 text-indigo-600" />
                <span className="text-gray-600">15K+ Influenciadores</span>
              </div>
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-indigo-600" />
                <span className="text-gray-600">2.5K+ Marcas</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe2 className="h-5 w-5 text-indigo-600" />
                <span className="text-gray-600">45K+ Campanhas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-b from-white to-indigo-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Por que escolher nossa plataforma?</h2>
            <p className="text-xl text-gray-600">Tudo que você precisa para crescer como influenciador</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-6">
                <Target className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Match Inteligente</h3>
              <p className="text-gray-600">Nossa IA encontra as marcas perfeitas para seu perfil e nicho.</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center mb-6">
                <BarChart2 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Métricas Avançadas</h3>
              <p className="text-gray-600">Análise detalhada do seu desempenho e insights valiosos.</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Pagamento Seguro</h3>
              <p className="text-gray-600">Receba seus pagamentos de forma segura e garantida.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings Calculator */}
      <div className="py-20 bg-gradient-to-b from-indigo-50/30 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-2 text-indigo-600 mb-4">
                  <Calculator className="h-5 w-5" />
                  <span className="text-sm font-semibold tracking-wide uppercase">Calculadora de Ganhos</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Calcule seu potencial de ganhos</h2>
                <p className="text-gray-600">Descubra quanto você pode ganhar com base no seu alcance</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
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
                            ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500'
                            : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        Feed Post
                      </button>
                      <button
                        onClick={() => setCalculatorValues({ ...calculatorValues, contentType: 'story' })}
                        className={`px-4 py-3 text-sm font-medium rounded-lg ${
                          calculatorValues.contentType === 'story'
                            ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500'
                            : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        Story
                      </button>
                      <button
                        onClick={() => setCalculatorValues({ ...calculatorValues, contentType: 'reels' })}
                        className={`px-4 py-3 text-sm font-medium rounded-lg ${
                          calculatorValues.contentType === 'reels'
                            ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500'
                            : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        Reels
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={calculateEarnings}
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Calculator className="h-5 w-5 mr-2" />
                    Calcular Ganhos
                  </button>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 border border-indigo-100">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Potencial de Ganhos</h3>
                  <div className="space-y-4">
                    {estimatedEarnings !== null ? (
                      <>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Estimativa por post:</span>
                            <span className="text-2xl font-bold text-indigo-600">
                              R$ {estimatedEarnings.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          * Valores estimados com base em médias do mercado. Os ganhos reais podem variar.
                        </p>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <DollarSign className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
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
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Comece sua jornada como influenciador</h2>
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-indigo-600 bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Criar Conta Grátis
            <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}