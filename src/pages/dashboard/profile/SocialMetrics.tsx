import React, { useEffect, useState } from 'react';
import { ArrowLeft, Users, Heart, MessageSquare, Share2, BarChart2, TrendingUp, Clock, Target, Globe2, ChevronRight, Eye, Zap, Sparkles, Instagram, Youtube, Video } from 'lucide-react';
import { useParams } from 'react-router-dom';

interface SocialMetricsProps {
  onBack: () => void;
}

export function SocialMetrics({ onBack }: SocialMetricsProps) {
  const { id } = useParams();
  const [platform, setPlatform] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchPlatformData = async () => {
      try {
        // Simulating API call
        const mockPlatforms = {
          '1': {
            id: '1',
            name: 'Instagram',
            username: '@joaosilva',
            followers: 150000,
            engagement: 4.8,
            metrics: {
              reach: '45K',
              engagement: '4.8%',
              interactions: '2.3K',
              avgLikes: '12.5K',
              avgComments: '850',
              shareRate: '3.2%'
            }
          },
          '2': {
            id: '2',
            name: 'YouTube',
            username: 'João Silva Tech',
            followers: 250000,
            engagement: 3.9,
            metrics: {
              reach: '85K',
              engagement: '3.9%',
              interactions: '4.1K',
              avgViews: '45K',
              avgLikes: '15K',
              completionRate: '65%'
            }
          }
        };

        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        const data = mockPlatforms[id as keyof typeof mockPlatforms];
        if (!data) throw new Error('Platform not found');
        
        setPlatform(data);
      } catch (error) {
        console.error('Error fetching platform data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlatformData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!platform) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Rede social não encontrada</h3>
        <button
          onClick={onBack}
          className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </button>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar para redes sociais
        </button>
      </div>

      {/* Overview Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100">
                {platform.name === 'Instagram' && <Instagram className="h-8 w-8 text-pink-600" />}
                {platform.name === 'YouTube' && <Youtube className="h-8 w-8 text-red-600" />}
                {platform.name === 'TikTok' && <Video className="h-8 w-8" />}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{platform.name}</h2>
                <p className="text-gray-500">{platform.username}</p>
              </div>
            </div>
            <a
              href={platform.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
            >
              Visitar Perfil
              <ChevronRight className="ml-2 h-4 w-4" />
            </a>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-5 w-5 text-indigo-600" />
                <BarChart2 className="h-4 w-4 text-indigo-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(platform.followers)}</p>
              <p className="text-sm text-gray-500">Seguidores</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-pink-50 to-white border border-pink-100">
              <div className="flex items-center justify-between mb-2">
                <Heart className="h-5 w-5 text-pink-600" />
                <BarChart2 className="h-4 w-4 text-pink-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{platform.engagement}%</p>
              <p className="text-sm text-gray-500">Engajamento</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-100">
              <div className="flex items-center justify-between mb-2">
                <Eye className="h-5 w-5 text-purple-600" />
                <BarChart2 className="h-4 w-4 text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">28%</p>
              <p className="text-sm text-gray-500">Taxa de Alcance</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-white border border-green-100">
              <div className="flex items-center justify-between mb-2">
                <Zap className="h-5 w-5 text-green-600" />
                <BarChart2 className="h-4 w-4 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">4.2%</p>
              <p className="text-sm text-gray-500">Taxa de Conversão</p>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-2 gap-8">
            {/* Engagement Metrics */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Métricas de Engajamento</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Heart className="h-5 w-5 text-pink-500 mr-2" />
                      <span className="text-gray-700">Média de Curtidas</span>
                    </div>
                    <span className="font-medium text-gray-900">12.5K</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-500 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-gray-700">Média de Comentários</span>
                    </div>
                    <span className="font-medium text-gray-900">850</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Share2 className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-700">Taxa de Compartilhamento</span>
                    </div>
                    <span className="font-medium text-gray-900">3.2%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Audience Demographics */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Demografia da Audiência</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Faixa Etária</h4>
                  <div className="space-y-2">
                    {['18-24', '25-34', '35-44', '45-54', '55+'].map((age) => (
                      <div key={age} className="flex items-center">
                        <span className="w-16 text-sm text-gray-600">{age}</span>
                        <div className="flex-1 h-2 mx-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${Math.random() * 100}%` }}
                          />
                        </div>
                        <span className="w-12 text-sm text-gray-600 text-right">
                          {Math.round(Math.random() * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Localização</h4>
                  <div className="space-y-2">
                    {['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Outros'].map((location) => (
                      <div key={location} className="flex items-center">
                        <span className="w-24 text-sm text-gray-600">{location}</span>
                        <div className="flex-1 h-2 mx-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${Math.random() * 100}%` }}
                          />
                        </div>
                        <span className="w-12 text-sm text-gray-600 text-right">
                          {Math.round(Math.random() * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Growth Trends */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tendências de Crescimento</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-indigo-500 mr-2" />
                    <span className="text-gray-700">Crescimento Mensal</span>
                  </div>
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">+5.2%</p>
                <p className="text-sm text-gray-500 mt-1">vs. mês anterior</p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-amber-500 mr-2" />
                    <span className="text-gray-700">Melhor Horário</span>
                  </div>
                  <Sparkles className="h-4 w-4 text-amber-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">19:00</p>
                <p className="text-sm text-gray-500 mt-1">maior engajamento</p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Target className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-700">Alcance Orgânico</span>
                  </div>
                  <Sparkles className="h-4 w-4 text-green-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">32%</p>
                <p className="text-sm text-gray-500 mt-1">da base total</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}