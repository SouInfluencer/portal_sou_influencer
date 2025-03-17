import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, CheckCircle, Clock, Plus, AlertTriangle, Calendar, DollarSign, Receipt, Shield, X } from 'lucide-react';
import { planService } from '../../../services/planService';
import { paymentService, type Card, type NewCardData } from '../../../services/paymentService';
import { usePlan } from './context/PlanContext';
import { toast } from 'react-hot-toast';
import type { ManagePlanProps } from './types';
import { PaymentMethodForm } from './components/PaymentMethodForm';

export function ManagePlan({ onBack }: ManagePlanProps) {
  const { currentPlan, subscription, refreshPlan } = usePlan();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [invoices, setInvoices] = useState<Array<{
    id: string;
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    downloadUrl?: string;
  }>>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cardsData, invoicesData] = await Promise.all([
          paymentService.getPaymentMethods(),
          paymentService.getInvoices()
        ]);
        
        setCards(cardsData);
        setInvoices(invoicesData);
        
        // Set default card as selected
        const defaultCard = cardsData.find(card => card.isDefault);
        if (defaultCard) {
          setSelectedCard(defaultCard.id);
        }
      } catch (error) {
        console.error('Error fetching payment data:', error);
        toast.error('Erro ao carregar dados de pagamento');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCancelSubscription = async () => {
    try {
      setLoading(true);
      await planService.cancelSubscription('Cancelamento solicitado pelo usuário');
      await refreshPlan();
      setShowCancelConfirm(false);
      toast.success('Assinatura cancelada com sucesso');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao cancelar assinatura');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewCard = async (formData: NewCardData) => {
    try {
      setLoading(true);
      const newCard = await paymentService.addPaymentMethod(formData);
      setCards(prev => [...prev, newCard]);
      setSelectedCard(newCard.id);
      setShowNewCardForm(false);
      toast.success('Cartão adicionado com sucesso');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao adicionar cartão');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDefaultCard = async (cardId: string) => {
    try {
      setLoading(true);
      await paymentService.updateDefaultPaymentMethod(cardId);
      setCards(prev => prev.map(card => ({
        ...card,
        isDefault: card.id === cardId
      })));
      setSelectedCard(cardId);
      toast.success('Método de pagamento atualizado com sucesso');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar método de pagamento');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      setLoading(true);
      await paymentService.deletePaymentMethod(cardId);
      setCards(prev => prev.filter(card => card.id !== cardId));
      if (selectedCard === cardId) {
        setSelectedCard(null);
      }
      toast.success('Cartão removido com sucesso');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao remover cartão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para planos
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Gerenciar Assinatura</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie seus métodos de pagamento e veja o histórico de faturas
          </p>
        </div>

        {/* Current Plan Status */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between p-6">
            <div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-medium text-gray-900">Plano {currentPlan?.name}</h2>
                  <p className="text-sm text-gray-500">
                    {subscription?.status === 'active' 
                      ? `Próxima cobrança em ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                      : 'Assinatura inativa'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <CheckCircle className="h-4 w-4 mr-1" />
                Ativo
              </span>
              <span className="text-lg font-medium text-gray-900">R$ {currentPlan?.price}/mês</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mt-8">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Método de Pagamento</h3>
            <div className="space-y-4">
              {/* Saved Cards */}
              <div className="space-y-4">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className={`relative rounded-lg border p-4 transition-all duration-200 ${
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
                        <button
                          onClick={() => handleUpdateDefaultCard(card.id)}
                          disabled={card.isDefault || loading}
                          className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Tornar Principal
                        </button>
                        <button
                          onClick={() => handleDeleteCard(card.id)}
                          disabled={card.isDefault || loading}
                          className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setShowNewCardForm(true)}
                  className="w-full flex items-center justify-center px-4 py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-300 transition-colors duration-200"
                >
                  <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-600">
                    Adicionar novo cartão
                  </span>
                </button>

                {showNewCardForm && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <PaymentMethodForm
                      onSubmit={handleAddNewCard}
                      onCancel={() => setShowNewCardForm(false)}
                      loading={loading}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mt-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Histórico de Faturas</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Baixar todas
              </button>
            </div>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fatura
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        R$ {invoice.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          invoice.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : invoice.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {invoice.status === 'paid' ? 'Pago' : 
                           invoice.status === 'pending' ? 'Pendente' : 'Falhou'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {invoice.downloadUrl && (
                          <a
                            href={invoice.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Receipt className="h-5 w-5" />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Cancel Subscription */}
        <div className="mt-8 flex justify-center sm:justify-start">
          <button
            onClick={() => setShowCancelConfirm(true)}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-red-600 bg-white hover:bg-red-50"
          >
            Cancelar assinatura
          </button>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Cancelar Assinatura
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Tem certeza que deseja cancelar sua assinatura? Você perderá acesso aos recursos premium ao final do período atual.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCancelSubscription}
                >
                  Cancelar Assinatura
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setShowCancelConfirm(false)}
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}