import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, CheckCircle, AlertTriangle, Info } from 'lucide-react';

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
  
  .content-grid {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-base);
  }
  
  .section-header {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-base);
  }

  .section-content {
    font-size: var(--font-size-base);
  }

  .card {
    padding: var(--spacing-base);
    border-radius: var(--border-radius);
  }

  .button {
    min-height: var(--min-touch-target);
    padding: calc(var(--spacing-base) * 0.75) var(--spacing-base);
    font-size: var(--font-size-base);
    border-radius: var(--border-radius);
    width: 100%;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .content-grid {
    gap: calc(var(--spacing-base) * 1.25);
  }

  .card {
    padding: calc(var(--spacing-base) * 1.25);
  }
}

@media (min-width: 769px) {
  .content-grid {
    gap: calc(var(--spacing-base) * 1.5);
  }

  .card {
    padding: calc(var(--spacing-base) * 1.5);
  }
}
`;

export function Terms() {
  const navigate = useNavigate();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Add styles to document
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    setMounted(true);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 container">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-20 blur-[100px] transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-20' : 'translate-y-12 opacity-0'}`} />
        <div className={`absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full opacity-20 blur-[100px] transition-all duration-1000 delay-300 ${mounted ? 'translate-x-0 opacity-20' : '-translate-x-12 opacity-0'}`} />
        <div className={`absolute -bottom-40 right-1/3 w-96 h-96 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full opacity-20 blur-[100px] transition-all duration-1000 delay-500 ${mounted ? 'translate-y-0 opacity-20' : 'translate-y-12 opacity-0'}`} />
      </div>

      <div className="max-w-4xl mx-auto py-6 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6 min-h-[var(--min-touch-target)] px-3 py-2 rounded-lg hover:bg-gray-100/80 transition-all duration-200 button"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </button>

          <h1 className={`section-header font-bold text-gray-900 mb-4 transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Termos e Condições
          </h1>
          <p className={`section-content text-gray-600 transition-all duration-1000 delay-200 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Última atualização: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className={`content-grid transition-all duration-1000 delay-400 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {/* Introduction */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 card">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Introdução</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Ao utilizar a plataforma Sou Influencer, você concorda com estes termos e condições. 
              Por favor, leia-os atentamente antes de acessar ou utilizar nossos serviços.
            </p>
          </div>

          {/* Key Points */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Pontos Principais</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-600">Você deve ter pelo menos 18 anos para utilizar nossos serviços.</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-600">É necessário fornecer informações precisas e verdadeiras ao criar sua conta.</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-600">Você é responsável por manter a segurança de sua conta e senha.</p>
              </div>
            </div>
          </div>

          {/* User Responsibilities */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Responsabilidades do Usuário</h2>
            </div>
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-600 mb-4">
                Como usuário da plataforma, você concorda em:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Não violar direitos de propriedade intelectual</li>
                <li>Não compartilhar conteúdo ofensivo ou ilegal</li>
                <li>Não utilizar a plataforma para fins fraudulentos</li>
                <li>Manter suas informações de perfil atualizadas</li>
                <li>Respeitar os direitos de outros usuários</li>
              </ul>
            </div>
          </div>

          {/* Privacy & Data */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Info className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Privacidade e Dados</h2>
            </div>
            <div className="space-y-4 text-gray-600">
              <p>
                Nós levamos sua privacidade muito a sério. Ao utilizar nossos serviços, você concorda com nossa 
                <button onClick={() => navigate('/privacy')} className="text-blue-600 hover:text-blue-500 font-medium mx-1">
                  Política de Privacidade
                </button>
                que descreve como coletamos, usamos e protegemos seus dados.
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex">
                  <Info className="h-5 w-5 text-blue-400 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-blue-700">
                    Seus dados são criptografados e armazenados de forma segura em servidores protegidos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Guidelines */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Diretrizes de Conteúdo</h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                Todo conteúdo publicado na plataforma deve seguir nossas diretrizes:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-grid">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Permitido</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Conteúdo original e autêntico
                    </li>
                    <li className="flex items-center text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Reviews honestos
                    </li>
                    <li className="flex items-center text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Divulgação de parcerias
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Não Permitido</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-600">
                      <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                      Conteúdo plagiado
                    </li>
                    <li className="flex items-center text-gray-600">
                      <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                      Discurso de ódio
                    </li>
                    <li className="flex items-center text-gray-600">
                      <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                      Informações enganosas
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg border border-blue-100 card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Dúvidas?</h2>
            <p className="text-gray-600 mb-6">
              Se você tiver alguma dúvida sobre nossos termos e condições, entre em contato conosco:
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => window.location.href = 'mailto:suporte@souinfluencer.com.br'}
                className="inline-flex items-center justify-center border border-transparent text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 button"
              >
                Enviar Email
              </button>
              <button
                onClick={() => navigate('/help')}
                className="inline-flex items-center justify-center border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200 button"
              >
                Central de Ajuda
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}