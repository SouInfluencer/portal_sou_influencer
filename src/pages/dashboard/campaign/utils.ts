import { DollarSign, Calendar, CheckCircle, Clock, Eye, Shield, Heart } from 'lucide-react';
import type { Influencer, ContentType, Campaign } from '../../../types';

export function getPriceForContentType(influencer: Influencer, contentType: string, platform: string): number {
  // Base price calculation based on followers and engagement
  const basePrice = influencer.followers * 0.05; // R$ 0.05 per follower
  const engagementMultiplier = 1 + (influencer.engagement / 100);

  // Platform multipliers
  const platformMultipliers = {
    Instagram: 1.0,
    YouTube: 1.2,
    TikTok: 1.1
  };

  // Content type multipliers
  const contentTypeMultipliers = {
    Feed: 1.0,     // Base price
    Story: 0.7,    // 70% of base price
    Reels: 1.5,    // 150% of base price
    Shorts: 1.5,   // 150% of base price
    Video: 2.0,    // 200% of base price
    Live: 2.5      // 250% of base price
  };

  const platformMultiplier = platformMultipliers[platform as keyof typeof platformMultipliers] || 1.0;
  const typeMultiplier = contentTypeMultipliers[contentType as keyof typeof contentTypeMultipliers] || 1.0;

  // Calculate final price
  const finalPrice = basePrice * engagementMultiplier * platformMultiplier * typeMultiplier;

  // Round to nearest hundred
  return Math.round(finalPrice / 100) * 100;
}

export function calculateInfluencerPrice(influencer: Influencer, contentType: ContentType | null): number {
  if (!contentType) return 0;
  return getPriceForContentType(influencer, contentType, influencer.platform);
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

export const getStepDetails = (step: string, campaign: Campaign) => {
  const details = {
    proposal: {
      title: 'Revisar e Aceitar Proposta',
      description: 'Analise os detalhes da campanha e aceite a proposta',
      nextAction: {
        title: 'Próximo Passo',
        description: 'Revise os detalhes da campanha e aceite a proposta para começar',
        action: 'Aceitar Proposta',
        buttonText: 'Aceitar e Continuar'
      },
      metrics: [
        { 
          icon: DollarSign, 
          label: 'Valor', 
          value: `R$ ${campaign.budget.toLocaleString()}`,
          color: 'text-green-600'
        },
        { 
          icon: Calendar, 
          label: 'Prazo', 
          value: campaign.deadline.toLocaleDateString(),
          color: 'text-blue-600'
        },
        { 
          icon: CheckCircle, 
          label: 'Requisitos', 
          value: `${campaign.requirements.length} itens`,
          color: 'text-blue-600'
        }
      ],
      tasks: [
        { title: 'Ler briefing completo', completed: false },
        { title: 'Verificar requisitos', completed: false },
        { title: 'Confirmar prazo', completed: false },
        { title: 'Aceitar proposta', completed: false }
      ]
    },
    delivery: {
      title: 'Entregar Conteúdo',
      description: 'Publique o conteúdo e envie o link para aprovação',
      nextAction: {
        title: 'Enviar Link',
        description: 'Publique o conteúdo na plataforma e forneça o link',
        action: 'Enviar Link',
        buttonText: 'Enviar para Aprovação'
      },
      metrics: [
        { 
          icon: Clock, 
          label: 'Tempo Restante', 
          value: '2 dias',
          color: 'text-yellow-600'
        },
        { 
          icon: CheckCircle, 
          label: 'Requisitos', 
          value: '0/5 completos',
          color: 'text-blue-600'
        },
        { 
          icon: Eye, 
          label: 'Preview', 
          value: 'Disponível',
          color: 'text-purple-600'
        }
      ],
      tasks: [
        { title: 'Produzir conteúdo', completed: false },
        { title: 'Revisar requisitos', completed: false },
        { title: 'Publicar na plataforma', completed: false },
        { title: 'Enviar link', completed: false }
      ]
    },
    validation: {
      title: 'Aguardar Aprovação',
      description: 'O anunciante está revisando seu conteúdo',
      nextAction: {
        title: 'Em Análise',
        description: 'O anunciante está revisando seu conteúdo. Você será notificado sobre o resultado.',
        action: 'Aguardar',
        buttonText: 'Aguardando Aprovação'
      },
      metrics: [
        { 
          icon: Clock, 
          label: 'Em Análise', 
          value: '1 dia',
          color: 'text-yellow-600'
        },
        { 
          icon: Eye, 
          label: 'Visualizações', 
          value: '2.5K',
          color: 'text-blue-600'
        },
        { 
          icon: Heart, 
          label: 'Engajamento', 
          value: '4.8%',
          color: 'text-pink-600'
        }
      ],
      tasks: [
        { title: 'Conteúdo enviado', completed: true },
        { title: 'Em análise', completed: true },
        { title: 'Aprovação', completed: false },
        { title: 'Liberação do pagamento', completed: false }
      ]
    },
    payment: {
      title: 'Receber Pagamento',
      description: 'Seu pagamento está sendo processado',
      nextAction: {
        title: 'Pagamento em Processamento',
        description: 'O pagamento será depositado em sua conta em até 7 dias úteis',
        action: 'Acompanhar',
        buttonText: 'Ver Status do Pagamento'
      },
      metrics: [
        { 
          icon: DollarSign, 
          label: 'Valor', 
          value: `R$ ${campaign.budget.toLocaleString()}`,
          color: 'text-green-600'
        },
        { 
          icon: Clock, 
          label: 'Previsão', 
          value: '7 dias úteis',
          color: 'text-blue-600'
        },
        { 
          icon: Shield, 
          label: 'Status', 
          value: 'Processando',
          color: 'text-blue-600'
        }
      ],
      tasks: [
        { title: 'Conteúdo aprovado', completed: true },
        { title: 'Pagamento iniciado', completed: true },
        { title: 'Processamento', completed: false },
        { title: 'Depósito', completed: false }
      ]
    }
  };
  return details[step as keyof typeof details];
};