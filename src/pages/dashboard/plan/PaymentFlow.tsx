import React, { useState } from 'react';
import { CreditCard, CheckCircle, Shield, AlertTriangle, Calendar, DollarSign, X } from 'lucide-react';

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
  
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-base);
  }
  
  .title {
    font-size: var(--font-size-xl);
  }
  
  .description {
    font-size: var(--font-size-base);
  }
  
  .card {
    padding: var(--spacing-base);
    margin-bottom: var(--spacing-base);
  }
  
  .card-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-base);
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
  
  .card {
    padding: calc(var(--spacing-base) * 1.25);
  }
}

@media (min-width: 769px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .card {
    padding: calc(var(--spacing-base) * 1.5);
  }
}
`;

interface PaymentFlowProps {
  onBack: () => void;
  onSuccess: () => void;
  planPrice: number;
}

export function PaymentFlow({ onBack, onSuccess, planPrice }: PaymentFlowProps) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
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
  const savedCards = [
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

  const [newCard, setNewCard] = useState({
    number: '',
    expMonth: '',
    expYear: '',
    cvc: '',
    holderName: ''
  });

  const handleSubmit = async () => {
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
    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSuccess();
    } catch (err) {
      setError('Erro ao processar pagamento. Por favor, tente novamente.');
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto container">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 mb-6 shadow-lg">
          <CreditCard className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3 title">Pagamento</h2>
        <p className="text-lg text-gray-600 description">
          Escolha um método de pagamento para continuar
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 rounded-xl border border-red-200">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Payment Amount */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total a pagar</p>
              <p className="text-3xl font-bold text-gray-900">
                R$ {planPrice.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-500" />
            <span className="text-sm text-green-700">Pagamento Seguro</span>
          </div>
        </div>
      </div>

      {/* Saved Cards */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 card">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Cartões Salvos</h3>
        <div className="space-y-4">
          {savedCards.map((card) => (
            <div
              key={card.id}
              onClick={() => {
                setSelectedCard(card.id);
                setShowNewCardForm(false);
              }}
              className={`relative rounded-lg border p-4 cursor-pointer transition-all duration-200 ${
                selectedCard === card.id
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-blue-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={`/card-brands/${card.brand}.svg`}
                    alt={card.brand}
                    className="h-8 w-8"
                  />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      •••• {card.last4}
                    </p>
                    <p className="text-sm text-gray-500">
                      Expira em {card.expMonth.toString().padStart(2, '0')}/{card.expYear}
                    </p>
                  </div>
                </div>
                {selectedCard === card.id && (
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                )}
              </div>
            </div>
          ))}

          <button
            onClick={() => {
              setShowNewCardForm(true);
              setSelectedCard(null);
            }}
            className={`relative w-full rounded-lg border-2 border-dashed p-4 hover:border-blue-300 transition-colors duration-200 ${
              showNewCardForm ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <div className="flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-900">
                Adicionar novo cartão
              </span>
            </div>
          </button>
        </div>

        {/* New Card Form */}
        {showNewCardForm && (
          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                Número do Cartão
              </label>
              <input
                type="text"
                id="cardNumber"
                value={newCard.number}
                onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="1234 5678 9012 3456"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="expMonth" className="block text-sm font-medium text-gray-700">
                  Mês
                </label>
                <input
                  type="text"
                  id="expMonth"
                  value={newCard.expMonth}
                  onChange={(e) => setNewCard({ ...newCard, expMonth: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="MM"
                />
              </div>
              <div>
                <label htmlFor="expYear" className="block text-sm font-medium text-gray-700">
                  Ano
                </label>
                <input
                  type="text"
                  id="expYear"
                  value={newCard.expYear}
                  onChange={(e) => setNewCard({ ...newCard, expYear: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="AAAA"
                />
              </div>
              <div>
                <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                  CVC
                </label>
                <input
                  type="text"
                  id="cvc"
                  value={newCard.cvc}
                  onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="123"
                />
              </div>
            </div>

            <div>
              <label htmlFor="holderName" className="block text-sm font-medium text-gray-700">
                Nome no Cartão
              </label>
              <input
                type="text"
                id="holderName"
                value={newCard.holderName}
                onChange={(e) => setNewCard({ ...newCard, holderName: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="NOME COMO ESTÁ NO CARTÃO"
              />
            </div>
          </div>
        )}
      </div>

      {/* Payment Security */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 card">
        <h3 className="text-lg font-medium text-gray-900">Segurança do Pagamento</h3>
        <div className="mt-5">
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900">Pagamento Seguro</h4>
                <p className="text-sm text-gray-500">
                  Todas as transações são processadas com criptografia de ponta a ponta
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900">Cobrança Recorrente</h4>
                <p className="text-sm text-gray-500">
                  Você pode cancelar sua assinatura a qualquer momento
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-4 sm:gap-3">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200 min-h-[var(--min-touch-target)] button"
        >
          Voltar
        </button>
        <button
          onClick={handleSubmit}
          disabled={processing}
          className="inline-flex items-center px-8 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 min-h-[var(--min-touch-target)] button"
        >
          {processing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              Processando...
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5 mr-2" />
              Pagar R$ {planPrice.toLocaleString()}
            </>
          )}
        </button>
      </div>
    </div>
  );
}