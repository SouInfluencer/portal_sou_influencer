import React from 'react';
import { Crown, Star, Check, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { PaymentFlow } from './PaymentFlow';

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
  
  .plan-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-base);
  }
  
  .plan-card {
    padding: var(--spacing-base);
  }
  
  .features-list {
    margin-top: var(--spacing-base);
  }
  
  .button {
    width: 100%;
    min-height: var(--min-touch-target);
    justify-content: center;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .plan-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .plan-card {
    padding: calc(var(--spacing-base) * 1.25);
  }
}

@media (min-width: 769px) {
  .plan-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .plan-card {
    padding: calc(var(--spacing-base) * 1.5);
  }
}
`;

interface Plan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  icon: typeof Star;
  color: string;
  bgColor: string;
  popular?: boolean;
}

interface ChoosePlanProps {
  onBack: () => void;
  onUpgrade: (planId: string) => void;
}

interface FeatureProps {
  title: string;
  description: string;
}

function Feature({ title, description }: FeatureProps) {
  return (
      <div className="flex items-center space-x-2">
        <Star className="h-4 w-4 text-amber-400" />
        <div>
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
  );
}

export function ChoosePlan({ onBack, onUpgrade }: ChoosePlanProps) {
  const [mounted, setMounted] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null);
  const [view, setView] = React.useState<'plans' | 'payment' | 'confirmation'>('plans');
  const [currentPlan, setCurrentPlan] = React.useState('starter');
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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

  const plans: Plan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: 'Grátis',
      description: 'Ideal para iniciantes no marketing de influência',
      features: [
        'Até 2 campanhas por mês',
        'Perfil básico verificado',
        'Métricas de engajamento básicas',
        'Acesso ao marketplace de campanhas',
        'Suporte por email',
        'Contratos básicos',
        'Agenda de postagens',
        'Métricas em tempo real',
        'Integração com uma rede social',
        'Relatórios básicos'
      ],
      icon: Star,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 'R$ 99/mês',
      description: 'Para influenciadores profissionais',
      features: [
        'Campanhas ilimitadas por mês',
        'Perfil verificado em destaque',
        'Analytics avançado de audiência',
        'Prioridade no matching de campanhas',
        'Suporte prioritário 24/7',
        'Seguro de entrega de conteúdo',
        'Ferramentas de gestão de conteúdo',
        'Calendário de postagens integrado',
        'Contratos personalizáveis',
        'Consultoria mensal de crescimento',
        'Métricas avançadas de ROI',
        'Integração com todas as redes sociais',
        'Relatórios personalizados',
        'API para automação',
        'Automação de campanhas',
        'Análise preditiva de resultados',
        'Dashboards customizados',
        'Múltiplos perfis de usuário'
      ],
      icon: Crown,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      popular: true
    }
  ];

  const handlePlanSelect = (plan: Plan) => {
    // Don't allow selecting current plan or starter plan
    if (plan.id === currentPlan || plan.id === 'starter') {
      return;
    }

    setSelectedPlan(plan.id);
    setView('confirmation');
  };

  const handleConfirmPlan = () => {
    if (selectedPlan) {
      setView('payment');
    }
  };

  const handlePaymentSuccess = async () => {
    setProcessing(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      onUpgrade(selectedPlan!);
    } catch (err) {
      setError('Erro ao atualizar plano. Por favor tente novamente.');
      setView('plans');
    } finally {
      setProcessing(false);
    }
  };

  if (view === 'payment') {
    return (
        <PaymentFlow
            onBack={() => setView('plans')}
            onSuccess={handlePaymentSuccess}
            planPrice={99}
        />
    );
  }

  if (view === 'confirmation') {
    const selectedPlanDetails = plans.find(p => p.id === selectedPlan);

    if (!selectedPlanDetails) {
      return null;
    }

    return (
        <div className="max-w-2xl mx-auto container">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 mb-6">
              <selectedPlanDetails.icon className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Confirmar Upgrade</h2>
            <p className="text-lg text-gray-600">
              Você está prestes a fazer upgrade para o plano {selectedPlanDetails.name}
            </p>
          </div>

          {/* Plan Summary */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{selectedPlanDetails.name}</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">{selectedPlanDetails.price}</p>
              </div>
              <div className={`p-3 rounded-xl ${selectedPlanDetails.bgColor}`}>
                <selectedPlanDetails.icon className={`h-6 w-6 ${selectedPlanDetails.color}`} />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Recursos Incluídos:</h4>
              <ul className="space-y-3">
                {selectedPlanDetails.features.slice(0, 5).map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      {feature}
                    </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <button
                onClick={() => setView('plans')}
                className="px-6 py-3 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200 min-h-[var(--min-touch-target)] button"
            >
              Voltar
            </button>
            <button
                onClick={handleConfirmPlan}
                className="inline-flex items-center px-8 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-lg hover:shadow-xl transition-all duration-200 min-h-[var(--min-touch-target)] button"
            >
              Continuar para Pagamento
            </button>
          </div>
        </div>
    );
  }

  return (
      <div className="max-w-5xl mx-auto container">
        {error && (
            <div className="mb-8 rounded-lg bg-red-50 p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
        )}

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Escolha seu Plano</h2>
          <p className="mt-4 text-lg text-gray-600">
            Selecione o plano ideal para impulsionar sua carreira como influenciador
          </p>
        </div>

        <div className="grid gap-8 plan-grid">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
                <div
                    key={plan.id}
                    className={`relative rounded-2xl border-2 plan-card ${
                        selectedPlan === plan.id
                            ? 'border-indigo-500 ring-2 ring-indigo-200 bg-gradient-to-br from-indigo-50 to-white'
                            : 'border-gray-200 bg-white hover:border-indigo-300'
                    } shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]`}
                >
                  {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-indigo-600 px-4 py-1 text-xs font-medium text-white">
                    Popular
                  </span>
                      </div>
                  )}

                  <div className={`inline-flex rounded-lg ${plan.bgColor} p-3`}>
                    <Icon className={`h-6 w-6 ${plan.color}`} />
                  </div>

                  <h3 className="mt-4 text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
                  <p className="mt-4 text-3xl font-bold text-gray-900">{plan.price}</p>
                  <ul className="mt-8 space-y-4 features-list">
                    {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mt-0.5" />
                          <span className="ml-3 text-sm text-gray-500">{feature}</span>
                        </li>
                    ))}
                  </ul>

                  <button
                      onClick={() => handlePlanSelect(plan)}
                      disabled={currentPlan === plan.name.toLowerCase() || plan.name.toLowerCase() === 'starter'}
                      className={`mt-8 rounded-xl px-6 py-3 text-sm font-medium button ${
                          currentPlan === plan.name.toLowerCase()
                              ? 'bg-green-100 text-green-700 cursor-default'
                              : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 shadow-lg hover:shadow-xl transition-all duration-200'
                      }`}
                  >
                    {currentPlan === plan.name.toLowerCase() ? 'Plano Atual' : plan.name.toLowerCase() === 'starter' ? 'Plano Gratuito' : 'Escolher Plano'}
                  </button>
                </div>
            );
          })}
        </div>
      </div>
  );
}