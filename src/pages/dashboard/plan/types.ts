import { Plan, Subscription } from '../../services/planService';

export interface ManagePlanProps {
  onBack: () => void;
}

export interface ChoosePlanProps {
  onBack: () => void;
  onUpgrade: (planId: string) => void;
}

export interface DowngradeFlowProps {
  onBack: () => void;
  onConfirm: () => void;
}

export interface PaymentFlowProps {
  onBack: () => void;
  onSuccess: () => void;
  planPrice: number;
}

export interface PlanContextData {
  currentPlan: Plan | null;
  subscription: Subscription | null;
  loading: boolean;
  error: string | null;
  refreshPlan: () => Promise<void>;
}