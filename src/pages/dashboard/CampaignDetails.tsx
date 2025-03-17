import React, { useState } from 'react';
import { ArrowLeft, Book, FileText, Image, User, Building2, DollarSign, Calendar, Hash, TrendingUp, Shield, CheckCircle, Clock, ChevronRight, Info, AlertTriangle, Eye, Heart, MessageSquare, Share2, Globe2, Target, Users, BarChart2, Star } from 'lucide-react';
import type { Campaign } from '../../types';
import { ProposalStep } from './campaign/progress/steps/ProposalStep';
import { ProductionStep } from './campaign/progress/steps/ProductionStep';
import { DeliveryStep } from './campaign/progress/steps/DeliveryStep';
import { ValidationStep } from './campaign/progress/steps/ValidationStep';
import { PaymentStep } from './campaign/progress/steps/PaymentStep';
import { authService } from '../../services/authService.ts';
import { StepProgress } from './campaign/components/StepProgress';
import { NextAction } from './campaign/components/NextAction';
import { StepMetrics } from './campaign/components/StepMetrics';
import { TaskList } from './campaign/components/TaskList';

import { useParams, useNavigate } from 'react-router-dom';

type ViewMode = 'influencer' | 'advertiser';

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  status: 'completed' | 'current' | 'upcoming';
}

const getStatusColor = (status: Campaign['status']) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    delivered: 'bg-purple-100 text-purple-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};


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
  
  .grid-cols-3 {
    grid-template-columns: 1fr;
  }
  
  .campaign-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-base);
  }
  
  .campaign-title {
    font-size: var(--font-size-xl);
  }
  
  .campaign-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-base);
  }
  
  .campaign-actions {
    width: 100%;
    justify-content: stretch;
  }
  
  .campaign-button {
    width: 100%;
    min-height: var(--min-touch-target);
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .grid-cols-3 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .campaign-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 769px) {
  .grid-cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .campaign-stats {
    grid-template-columns: repeat(4, 1fr);
  }
}
`;

interface CampaignDetailsProps {
  onBack: () => void; 
}

export function CampaignDetails({ onBack }: CampaignDetailsProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = React.useState<Campaign | null>(null);
  const [currentStep, setCurrentStep] = useState<'proposal' | 'production' | 'delivery' | 'validation' | 'payment'>(
    () => {
      // Determine initial step based on campaign status
      switch (campaign?.status) {
        case 'pending':
          return 'proposal';
        case 'accepted':
          return 'production';
        case 'in_production':
          return 'delivery';
        case 'delivered':
          return 'validation';
        case 'approved':
          return 'payment';
        default:
          return 'proposal';
      }
    }
  );
  const [viewMode, setViewMode] = useState<ViewMode>(authService.getUser()?.type || 'influencer');
  const [showHelp, setShowHelp] = useState(false);
  
  const stepComponents = {
    proposal: ProposalStep,
    production: ProductionStep,
    delivery: DeliveryStep,
    validation: ValidationStep,
    payment: PaymentStep
  };
  
  React.useEffect(() => {
    // Add styles to document
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const StepComponent = stepComponents[currentStep];

  const handleStepComplete = (nextStatus: Campaign['status']) => {
    if (campaign) {
      // Update campaign status
      setCampaign({
        ...campaign,
        status: nextStatus
      });

      // Move to next step
      switch (currentStep) {
        case 'proposal':
          setCurrentStep('production');
          break;
        case 'production':
          setCurrentStep('delivery');
          break;
        case 'delivery':
          setCurrentStep('validation');
          break;
        case 'validation':
          setCurrentStep('payment');
          break;
        case 'payment':
          // Campaign completed
          break;
      }
    }
  };

  const steps: Step[] = [
    {
      id: 'review',
      title: 'Convite de Campanha',
      description: 'Aceitar ou recusar proposta',
      icon: Book,
      status: 'completed'
    },
    {
      id: 'production',
      title: 'Produção',
      description: 'Baixar materiais e criar conteúdo',
      icon: Image,
      status: 'current'
    },
    {
      id: 'delivery',
      title: 'Postagem',
      description: 'Publicar e informar link',
      icon: FileText,
      status: 'upcoming'
    },
    {
      id: 'validation',
      title: 'Validação',
      description: 'Aprovação do anunciante',
      icon: Star,
      status: 'upcoming'
    },
    {
      id: 'payment',
      title: 'Pagamento',
      description: 'Liberação automática',
      icon: DollarSign,
      status: 'upcoming'
    }
  ];

  React.useEffect(() => {
    // TODO: Fetch campaign details from API
    // For now, using mock data
    const mockCampaign = {
      id: 1,
      title: "Lançamento Novo Gadget",
      brand: {
        name: "TechCorp",
        logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop"
      },
      description: "Criar um vídeo review do nosso novo smartphone, destacando os principais recursos e funcionalidades. Foco especial na câmera e bateria.",
      deadline: new Date("2024-04-15"),
      budget: 3500,
      requirements: [
        "Vídeo de 10-15 minutos",
        "Destacar câmera e bateria",
        "Mencionar preço promocional",
        "Incluir demonstração prática",
        "Comparar com modelo anterior"
      ],
      status: "in_progress",
      platform: "Instagram",
      contentType: "Post + Stories",
      deliveryProof: {
        url: "https://www.instagram.com/p/DFeMQJ9ObWY/",
        submittedAt: new Date("2024-03-20"),
        status: "pending"
      },
    };
    
    // Adicionar mensagens mockadas
    mockCampaign.messages = [
      {
        id: 1,
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        sender: "Ana Silva",
        content: "O briefing foi atualizado com as novas especificações do produto.",
        timestamp: new Date("2024-03-20T10:30:00"),
        isNew: true,
        attachments: [
          { name: "briefing_v2.pdf", size: "2.4 MB", type: "pdf" }
        ]
      },
      {
        id: 2,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        sender: "Você",
        content: "Entendi! Vou revisar e começar a produção ainda hoje.",
        timestamp: new Date("2024-03-20T10:35:00"),
        isNew: false
      }
    ];
    
    setCampaign(mockCampaign);
  }, [id]);

  if (!campaign) {
    return <div>Loading...</div>;
  }

  const getStatusBadgeColor = (status: Campaign['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      delivered: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: Campaign['status']) => {
    const labels = {
      pending: 'Pendente',
      in_progress: 'Em Andamento',
      completed: 'Concluída',
      rejected: 'Rejeitada',
      delivered: 'Entregue'
    };
    return labels[status] || status;
  };

  return (
    <div className="py-6 min-h-screen container">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all duration-200 min-h-[var(--min-touch-target)]"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {viewMode === 'influencer' ? 'Voltar para campanhas' : 'Voltar para gerenciamento'}
          </button>
          <div className="flex items-center gap-2 sm:gap-4 campaign-actions">
            <button
              onClick={() => setShowHelp(true)}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 min-h-[var(--min-touch-target)] campaign-button"
            >
              <Info className="h-4 w-4 mr-2" />
              Ajuda
            </button>
            <button
              onClick={() => navigate('/dashboard/messages')}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md transition-all duration-200 min-h-[var(--min-touch-target)] campaign-button"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Nova Mensagem
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </button>
          </div>
        </div>

        {/* Campaign Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6 campaign-header">
              <div className="flex items-center gap-4">
                <img
                  src={campaign.brand.logo}
                  alt={campaign.brand.name}
                  className="h-16 w-16 rounded-xl shadow-sm ring-1 ring-black/5"
                />
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 campaign-title">{campaign.title}</h1>
                  <div className="flex items-center mt-1 space-x-2">
                    <p className="text-gray-500">{campaign.brand.name}</p>
                    <span className="text-gray-300">•</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {campaign.platform}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* View Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('influencer')}
                    className={`flex items-center justify-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 min-h-[var(--min-touch-target)] ${
                      viewMode === 'influencer'
                        ? 'bg-white text-blue-600 shadow'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Visão Influencer
                  </button>
                  <button
                    onClick={() => setViewMode('advertiser')}
                    className={`flex items-center justify-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 min-h-[var(--min-touch-target)] ${
                      viewMode === 'advertiser'
                        ? 'bg-white text-blue-600 shadow'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Visão Anunciante
                  </button>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(campaign?.status || 'pending')}`}>
                  {getStatusLabel(campaign?.status || 'pending')}
                </span>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-8 campaign-stats">
              <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  <BarChart2 className="h-5 w-5 text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">45K+</p>
                <p className="text-sm text-gray-600">Alcance Estimado</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <Heart className="h-6 w-6 text-green-600" />
                  <BarChart2 className="h-5 w-5 text-green-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">4.8%</p>
                <p className="text-sm text-gray-600">Engajamento</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100">
                <div className="flex items-center justify-between mb-2">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                  <BarChart2 className="h-5 w-5 text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-sm text-gray-600">Comentários</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-xl border border-amber-100">
                <div className="flex items-center justify-between mb-2">
                  <Globe2 className="h-6 w-6 text-amber-600" />
                  <BarChart2 className="h-5 w-5 text-amber-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">28%</p>
                <p className="text-sm text-gray-600">Taxa de Conversão</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mt-6">
            <StepComponent
              campaign={campaign}
              onComplete={(nextStatus) => handleStepComplete(nextStatus)}
            />
          </div>
        )}
      </div>
    </div>
  );
}