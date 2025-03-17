import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Heart, MessageSquare, Share2, BarChart2, Calendar, Clock, Globe2, Target, Users, Link as LinkIcon, ExternalLink } from 'lucide-react';
import type { PortfolioItem } from '../../../services/portfolioService';
import { campaignDetailsService } from '../../../services/campaignDetailsService';
import { toast } from 'react-hot-toast';

interface PortfolioDetailsProps {
  campaign: PortfolioItem;
  onBack: () => void;
}

export function PortfolioDetails({ campaign, onBack }: PortfolioDetailsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<{
    metrics: {
      reach: number;
      engagement: number;
      clicks: number;
      conversions: number;
    };
    timeline: Array<{
      id: string;
      date: string;
      type: 'milestone' | 'update' | 'message';
      content: string;
    }>;
    tasks: Array<{
      id: string;
      title: string;
      completed: boolean;
      dueDate?: string;
    }>;
  }>({
    metrics: {
      reach: 0,
      engagement: 0,
      clicks: 0,
      conversions: 0
    },
    timeline: [],
    tasks: []
  });

  useEffect(() => {
    fetchCampaignDetails();
  }, [campaign.id]);

  const fetchCampaignDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await campaignDetailsService.getCampaignDetails(campaign.id);
      setDetails({
        metrics: data.metrics,
        timeline: data.timeline,
        tasks: data.tasks
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar detalhes da campanha');
      toast.error('Erro ao carregar detalhes da campanha');
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
            <h3 className="text-sm font-medium text-red-800">Erro ao carregar detalhes</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={fetchCampaignDetails}
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
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{campaign.product}</h2>
              <p className="text-gray-500">{campaign.brand.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Campanha Concluída</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 mb-8 grid-cols-2 sm:grid-cols-4">
          <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <Eye className="h-6 w-6 text-blue-600" />
              <BarChart2 className="h-4 w-4 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{details.metrics.reach.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Alcance</p>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-white p-6 rounded-xl border border-pink-100">
            <div className="flex items-center justify-between mb-2">
              <Heart className="h-6 w-6 text-pink-600" />
              <BarChart2 className="h-4 w-4 text-pink-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{details.metrics.engagement}%</p>
            <p className="text-sm text-gray-500">Engajamento</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <MessageSquare className="h-6 w-6 text-purple-600" />
              <BarChart2 className="h-4 w-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{details.metrics.clicks.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Cliques</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100">
            <div className="flex items-center justify-between mb-2">
              <Share2 className="h-6 w-6 text-green-600" />
              <BarChart2 className="h-4 w-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{details.metrics.conversions}</p>
            <p className="text-sm text-gray-500">Conversões</p>
          </div>
        </div>

        {/* Campaign Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Campaign Info */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Detalhes da Campanha</h3>
            <div className="space-y-4">
              <div className="flex items-center text-sm">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Data de Publicação</p>
                  <p className="text-gray-500">{new Date(campaign.date).toLocaleDateString()}</p>
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

          {/* Timeline */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Linha do Tempo</h3>
            <div className="space-y-4">
              {details.timeline.map((event) => (
                <div key={event.id} className="flex items-start">
                  <div className="flex-shrink-0 w-8">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      event.type === 'milestone' ? 'bg-green-100' :
                      event.type === 'update' ? 'bg-blue-100' :
                      'bg-gray-100'
                    }`}>
                      {event.type === 'milestone' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : event.type === 'update' ? (
                        <RefreshCw className="h-4 w-4 text-blue-600" />
                      ) : (
                        <MessageSquare className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                  </div>
                  <div className="ml-4 min-w-0 flex-1">
                    <p className="text-sm text-gray-900">{event.content}</p>
                    <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Preview */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Conteúdo da Campanha</h3>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="aspect-video relative">
              {campaign.content.type === 'video' ? (
                <iframe
                  src={campaign.content.url}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <img
                  src={campaign.content.thumbnail || campaign.content.url}
                  alt="Campaign content"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
            </div>
            <div className="p-4 border-t border-gray-200">
              <a
                href={campaign.content.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Ver publicação original
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}