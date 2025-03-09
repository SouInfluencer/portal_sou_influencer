import React from 'react';
import { ArrowLeft, Calendar, Clock, Info, CheckCircle, AlertTriangle, FileText, Camera, Upload, Star, MessageSquare, DollarSign, Sparkles, Link as LinkIcon, Shield, BarChart2, Eye } from 'lucide-react';
import type { Campaign } from '../../../../types';
import { ProposalStep } from './steps/ProposalStep';
import { DeliveryStep } from './steps/DeliveryStep';
import { ValidationStep } from './steps/ValidationStep';
import { PaymentStep } from './steps/PaymentStep';

interface CampaignProgressPageProps {
  campaign: Campaign;
  step: 'proposal' | 'production' | 'prepayment' | 'delivery' | 'validation' | 'payment';
  onBack: () => void;
  onNext?: () => void;
  onComplete?: () => void;
  onHelp?: () => void;
}

const steps = [
  {
    id: 'proposal',
    title: 'Convite de Campanha',
    description: 'Aceitar ou recusar proposta',
    icon: FileText,
    tasks: [
      'Ler o briefing completo',
      'Verificar requisitos',
      'Confirmar prazo de entrega',
      'Aceitar proposta'
    ]
  },
  {
    id: 'delivery',
    title: 'Postagem',
    description: 'Baixar materiais, postar e informar link',
    icon: Camera,
    tasks: [
      'Baixar materiais da campanha',
      'Revisar diretrizes',
      'Publicar na plataforma',
      'Enviar link da publicação'
    ]
  },
  {
    id: 'validation',
    title: 'Validação',
    description: 'Verificação do conteúdo pelo anunciante',
    icon: Star,
    tasks: [
      'Aguardar revisão',
      'Responder feedback se necessário',
      'Fazer ajustes se solicitado',
      'Receber aprovação final'
    ]
  },
  {
    id: 'payment',
    title: 'Pagamento',
    description: 'Liberação automática do pagamento',
    icon: DollarSign,
    tasks: [
      'Confirmar dados bancários',
      'Aguardar processamento',
      'Receber pagamento',
      'Confirmar recebimento'
    ]
  }
];

const getStepDetails = (step: string) => {
  const details = {
    proposal: {
      title: 'Convite de Campanha',
      description: 'Revise e decida sobre a proposta',
      icon: FileText,
      color: 'bg-blue-100 text-blue-600',
      nextAction: 'Leia atentamente o briefing e aceite a proposta para começar',
      metrics: [
        { icon: DollarSign, label: 'Valor', value: 'R$ {budget}' },
        { icon: Calendar, label: 'Prazo', value: '{deadline}' },
        { icon: Eye, label: 'Alcance Esperado', value: '45K+' }
      ]
    },
    delivery: {
      title: 'Postagem do Conteúdo',
      description: 'Baixe os materiais, poste e informe o link',
      icon: Camera,
      color: 'bg-green-100 text-green-600',
      nextAction: 'Publique o conteúdo na plataforma e forneça o link',
      metrics: [
        { icon: Clock, label: 'Tempo Restante', value: '2 dias' },
        { icon: LinkIcon, label: 'Link', value: 'Pendente' },
        { icon: CheckCircle, label: 'Requisitos', value: '0/5' }
      ]
    },
    validation: {
      title: 'Validação do Conteúdo',
      description: 'Verificação e aprovação pelo anunciante',
      icon: Star,
      color: 'bg-yellow-100 text-yellow-600',
      nextAction: 'Aguarde a revisão do anunciante. Você será notificado sobre o resultado.',
      metrics: [
        { icon: Clock, label: 'Tempo em Análise', value: '1 dia' },
        { icon: Eye, label: 'Visualizações', value: '2.5K' },
        { icon: BarChart2, label: 'Engajamento', value: '4.8%' }
      ]
    },
    payment: {
      title: 'Liberação do Pagamento',
      description: 'Processamento e liberação automática',
      icon: DollarSign,
      color: 'bg-indigo-100 text-indigo-600',
      nextAction: 'O pagamento será processado automaticamente após a aprovação',
      metrics: [
        { icon: Shield, label: 'Status', value: 'Processando' },
        { icon: DollarSign, label: 'Valor', value: 'R$ {budget}' },
        { icon: Clock, label: 'Previsão', value: '2 dias úteis' }
      ]
    }
  };
  return details[step as keyof typeof details];
};

export function CampaignProgressPage({
  campaign,
  step,
  onBack,
  onNext,
  onComplete,
  onHelp
}: CampaignProgressPageProps) {
  const [showHelpModal, setShowHelpModal] = React.useState(false);

  const stepComponents = {
    proposal: ProposalStep,
    production: ProductionStep,
    delivery: DeliveryStep,
    validation: ValidationStep,
    payment: PaymentStep
  };

  const StepComponent = stepComponents[step];

  const handleStepComplete = (nextStatus: Campaign['status']) => {
    if (campaign) {
      // Update campaign status
      setCampaign({
        ...campaign,
        status: nextStatus
      });

      // Move to next step
      switch (step) {
        case 'proposal':
          setStep('production');
          break;
        case 'production':
          setStep('delivery');
          break;
        case 'delivery':
          setStep('validation');
          break;
        case 'validation':
          setStep('payment');
          break;
      }
    }
  };

  const currentStepIndex = steps.findIndex(s => s.id === step);

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="space-y-8">
      {/* Current Task Overview */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100/80 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              <div className={`p-3 rounded-xl ${getStepDetails(step)?.color}`}>
                {React.createElement(getStepDetails(step)?.icon || Sparkles, {
                  className: "h-6 w-6"
                })}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{getStepDetails(step)?.title}</h2>
                <p className="text-gray-600 text-lg">
                  {getStepDetails(step)?.description}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowHelpModal(true)}
              className="p-2.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
            >
              <Info className="h-5 w-5" />
            </button>
          </div>

          {/* Current Tasks */}
          <div className="mt-6">
            {/* Next Action Card */}
            <div className="bg-gradient-to-br from-indigo-50/50 to-white rounded-xl border border-indigo-100/50 p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="ml-3 text-sm font-medium text-indigo-900">Próxima Ação</h3>
              </div>
              <p className="text-lg font-medium text-indigo-700">
                {getStepDetails(step)?.nextAction}
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-4">
              {getStepDetails(step)?.metrics.map((metric, index) => (
                <div key={index} className="bg-white rounded-xl p-4 border border-gray-200/80 hover:border-indigo-200 transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <metric.icon className="h-5 w-5 text-gray-400" />
                    <BarChart2 className="h-4 w-4 text-gray-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {metric.value.replace('{budget}', campaign.budget.toLocaleString())
                      .replace('{deadline}', campaign.deadline.toLocaleDateString())}
                  </p>
                  <p className="text-xs text-gray-500">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-4 inset-y-0 transform -translate-x-1/2 w-0.5 bg-gray-200" />
          
          <div className="space-y-8 relative">
            {steps.map((s, index) => {
              const status = getStepStatus(index);
              return (
                <div key={s.id} className="flex items-center">
                  <div className={`relative flex items-center justify-center flex-shrink-0 h-8 w-8 rounded-full ${
                    status === 'completed'
                      ? 'bg-green-500'
                      : status === 'current'
                      ? 'bg-blue-500'
                      : 'bg-gray-200'
                  } shadow-sm`}>
                    {status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-white" />
                    ) : (
                      <s.icon className="h-5 w-5 text-white" />
                    )}
                    {/* Connecting Line */}
                    {index < steps.length - 1 && (
                      <div className={`absolute top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-8 ${
                        status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                  <div className="ml-4 min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${
                        status === 'completed'
                          ? 'text-green-600'
                          : status === 'current'
                          ? 'text-blue-600'
                          : 'text-gray-500'
                      }`}>
                        {s.title}
                      </p>
                      {status === 'completed' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Concluído
                        </span>
                      )}
                      {status === 'current' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Em Andamento
                        </span>
                      )}
                      {status === 'current' && (
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          {s.tasks.map((task, taskIndex) => (
                            <div key={taskIndex} className="flex items-center text-xs text-gray-500">
                              <div className="h-3 w-3 rounded-full border border-gray-300 mr-2" />
                              {task}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{s.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Content */}
      {StepComponent && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mt-6">
          <StepComponent
            campaign={campaign}
            onComplete={handleStepComplete}
            onNext={() => {
              switch (step) {
                case 'production':
                  setStep('delivery');
                  break;
                // Add other cases as needed
              }
            }}
          />
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                  <Info className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Precisa de ajuda?
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Nossa equipe está disponível para ajudar você em qualquer etapa do processo.
                      Entre em contato através do chat ou email de suporte.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  onClick={() => setShowHelpModal(false)}
                >
                  Entendi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}