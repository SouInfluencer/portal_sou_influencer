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
      color: 'bg-blue-100 text-blue-600',
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
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 px-4 sm:px-6 lg:px-8">
      {/* Current Task Overview */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100/80 overflow-hidden transition-all duration-300">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <div className={`p-3 rounded-xl ${getStepDetails(step)?.color}`}>
                {React.createElement(getStepDetails(step)?.icon || Sparkles, {
                  className: "h-6 w-6"
                })}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{getStepDetails(step)?.title}</h2>
                <p className="text-gray-600 text-lg">
                  {getStepDetails(step)?.description}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowHelp(true)}
              className="p-2.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 min-h-[var(--min-touch-target)] min-w-[var(--min-touch-target)]"
            >
              <Info className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 py-4 border-y border-gray-100">
            {getStepDetails(step)?.metrics.map((metric, index) => (
              <div key={index} className="bg-white rounded-xl p-4 border border-gray-200/80 hover:border-blue-200 transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className={`h-5 w-5 ${metric.color || 'text-gray-400'}`} />
                  <BarChart2 className="h-4 w-4 text-gray-300" />
                </div>
                <p className="text-base sm:text-lg font-medium text-gray-900">{metric.value}</p>
                <p className="text-xs text-gray-500">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Progress and Tasks */}
        <div className="col-span-2 space-y-6">
          {/* Progress Steps */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Progresso da Campanha</h3>
            <StepProgress steps={steps} currentStep={currentStep} />
          </div>

          {/* Current Tasks */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <TaskList
              step={currentStep}
              campaign={campaign}
              onTaskComplete={(index) => {
                // TODO: Implement task completion
                console.log('Complete task:', index);
              }}
            />
          </div>
        </div>

        {/* Right Column - Next Action and Metrics */}
        <div className="space-y-6">
          {/* Next Action */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <NextAction
              step={currentStep}
              campaign={campaign}
              onAction={() => {
                // TODO: Implement next action
                console.log('Execute next action');
              }}
            />
          </div>

          {/* Step Metrics */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Métricas</h3>
            <StepMetrics step={currentStep} campaign={campaign} />
          </div>
        </div>
      </div>

      {/* Step Content */}
      {StepComponent && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 mt-6">
          <StepComponent
            campaign={campaign}
            onComplete={(nextStatus) => handleStepComplete(nextStatus)}
          />
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                  <Info className="h-6 w-6 text-blue-600" />
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
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm min-h-[var(--min-touch-target)]"
                  onClick={() => setShowHelp(false)}
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