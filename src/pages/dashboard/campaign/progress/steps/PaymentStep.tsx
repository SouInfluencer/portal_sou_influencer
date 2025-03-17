import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, Clock, Plus, AlertTriangle, Calendar, DollarSign, Receipt, Shield, X } from 'lucide-react';
import type { Campaign } from '../../../../../types';
import { paymentMethodService, type PaymentMethod, type NewPaymentMethodData } from '../../../../../services/paymentMethodService';
import { paymentService } from '../../../../../services/paymentService';
import { toast } from 'react-hot-toast';

interface PaymentStepProps {
  campaign: Campaign;
  onNext?: () => void;
  onComplete?: () => void;
}

export function PaymentStep({ campaign, onNext, onComplete }: PaymentStepProps) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<PaymentMethod[]>([]);
  const [newCard, setNewCard] = useState<NewPaymentMethodData>({
    number: '',
    expMonth: '',
    expYear: '',
    cvc: '',
    holderName: ''
  });

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      setError(null);
      const methods = await paymentMethodService.getPaymentMethods();
      setCards(methods);
      
      // Auto-select default card if exists
      const defaultCard = methods.find(card => card.isDefault);
      if (defaultCard) {
        setSelectedCard(defaultCard.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar métodos de pagamento');
      toast.error('Erro ao carregar métodos de pagamento');
      setCards([]); // Reset to empty state on error
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewCard = async () => {
    try {
      setLoading(true);
      setError(null);

      const newPaymentMethod = await paymentMethodService.addPaymentMethod(newCard);
      setCards(prev => [...prev, newPaymentMethod]);
      setSelectedCard(newPaymentMethod.id);
      setShowNewCardForm(false);
      toast.success('Cartão adicionado com sucesso');

      // Reset form
      setNewCard({
        number: '',
        expMonth: '',
        expYear: '',
        cvc: '',
        holderName: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar cartão');
      toast.error('Erro ao adicionar cartão');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDefaultCard = async (cardId: string) => {
    try {
      setLoading(true);
      setError(null);
      await paymentMethodService.updateDefaultPaymentMethod(cardId);
      setCards(prev => prev.map(card => ({
        ...card,
        isDefault: card.id === cardId
      })));
      toast.success('Cartão padrão atualizado com sucesso');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar cartão padrão');
      toast.error('Erro ao atualizar cartão padrão');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      setLoading(true);
      setError(null);
      await paymentMethodService.deletePaymentMethod(cardId);
      setCards(prev => prev.filter(card => card.id !== cardId));
      if (selectedCard === cardId) {
        setSelectedCard(null);
      }
      toast.success('Cartão removido com sucesso');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover cartão');
      toast.error('Erro ao remover cartão');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCard) {
      setError('Selecione um cartão para continuar');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await paymentService.processCampaignPayment(campaign.id, selectedCard);
      onComplete?.();
      toast.success('Pagamento processado com sucesso');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar pagamento');
      toast.error('Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !cards.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Amount */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total a pagar</p>
              <p className="text-3xl font-bold text-gray-900">
                R$ {campaign.budget.toLocaleString()}
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
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Cartões Salvos</h3>
        <div className="space-y-4">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => setSelectedCard(card.id)}
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
                <div className="flex items-center space-x-2">
                  {card.isDefault && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Principal
                    </span>
                  )}
                  {!card.isDefault && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateDefaultCard(card.id);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Tornar Principal
                    </button>
                  )}
                  {!card.isDefault && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCard(card.id);
                      }}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remover
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => setShowNewCardForm(true)}
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

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowNewCardForm(false);
                  setNewCard({
                    number: '',
                    expMonth: '',
                    expYear: '',
                    cvc: '',
                    holderName: ''
                  });
                }}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddNewCard}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? (
                  <>
                    <Clock className="animate-spin h-4 w-4 mr-2" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Salvar Cartão
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Security */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
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
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleSubmit}
          disabled={loading || !selectedCard}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {loading ? (
            <>
              <Clock className="animate-spin h-5 w-5 mr-2" />
              Processando...
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5 mr-2" />
              Pagar R$ {campaign.budget.toLocaleString()}
            </>
          )}
        </button>
      </div>
    </div>
  );
}