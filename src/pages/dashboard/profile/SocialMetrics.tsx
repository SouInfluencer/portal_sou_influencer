import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Heart, MessageSquare, Share2, BarChart2, Calendar, Clock, Globe2, Target, Users, Link as LinkIcon, ExternalLink, AlertTriangle } from 'lucide-react';
import { socialNetworkMetricsService } from '../../../services/socialNetworkMetricsService';
import { toast } from 'react-hot-toast';
import type { SocialAccount } from '../../../types';

interface SocialMetricsProps {
  platform: SocialAccount['platform'];
  onBack: () => void;
}

export function SocialMetrics({ platform, onBack }: SocialMetricsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<{
    followers: number;
    engagement: number;
    reachRate: number;
    averageViews: number;
    averageLikes: number;
    averageComments: number;
    demographics: {
      age: {
        [key: string]: number;
      };
      gender: {
        male: number;
        female: number;
        other: number;
      };
      locations: Array<{
        city: string;
        percentage: number;
      }>;
    };
    growth: {
      monthly: number;
      weekly: number;
      daily: number;
    };
    bestTime: {
      day: string;
      hour: string;
      engagement: number;
    };
    contentPerformance: Array<{
      type: string;
      averageEngagement: number;
      averageReach: number;
    }>;
  }>({
    followers: 0,
    engagement: 0,
    reachRate: 0,
    averageViews: 0,
    averageLikes: 0,
    averageComments: 0,
    demographics: {
      age: {},
      gender: {
        male: 0,
        female: 0,
        other: 0
      },
      locations: []
    },
    growth: {
      monthly: 0,
      weekly: 0,
      daily: 0
    },
    bestTime: {
      day: '',
      hour: '',
      engagement: 0
    },
    contentPerformance: []
  });

  const [insights, setInsights] = useState<{
    views: number[];
    engagement: number[];
    followers: number[];
    dates: string[];
  }>({
    views: [],
    engagement: [],
    followers: [],
    dates: []
  });

  useEffect(() => {
    fetchMetrics();
  }, [platform]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      const [metricsData, insightsData] = await Promise.all([
        socialNetworkMetricsService.getAccountMetrics(platform),
        socialNetworkMetricsService.getAccountInsights(platform)
      ]);

      setMetrics(metricsData);
      setInsights(insightsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar métricas');
      toast.error('Erro ao carregar métricas da rede social');
    } finally {
      setLoading(false);
    }
  };

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
            <h3 className="text-sm font-medium text-red-800">Erro ao carregar métricas</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={fetchMetrics}
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
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-6 w-6 text-blue-600" />
            <BarChart2 className="h-4 w-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.followers.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Seguidores</p>
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-white p-6 rounded-xl border border-pink-100">
          <div className="flex items-center justify-between mb-2">
            <Heart className="h-6 w-6 text-pink-600" />
            <BarChart2 className="h-4 w-4 text-pink-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.engagement}%</p>
          <p className="text-sm text-gray-500">Engajamento</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100">
          <div className="flex items-center justify-between mb-2">
            <Eye className="h-6 w-6 text-purple-600" />
            <BarChart2 className="h-4 w-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.averageViews.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Média de Views</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100">
          <div className="flex items-center justify-between mb-2">
            <MessageSquare className="h-6 w-6 text-green-600" />
            <BarChart2 className="h-4 w-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.averageComments.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Média de Comentários</p>
        </div>
      </div>

      {/* Growth Metrics */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Crescimento</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Diário</span>
              <span className={`text-xs font-medium ${
                metrics.growth.daily >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {metrics.growth.daily >= 0 ? '+' : ''}{metrics.growth.daily}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div
                className={`h-2 rounded-full ${
                  metrics.growth.daily >= 0 ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.abs(metrics.growth.daily)}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Semanal</span>
              <span className={`text-xs font-medium ${
                metrics.growth.weekly >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {metrics.growth.weekly >= 0 ? '+' : ''}{metrics.growth.weekly}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div
                className={`h-2 rounded-full ${
                  metrics.growth.weekly >= 0 ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.abs(metrics.growth.weekly)}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Mensal</span>
              <span className={`text-xs font-medium ${
                metrics.growth.monthly >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {metrics.growth.monthly >= 0 ? '+' : ''}{metrics.growth.monthly}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div
                className={`h-2 rounded-full ${
                  metrics.growth.monthly >= 0 ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.abs(metrics.growth.monthly)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Distribution */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Faixa Etária</h3>
          <div className="space-y-4">
            {Object.entries(metrics.demographics.age).map(([age, percentage]) => (
              <div key={age}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">{age}</span>
                  <span className="text-sm font-medium text-gray-900">{percentage}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gender Distribution */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Gênero</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Feminino</span>
                <span className="text-sm font-medium text-gray-900">{metrics.demographics.gender.female}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-pink-500 rounded-full"
                  style={{ width: `${metrics.demographics.gender.female}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Masculino</span>
                <span className="text-sm font-medium text-gray-900">{metrics.demographics.gender.male}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-blue-500 rounded-full"
                  style={{ width: `${metrics.demographics.gender.male}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Outro</span>
                <span className="text-sm font-medium text-gray-900">{metrics.demographics.gender.other}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-purple-500 rounded-full"
                  style={{ width: `${metrics.demographics.gender.other}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Performance */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance por Tipo de Conteúdo</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.contentPerformance.map((content, index) => (
            <div key={index} className="p-4 rounded-lg bg-gray-50">
              <h4 className="text-sm font-medium text-gray-900 mb-3">{content.type}</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Engajamento</span>
                    <span className="text-xs font-medium text-gray-900">{content.averageEngagement}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full">
                    <div
                      className="h-1.5 bg-blue-500 rounded-full"
                      style={{ width: `${content.averageEngagement}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Alcance</span>
                    <span className="text-xs font-medium text-gray-900">{content.averageReach}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full">
                    <div
                      className="h-1.5 bg-green-500 rounded-full"
                      style={{ width: `${content.averageReach}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Time to Post */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Melhor Horário para Postar</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Dia da Semana</p>
            <p className="text-lg font-medium text-gray-900">{metrics.bestTime.day}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Horário</p>
            <p className="text-lg font-medium text-gray-900">{metrics.bestTime.hour}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Engajamento Médio</p>
            <p className="text-lg font-medium text-green-600">{metrics.bestTime.engagement}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}