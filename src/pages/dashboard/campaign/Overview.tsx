import React from 'react';
import { Calendar, DollarSign, Hash, Upload, CheckCircle, Clock, TrendingUp, ShieldCheck, CreditCard, FileCheck } from 'lucide-react';
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
  
  .progress-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-base);
  }
  
  .campaign-details {
    grid-template-columns: 1fr;
  }
  
  .campaign-brief {
    padding: var(--spacing-base);
  }
  
  .step-item {
    padding: var(--spacing-base);
    margin-bottom: var(--spacing-base);
  }
  
  .step-icon {
    width: var(--min-touch-target);
    height: var(--min-touch-target);
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .progress-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .campaign-details {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 769px) {
  .progress-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .campaign-details {
    grid-template-columns: repeat(2, 1fr);
  }
}
`;

interface CampaignOverviewProps {
  campaign: Campaign;
}

interface ProgressStep {
  id: 'proposal' | 'production' | 'prepayment' | 'delivery' | 'validation' | 'payment';
  title: string;
  description: string;
  icon: React.ElementType;
  status: 'completed' | 'current' | 'upcoming';
}

export function CampaignOverview({ campaign }: CampaignOverviewProps) {
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

  const getStepStatus = (stepId: ProgressStep['id']): ProgressStep['status'] => {
    const statusMap = {
      proposal: 0,
      production: 1,
      prepayment: 2,
      delivery: 3,
      validation: 4,
      payment: 5
    };

    const currentStepIndex = statusMap[campaign.status];
    const stepIndex = statusMap[stepId];

    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'upcoming';
  };

  const steps: ProgressStep[] = [
    {
      id: 'proposal',
      title: 'Proposta Aceita',
      description: 'Influenciador aceitou a proposta',
      icon: CheckCircle,
      status: getStepStatus('proposal')
    },
    {
      id: 'production',
      title: 'Em Produção',
      description: 'Influenciador irá postar a campanha',
      icon: TrendingUp,
      status: getStepStatus('production')
    },
    {
      id: 'prepayment',
      title: 'Pré-Pagamento',
      description: 'O anunciante realiza o pré-pagamento',
      icon: ShieldCheck,
      status: getStepStatus('prepayment')
    },
    {
      id: 'delivery',
      title: 'Entrega',
      description: 'O influenciador faz a postagem da campanha',
      icon: Upload,
      status: getStepStatus('delivery')
    },
    {
      id: 'validation',
      title: 'Validação',
      description: 'O anunciante valida a postagem',
      icon: FileCheck,
      status: getStepStatus('validation')
    },
    {
      id: 'payment',
      title: 'Pagamento',
      description: 'O pagamento é liberado ao influenciador',
      icon: CreditCard,
      status: getStepStatus('payment')
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 container">
      {/* Campaign Progress */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Progresso da Campanha</h3>
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-4 inset-y-0 transform -translate-x-1/2 w-0.5 bg-gray-200" />
            
            <div className="space-y-4 sm:space-y-6 lg:space-y-8 relative progress-grid">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col sm:flex-row items-start sm:items-center step-item">
                  <div className={`relative flex items-center justify-center flex-shrink-0 h-8 w-8 rounded-full ${
                    step.status === 'completed'
                      ? 'bg-green-500'
                      : step.status === 'current'
                      ? 'bg-blue-500'
                      : 'bg-gray-200'
                  } shadow-sm step-icon`}>
                    {step.status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-white" />
                    ) : (
                      <step.icon className="h-5 w-5 text-white" />
                    )}
                    {/* Connecting Line */}
                    {index < steps.length - 1 && (
                      <div className={`absolute top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-8 ${
                        step.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-4 min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${
                        step.status === 'completed'
                          ? 'text-green-600'
                          : step.status === 'current'
                          ? 'text-blue-600'
                          : 'text-gray-500'
                      }`}>
                        {step.title}
                      </p>
                      {step.status === 'completed' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Concluído
                        </span>
                      )}
                      {step.status === 'current' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Em Andamento
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Details */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Detalhes da Campanha</h3>
          <div className="grid gap-4 campaign-details">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-5 w-5 mr-2 text-gray-400" />
              Prazo: {campaign.deadline.toLocaleDateString()}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <DollarSign className="h-5 w-5 mr-2 text-gray-400" />
              Valor: R$ {campaign.budget.toLocaleString()}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Hash className="h-5 w-5 mr-2 text-gray-400" />
              Plataforma: {campaign.platform}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <TrendingUp className="h-5 w-5 mr-2 text-gray-400" />
              Tipo: {campaign.contentType}
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Brief */}
      <div className="bg-white shadow rounded-lg campaign-brief">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Briefing</h3>
          <p className="text-sm text-gray-500 mb-4">{campaign.description}</p>
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Requisitos:</h4>
            <ul className="list-disc pl-5 space-y-2">
              {campaign.requirements.map((requirement, index) => (
                <li key={index} className="text-sm text-gray-500">{requirement}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}