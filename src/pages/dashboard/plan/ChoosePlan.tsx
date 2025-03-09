import React from 'react';
import { Crown, Star, Check, ChevronRight, AlertTriangle } from 'lucide-react';
import { PaymentFlow } from './PaymentFlow';

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
  const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null);
  const [view, setView] = React.useState<'plans' | 'payment'>('plans');
  const [currentPlan, setCurrentPlan] = React.useState('starter');

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
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Escolha seu Plano</h2>
        <p className="mt-4 text-lg text-gray-600">
          Selecione o plano ideal para impulsionar sua carreira como influenciador
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative rounded-2xl border-2 p-8 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                selectedPlan === plan.id
                  ? 'border-indigo-500 bg-indigo-50 shadow-xl'
                  : 'border-gray-200 bg-white shadow-lg hover:border-indigo-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-indigo-600 px-4 py-1 text-xs font-medium text-white">
                    Popular
                  </span>
                </div>
              )}

              <div>
                <div className={`inline-flex rounded-lg ${plan.bgColor} p-3`}>
                  <Icon className={`h-6 w-6 ${plan.color}`} />
                </div>

                <div className="mt-4">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{plan.price}</p>
                  <p className="mt-2 text-gray-500">{plan.description}</p>
                </div>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="ml-3 text-sm text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade()}
                  disabled={currentPlan === plan.id || plan.id === 'starter'}
                  className={`mt-8 w-full rounded-xl px-6 py-3 text-sm font-medium ${
                    currentPlan === plan.id
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 shadow-lg hover:shadow-xl transition-all duration-200'
                  }`}
                >
                  {currentPlan === plan.id ? 'Plano Atual' : plan.id === 'starter' ? 'Plano Gratuito' : 'Escolher Plano'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}