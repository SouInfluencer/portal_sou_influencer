import React from 'react';
import { TrendingUp, Users, Calendar, ChevronRight, Globe2, Rocket, Sparkles, Star, Award, Eye, Heart } from 'lucide-react';
import { PortfolioDetails } from './PortfolioDetails';

interface PortfolioProps {
  profile: any; // TODO: Add proper type
}

export function Portfolio({ profile }: PortfolioProps) {
  const [selectedCampaign, setSelectedCampaign] = React.useState<any | null>(null);

  if (selectedCampaign) {
    return <PortfolioDetails campaign={selectedCampaign} onBack={() => setSelectedCampaign(null)} />;
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Portfolio Stats */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 hover:border-blue-200 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <Sparkles className="h-4 w-4 text-blue-400" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">45</p>
            <p className="text-sm text-gray-500">Campanhas Concluídas</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-white border border-green-100 hover:border-green-200 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-5 w-5 text-green-500" />
              <Globe2 className="h-4 w-4 text-green-400" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{profile.metrics.totalReach}</p>
            <p className="text-sm text-gray-500">Alcance Total</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 hover:border-blue-200 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <Rocket className="h-4 w-4 text-blue-400" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{profile.metrics.avgEngagement}</p>
            <p className="text-sm text-gray-500">Engajamento Médio</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-white border border-amber-100 hover:border-amber-200 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <Star className="h-5 w-5 text-amber-500" />
              <Award className="h-4 w-4 text-amber-400" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{profile.metrics.rating}</p>
            <p className="text-sm text-gray-500">Avaliação Média</p>
          </div>
        </div>
      </div>

      {/* Campaign Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {profile.recentCampaigns.map((campaign: any, index: number) => (
          <div
            key={index}
            className="group bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 mb-4">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="flex-shrink-0">
                    <img
                      src={`https://logo.clearbit.com/${campaign.brand.toLowerCase()}.com`}
                      alt={campaign.brand}
                      className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48';
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-medium text-gray-900">{campaign.product}</h3>
                    <p className="text-sm text-gray-500">{campaign.brand}</p>
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
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200 min-h-[44px]"
                >
                  Ver Detalhes
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}