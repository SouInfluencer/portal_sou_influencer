import React from 'react';
import { Check, Crown, Star, Zap, X, ArrowDown, Users, BarChart2 } from 'lucide-react';
import { ManagePlan } from './plan/ManagePlan';
import { ChoosePlan } from './plan/ChoosePlan';
import { DowngradeFlow } from './plan/DowngradeFlow';

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
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-base);
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
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 769px) {
  .plan-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
`;

export function Plan() {
  const [currentPlan, setCurrentPlan] = React.useState('starter');
  const [showUpgradeConfirm, setShowUpgradeConfirm] = React.useState(false);
  const [view, setView] = React.useState<'plans' | 'manage' | 'choose' | 'downgrade'>('plans');
  const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null);
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

  const plans = [
    {
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
      bgColor: 'bg-gray-100',
    },
    {
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
      popular: true,
    },
  ];

  const handleUpgrade = (planName: string) => {
    setSelectedPlan(planName);
    setView('choose');
  };

  const handleDowngrade = () => {
    setView('downgrade');
  };

  const handleManageSubscription = () => {
    setView('manage');
  };

  const confirmUpgrade = () => {
    if (selectedPlan) {
      setCurrentPlan(selectedPlan.toLowerCase());
      setShowUpgradeConfirm(false);
      // TODO: Implement actual plan upgrade
    }
  };

  return (
      <div className="py-6 container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {view === 'manage' ? (
              <ManagePlan onBack={() => setView('plans')} />
          ) : view === 'choose' ? (
              <ChoosePlan
                  onBack={() => setView('plans')}
                  onUpgrade={(planId) => {
                    setCurrentPlan(planId);
                    setView('plans');
                  }}
              />
          ) : view === 'downgrade' ? (
              <DowngradeFlow
                  onBack={() => setView('plans')}
                  onConfirm={() => {
                    setCurrentPlan('starter');
                    setView('plans');
                  }}
              />
          ) : (
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Meu Plano</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Gerencie sua assinatura e recursos disponíveis
                </p>

                <div className="py-4">
                  {/* Current Plan Status */}
                  <div className="bg-gradient-to-br from-indigo-50/50 to-white rounded-2xl shadow-lg border border-indigo-100/50 p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 plan-card">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">Plano {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}</h2>
                        <p className="text-sm text-gray-500">Próxima cobrança em 15 de Abril, 2024</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                            onClick={handleManageSubscription}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
                        >
                          Gerenciar Assinatura
                        </button>
                        {currentPlan === 'pro' && (
                            <button
                                onClick={handleDowngrade}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-red-600 bg-white hover:bg-red-50 transition-all duration-200"
                            >
                              Fazer Downgrade
                            </button>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 mt-6 sm:mt-8 stats-grid">
                      <div className="bg-white rounded-xl p-4 border border-gray-100 hover:border-indigo-200 transition-all duration-200">
                        <div className="flex items-center justify-between mb-2">
                          <Users className="h-5 w-5 text-gray-400" />
                          <BarChart2 className="h-4 w-4 text-gray-300" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-500">Campanhas do Mês</h3>
                        <p className="mt-2 text-3xl font-semibold text-gray-900">7</p>
                        <p className="text-xs text-gray-500 mt-1">+40% que mês anterior</p>
                        <div className="mt-2 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-indigo-600 rounded-full" style={{ width: '35%' }} />
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-gray-100 hover:border-indigo-200 transition-all duration-200">
                        <div className="flex items-center justify-between mb-2">
                          <Users className="h-5 w-5 text-gray-400" />
                          <BarChart2 className="h-4 w-4 text-gray-300" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-500">Taxa de Aprovação</h3>
                        <p className="mt-2 text-3xl font-semibold text-gray-900">98%</p>
                        <p className="text-xs text-gray-500 mt-1">+5% que mês anterior</p>
                        <div className="mt-2 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-indigo-600 rounded-full" style={{ width: '98%' }} />
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-gray-100 hover:border-indigo-200 transition-all duration-200">
                        <div className="flex items-center justify-between mb-2">
                          <Users className="h-5 w-5 text-gray-400" />
                          <BarChart2 className="h-4 w-4 text-gray-300" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-500">Ganhos do Mês</h3>
                        <p className="mt-2 text-3xl font-semibold text-gray-900">R$ 12.5K</p>
                        <p className="text-xs text-gray-500 mt-1">+25% que mês anterior</p>
                        <div className="mt-2 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-indigo-600 rounded-full" style={{ width: '60%' }} />
                        </div>
                      </div>
                    </div>

                    {/* Benefits Summary */}
                    <div className="mt-6 sm:mt-8 bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-indigo-100">
                      <h3 className="text-sm font-medium text-indigo-900">Benefícios do seu plano este mês</h3>
                      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="flex items-center">
                          <Check className="h-5 w-5 text-indigo-600" />
                          <span className="ml-2 text-sm text-indigo-700">
                        Economia de R$ 450 em taxas
                      </span>
                        </div>
                        <div className="flex items-center">
                          <Check className="h-5 w-5 text-indigo-600" />
                          <span className="ml-2 text-sm text-indigo-700">
                        15 matches premium com marcas
                      </span>
                        </div>
                        <div className="flex items-center">
                          <Check className="h-5 w-5 text-indigo-600" />
                          <span className="ml-2 text-sm text-indigo-700">
                        2 consultorias de growth realizadas
                      </span>
                        </div>
                        <div className="flex items-center">
                          <Check className="h-5 w-5 text-indigo-600" />
                          <span className="ml-2 text-sm text-indigo-700">
                        Prioridade em 5 campanhas especiais
                      </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Available Plans */}
                  <div className="grid gap-6 sm:gap-8 plan-grid max-w-5xl mx-auto">
                    {plans.map((plan) => {
                      const Icon = plan.icon;
                      return (
                          <div
                              key={plan.name}
                              className={`relative rounded-lg border ${
                                  currentPlan === plan.name.toLowerCase()
                                      ? 'border-indigo-500 ring-2 ring-indigo-200 bg-gradient-to-br from-indigo-50 to-white shadow-lg'
                                      : 'border-gray-200 bg-white hover:border-indigo-300'
                              } p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]`}
                          >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="inline-flex items-center rounded-full bg-indigo-600 px-4 py-1 text-xs font-medium text-white">
                            Popular
                          </span>
                                </div>
                            )}
                            <div className={`inline-flex rounded-lg ${plan.bgColor} p-3 min-h-[var(--min-touch-target)] min-w-[var(--min-touch-target)]`}>
                              <Icon className={`h-6 w-6 ${plan.color}`} />
                            </div>
                            <h3 className="mt-4 text-2xl font-bold text-gray-900">{plan.name}</h3>
                            <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
                            <p className="mt-4 text-3xl font-bold text-gray-900">{plan.price}</p>

                            <ul className="mt-8 space-y-4">
                              {plan.features.map((feature) => (
                                  <li key={feature} className="flex items-start">
                                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                                    <span className="ml-3 text-sm text-gray-500">{feature}</span>
                                  </li>
                              ))}
                            </ul>

                            <button
                                className={`mt-8 w-full rounded-xl px-6 py-3 text-sm font-medium ${
                                    currentPlan === plan.name.toLowerCase()
                                        ? 'bg-green-100 text-green-700 cursor-default min-h-[var(--min-touch-target)]'
                                        : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 shadow-lg hover:shadow-xl transition-all duration-200'
                                }`}
                                onClick={() => handleUpgrade(plan.name)}
                                disabled={currentPlan === plan.name.toLowerCase() || plan.name.toLowerCase() === 'starter'}
                            >
                              {currentPlan === plan.name.toLowerCase() ? 'Plano Atual' : 'Escolher Plano'}
                            </button>
                          </div>
                      );
                    })}
                  </div>
                </div>
              </div>
          )}
        </div>

        {/* Upgrade Confirmation Modal */}
        {showUpgradeConfirm && selectedPlan && (
            <div className="fixed z-10 inset-0 overflow-y-auto">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                      <Crown className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Upgrade para {selectedPlan}
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Tem certeza que deseja fazer upgrade para o plano {selectedPlan}?
                          Você terá acesso imediato a todos os recursos do novo plano.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                        type="button"
                        onClick={confirmUpgrade}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Confirmar Upgrade
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowUpgradeConfirm(false)}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}