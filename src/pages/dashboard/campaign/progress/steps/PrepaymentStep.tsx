import React from 'react';
import { ShieldCheck, CreditCard, CheckCircle, Clock, Plus, AlertTriangle } from 'lucide-react';
import type { Campaign } from '../../../../../types';

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
    <div className="space-y-8">
      {/* Step Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Pré-Pagamento</h2>
        <p className="mt-1 text-sm text-gray-500">
          Selecione um cartão de crédito para realizar o pré-pagamento da campanha.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Payment Amount */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">Valor do Pré-Pagamento</h3>
          <div className="mt-5">
            <div className="rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-center sm:justify-between">
              <div className="sm:flex sm:items-center">
                <div className="flex-shrink-0">
                  <CreditCard className="h-8 w-8 text-gray-400" />
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-4">
                  <div className="text-sm font-medium text-gray-900">Total a pagar</div>
                  <div className="mt-1 text-3xl font-bold text-gray-900">
                    R$ {campaign.budget.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <ShieldCheck className="h-4 w-4 mr-1" />
                  Pagamento Seguro
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Cards */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cartões Salvos</h3>
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
                    ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                    : 'border-gray-200 hover:border-indigo-200'
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
                    <CheckCircle className="h-5 w-5 text-indigo-600" />
                  )}
                </div>
              </div>
            ))}

            <button
              onClick={() => {
                setShowNewCardForm(true);
                setSelectedCard(null);
              }}
              className={`relative w-full rounded-lg border-2 border-dashed p-4 hover:border-indigo-300 transition-colors duration-200 ${
                showNewCardForm ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
              }`}
            >
              <div className="flex items-center justify-center">
                <Plus className="h-5 w-5 text-gray-400 mr-2" />
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
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="NOME COMO ESTÁ NO CARTÃO"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Security */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">Segurança do Pagamento</h3>
          <div className="mt-5">
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShieldCheck className="h-6 w-6 text-green-500" />
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
                  <CreditCard className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">Garantia de Entrega</h4>
                  <p className="text-sm text-gray-500">
                    O pagamento só é liberado após a aprovação do conteúdo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handlePayment}
          disabled={status !== 'pending'}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'processing' ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              Processando...
            </>
          ) : status === 'completed' ? (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              Pagamento Concluído
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5 mr-2" />
              Realizar Pagamento
            </>
          )}
        </button>
      </div>
    </div>
  );
}