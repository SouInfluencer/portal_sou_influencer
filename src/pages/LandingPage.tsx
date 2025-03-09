import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, ArrowRight, Star, Sparkles, Globe2, Rocket, Shield, ChevronRight, BarChart2, Award, CheckCircle, MessageSquare } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = React.useState<'influencer' | 'advertiser' | null>(null);
  const [hoveredCard, setHoveredCard] = React.useState<'influencer' | 'advertiser' | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-200 to-indigo-300 rounded-full opacity-20 blur-[100px]" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full opacity-20 blur-[100px]" />
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full opacity-20 blur-[100px]" />
      </div>

      {/* Header with Logo */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-500">
                Sou Influencer
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Entrar
              </button>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Hero Section */}
        <div className="text-center mb-20 relative pt-16">
          <div className="flex items-center justify-center space-x-2 text-indigo-600 mb-4">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-semibold tracking-wide uppercase">Plataforma líder em marketing de influência</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            <span className="block mb-2">Conectando</span>
            <span className="block bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              marcas e criadores
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed mb-12">
            Escolha seu perfil e faça parte da maior comunidade de marketing de influência do Brasil
          </p>
          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-2 text-gray-500">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Cadastro Gratuito</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <Shield className="h-5 w-5 text-indigo-500" />
              <span>100% Seguro</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <MessageSquare className="h-5 w-5 text-purple-500" />
              <span>Suporte 24/7</span>
            </div>
          </div>
        </div>

        {/* Profile Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Influencer Card */}
          <button
            onClick={() => {
              setSelectedProfile('influencer');
              navigate('/influencer');
            }}
            onMouseEnter={() => setHoveredCard('influencer')}
            onMouseLeave={() => setHoveredCard(null)}
            className={`group relative rounded-2xl border-2 p-8 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-[1.02] ${
              selectedProfile === 'influencer'
                ? 'border-indigo-500 bg-indigo-50 shadow-xl'
                : 'border-gray-200 bg-white shadow-lg'
            }`}
          >
            <div className="flex flex-col items-start text-left">
              <div className="flex items-center justify-between w-full mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg transform transition-transform duration-300 ${
                  hoveredCard === 'influencer' ? 'scale-110' : ''
                }`}>
                  <Users className="h-7 w-7 text-white" />
                </div>
                <ChevronRight className={`h-6 w-6 text-indigo-500 transform transition-transform duration-300 ${
                  selectedProfile === 'influencer' ? 'translate-x-2' : 'group-hover:translate-x-2'
                }`} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Sou Influenciador</h3>
              <p className="text-gray-600 mb-6">Conecte-se com marcas e gerencie suas campanhas</p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-amber-400 mr-2" />
                  <span className="text-gray-600">Receba propostas personalizadas</span>
                </div>
                <div className="flex items-center">
                  <BarChart2 className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600">Métricas e insights avançados</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-indigo-500 mr-2" />
                  <span className="text-gray-600">Pagamentos seguros e garantidos</span>
                </div>
              </div>
            </div>
            {/* Hover Effect */}
            <div className={`absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-2xl transition-opacity duration-300 ${
              hoveredCard === 'influencer' ? 'opacity-100' : 'opacity-0'
            }`} />
          </button>

          {/* Advertiser Card */}
          <button
            onClick={() => {
              setSelectedProfile('advertiser');
              navigate('/advertiser');
            }}
            onMouseEnter={() => setHoveredCard('advertiser')}
            onMouseLeave={() => setHoveredCard(null)}
            className={`group relative rounded-2xl border-2 p-8 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-[1.02] ${
              selectedProfile === 'advertiser'
                ? 'border-indigo-500 bg-indigo-50 shadow-xl'
                : 'border-gray-200 bg-white shadow-lg'
            }`}
          >
            <div className="flex flex-col items-start text-left">
              <div className="flex items-center justify-between w-full mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg transform transition-transform duration-300 ${
                  hoveredCard === 'advertiser' ? 'scale-110' : ''
                }`}>
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                <ChevronRight className={`h-6 w-6 text-indigo-500 transform transition-transform duration-300 ${
                  selectedProfile === 'advertiser' ? 'translate-x-2' : 'group-hover:translate-x-2'
                }`} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Sou Anunciante</h3>
              <p className="text-gray-600 mb-6">Encontre os melhores influenciadores para sua marca</p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-gray-600">Match inteligente com criadores</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="text-gray-600">Influenciadores verificados</span>
                </div>
                <div className="flex items-center">
                  <Rocket className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-gray-600">Resultados mensuráveis</span>
                </div>
              </div>
            </div>
            {/* Hover Effect */}
            <div className={`absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-2xl transition-opacity duration-300 ${
              hoveredCard === 'advertiser' ? 'opacity-100' : 'opacity-0'
            }`} />
          </button>
        </div>

        {/* Stats Section */}
        <div className="mt-24">
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="bg-white px-6 py-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
              <dt className="flex items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white mb-4">
                  <Users className="h-6 w-6" />
                </div>
              </dt>
              <dd className="text-3xl font-extrabold text-gray-900 mb-1">15K+</dd>
              <dd className="text-sm text-gray-500">Influenciadores ativos</dd>
            </div>

            <div className="bg-white px-6 py-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
              <dt className="flex items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white mb-4">
                  <Globe2 className="h-6 w-6" />
                </div>
              </dt>
              <dd className="text-3xl font-extrabold text-gray-900 mb-1">45K+</dd>
              <dd className="text-sm text-gray-500">Campanhas realizadas</dd>
            </div>

            <div className="bg-white px-6 py-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
              <dt className="flex items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 text-white mb-4">
                  <Building2 className="h-6 w-6" />
                </div>
              </dt>
              <dd className="text-3xl font-extrabold text-gray-900 mb-1">2.5K+</dd>
              <dd className="text-sm text-gray-500">Marcas parceiras</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}