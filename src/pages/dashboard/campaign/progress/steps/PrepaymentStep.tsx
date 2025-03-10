import React from 'react';
import { ShieldCheck, CreditCard, CheckCircle, Clock, Plus, AlertTriangle } from 'lucide-react';
import type { Campaign } from '../../../../../types';

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
  
  .card-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-base);
  }
  
  .payment-card {
    padding: var(--spacing-base);
  }
  
  .button {
    width: 100%;
    min-height: var(--min-touch-target);
    justify-content: center;
  }
  
  .input {
    min-height: var(--min-touch-target);
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .payment-card {
    padding: calc(var(--spacing-base) * 1.25);
  }
}

@media (min-width: 769px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .payment-card {
    padding: calc(var(--spacing-base) * 1.5);
  }
}
`;

interface PrepaymentStepProps {
  campaign: Campaign;
  onNext?: () => void;
  onComplete?: () => void;
}

interface SavedCard {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  holderName: string;
}

export function PrepaymentStep({ campaign, onNext, onComplete }: PrepaymentStepProps) {
  const [status, setStatus] = React.useState<'pending' | 'processing' | 'completed'>('pending');
  const [showNewCardForm, setShowNewCardForm] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
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

  // Mock saved cards
  const savedCards: SavedCard[] = [
    {
      id: '1',
      brand: 'visa',
      last4: '4242',
      expMonth: 12,
      expYear: 2025,
      holderName: 'João Silva'
    },
    {
      id: '2',
      brand: 'mastercard',
      last4: '8888',
      expMonth: 8,
      expYear: 2024,
      holderName: 'João Silva'
    }
  ];

  const [newCard, setNewCard] = React.useState({
    number: '',
    expMonth: '',
    expYear: '',
    cvc: '',
    holderName: ''
  });

  const handlePayment = () => {
    if (!selectedCard && !showNewCardForm) {
      setError('Por favor, selecione um cartão ou adicione um novo');
      return;
    }

    if (showNewCardForm) {
      // Validate new card
      if (!newCard.number || !newCard.expMonth || !newCard.expYear || !newCard.cvc || !newCard.holderName) {
        setError('Por favor, preencha todos os campos do cartão');
        return;
      }
    }

    setError(null);
    setStatus('processing');
    // Simulate payment processing
    setTimeout(() => {
      setStatus('completed');
      onComplete?.();
    }, 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 container">
      {/* Step Header */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-50 to-white border border-green-100 flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Pré-Pagamento</h2>
              <p className="text-gray-500">Selecione um cartão de crédito para realizar o pré-pagamento da campanha.</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Pagamento Seguro</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 sm:gap-6 card-grid">
          <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white shadow rounded-lg payment-card">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Método de Pagamento</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowNewCardForm(false)}
                  className="mt-3 w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:text-sm min-h-[var(--min-touch-target)] button"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:text-sm min-h-[var(--min-touch-target)] button"
                  onClick={() => setShowNewCardForm(false)}
                >
                  Desconectar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}