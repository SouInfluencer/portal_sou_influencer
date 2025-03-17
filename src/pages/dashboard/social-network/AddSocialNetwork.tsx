import React, { useState } from 'react';
import { Camera, MapPin, Link as LinkIcon, Instagram, Youtube, Video, Edit2, AtSign, Users, Globe2, Heart, MessageSquare, Globe, Award, ChevronRight, Star, BarChart2, Sparkles, Crown, X, Plus, AlertTriangle, Info, Check, Download, Clock } from 'lucide-react';
import { socialNetworkService } from '../../../services/socialNetworkService.ts';
import { toast } from 'react-hot-toast';
import type { Platform } from '../types';

interface AddSocialNetworkProps {
  onBack: () => void;
}

export function AddSocialNetwork({ onBack }: AddSocialNetworkProps) {
  const [step, setStep] = useState<'select' | 'username' | 'validation' | 'verifying' | 'review' | 'success'>('select');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [validationPost, setValidationPost] = useState<{
    image: string;
    caption: string;
  }>({
    image: '',
    caption: ''
  });
  const [postUrl, setPostUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const platforms = [
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
      bgColor: 'bg-pink-50'
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

  const handleConnect = async (platform: Platform) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedPlatform(platform);
      
      // Get validation image and caption
      const validationData = await socialNetworkService.getValidationImage(platform);
      setValidationPost(validationData);
      
      setStep('username');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao iniciar conexão');
      toast.error('Erro ao iniciar processo de conexão');
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !selectedPlatform) return;

    try {
      setLoading(true);
      setError(null);

      const validation = await socialNetworkService.validateAccount(selectedPlatform, username);
      
      if (validation.valid) {
        setStep('validation');
      } else {
        setError(validation.error || 'Usuário não encontrado ou inválido');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao validar usuário');
      toast.error('Erro ao validar usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleValidationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postUrl.trim() || !selectedPlatform) return;

    try {
      setLoading(true);
      setError(null);
      setStep('verifying');

      const validation = await socialNetworkService.submitValidationPost(selectedPlatform, username, postUrl);
      
      if (validation.valid) {
        setStep('review');
      } else {
        setError(validation.error || 'Não foi possível validar a publicação');
        setStep('validation');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao validar publicação');
      setStep('validation');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminApproval = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!selectedPlatform || !username) {
        throw new Error('Dados inválidos');
      }

      await socialNetworkService.connectAccount(selectedPlatform, username);
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao conectar conta');
      setStep('review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto py-6 sm:py-8">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <X className="h-4 w-4 mr-1" />
            Voltar
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Conectar Redes Sociais</h1>
          <p className="text-base sm:text-lg text-gray-600">
            Integre suas redes sociais para:
            <span className="block mt-2 text-sm text-gray-500">
              • Gerenciar campanhas e métricas em um só lugar • Receber propostas personalizadas • Aumentar sua visibilidade
            </span>
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setError(null)}
                    className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'select' && (
          <div className="grid gap-6">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${platform.bgColor}`}>
                        <platform.icon className={`h-6 w-6 ${platform.color}`} />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-medium text-gray-900">{platform.name}</h3>
                        <p className="text-sm text-gray-500">{platform.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleConnect(platform.id as Platform)}
                      disabled={loading}
                      className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105"
                    >
                      Conectar
                    </button>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-blue-500" />
                        Recursos
                      </h4>
                      <ul className="space-y-2">
                        {platform.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-500">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 'username' && selectedPlatform && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className={`p-3 rounded-xl ${platforms.find(p => p.id === selectedPlatform)?.bgColor}`}>
                  {React.createElement(platforms.find(p => p.id === selectedPlatform)?.icon || Instagram, {
                    className: `h-6 w-6 ${platforms.find(p => p.id === selectedPlatform)?.color}`
                  })}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Conectar {platforms.find(p => p.id === selectedPlatform)?.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Informe seu nome de usuário para iniciar a validação
                  </p>
                </div>
              </div>

              <form onSubmit={handleUsernameSubmit} className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome de usuário
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <AtSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                      placeholder={`Seu usuário do ${platforms.find(p => p.id === selectedPlatform)?.name}`}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-8 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {loading ? (
                      <>
                        <Clock className="animate-spin h-5 w-5 mr-2" />
                        Verificando...
                      </>
                    ) : (
                      'Continuar'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {step === 'validation' && selectedPlatform && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className={`p-3 rounded-xl ${platforms.find(p => p.id === selectedPlatform)?.bgColor}`}>
                  {React.createElement(platforms.find(p => p.id === selectedPlatform)?.icon || Instagram, {
                    className: `h-6 w-6 ${platforms.find(p => p.id === selectedPlatform)?.color}`
                  })}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Validação da Conta
                  </h3>
                  <p className="text-sm text-gray-600">
                    Faça uma publicação com a imagem e legenda fornecidas para validar sua conta
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Imagem para Publicação</h4>
                <div className="relative rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={validationPost.image}
                    alt="Imagem de validação"
                    className="w-full h-64 object-cover"
                  />
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = validationPost.image;
                      link.download = 'validacao.jpg';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="absolute bottom-4 right-4 inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-black/50 backdrop-blur-sm hover:bg-black/60 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Imagem
                  </button>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Legenda</h4>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <p className="text-sm text-gray-600 whitespace-pre-line">{validationPost.caption}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(validationPost.caption);
                    }}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar Legenda
                  </button>
                </div>
              </div>

              <form onSubmit={handleValidationSubmit} className="space-y-6">
                <div>
                  <label htmlFor="postUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    Link da Publicação
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LinkIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="url"
                      name="postUrl"
                      id="postUrl"
                      value={postUrl}
                      onChange={(e) => setPostUrl(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                      placeholder="https://"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setStep('username')}
                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-8 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {loading ? (
                      <>
                        <Clock className="animate-spin h-5 w-5 mr-2" />
                        Verificando...
                      </>
                    ) : (
                      'Verificar Publicação'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {step === 'verifying' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <Clock className="h-6 w-6 text-blue-600 animate-spin" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Verificando Publicação
              </h3>
              <p className="text-sm text-gray-600">
                Aguarde enquanto verificamos sua publicação...
              </p>
            </div>
          </div>
        )}

        {step === 'review' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className={`p-3 rounded-xl ${platforms.find(p => p.id === selectedPlatform)?.bgColor}`}>
                  {React.createElement(platforms.find(p => p.id === selectedPlatform)?.icon || Instagram, {
                    className: `h-6 w-6 ${platforms.find(p => p.id === selectedPlatform)?.color}`
                  })}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Revisão do Administrador
                  </h3>
                  <p className="text-sm text-gray-600">
                    Sua publicação foi verificada e está aguardando aprovação
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-yellow-800">
                      Em Análise
                    </h4>
                    <p className="mt-2 text-sm text-yellow-700">
                      Um administrador irá revisar sua publicação em breve para confirmar a autenticidade da sua conta.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setStep('validation')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
                >
                  Voltar
                </button>
                <button
                  onClick={handleAdminApproval}
                  disabled={loading}
                  className="inline-flex items-center px-8 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <Clock className="animate-spin h-5 w-5 mr-2" />
                      Processando...
                    </>
                  ) : (
                    'Aprovar Conta'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Conexão Estabelecida!
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Sua conta do {platforms.find(p => p.id === selectedPlatform)?.name} foi validada e ativada com sucesso.
            </p>
            <button
              onClick={onBack}
              className="inline-flex items-center px-8 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Voltar para Redes Sociais
            </button>
          </div>
        )}
      </div>
    </div>
  );
}