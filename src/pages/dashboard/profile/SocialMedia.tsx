import React, { useState, useEffect } from 'react';
import { Instagram, Youtube, Video, Share2, Plus, ChevronRight, Users, Heart, BarChart2, Globe2, Settings2, Trash2, AlertTriangle } from 'lucide-react';
import { socialNetworksService } from '../../../services/socialNetworksService';
import { socialNetworkMetricsService } from '../../../services/socialNetworkMetricsService';
import { toast } from 'react-hot-toast';
import type { SocialAccount } from '../../../types';
import type { ProfileData } from '../../../services/profileService';

interface SocialMediaProps {
  profile: ProfileData;
}

export function SocialMedia({ profile }: SocialMediaProps) {
  const [selectedPlatform, setSelectedPlatform] = React.useState<SocialAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectedAccounts, setConnectedAccounts] = useState<SocialAccount[]>([]);
  const [metrics, setMetrics] = useState<{
    [key: string]: {
      followers: number;
      engagement: number;
      reachRate: number;
      averageViews: number;
      averageLikes: number;
      averageComments: number;
    };
  }>({});

  useEffect(() => {
    fetchConnectedAccounts();
  }, []);

  const fetchConnectedAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const accounts = await socialNetworksService.getConnectedAccounts();
      setConnectedAccounts(accounts);

      // Fetch metrics for each account
      const metricsPromises = accounts.map(account => 
        socialNetworkMetricsService.getAccountMetrics(account.platform)
      );
      
      const metricsResults = await Promise.allSettled(metricsPromises);
      const metricsData: typeof metrics = {};
      
      metricsResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          metricsData[accounts[index].platform] = result.value;
        }
      });

      setMetrics(metricsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar redes sociais');
      toast.error('Erro ao carregar redes sociais conectadas');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (platform: SocialAccount['platform']) => {
    try {
      setLoading(true);
      await socialNetworksService.disconnectAccount(platform);
      setConnectedAccounts(prev => prev.filter(account => account.platform !== platform));
      toast.success('Rede social desconectada com sucesso');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao desconectar rede social');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !connectedAccounts.length) {
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
            <h3 className="text-sm font-medium text-red-800">Erro ao carregar redes sociais</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={fetchConnectedAccounts}
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
      {connectedAccounts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <Share2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Nenhuma rede social conectada
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Conecte suas redes sociais para gerenciar suas campanhas.
          </p>
          <div className="mt-6">
            <button
              onClick={() => window.location.href = '/dashboard/social-networks'}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Conectar Rede Social
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {connectedAccounts.map((account) => (
            <div
              key={account.platform}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-xl ${
                      account.platform === 'instagram' ? 'bg-pink-50' :
                      account.platform === 'youtube' ? 'bg-red-50' :
                      'bg-gray-50'
                    }`}>
                      {account.platform === 'instagram' && <Instagram className="h-6 w-6 text-pink-600" />}
                      {account.platform === 'youtube' && <Youtube className="h-6 w-6 text-red-600" />}
                      {account.platform === 'tiktok' && <Video className="h-6 w-6" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{account.platform}</h3>
                      <p className="text-sm text-gray-500">{account.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleDisconnect(account.platform)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Settings2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-100">
                  <div className="text-center">
                    <Users className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                    <p className="text-sm font-medium text-gray-900">
                      {metrics[account.platform]?.followers.toLocaleString() || '0'}
                    </p>
                    <p className="text-xs text-gray-500">Seguidores</p>
                  </div>
                  <div className="text-center">
                    <Heart className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                    <p className="text-sm font-medium text-gray-900">
                      {metrics[account.platform]?.engagement || '0'}%
                    </p>
                    <p className="text-xs text-gray-500">Engajamento</p>
                  </div>
                  <div className="text-center">
                    <Globe2 className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                    <p className="text-sm font-medium text-gray-900">
                      {metrics[account.platform]?.reachRate || '0'}%
                    </p>
                    <p className="text-xs text-gray-500">Alcance</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button 
                    onClick={() => window.location.href = `/dashboard/social-networks/${account.platform}/metrics`}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
                  >
                    Ver Métricas
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}