import React from 'react';
import { ChevronRight, DollarSign, Info, Check, Edit2 } from 'lucide-react';
import type { CampaignType, Platform, ContentType, Influencer } from './campaign/types';
import { calculateInfluencerPrice, formatCurrency } from './campaign/utils';
import { PlatformStep } from './campaign/steps/PlatformStep';
import { CategoriesStep } from './campaign/steps/CategoriesStep';
import { InfluencerStep } from './campaign/steps/InfluencerStep';
import { PostStep } from './campaign/steps/PostStep';
import { PaymentStep } from './campaign/steps/PaymentStep';
import { ReviewStep } from './campaign/steps/ReviewStep';
import { useLocation } from 'react-router-dom';

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
  
  .steps-container {
    overflow-x: auto;
    padding-bottom: var(--spacing-base);
    margin-left: calc(var(--container-padding) * -1);
    margin-right: calc(var(--container-padding) * -1);
    padding-left: var(--container-padding);
    padding-right: var(--container-padding);
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  .steps-list {
    min-width: max-content;
    padding: 0 var(--container-padding);
    display: flex;
    align-items: center;
    gap: var(--spacing-base);
  }
  
  .step-item {
    min-width: 120px;
    flex-shrink: 0;
    text-align: center;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-base);
  }
  
  .button {
    width: 100%;
    min-height: var(--min-touch-target);
    justify-content: center;
  }

  .card {
    padding: var(--spacing-base);
    margin-bottom: var(--spacing-base);
    border-radius: var(--border-radius);
  }

  .back-button {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: var(--header-height);
    padding: 0 var(--container-padding);
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(8px);
    z-index: 50;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  }

  .content-area {
    padding-top: calc(var(--header-height) + var(--spacing-base));
  }

  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: var(--bottom-nav-height);
    padding: var(--spacing-base);
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(8px);
    z-index: 50;
    border-top: 1px solid rgba(229, 231, 235, 0.5);
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: calc(var(--spacing-base) * 1.25);
  }

  .card {
    padding: calc(var(--spacing-base) * 1.25);
  }
}

@media (min-width: 769px) {
  .form-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: calc(var(--spacing-base) * 1.5);
  }

  .card {
    padding: calc(var(--spacing-base) * 1.5);
  }
}
`;

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
      mentions: [] as string[]
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

  const [showBudgetInput, setShowBudgetInput] = React.useState(false);
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

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData.type === 'single') return; // Prevent editing if single influencer
    const value = Number(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setFormData(prev => ({ ...prev, budget: value }));
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
          <h1 className={`text-2xl font-semibold text-gray-900 transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>Nova Campanha</h1>
          <p className={`mt-1 text-sm text-gray-500 transition-all duration-1000 delay-200 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Crie uma nova campanha para encontrar os melhores influenciadores
          </p>

        {/* Progress Steps */}
        <div className="mt-8 mb-4 steps-container">
          <nav aria-label="Progress">
            <ol role="list" className="flex items-center steps-list">
              {activeSteps.map((step, stepIdx) => (
                <li key={step.id} className={`${stepIdx !== activeSteps.length - 1 ? 'pr-8 sm:pr-20' : ''} relative step-item`}>
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
                      {formData.type === 'multiple' && !formData.influencer && (
                        <button
                          onClick={() => setShowBudgetInput(!showBudgetInput)}
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        >
                          <Edit2 className="h-4 w-4 text-gray-400" />
                        </button>
                      )}
                    </div>
                    {showBudgetInput && formData.type === 'multiple' && !formData.influencer ? (
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">R$</span>
                        </div>
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={formData.budget || ''}
                          onChange={handleBudgetChange}
                          className="block w-full pl-12 pr-12 sm:text-3xl border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-bold"
                          placeholder="0,00"
                        />
                      </div>
                    ) : (
                      <p className="text-3xl font-bold text-gray-900">
                        {formData.budget === null ? '---' : formatCurrency(formData.budget)}
                      </p>
                    )}
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
                    influencers: [],
                    filters: {},
                    contentType: formData.contentType,
                    searchTerm: "",
                    currentPage: 1,
                    onSearch: () => {},
                    onFilterChange: () => {},
                    onPageChange: () => {},
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
                    onSubmit: () => {
                      // TODO: Implement campaign creation
                      console.log('Creating campaign:', formData);
                      onBack();
                    }
                  })
                }
              )}
            </div>
          </div>
        </div>
        </div>
        <div className="bottom-nav">
          <div className="flex justify-between items-center">
            <button
              onClick={handleBack}
              disabled={currentStepIndex === 0}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[var(--min-touch-target)] button"
            >
              Anterior
            </button>
            <button
              onClick={handleNext}
              disabled={currentStepIndex === activeSteps.length - 1}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[var(--min-touch-target)] button"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}