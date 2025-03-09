import React from 'react';
import { ArrowLeft, CreditCard, CheckCircle, AlertTriangle, Calendar, DollarSign, Receipt, Shield, X } from 'lucide-react';

interface ManagePlanProps {
  onBack: () => void;
}

export function ManagePlan({ onBack }: ManagePlanProps) {
  const [selectedCard, setSelectedCard] = React.useState<string | null>(null);
  const [showNewCardForm, setShowNewCardForm] = React.useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = React.useState(false);

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

  const invoices = [
    {
      id: '1',
      date: '2024-03-01',
      amount: 99,
      status: 'paid'
    },
    {
      id: '2',
      date: '2024-02-01',
      amount: 99,
      status: 'paid'
    },
    {
      id: '3',
      date: '2024-01-01',
      amount: 99,
      status: 'paid'
    }
  ];

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar para planos
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Gerenciar Assinatura</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie seus métodos de pagamento e veja o histórico de faturas
          </p>
        </div>

        {/* Current Plan Status */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-medium text-gray-900">Plano Pro</h2>
                  <p className="text-sm text-gray-500">Próxima cobrança em 15 de Abril, 2024</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <CheckCircle className="h-4 w-4 mr-1" />
                Ativo
              </span>
              <span className="text-lg font-medium text-gray-900">R$ 99/mês</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Método de Pagamento</h3>
          <div className="space-y-4">
            {savedCards.map((card) => (
              <div
                key={card.id}
                onClick={() => setSelectedCard(card.id)}
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
              onClick={() => setShowNewCardForm(true)}
              className="w-full flex items-center justify-center px-4 py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-300 transition-colors duration-200"
            >
              <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-600">
                Adicionar novo cartão
              </span>
            </button>
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Histórico de Faturas</h3>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
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
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Pago
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <Receipt className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cancel Subscription */}
        <div className="mt-8">
          <button
            onClick={() => setShowCancelConfirm(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-red-600 bg-white hover:bg-red-50"
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
                  onClick={() => setShowCancelConfirm(false)}
                >
                  Cancelar Assinatura
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
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