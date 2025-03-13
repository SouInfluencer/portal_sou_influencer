import React, { useState, useEffect } from 'react';
import { Crown, Star, Check, ChevronRight, AlertTriangle, Users, BarChart2, Heart } from 'lucide-react';
import { ManagePlan } from './plan/ManagePlan';
import { ChoosePlan } from './plan/ChoosePlan';
import { DowngradeFlow } from './plan/DowngradeFlow';
import { PlanProvider, usePlan } from './plan/context/PlanContext';
import { planService } from '../../services/planService';
import { toast } from 'react-hot-toast';

export function Plan() {
  const [view, setView] = useState<'plans' | 'manage' | 'choose' | 'downgrade'>('plans');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<{
    campaignsThisMonth: number;
    approvalRate: number;
    monthlyEarnings: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const { currentPlan, subscription, refreshPlan } = usePlan();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await planService.getUsageMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        toast.error('Erro ao carregar métricas de uso');
      }
    };

    fetchMetrics();
  }, []);

  const handleUpgrade = async (planId: string) => {
    try {
      setLoading(true);
      await planService.upgradePlan(planId);
      await refreshPlan();
      toast.success('Plano atualizado com sucesso!');
      setView('plans');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar plano');
    } finally {
      setLoading(false);
    }
  };

  const handleDowngrade = async () => {
    try {
      setLoading(true);
      await planService.downgradePlan('Downgrade requested by user');
      await refreshPlan();
      toast.success('Plano alterado com sucesso!');
      setView('plans');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao alterar plano');
    } finally {
      setLoading(false);
    }
  };

  if (view === 'manage') {
    return <ManagePlan onBack={() => setView('plans')} />;
  }

  if (view === 'choose') {
    return (
      <ChoosePlan
        onBack={() => setView('plans')}
        onUpgrade={handleUpgrade}
      />
    );
  }

  if (view === 'downgrade') {
    return (
      <DowngradeFlow
        onBack={() => setView('plans')}
        onConfirm={handleDowngrade}
      />
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Meu Plano</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gerencie sua assinatura e recursos disponíveis
        </p>

        <div className="py-4">
          {/* Current Plan Status */}
          <div className="bg-gradient-to-br from-indigo-50/50 to-white rounded-2xl shadow-lg border border-indigo-100/50 p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Plano {currentPlan?.name || 'Carregando...'}
                </h2>
                {subscription && (
                  <p className="text-sm text-gray-500">
                    Próxima cobrança em {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setView('manage')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
                >
                  Gerenciar Assinatura
                </button>
                {currentPlan?.name === 'Pro' && (
                  <button
                    onClick={() => setView('downgrade')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-red-600 bg-white hover:bg-red-50 transition-all duration-200"
                  >
                    Fazer Downgrade
                  </button>
                )}
              </div>
            </div>

            {metrics && (
              <div className="grid gap-4 mt-6 sm:mt-8 grid-cols-2 sm:grid-cols-3">
                <div className="bg-white rounded-xl p-4 border border-gray-100 hover:border-indigo-200 transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="h-5 w-5 text-gray-400" />
                    <BarChart2 className="h-4 w-4 text-gray-300" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-500">Campanhas do Mês</h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">{metrics.campaignsThisMonth}</p>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-indigo-600 rounded-full"
                      style={{ width: `${(metrics.campaignsThisMonth / 10) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-100 hover:border-indigo-200 transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <Heart className="h-5 w-5 text-gray-400" />
                    <BarChart2 className="h-4 w-4 text-gray-300" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-500">Taxa de Aprovação</h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">{metrics.approvalRate}%</p>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-indigo-600 rounded-full"
                      style={{ width: `${metrics.approvalRate}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-100 hover:border-indigo-200 transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <Crown className="h-5 w-5 text-gray-400" />
                    <BarChart2 className="h-4 w-4 text-gray-300" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-500">Ganhos do Mês</h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    R$ {metrics.monthlyEarnings.toLocaleString()}
                  </p>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-indigo-600 rounded-full"
                      style={{ width: '60%' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap the Plan component with PlanProvider
export default function PlanWithProvider() {
  return (
    <PlanProvider>
      <Plan />
    </PlanProvider>
  );
}