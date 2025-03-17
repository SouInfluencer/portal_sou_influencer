import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ChevronRight, DollarSign, Info, Check, Edit2 } from 'lucide-react';
import type { CampaignType, Platform, ContentType, Influencer } from './campaign/types';
import { calculateInfluencerPrice, formatCurrency } from './campaign/utils';
import { PlatformStep } from './campaign/steps/PlatformStep';
import { CategoriesStep } from './campaign/steps/CategoriesStep';
import { InfluencerStep } from './campaign/steps/InfluencerStep';
import { PostStep } from './campaign/steps/PostStep';
import { PaymentStep } from './campaign/steps/PaymentStep';
import { ReviewStep } from './campaign/steps/ReviewStep';
import { useLocation, useNavigate } from 'react-router-dom';
import { campaignService } from '../../services/campaignService';
import { toast } from 'react-hot-toast';

interface NewCampaignProps {
  onBack: () => void;
}

interface StepConfig {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  showForType?: CampaignType;
}

const steps: StepConfig[] = [
  { 
    id: 'platform',
    title: 'Plataforma',
    component: PlatformStep
  },
  { 
    id: 'categories',
    title: 'Categorias',
    component: CategoriesStep
  },
  { 
    id: 'influencer',
    title: 'Influenciador',
    component: InfluencerStep
  },
  { 
    id: 'post',
    title: 'Conteúdo',
    component: PostStep
  },
  {
    id: 'payment',
    title: 'Pagamento',
    component: PaymentStep
  },
  { 
    id: 'review',
    title: 'Revisão',
    component: ReviewStep
  }
];

export function NewCampaign({ onBack }: NewCampaignProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const hash = location.hash.slice(1);
  const params = new URLSearchParams(hash.split('?')[1]);
  const campaignType = params.get('type') as CampaignType;
  const influencerId = params.get('influencer');

  // Get selected influencer from localStorage if type is single
  const selectedInfluencer = React.useMemo(() => {
    if (influencerId) {
      const stored = localStorage.getItem('selectedInfluencer');
      if (stored) {
        return JSON.parse(stored);
      }
    }
    return null;
  }, [campaignType, influencerId]);

  const [currentStep, setCurrentStep] = React.useState('platform');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    type: campaignType || '' as CampaignType,
    categories: [] as string[],
    platform: '' as Platform,
    contentType: '' as ContentType,
    budget: null as number | null,
    influencer: selectedInfluencer as Influencer | null,
    paymentMethod: null as { id: string; brand: string; last4: string } | null,
    content: {
      caption: '',
      hashtags: [] as string[],
      mentions: [] as string[],
      imageUrl: undefined as string | undefined
    }
  });

  // Filter steps based on campaign type
  const activeSteps = React.useMemo(() => {
    return steps;
  }, [formData.type]);

  // Get current step index
  const currentStepIndex = React.useMemo(() => {
    return activeSteps.findIndex(step => step.id === currentStep);
  }, [currentStep, activeSteps]);

  const handleNext = () => {
    if (currentStepIndex < activeSteps.length - 1) {
      setCurrentStep(activeSteps[currentStepIndex + 1].id);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(activeSteps[currentStepIndex - 1].id);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const campaign = await campaignService.createCampaign({
        title: formData.influencer ? `Campanha com ${formData.influencer.name}` : 'Nova Campanha',
        description: formData.content.caption || '',
        platform: formData.platform,
        contentType: formData.contentType,
        budget: formData.budget || 0,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        requirements: [],
        type: formData.type,
        categories: formData.categories,
        influencerId: formData.influencer?.id,
        content: {
          caption: formData.content.caption,
          hashtags: formData.content.hashtags,
          mentions: formData.content.mentions,
          imageUrl: formData.content.imageUrl // Include image URL in payload
        }
      });

      toast.success('Campanha criada com sucesso!');
      navigate(`/dashboard/campaign/${campaign.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar campanha');
      toast.error('Erro ao criar campanha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoriesSelect = (categories: string[]) => {
    setFormData(prev => ({ ...prev, categories }));
  };

  const handleInfluencerSelect = (influencer: Influencer) => {
    // Calculate price based on platform and content type
    const price = calculateInfluencerPrice(influencer, formData.contentType);
    setFormData(prev => ({ 
      ...prev, 
      influencer,
      budget: price
    }));
    handleNext();
  };

  const handleContentTypeSelect = (contentType: ContentType) => {
    const newBudget = formData.influencer 
      ? calculateInfluencerPrice(formData.influencer, contentType)
      : formData.budget;

    setFormData(prev => ({ 
      ...prev, 
      contentType,
      budget: newBudget
    }));
  };

  return (
    <div className="py-6 container relative">
      <div className="max-w-7xl mx-auto">
        <div className="back-button">
          <button
            onClick={onBack}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 min-h-[var(--min-touch-target)] px-3 py-2 rounded-lg hover:bg-gray-100/80 transition-all duration-200"
          >
            <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
            Voltar para campanhas
          </button>
        </div>
        <div className="content-area">
          <h1 className="text-2xl font-semibold text-gray-900">Nova Campanha</h1>
          <p className="mt-1 text-sm text-gray-500">
            Crie uma nova campanha para encontrar os melhores influenciadores
          </p>

          {/* Progress Steps */}
          <div className="mt-8 mb-4">
            <nav aria-label="Progress">
              <ol role="list" className="flex items-center">
                {activeSteps.map((step, stepIdx) => (
                  <li key={step.id} className={`${stepIdx !== activeSteps.length - 1 ? 'pr-8 sm:pr-20' : ''} relative`}>
                    {currentStepIndex > stepIdx ? (
                      <>
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                          <div className="h-0.5 w-full bg-blue-600" />
                        </div>
                        <div className="relative w-8 h-8 flex items-center justify-center bg-blue-600 rounded-full hover:bg-blue-900">
                          <Check className="w-5 h-5 text-white" />
                          <span className="sr-only">{step.title}</span>
                        </div>
                      </>
                    ) : step.id === currentStep ? (
                      <>
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                          <div className="h-0.5 w-full bg-gray-200" />
                        </div>
                        <div className="relative w-8 h-8 flex items-center justify-center bg-white border-2 border-blue-600 rounded-full">
                          <span className="h-2.5 w-2.5 bg-blue-600 rounded-full" />
                          <span className="sr-only">{step.title}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                          <div className="h-0.5 w-full bg-gray-200" />
                        </div>
                        <div className="relative w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full hover:border-gray-400">
                          <span className="h-2.5 w-2.5 bg-transparent rounded-full" />
                          <span className="sr-only">{step.title}</span>
                        </div>
                      </>
                    )}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className={`text-xs font-medium ${
                        step.id === currentStep ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          <div className="py-8">
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              {/* Total Value Display */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 relative card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-sm font-medium text-gray-500">Valor Total</p>
                      </div>
                      <p className="text-3xl font-bold text-gray-900">
                        {formatCurrency(formData.budget)}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Info className="h-4 w-4 mr-1" />
                    {formData.influencer
                      ? 'Valor baseado no influenciador selecionado'
                      : 'Valor será calculado com base no influenciador selecionado'
                    }
                  </div>
                </div>
              </div>

              {/* Step Content */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 card"> 
                {React.createElement(
                  activeSteps[currentStepIndex].component,
                  {
                    // Common props
                    onNext: handleNext,
                    onBack: handleBack,
                    // Step-specific props
                    ...(currentStep === 'categories' && {
                      selectedCategories: formData.categories,
                      onCategoriesSelect: handleCategoriesSelect
                    }),
                    ...(currentStep === 'platform' && {
                      selectedPlatform: formData.platform,
                      selectedContentType: formData.contentType,
                      onPlatformSelect: (platform: Platform) => setFormData({ ...formData, platform }),
                      onContentTypeSelect: handleContentTypeSelect
                    }),
                    ...(currentStep === 'influencer' && {
                      contentType: formData.contentType,
                      platform: formData.platform,
                      onInfluencerSelect: handleInfluencerSelect
                    }),
                    ...(currentStep === 'post' && {
                      platform: formData.platform,
                      contentType: formData.contentType,
                      onContentChange: (content: any) => setFormData({ ...formData, content })
                    }),
                    ...(currentStep === 'payment' && {
                      budget: formData.budget || 0,
                      onPaymentMethodSelect: (method) => {
                        setFormData(prev => ({ ...prev, paymentMethod: method }));
                        handleNext();
                      }
                    }),
                    ...(currentStep === 'review' && {
                      formData,
                      onSubmit: handleSubmit,
                      loading,
                      error
                    })
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}