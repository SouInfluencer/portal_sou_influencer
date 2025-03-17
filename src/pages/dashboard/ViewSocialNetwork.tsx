import React, { useState } from 'react';
import { Instagram, Youtube, Video, Twitter, Edit2, Check, X, AtSign, Users, Globe2, Heart, MessageSquare, BarChart3, Settings2, Trash2, AlertTriangle } from 'lucide-react';
import type { SocialAccount } from '../../types';

interface ViewSocialNetworkProps {
  account: SocialAccount;
  onEdit: () => void;
  onDisconnect: (platform: SocialAccount['platform']) => void;
}

export function ViewSocialNetwork({ account, onEdit, onDisconnect }: ViewSocialNetworkProps) {
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

  const getPlatformIcon = (platform: SocialAccount['platform']) => {
    const icons = {
      instagram: Instagram,
      tiktok: Video,
      youtube: Youtube,
      twitter: Twitter
    };
    return icons[platform];
  };

  const getPlatformColor = (platform: SocialAccount['platform']) => {
    const colors = {
      instagram: 'text-pink-500 hover:text-pink-600',
      tiktok: 'text-black hover:text-gray-800',
      youtube: 'text-red-500 hover:text-red-600',
      twitter: 'text-blue-400 hover:text-blue-500'
    };
    return colors[platform];
  };

  const getPlatformGradient = (platform: SocialAccount['platform']) => {
    const gradients = {
      instagram: 'from-pink-500 via-purple-500 to-blue-500',
      tiktok: 'from-gray-900 to-gray-800',
      youtube: 'from-red-600 to-red-500',
      twitter: 'from-blue-400 to-blue-500'
    };
    return gradients[platform];
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getAccountTypeColor = (type: SocialAccount['accountType']) => {
    const colors = {
      personal: 'bg-blue-100 text-blue-800',
      creator: 'bg-purple-100 text-purple-800',
      business: 'bg-green-100 text-green-800'
    };
    return colors[type];
  };

  const accountTypes = {
    personal: 'Conta Pessoal',
    creator: 'Conta Criador',
    business: 'Conta Business'
  };

  const metrics = [
    {
      icon: Users,
      label: 'Seguidores',
      value: formatFollowers(account.followers),
      color: 'text-blue-600'
    },
    {
      icon: Heart,
      label: 'Engajamento',
      value: '4.2%',
      color: 'text-red-600'
    },
    {
      icon: MessageSquare,
      label: 'Comentários/Post',
      value: '156',
      color: 'text-green-600'
    },
    {
      icon: Globe2,
      label: 'Alcance',
      value: '45K',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getPlatformGradient(account.platform)} p-6 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white rounded-xl shadow-lg">
                {React.createElement(getPlatformIcon(account.platform), {
                  className: `h-8 w-8 ${getPlatformColor(account.platform)}`
                })}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">{account.username}</h3>
                <div className="flex items-center mt-1 space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccountTypeColor(account.accountType)}`}>
                    {accountTypes[account.accountType]}
                  </span>
                  {account.verified && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verificado
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={onEdit}
                className="inline-flex items-center px-3 py-2 border border-white/30 rounded-lg text-sm font-medium text-white hover:bg-white/20 transition-colors duration-200"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Editar
              </button>
              <button
                onClick={() => setShowDisconnectConfirm(true)}
                className="inline-flex items-center px-3 py-2 border border-white/30 rounded-lg text-sm font-medium text-white hover:bg-white/20 transition-colors duration-200"
              >
                <Settings2 className="h-4 w-4 mr-2" />
                Gerenciar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric) => (
            <div key={metric.label} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
                <BarChart3 className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              <p className="text-sm text-gray-500">{metric.label}</p>
            </div>
          ))}
        </div>

        {/* Categories and Content Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Categorias de Conteúdo</h4>
            <div className="flex flex-wrap gap-2">
              {account.contentCategories.map((category) => (
                <span key={category} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {category}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Tipos de Conteúdo</h4>
            <div className="flex flex-wrap gap-2">
              {account.contentTypes.map((type) => (
                <span key={type} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-8">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Preços por Formato</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Feed Post</h5>
              <p className="text-2xl font-bold text-gray-900">
                R$ {account.pricing.post.toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Story</h5>
              <p className="text-2xl font-bold text-gray-900">
                R$ {account.pricing.story.toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Reels</h5>
              <p className="text-2xl font-bold text-gray-900">
                R$ {account.pricing.reels.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Disconnect Confirmation Modal */}
      {showDisconnectConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
              Desconectar Conta
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Tem certeza que deseja desconectar sua conta do {account.platform}? 
              Você precisará reconectar para continuar gerenciando campanhas nesta plataforma.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDisconnectConfirm(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDisconnect(account.platform);
                  setShowDisconnectConfirm(false);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Desconectar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}