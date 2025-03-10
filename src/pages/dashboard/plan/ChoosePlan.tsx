import React from 'react';
import { Crown, Star, Check, ChevronRight, AlertCircle } from 'lucide-react';
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

export function ChoosePlan({ onBack, onUpgrade }: ChoosePlanProps) {
  const [mounted, setMounted] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null);
  const [view, setView] = React.useState<'plans' | 'payment'>('plans');
  const [currentPlan, setCurrentPlan] = React.useState('starter');

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
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      popular: true
    }
  ];

  const handleUpgrade = () => {
    if (selectedPlan) {
      setView('payment');
    }
  };

  const handlePaymentSuccess = () => {
    onUpgrade(selectedPlan!);
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

  return (
    <div className="max-w-5xl mx-auto container">
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
              className={`relative rounded-2xl border plan-card ${
                selectedPlan === plan.id
                  ? 'border-blue-500 ring-2 ring-blue-200 bg-gradient-to-br from-blue-50 to-white'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              } shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-blue-600 px-4 py-1 text-xs font-medium text-white">
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
                onClick={() => handleUpgrade(plan.name)}
                disabled={currentPlan === plan.name.toLowerCase() || plan.name.toLowerCase() === 'starter'}
                className={`mt-8 rounded-xl px-6 py-3 text-sm font-medium button ${
                  currentPlan === plan.name.toLowerCase()
                    ? 'bg-green-100 text-green-700 cursor-default'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200'
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