import React, { useState } from 'react';
import { CreditCard, CheckCircle, AlertTriangle, ShieldCheck, Plus, X } from 'lucide-react';

interface PaymentStepProps {
  budget: number;
  onPaymentMethodSelect: (method: { id: string; brand: string; last4: string }) => void;
}

export function PaymentStep({ budget, onPaymentMethodSelect }: PaymentStepProps) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = () => {
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
      // TODO: Implement card validation and processing
    }

    const card = savedCards.find(c => c.id === selectedCard);
    if (card) {
      onPaymentMethodSelect({
        id: card.id,
        brand: card.brand,
        last4: card.last4
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 mb-6 shadow-lg">
          <CreditCard className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Método de Pagamento</h2>
        <p className="text-lg text-gray-600">
          Selecione um cartão para realizar o pagamento da campanha
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
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total a pagar</p>
              <p className="text-3xl font-bold text-gray-900">
                R$ {budget.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-green-500" />
            <span className="text-sm text-green-700">Pagamento Seguro</span>
          </div>
        </div>
      </div>

      {/* Saved Cards */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
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
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
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

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleSubmit}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <CreditCard className="h-5 w-5 mr-2" />
          Continuar
        </button>
      </div>
    </div>
  );
}