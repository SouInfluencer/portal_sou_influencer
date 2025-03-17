import React, { useState } from 'react';
import { Instagram, Youtube, Video, Share2, Plus, ChevronRight, Users, Heart, BarChart2, Globe2, Settings2, Trash2, Loader2, AlertCircle, X, Info } from 'lucide-react';
import { AddSocialNetwork } from './AddSocialNetwork';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

interface SocialNetwork {
  id: string;
  platform: string;
  username: string;
  status: 'pending' | 'validating' | 'approved' | 'rejected';
  verified: boolean;
  verified_at: string | null;
  rejection_reason?: string;
  post_url: string | null;
  created_at: string;
}

export function SocialNetworks() {
  const navigate = useNavigate();
  const [showAddNetwork, setShowAddNetwork] = React.useState(false);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [connectedNetworks, setConnectedNetworks] = React.useState<SocialNetwork[]>([]);
  const [selectedNetwork, setSelectedNetwork] = React.useState<SocialNetwork | null>(null);
  const [showRejectionModal, setShowRejectionModal] = React.useState(false);

  // Listen for navigation changes
  React.useEffect(() => {
    const handleFocus = () => {
      fetchSocialNetworks();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  React.useEffect(() => {
    fetchSocialNetworks();
  }, []);

  const fetchSocialNetworks = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const { data: networks, error } = await supabase
        .from('social_networks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setConnectedNetworks(networks || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching social networks:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar redes sociais');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async (networkId: string) => {
    try {
      const { error } = await supabase
        .from('social_networks')
        .delete()
        .eq('id', networkId);

      if (error) throw error;

      setConnectedNetworks(prev => prev.filter(network => network.id !== networkId));
      setShowDisconnectConfirm(null);
      toast.success('Rede social desconectada com sucesso');
    } catch (err) {
      console.error('Error disconnecting network:', err);
      toast.error('Erro ao desconectar rede social');
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return Instagram;
      case 'youtube':
        return Youtube;
      case 'tiktok':
        return Video;
      default:
        return Share2;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return { color: 'text-pink-600', bg: 'bg-pink-50' };
      case 'youtube':
        return { color: 'text-red-600', bg: 'bg-red-50' };
      case 'tiktok':
        return { color: 'text-gray-900', bg: 'bg-gray-50' };
      default:
        return { color: 'text-blue-600', bg: 'bg-blue-50' };
    }
  };

  const getStatusColor = (status: SocialNetwork['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'validating':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: SocialNetwork['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'validating':
        return 'Em Validação';
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Rejeitado';
      default:
        return status;
    }
  };

  if (showAddNetwork) {
    return <AddSocialNetwork onBack={() => setShowAddNetwork(false)} />;
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        ) : connectedNetworks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <Share2 className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Conecte suas redes sociais
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              Para começar a receber propostas de campanhas, conecte pelo menos uma rede social.
              Quanto mais redes conectadas, mais oportunidades você terá!
            </p>
            <button
              onClick={() => setShowAddNetwork(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Conectar Rede Social
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Redes Sociais</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gerencie suas conexões com redes sociais
              </p>
            </div>
            <button
              onClick={() => setShowAddNetwork(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Conectar Nova Rede
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {connectedNetworks.map((network) => {
            const Icon = getPlatformIcon(network.platform);
            const { color, bg } = getPlatformColor(network.platform);
            return (
              <div
                key={network.id}
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-xl ${bg}`}>
                        <Icon className={`h-6 w-6 ${color}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{network.platform}</h3>
                        <p className="text-sm text-gray-500">@{network.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(network.status)}`}>
                        {getStatusLabel(network.status)}
                        {network.status === 'rejected' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedNetwork(network);
                              setShowRejectionModal(true);
                            }}
                            className="ml-1 p-0.5 hover:bg-red-200 rounded-full transition-colors duration-200"
                          >
                            <Info className="h-3 w-3" />
                          </button>
                        )}
                      </span>
                      <button 
                        onClick={() => setShowDisconnectConfirm(network.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <Settings2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disconnect Confirmation Modal */}
      {showDisconnectConfirm && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Desconectar Rede Social
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Tem certeza que deseja desconectar esta rede social? Você precisará reconectar para gerenciar campanhas nesta plataforma.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => {
                    if (showDisconnectConfirm) {
                      handleDisconnect(showDisconnectConfirm);
                    }
                  }}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Desconectar
                </button>
                <button
                  type="button"
                  onClick={() => setShowDisconnectConfirm(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Rejection Details Modal */}
      {showRejectionModal && selectedNetwork && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={() => {
                    setShowRejectionModal(false);
                    setSelectedNetwork(null);
                  }}
                  className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Validação Rejeitada
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {selectedNetwork.rejection_reason || 'A validação da sua rede social foi rejeitada. Por favor, tente novamente seguindo as instruções corretamente.'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      if (selectedNetwork) {
                        await handleDisconnect(selectedNetwork.id);
                        setSelectedNetwork(null);
                        setShowRejectionModal(false);
                        setShowAddNetwork(true);
                      }
                    } catch (error) {
                      console.error('Error removing social network:', error);
                      toast.error('Erro ao remover rede social');
                    }
                  }}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Tentar Novamente
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRejectionModal(false);
                    setSelectedNetwork(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}