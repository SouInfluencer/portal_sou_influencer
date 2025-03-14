import React from 'react';
import { Instagram, Youtube, Video, Check } from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  icon: typeof Instagram;
  description: string;
  features: string[];
  permissions: string[];
  color: string;
  gradientFrom: string;
  bgColor: string;
  popular?: boolean;
}

interface SelectPlatformProps {
  selectedPlatform: string | null;
  onPlatformSelect: (platform: string) => void;
  onNext: () => void;
}

export function SelectPlatform({
  selectedPlatform,
  onPlatformSelect,
  onNext
}: SelectPlatformProps) {
  const platforms: Platform[] = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      description: 'Conecte sua conta profissional do Instagram para gerenciar campanhas e métricas.',
      features: [
        'Métricas de engajamento em tempo real',
        'Agendamento de posts',
        'Insights de audiência',
        'Gestão de campanhas'
      ],
      permissions: [
        'Ler informações do perfil',
        'Acessar métricas e insights',
        'Publicar conteúdo',
        'Gerenciar mensagens'
      ],
      color: 'text-pink-600',
      gradientFrom: 'from-pink-500',
      bgColor: 'bg-pink-50',
      popular: true
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Youtube,
      description: 'Integre seu canal do YouTube para análise de desempenho e gestão de conteúdo.',
      features: [
        'Analytics avançado',
        'Gestão de comentários',
        'Métricas de visualização',
        'Insights de monetização'
      ],
      permissions: [
        'Acessar dados do canal',
        'Ler métricas e analytics',
        'Gerenciar uploads',
        'Moderar comentários'
      ],
      color: 'text-red-600',
      gradientFrom: 'from-red-500',
      bgColor: 'bg-red-50'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: Video,
      description: 'Conecte sua conta do TikTok para expandir seu alcance e gerenciar campanhas.',
      features: [
        'Métricas de performance',
        'Gestão de conteúdo',
        'Análise de tendências',
        'Insights de audiência'
      ],
      permissions: [
        'Acessar dados do perfil',
        'Ler métricas e analytics',
        'Publicar conteúdo',
        'Gerenciar interações'
      ],
      color: 'text-gray-900',
      gradientFrom: 'from-gray-500',
      bgColor: 'bg-gray-50'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Conectar Rede Social</h2>
        <p className="mt-2 text-gray-600">
          Escolha a plataforma que deseja conectar para começar a gerenciar suas campanhas
        </p>
      </div>

      <div className="grid gap-6 platform-grid">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            onClick={() => onPlatformSelect(platform.id)}
            className={`relative rounded-xl border ${
              selectedPlatform === platform.id
                ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50/50'
                : 'border-gray-200 hover:border-blue-300'
            } p-6 cursor-pointer transition-all duration-200 platform-card`}
          >
            {platform.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Popular
                </span>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${platform.bgColor}`}>
                <platform.icon className={`h-6 w-6 ${platform.color}`} />
              </div>
              {selectedPlatform === platform.id && (
                <Check className="h-5 w-5 text-blue-600" />
              )}
            </div>

            <h3 className="text-lg font-medium text-gray-900 mb-2">{platform.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{platform.description}</p>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Recursos</h4>
                <ul className="space-y-2">
                  {platform.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Permissões</h4>
                <ul className="space-y-2">
                  {platform.permissions.map((permission, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <Check className="h-4 w-4 text-blue-500 mr-2" />
                      {permission}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onNext}
          disabled={!selectedPlatform}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}