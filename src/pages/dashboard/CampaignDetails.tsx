import React, { useState } from 'react';
import { ArrowLeft, Book, FileText, Image, User, Building2, DollarSign, Calendar, Hash, TrendingUp, Shield, CheckCircle, Clock, ChevronRight, Info, AlertTriangle, Eye, Heart, MessageSquare, Share2, Globe2, Target, Users, BarChart2, Star, Award, Upload, X } from 'lucide-react';
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
    draft: 'Rascunho',
    pending_acceptance: 'Aguardando Aceite',
    in_progress: 'Em Andamento',
    in_review: 'Em Revisão',
    needs_revision: 'Necessita Revisão',
    completed: 'Concluída',
    cancelled: 'Cancelada'
  };
  return labels[status] || status;
};

const getInfluencerStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Aguardando Resposta';
    case 'accepted':
      return 'Proposta Aceita';
    case 'in_progress':
      return 'Em Produção';
    case 'delivered':
      return 'Conteúdo Entregue';
    case 'approved':
      return 'Conteúdo Aprovado';
    case 'rejected':
      return 'Conteúdo Rejeitado';
    default:
      return status;
  }
};

const getInfluencerStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'accepted':
      return 'bg-blue-100 text-blue-800';
    case 'in_progress':
      return 'bg-purple-100 text-purple-800';
    case 'delivered':
      return 'bg-indigo-100 text-indigo-800';
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
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
  const [selectedInfluencer, setSelectedInfluencer] = useState<number | null>(null);
  
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
      influencers: [
        {
          id: 1,
          name: "Ana Silva",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          status: "in_progress",
          accepted_at: "2024-03-15T10:30:00",
          production_started_at: "2024-03-16T14:20:00",
          delivered_at: null,
          approved_at: null,
          rejected_at: null
        }
      ],
      messages: [
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
      ]
    };
    
    setCampaign(mockCampaign);
  }, [id]);

  if (!campaign) {
    return <div>Loading...</div>;
  }

  return (
    <div className="py-6 min-h-screen container">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 min-h-[44px] px-3 py-2 rounded-lg hover:bg-gray-100/80 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para campanhas
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard/messages')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Nova Mensagem
            </button>
          </div>
        </div>

        {/* Campaign Overview Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 flex items-center justify-center shadow-lg">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{campaign.title}</h1>
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
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(campaign.status)}`}>
                  {getStatusLabel(campaign.status)}
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  <BarChart2 className="h-4 w-4 text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{campaign.influencers?.length || 0}</p>
                <p className="text-sm text-gray-500">Influenciadores</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <Heart className="h-6 w-6 text-green-600" />
                  <BarChart2 className="h-4 w-4 text-green-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(campaign.budget)}
                </p>
                <p className="text-sm text-gray-500">Orçamento Total</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100">
                <div className="flex items-center justify-between mb-2">
                  <Globe2 className="h-6 w-6 text-purple-600" />
                  <BarChart2 className="h-4 w-4 text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {new Date(campaign.deadline).toLocaleDateString('pt-BR')}
                </p>
                <p className="text-sm text-gray-500">Prazo Final</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-xl border border-amber-100">
                <div className="flex items-center justify-between mb-2">
                  <Award className="h-6 w-6 text-amber-600" />
                  <BarChart2 className="h-4 w-4 text-amber-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{campaign.requirements?.length || 0}</p>
                <p className="text-sm text-gray-500">Requisitos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Influencers Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Influencers List */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Influenciadores</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {campaign.influencers?.map((influencer) => (
                <button
                  key={influencer.id}
                  onClick={() => setSelectedInfluencer(influencer.id)}
                  className={`w-full p-4 text-left hover:bg-gray-50/80 transition-all duration-200 ${
                    selectedInfluencer === influencer.id ? 'bg-blue-50/50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={influencer.avatar}
                      alt={influencer.name}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-md"
                    />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{influencer.name}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getInfluencerStatusColor(influencer.status)}`}>
                        {getInfluencerStatusLabel(influencer.status)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
              {(!campaign.influencers || campaign.influencers.length === 0) && (
                <div className="p-8 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aguardando Influenciadores</h3>
                  <p className="text-gray-500 mb-4">
                    Os influenciadores selecionados aparecerão aqui quando aceitarem participar da campanha
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Selected Influencer Progress */}
          {selectedInfluencer && campaign.influencers?.find(i => i.id === selectedInfluencer) && (
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Progresso do Influenciador</h2>
                </div>
              </div>
              <div className="p-6">
                {/* Progress Steps */}
                <div className="relative">
                  <div className="absolute top-0 left-6 h-full w-0.5 bg-gray-200" />
                  <div className="relative space-y-8">
                    {[
                      { label: 'Convite', date: campaign.influencers?.find(i => i.id === selectedInfluencer)?.accepted_at, icon: FileText, status: campaign.influencers?.find(i => i.id === selectedInfluencer)?.status === 'accepted' },
                      { label: 'Produção', date: campaign.influencers?.find(i => i.id === selectedInfluencer)?.production_started_at, icon: Image, status: campaign.influencers?.find(i => i.id === selectedInfluencer)?.status === 'in_progress' },
                      {
                        label: 'Entrega',
                        date: campaign.influencers?.find(i => i.id === selectedInfluencer)?.delivered_at,
                        icon: Upload,
                        status: campaign.influencers?.find(i => i.id === selectedInfluencer)?.status === 'delivered',
                        details: campaign.influencers?.find(i => i.id === selectedInfluencer)?.post_url ? (
                          <a 
                            href={campaign.influencers?.find(i => i.id === selectedInfluencer)?.post_url}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            Ver publicação
                          </a>
                        ) : null
                      },
                      { 
                        label: 'Validação', 
                        date: campaign.influencers?.find(i => i.id === selectedInfluencer)?.validation_status === 'approved' ? campaign.influencers?.find(i => i.id === selectedInfluencer)?.approved_at : (campaign.influencers?.find(i => i.id === selectedInfluencer)?.validation_status === 'rejected' ? campaign.influencers?.find(i => i.id === selectedInfluencer)?.rejected_at : null),
                        icon: Star, 
                        status: campaign.influencers?.find(i => i.id === selectedInfluencer)?.status === 'approved' || campaign.influencers?.find(i => i.id === selectedInfluencer)?.status === 'rejected',
                        details: campaign.influencers?.find(i => i.id === selectedInfluencer)?.validation_feedback ? (
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Info className="h-3 w-3" />
                            {campaign.influencers?.find(i => i.id === selectedInfluencer)?.validation_feedback}
                          </p>
                        ) : null,
                      },
                      { 
                        label: 'Pagamento',
                        date: campaign.influencers?.find(i => i.id === selectedInfluencer)?.payment_status === 'completed' ? campaign.influencers?.find(i => i.id === selectedInfluencer)?.payment_processed_at : null,
                        icon: DollarSign,
                        status: campaign.influencers?.find(i => i.id === selectedInfluencer)?.payment_status === 'completed',
                        details: campaign.influencers?.find(i => i.id === selectedInfluencer)?.payment_status === 'processing' ? (
                          <p className="text-xs text-blue-600 flex items-center gap-1">
                            <Clock className="h-3 w-3 animate-spin" />
                            Processando pagamento...
                          </p>
                        ) : null
                      }
                    ].map((step, index) => (
                      <div key={step.label} className="flex items-center gap-4">
                        <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                          step.status
                            ? 'bg-green-100 border-green-500 text-green-600 scale-110'
                            : 'bg-white border-gray-300 text-gray-400'
                        }`}>
                          <step.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{step.label}</p>
                          {step.date ? (
                            <p className="text-xs text-gray-500">
                              {new Date(step.date).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                        ) : step.details && (
                            <p className="text-xs text-gray-500">{step.details || 'Pendente'}</p>
                        )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Performance Metrics */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Métricas de Performance</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <Eye className="h-5 w-5 text-gray-400 mb-2" />
                      <p className="text-lg font-medium text-gray-900">45.2K</p>
                      <p className="text-xs text-gray-500">Visualizações</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <Heart className="h-5 w-5 text-gray-400 mb-2" />
                      <p className="text-lg font-medium text-gray-900">3.2K</p>
                      <p className="text-xs text-gray-500">Curtidas</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <MessageSquare className="h-5 w-5 text-gray-400 mb-2" />
                      <p className="text-lg font-medium text-gray-900">245</p>
                      <p className="text-xs text-gray-500">Comentários</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <Share2 className="h-5 w-5 text-gray-400 mb-2" />
                      <p className="text-lg font-medium text-gray-900">128</p>
                      <p className="text-xs text-gray-500">Compartilhamentos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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