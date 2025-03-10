import React, { useState } from 'react';
import { Instagram, Youtube, Video, ArrowLeft, Shield, AlertCircle, CheckCircle, Info, X, Image, Upload, Loader2, Camera, AtSign, Copy, Download, Link as LinkIcon, HelpCircle } from 'lucide-react';

// Add mobile-first styles
const styles = `
/* Base styles */
:root {
  --min-touch-target: clamp(2.75rem, 8vw, 3rem); /* 44-48px */
  --container-padding: clamp(1rem, 5vw, 2rem);
  --font-size-base: clamp(0.875rem, 4vw, 1rem);
  --font-size-lg: clamp(1.125rem, 5vw, 1.25rem);
  --font-size-xl: clamp(1.5rem, 6vw, 1.875rem);
  --spacing-base: clamp(1rem, 4vw, 1.5rem);
  --border-radius: clamp(0.75rem, 3vw, 1rem);
}

/* Mobile-first media queries */
@media (max-width: 480px) {
  .container {
    padding: var(--container-padding);
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  .platform-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-base);
  }
  
  .platform-card {
    padding: var(--spacing-base);
  }
  
  .form-input {
    min-height: var(--min-touch-target);
    font-size: var(--font-size-base);
  }
  
  .button {
    min-height: var(--min-touch-target);
    width: 100%;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .platform-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .platform-card {
    padding: calc(var(--spacing-base) * 1.25);
  }
}

@media (min-width: 769px) {
  .platform-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .platform-card {
    padding: calc(var(--spacing-base) * 1.5);
  }
}
`;

interface Platform {
  id: 'instagram' | 'youtube' | 'tiktok';
  name: string;
  icon: typeof Instagram;
  description: string;
  features: string[];
  permissions: string[];
  color: string;
  gradientFrom: string;
  bgColor: string;
}

export function AddSocialNetwork() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform['id'] | null>(null);
  const [connectStep, setConnectStep] = useState<'select' | 'username' | 'validation' | 'verifying' | 'review' | 'success'>('select');
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [validationPost, setValidationPost] = useState<{
    image: string;
    caption: string;
  }>({
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop',
    caption: '#SouInfluencer #Verificação\n\nEste post confirma que sou eu mesmo(a) conectando minha conta à plataforma Sou Influencer.'
  });
  const [postUrl, setPostUrl] = useState('');
  
  React.useEffect(() => {
    // Add styles to document
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

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

  const handleConnect = async (platform: Platform['id']) => {
    setSelectedPlatform(platform);
    setConnectStep('username');
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setConnectStep('validation');
    }
  };

  const handleValidationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (postUrl.trim()) {
      setConnectStep('verifying');
      // Simular verificação automática
      setTimeout(() => {
        setConnectStep('review');
      }, 3000);
    }
  };

  const handleAdminApproval = async () => {
    try {
      // Simular aprovação do administrador
      await new Promise(resolve => setTimeout(resolve, 2000));
      setConnectStep('success');
    } catch (err) {
      setError('Ocorreu um erro durante a aprovação. Por favor, tente novamente.');
      setConnectStep('select');
    }
  };

  const handleBack = () => {
    if (connectStep === 'username') {
      setSelectedPlatform(null);
      setConnectStep('select');
    } else if (connectStep === 'validation') {
      setConnectStep('username');
    } else if (connectStep === 'review') {
      setConnectStep('validation');
    } else if (connectStep === 'success') {
      setSelectedPlatform(null);
      setConnectStep('select');
    }
  };

  const selectedPlatformData = selectedPlatform ? platforms.find(p => p.id === selectedPlatform) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white container">
      <div className="max-w-4xl mx-auto py-6 sm:py-8">
        <div className="mb-8">
          {connectStep !== 'select' && (
            <button
              onClick={handleBack}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4 min-h-[var(--min-touch-target)] px-3 py-2 rounded-lg hover:bg-gray-100/80 transition-all duration-200 button"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar
            </button>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Conectar Redes Sociais</h1>
          <p className="text-base sm:text-lg text-gray-600">
            Integre suas redes sociais para:
            <span className="block mt-2 text-sm text-gray-500">
              • Gerenciar campanhas e métricas em um só lugar • Receber propostas personalizadas • Aumentar sua visibilidade
            </span>
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 card">
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

        {connectStep === 'select' && (
          <div className="grid gap-6 platform-grid">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] platform-card"
              >
                <div>
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
                      onClick={() => handleConnect(platform.id)}
                      className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 min-h-[var(--min-touch-target)] button"
                    >
                      Conectar
                    </button>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center"><Shield className="h-4 w-4 mr-2 text-blue-500" />Recursos</h4>
                      <ul className="space-y-2">
                        {platform.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-500">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-start">
                          <HelpCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-blue-700">
                            Ao conectar sua conta, você mantém total controle sobre suas publicações.
                            <span className="block mt-1 text-blue-600">
                              Nunca publicaremos nada sem sua autorização expressa.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {connectStep === 'username' && selectedPlatformData && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className={`p-3 rounded-xl ${selectedPlatformData.bgColor}`}>
                  <selectedPlatformData.icon className={`h-6 w-6 ${selectedPlatformData.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Conectar {selectedPlatformData.name}
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
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                      placeholder={`Seu usuário do ${selectedPlatformData.name}`}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-8 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Continuar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {connectStep === 'validation' && selectedPlatformData && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className={`p-3 rounded-xl ${selectedPlatformData.bgColor}`}>
                  <selectedPlatformData.icon className={`h-6 w-6 ${selectedPlatformData.color}`} />
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
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                      placeholder="https://"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-8 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Verificar Publicação
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {connectStep === 'verifying' && selectedPlatformData && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
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

        {connectStep === 'review' && selectedPlatformData && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className={`p-3 rounded-xl ${selectedPlatformData.bgColor}`}>
                  <selectedPlatformData.icon className={`h-6 w-6 ${selectedPlatformData.color}`} />
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

              {/* Simular botões de administrador */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setConnectStep('validation')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
                >
                  Voltar
                </button>
                <button
                  onClick={handleAdminApproval}
                  className="inline-flex items-center px-8 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Aprovar Conta
                </button>
              </div>
            </div>
          </div>
        )}

        {connectStep === 'success' && selectedPlatformData && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Conexão Estabelecida!
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Sua conta do {selectedPlatformData.name} foi validada e ativada com sucesso.
            </p>
            <button
              onClick={handleBack}
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