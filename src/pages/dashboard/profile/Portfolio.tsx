import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Calendar, ChevronRight, Globe2, Rocket, Sparkles, Star, Award, Eye, Heart, AlertTriangle } from 'lucide-react';
import { PortfolioDetails } from './PortfolioDetails';
import { portfolioService, type PortfolioItem, type PortfolioStats } from '../../../services/portfolioService';
import { toast } from 'react-hot-toast';

interface PortfolioProps {
  profile: any; // TODO: Add proper type
}

export function Portfolio({ profile }: PortfolioProps) {
  const [selectedCampaign, setSelectedCampaign] = React.useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [stats, setStats] = useState<PortfolioStats>({
    totalCampaigns: 0,
    totalReach: '0',
    avgEngagement: '0%',
    totalEarnings: 0
  });

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [items, portfolioStats] = await Promise.all([
        portfolioService.getPortfolioItems(),
        portfolioService.getPortfolioStats()
      ]);

      setPortfolioItems(items);
      setStats(portfolioStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar portfólio');
      toast.error('Erro ao carregar dados do portfólio');
    } finally {
      setLoading(false);
    }
  };

  if (selectedCampaign) {
    return <PortfolioDetails campaign={selectedCampaign} onBack={() => setSelectedCampaign(null)} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Erro ao carregar portfólio</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={fetchPortfolioData}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Portfolio Stats */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <Sparkles className="h-4 w-4 text-blue-400" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalCampaigns}</p>
            <p className="text-sm text-gray-500">Campanhas Concluídas</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-6 w-6 text-green-500" />
              <Globe2 className="h-4 w-4 text-green-400" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalReach}</p>
            <p className="text-sm text-gray-500">Alcance Total</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="h-6 w-6 text-blue-500" />
              <Rocket className="h-4 w-4 text-blue-400" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.avgEngagement}</p>
            <p className="text-sm text-gray-500">Engajamento Médio</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-xl border border-amber-100">
            <div className="flex items-center justify-between mb-2">
              <Star className="h-6 w-6 text-amber-500" />
              <Award className="h-4 w-4 text-amber-400" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">
              R$ {stats.totalEarnings.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Ganhos Totais</p>
          </div>
        </div>
      </div>

      {/* Campaign Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {portfolioItems.length === 0 ? (
          <div className="lg:col-span-2 text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <Award className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhuma campanha concluída
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Suas campanhas concluídas aparecerão aqui.
            </p>
          </div>
        ) : (
          portfolioItems.map((campaign) => (
            <div
              key={campaign.id}
              className="group bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 mb-4">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="flex-shrink-0">
                      <img
                        src={campaign.brand.logo}
                        alt={campaign.brand.name}
                        className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48';
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-medium text-gray-900">{campaign.product}</h3>
                      <p className="text-sm text-gray-500">{campaign.brand.name}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {campaign.type}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-4 py-3 sm:py-4 border-y border-gray-100">
                  <div className="text-center">
                    <Eye className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs sm:text-sm font-medium text-gray-900">{campaign.performance.views}</p>
                    <p className="text-xs text-gray-500">Visualizações</p>
                  </div>
                  <div className="text-center">
                    <Heart className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs sm:text-sm font-medium text-gray-900">{campaign.performance.engagement}</p>
                    <p className="text-xs text-gray-500">Engajamento</p>
                  </div>
                  <div className="text-center">
                    <ChevronRight className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs sm:text-sm font-medium text-gray-900">{campaign.performance.clicks}</p>
                    <p className="text-xs text-gray-500">Cliques</p>
                  </div>
                </div>

                <div className="mt-3 sm:mt-4 flex justify-end">
                  <button
                    onClick={() => setSelectedCampaign(campaign)}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    Ver Detalhes
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}