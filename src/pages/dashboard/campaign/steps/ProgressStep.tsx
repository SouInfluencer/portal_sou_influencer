import React from 'react';
import { CheckCircle, TrendingUp, ShieldCheck, Upload, FileCheck, CreditCard, ArrowLeft, ThumbsUp, ThumbsDown, AlertTriangle } from 'lucide-react';
import type { Campaign } from '../../../types';

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
  }
  
  .step-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-base);
  }
  
  .step-title {
    font-size: var(--font-size-lg);
  }
  
  .step-description {
    font-size: var(--font-size-base);
  }
  
  .step-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-base);
  }
  
  .step-card {
    padding: var(--spacing-base);
  }
  
  .button {
    width: 100%;
    min-height: var(--min-touch-target);
    justify-content: center;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .step-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .step-card {
    padding: calc(var(--spacing-base) * 1.25);
  }
}

@media (min-width: 769px) {
  .step-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .step-card {
    padding: calc(var(--spacing-base) * 1.5);
  }
}
`;

interface ProgressStepProps {
  campaign: Campaign;
  step: 'proposal' | 'production' | 'prepayment' | 'delivery' | 'validation' | 'payment';
  onBack: () => void;
  onAcceptProposal?: () => void;
  onRejectProposal?: () => void;
}

export function ProgressStep({ campaign, step, onBack, onAcceptProposal, onRejectProposal }: ProgressStepProps) {
  const [showRejectConfirm, setShowRejectConfirm] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Add styles to document
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Trigger mount animation
    setMounted(true);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const steps = {
    proposal: {
      title: 'Proposta Aceita',
      description: 'O influenciador aceitou a proposta da campanha',
      icon: CheckCircle,
      content: (
        <div className="space-y-6 container">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Proposta de Campanha</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Revise os detalhes da proposta e aceite ou recuse a campanha.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-4 sm:space-x-4">
            <button
              onClick={() => setShowRejectConfirm(true)}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 min-h-[var(--min-touch-target)] button"
            >
              <ThumbsDown className="h-5 w-5 mr-2 text-red-500" />
              Recusar Proposta
            </button>
            <button
              onClick={onAcceptProposal}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 min-h-[var(--min-touch-target)] button"
            >
              <ThumbsUp className="h-5 w-5 mr-2" />
              Aceitar Proposta
            </button>
          </div>

          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Detalhes da Proposta</h3>
              <div className="mt-5">
                <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 step-grid">
                  <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Valor Acordado</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      R$ {campaign.budget.toLocaleString()}
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Prazo de Entrega</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {campaign.deadline.toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Requisitos da Campanha</h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>Todos os requisitos devem ser atendidos conforme especificado.</p>
              </div>
              <div className="mt-5">
                <ul className="divide-y divide-gray-200">
                  {campaign.requirements.map((requirement, index) => (
                    <li key={index} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{requirement}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    production: {
      title: 'Em Produção',
      description: 'O influenciador está produzindo o conteúdo',
      icon: TrendingUp,
      content: (
        <div className="space-y-6 container">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Produção em andamento</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>O conteúdo está sendo produzido conforme as especificações da campanha.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Checklist de Produção</h3>
              <div className="mt-5">
                <ul className="divide-y divide-gray-200">
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">Briefing Revisado</p>
                        <p className="text-sm text-gray-500">Todos os requisitos foram analisados</p>
                      </div>
                    </div>
                  </li>
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <TrendingUp className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">Produção do Conteúdo</p>
                        <p className="text-sm text-gray-500">Criação do conteúdo em andamento</p>
                      </div>
                    </div>
                  </li>
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">Revisão e Ajustes</p>
                        <p className="text-sm text-gray-500">Aguardando finalização</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Cronograma</h3>
              <div className="mt-5">
                <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3 step-grid">
                  <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Início da Produção</dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">
                      {new Date().toLocaleDateString()}
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Prazo de Entrega</dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">
                      {campaign.deadline.toLocaleDateString()}
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Tempo Restante</dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">5 dias</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )
    },
    prepayment: {
      title: 'Pré-Pagamento',
      description: 'O anunciante realiza o pré-pagamento',
      icon: ShieldCheck,
      content: (
        <div className="space-y-6">
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ShieldCheck className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Aguardando pré-pagamento</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>O pagamento está sendo processado de forma segura.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Detalhes do Pagamento</h3>
              <div className="mt-5">
                <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Valor Total</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      R$ {campaign.budget.toLocaleString()}
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Status</dt>
                    <dd className="mt-1 text-3xl font-semibold text-yellow-600">Processando</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Garantias</h3>
              <div className="mt-5">
                <ul className="divide-y divide-gray-200">
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <ShieldCheck className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">Pagamento Seguro</p>
                        <p className="text-sm text-gray-500">Processamento criptografado e seguro</p>
                      </div>
                    </div>
                  </li>
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <ShieldCheck className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">Garantia de Entrega</p>
                        <p className="text-sm text-gray-500">Liberação após aprovação do conteúdo</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    delivery: {
      title: 'Entrega',
      description: 'O influenciador faz a postagem da campanha',
      icon: Upload,
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Upload className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Entrega do conteúdo</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>O conteúdo está pronto para ser publicado na plataforma.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Checklist de Entrega</h3>
              <div className="mt-5">
                <ul className="divide-y divide-gray-200">
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">Conteúdo Finalizado</p>
                        <p className="text-sm text-gray-500">Material pronto para publicação</p>
                      </div>
                    </div>
                  </li>
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">Revisão de Requisitos</p>
                        <p className="text-sm text-gray-500">Todos os requisitos atendidos</p>
                      </div>
                    </div>
                  </li>
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Upload className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">Publicação</p>
                        <p className="text-sm text-gray-500">Aguardando horário agendado</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Detalhes da Publicação</h3>
              <div className="mt-5">
                <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Data de Publicação</dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">
                      {campaign.deadline.toLocaleDateString()}
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Plataforma</dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">
                      {campaign.platform}
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Tipo de Conteúdo</dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">
                      {campaign.contentType}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )
    },
    validation: {
      title: 'Validação',
      description: 'O anunciante valida a postagem',
      icon: FileCheck,
      content: (
        <div className="space-y-6">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FileCheck className="h-5 w-5 text-purple-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-purple-800">Validação em andamento</h3>
                <div className="mt-2 text-sm text-purple-700">
                  <p>O anunciante está revisando o conteúdo publicado.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Checklist de Validação</h3>
              <div className="mt-5">
                <ul className="divide-y divide-gray-200">
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">Conteúdo Publicado</p>
                        <p className="text-sm text-gray-500">Post já está no ar</p>
                      </div>
                    </div>
                  </li>
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <FileCheck className="h-5 w-5 text-purple-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">Revisão do Anunciante</p>
                        <p className="text-sm text-gray-500">Em análise</p>
                      </div>
                    </div>
                  </li>
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">Aprovação Final</p>
                        <p className="text-sm text-gray-500">Aguardando</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Métricas Iniciais</h3>
              <div className="mt-5">
                <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Alcance</dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">15.2K</dd>
                  </div>
                  <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Engajamento</dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">4.8%</dd>
                  </div>
                  <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Cliques</dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">850</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )
    },
    payment: {
      title: 'Pagamento',
      description: 'O pagamento é liberado ao influenciador',
      icon: CreditCard,
      content: (
        <div className="space-y-6">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CreditCard className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Pagamento liberado!</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>O pagamento foi processado e será creditado em sua conta.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Detalhes do Pagamento</h3>
              <div className="mt-5">
                <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Valor Total</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      R$ {campaign.budget.toLocaleString()}
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Status</dt>
                    <dd className="mt-1 text-3xl font-semibold text-green-600">Aprovado</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Resumo da Campanha</h3>
              <div className="mt-5">
                <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Alcance Total</dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">45.2K</dd>
                  </div>
                  <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Engajamento</dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">5.2%</dd>
                  </div>
                  <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">ROI Estimado</dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">3.8x</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )
    }
  };

  const currentStep = steps[step];

  return (
    <div className="space-y-6 container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 step-header">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 min-h-[var(--min-touch-target)] px-3 py-2 rounded-lg hover:bg-gray-100/80 transition-all duration-200 button"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900 step-title">{currentStep.title}</h2>
            <p className="text-sm text-gray-500 step-description">{currentStep.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <currentStep.icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>

      {/* Content */}
      {currentStep.content}
      
      {/* Reject Confirmation Modal */}
      {showRejectConfirm && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Recusar Proposta
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Tem certeza que deseja recusar esta proposta? Esta ação não pode ser desfeita.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    onRejectProposal?.();
                    setShowRejectConfirm(false);
                  }}
                >
                  Recusar
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setShowRejectConfirm(false)}
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