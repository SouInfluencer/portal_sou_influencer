import React from 'react';
import { Instagram, Youtube, Video, Share2, Plus, ChevronRight, Users, Heart, BarChart2, Globe2, Settings2, Trash2 } from 'lucide-react';
import { AddSocialNetwork } from './AddSocialNetwork';
import { useNavigate } from 'react-router-dom';

export function SocialNetworks() {
  const navigate = useNavigate();
  const [showAddNetwork, setShowAddNetwork] = React.useState(false);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = React.useState<string | null>(null);
  
  const connectedNetworks = [
    {
      id: '1',
      platform: 'Instagram',
      username: '@joaosilva',
      followers: 150000,
      engagement: 4.8,
      icon: Instagram,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      metrics: {
        reach: '45K',
        engagement: '4.8%',
        interactions: '2.3K'
      }
    },
    {
      id: '2',
      platform: 'YouTube',
      username: 'João Silva Tech',
      followers: 250000,
      engagement: 3.9,
      icon: Youtube,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      metrics: {
        reach: '85K',
        engagement: '3.9%',
        interactions: '4.1K'
      }
    }
  ];

  const handleDisconnect = (networkId: string) => {
    // TODO: Implement network disconnection
    console.log('Disconnecting network:', networkId);
    setShowDisconnectConfirm(null);
  };

  if (showAddNetwork) {
    return <AddSocialNetwork onBack={() => setShowAddNetwork(false)} />;
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Empty State */}
        {connectedNetworks.length === 0 && (
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
        )}

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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {connectedNetworks.map((network) => (
            <div
              key={network.id}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-xl ${network.bgColor}`}>
                      <network.icon className={`h-6 w-6 ${network.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{network.platform}</h3>
                      <p className="text-sm text-gray-500">{network.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setShowDisconnectConfirm(network.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Settings2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-100">
                  <div className="text-center">
                    <Users className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                    <p className="text-sm font-medium text-gray-900">{network.metrics.reach}</p>
                    <p className="text-xs text-gray-500">Alcance</p>
                  </div>
                  <div className="text-center">
                    <Heart className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                    <p className="text-sm font-medium text-gray-900">{network.metrics.engagement}</p>
                    <p className="text-xs text-gray-500">Engajamento</p>
                  </div>
                  <div className="text-center">
                    <Globe2 className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                    <p className="text-sm font-medium text-gray-900">{network.metrics.interactions}</p>
                    <p className="text-xs text-gray-500">Interações</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button 
                    onClick={() => navigate(`/dashboard/social-networks/${network.id}/metrics`)}
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
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => handleDisconnect(showDisconnectConfirm)}
                >
                  Desconectar
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setShowDisconnectConfirm(null)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}