import React, { createContext, useContext, useState, useEffect } from 'react';
import { planService, Plan, Subscription } from '../../../../services/planService';
import type { PlanContextData } from '../types';

const PlanContext = createContext<PlanContextData | undefined>(undefined);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlanData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [plans, subscription] = await Promise.all([
        planService.getPlans(),
        planService.getCurrentSubscription()
      ]);

      if (subscription) {
        const currentPlan = plans.find(p => p.id === subscription.planId);
        setCurrentPlan(currentPlan || null);
      }
      
      setSubscription(subscription);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados do plano');
      console.error('Error fetching plan data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanData();
  }, []);

  return (
    <PlanContext.Provider value={{
      currentPlan,
      subscription,
      loading,
      error,
      refreshPlan: fetchPlanData
    }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
}