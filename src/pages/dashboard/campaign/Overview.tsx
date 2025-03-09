import React from 'react';
import { Calendar, DollarSign, Hash, Upload, CheckCircle, Clock, TrendingUp, ShieldCheck, CreditCard, FileCheck } from 'lucide-react';
import type { Campaign } from '../../../types';

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
    <div className="space-y-8">
      {/* Campaign Progress */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Progresso da Campanha</h3>
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-4 inset-y-0 transform -translate-x-1/2 w-0.5 bg-gray-200" />
            
            <div className="space-y-8 relative">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`relative flex items-center justify-center flex-shrink-0 h-8 w-8 rounded-full ${
                    step.status === 'completed'
                      ? 'bg-green-500'
                      : step.status === 'current'
                      ? 'bg-blue-500'
                      : 'bg-gray-200'
                  } shadow-sm`}>
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
                  <div className="ml-4 min-w-0 flex-1">
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
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Detalhes da Campanha</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
      <div className="bg-white shadow sm:rounded-lg">
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