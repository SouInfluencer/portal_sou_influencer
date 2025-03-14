import React from 'react';
import { ArrowLeft, Eye, Heart, MessageSquare, Share2, BarChart2, Calendar, Clock, Globe2, Target, Users, Link as LinkIcon } from 'lucide-react';

interface PortfolioDetailsProps {
  campaign: any; // TODO: Add proper type
  onBack: () => void;
}

export function PortfolioDetails({ campaign, onBack }: PortfolioDetailsProps) {
  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        <button
          onClick={onBack}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 min-h-[44px] px-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar para portfólio
        </button>
      </div>

      {/* Campaign Overview */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-4 sm:mb-6">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <img
                src={`https://logo.clearbit.com/${campaign.brand.toLowerCase()}.com`}
                alt={campaign.brand}
                className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg sm:rounded-xl shadow-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64';
                }}
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{campaign.product}</h1>
                <div className="flex items-center mt-1 space-x-2">
                  <span className="text-gray-500">{campaign.brand}</span>
                  <span className="text-gray-300">•</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {campaign.type}
                  </span>
                </div>
              </div>
            </div>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 min-h-[44px]"
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              Ver Publicação
            </a>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <Eye className="h-5 w-5 text-blue-600" />
                <BarChart2 className="h-4 w-4 text-blue-400" />
              </div>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{campaign.performance.views}</p>
              <p className="text-sm text-gray-500">Visualizações</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-pink-50 to-white border border-pink-100">
              <div className="flex items-center justify-between mb-2">
                <Heart className="h-5 w-5 text-pink-600" />
                <BarChart2 className="h-4 w-4 text-pink-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{campaign.performance.engagement}</p>
              <p className="text-sm text-gray-500">Engajamento</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-100">
              <div className="flex items-center justify-between mb-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                <BarChart2 className="h-4 w-4 text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">156</p>
              <p className="text-sm text-gray-500">Comentários</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-white border border-green-100">
              <div className="flex items-center justify-between mb-2">
                <Share2 className="h-5 w-5 text-green-600" />
                <BarChart2 className="h-4 w-4 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">45</p>
              <p className="text-sm text-gray-500">Compartilhamentos</p>
            </div>
          </div>

          {/* Campaign Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Detalhes da Campanha</h3>
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Data de Publicação</p>
                    <p className="text-gray-500">15 de Março, 2024</p>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Duração da Campanha</p>
                    <p className="text-gray-500">7 dias</p>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <Target className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Objetivo</p>
                    <p className="text-gray-500">Lançamento de Produto</p>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Público-Alvo</p>
                    <p className="text-gray-500">Tech Enthusiasts, 25-45 anos</p>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <Globe2 className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Alcance Geográfico</p>
                    <p className="text-gray-500">Brasil</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Resultados</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                  <span className="text-gray-600">CTR</span>
                  <span className="font-medium text-gray-900">4.8%</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                  <span className="text-gray-600">Tempo Médio de Visualização</span>
                  <span className="font-medium text-gray-900">2:45</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                  <span className="text-gray-600">Taxa de Conversão</span>
                  <span className="font-medium text-gray-900">2.3%</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                  <span className="text-gray-600">ROI Estimado</span>
                  <span className="font-medium text-gray-900">3.2x</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}