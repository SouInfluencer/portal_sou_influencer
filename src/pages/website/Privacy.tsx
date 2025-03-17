import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database, Bell, Globe, Key, FileText } from 'lucide-react';

// Add mobile-first styles
const styles = `
/* Base styles */
:root {
  --min-touch-target: clamp(2.75rem, 8vw, 3rem);
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

export function Privacy() {
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
        <div className={`absolute -bottom-40 right-1/3 w-96 h-96 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full opacity-20 blur-[100px] transition-all duration-1000 delay-500 ${mounted ? 'translate-y-0 opacity-20' : 'translate-y-12 opacity-0'}`} />
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
            Política de Privacidade
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
              A Sou Influencer está comprometida em proteger sua privacidade e seus dados pessoais. 
              Esta política descreve como coletamos, usamos e protegemos suas informações ao utilizar nossa plataforma.
            </p>
          </div>

          {/* Data Collection */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Database className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Dados Coletados</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">Coletamos os seguintes tipos de informações:</p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <Lock className="h-5 w-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <span>Informações de cadastro (nome, email, telefone)</span>
                </li>
                <li className="flex items-start">
                  <Eye className="h-5 w-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <span>Dados de uso da plataforma</span>
                </li>
                <li className="flex items-start">
                  <Globe className="h-5 w-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <span>Informações de redes sociais conectadas</span>
                </li>
                <li className="flex items-start">
                  <Bell className="h-5 w-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <span>Preferências de notificação</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Data Usage */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Uso dos Dados</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">Utilizamos seus dados para:</p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <Key className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span>Fornecer e melhorar nossos serviços</span>
                </li>
                <li className="flex items-start">
                  <Shield className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span>Proteger a segurança da plataforma</span>
                </li>
                <li className="flex items-start">
                  <Bell className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span>Enviar comunicações relevantes</span>
                </li>
                <li className="flex items-start">
                  <Globe className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span>Personalizar sua experiência</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Data Protection */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Lock className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Proteção de Dados</h2>
            </div>
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-600">
                Implementamos medidas técnicas e organizacionais para proteger seus dados:
              </p>
              <ul className="mt-4 space-y-3 text-gray-600">
                <li className="flex items-start">
                  <Shield className="h-5 w-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <span>Criptografia de ponta a ponta</span>
                </li>
                <li className="flex items-start">
                  <Key className="h-5 w-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <span>Autenticação em duas etapas</span>
                </li>
                <li className="flex items-start">
                  <Database className="h-5 w-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <span>Backups regulares e seguros</span>
                </li>
                <li className="flex items-start">
                  <Eye className="h-5 w-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <span>Monitoramento contínuo</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Your Rights */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-amber-100 rounded-lg">
                <FileText className="h-5 w-5 text-amber-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Seus Direitos</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">Você tem direito a:</p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <Eye className="h-5 w-5 text-amber-500 mt-1 mr-3 flex-shrink-0" />
                  <span>Acessar seus dados pessoais</span>
                </li>
                <li className="flex items-start">
                  <FileText className="h-5 w-5 text-amber-500 mt-1 mr-3 flex-shrink-0" />
                  <span>Solicitar correção de dados incorretos</span>
                </li>
                <li className="flex items-start">
                  <X className="h-5 w-5 text-amber-500 mt-1 mr-3 flex-shrink-0" />
                  <span>Solicitar exclusão de seus dados</span>
                </li>
                <li className="flex items-start">
                  <Bell className="h-5 w-5 text-amber-500 mt-1 mr-3 flex-shrink-0" />
                  <span>Gerenciar preferências de comunicação</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg border border-blue-100 card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Dúvidas?</h2>
            <p className="text-gray-600 mb-6">
              Se você tiver alguma dúvida sobre nossa política de privacidade, entre em contato:
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => window.location.href = 'mailto:privacidade@souinfluencer.com.br'}
                className="inline-flex items-center justify-center border border-transparent text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 button"
              >
                Enviar Email
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="inline-flex items-center justify-center border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200 button"
              >
                Fale Conosco
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}