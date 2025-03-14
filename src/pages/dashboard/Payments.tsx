import React, { useState } from 'react';
import { CreditCard, DollarSign, ArrowRight, Calendar, Clock, AlertCircle, CheckCircle, Download, Plus, ChevronDown, Building2 } from 'lucide-react';

interface Payment {
  id: string;
  campaignName: string;
  brand: {
    name: string;
    logo: string;
  };
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  date: string;
  releaseDate: string;
  paymentMethod: {
    type: 'credit_card';
    last4: string;
    brand: string;
  };
}

interface BankTransfer {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  requestDate: string;
  completionDate?: string;
  bankAccount: {
    bank: string;
    agency: string;
    account: string;
    holder: string;
  };
}

export function Payments() {
  const [showAddBankAccount, setShowAddBankAccount] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [activeTab, setActiveTab] = useState<'payments' | 'transfers'>('payments');

  const payments: Payment[] = [
    {
      id: '1',
      campaignName: 'Lançamento Novo Gadget',
      brand: {
        name: 'TechCorp',
        logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop'
      },
      amount: 3500,
      status: 'completed',
      date: '2024-03-15',
      releaseDate: '2024-04-15',
      paymentMethod: {
        type: 'credit_card',
        last4: '4242',
        brand: 'visa'
      }
    },
    {
      id: '2',
      campaignName: 'Campanha Verão',
      brand: {
        name: 'FitLife',
        logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop'
      },
      amount: 2800,
      status: 'processing',
      date: '2024-03-20',
      releaseDate: '2024-04-20',
      paymentMethod: {
        type: 'credit_card',
        last4: '1234',
        brand: 'mastercard'
      }
    },
    {
      id: '3',
      campaignName: 'Linha Sustentável',
      brand: {
        name: 'EcoBeauty',
        logo: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=100&h=100&fit=crop'
      },
      amount: 4200,
      status: 'pending',
      date: '2024-03-25',
      releaseDate: '2024-04-25',
      paymentMethod: {
        type: 'credit_card',
        last4: '5678',
        brand: 'amex'
      }
    }
  ];

  const transfers: BankTransfer[] = [
    {
      id: 'tr1',
      amount: 5000,
      status: 'completed',
      requestDate: '2024-03-10',
      completionDate: '2024-03-11',
      bankAccount: {
        bank: 'Banco do Brasil',
        agency: '1234',
        account: '****5678',
        holder: 'João Silva'
      }
    },
    {
      id: 'tr2',
      amount: 3200,
      status: 'pending',
      requestDate: '2024-03-15',
      bankAccount: {
        bank: 'Banco do Brasil',
        agency: '1234',
        account: '****5678',
        holder: 'João Silva'
      }
    },
    {
      id: 'tr3',
      amount: 2800,
      status: 'failed',
      requestDate: '2024-03-08',
      bankAccount: {
        bank: 'Banco do Brasil',
        agency: '1234',
        account: '****5678',
        holder: 'João Silva'
      }
    }
  ];

  const getStatusColor = (status: Payment['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getStatusLabel = (status: Payment['status']) => {
    const labels = {
      pending: 'Pendente',
      processing: 'Em Processamento',
      completed: 'Concluído',
      failed: 'Falhou'
    };
    return labels[status];
  };

  const totalEarnings = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const availableForWithdraw = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = payments
    .filter(p => p.status === 'pending' || p.status === 'processing')
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Pagamentos</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gerencie seus pagamentos e saques
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Recebido
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          R$ {totalEarnings.toLocaleString()}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Disponível para Saque
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          R$ {availableForWithdraw.toLocaleString()}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Em Processamento
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          R$ {pendingAmount.toLocaleString()}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Account Section */}
          <div className="bg-white shadow-sm rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Conta Bancária</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Conta para recebimento dos pagamentos
                  </p>
                </div>
                <button
                  onClick={() => setShowAddBankAccount(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Conta
                </button>
              </div>

              {/* Bank Account Info */}
              <div className="mt-6 border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="h-8 w-8 text-gray-400" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Banco do Brasil</p>
                      <p className="text-sm text-gray-500">Ag. 1234 • CC. ****5678</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Principal
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payments List */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('payments')}
                  className={`${
                    activeTab === 'payments'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pagamentos de Campanhas
                </button>
                <button
                  onClick={() => setActiveTab('transfers')}
                  className={`${
                    activeTab === 'transfers'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Transferências Bancárias
                </button>
              </nav>
            </div>

            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {activeTab === 'payments' ? 'Histórico de Pagamentos' : 'Histórico de Transferências'}
                </h3>
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="all">Todos os meses</option>
                    <option value="03-2024">Março 2024</option>
                    <option value="02-2024">Fevereiro 2024</option>
                    <option value="01-2024">Janeiro 2024</option>
                  </select>
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                {activeTab === 'payments' ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Campanha
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Liberação
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Método
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={payment.brand.logo}
                              alt={payment.brand.name}
                              className="h-8 w-8 rounded-full"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {payment.campaignName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {payment.brand.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            R$ {payment.amount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(payment.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(payment.releaseDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                            {getStatusLabel(payment.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <img
                              src={`/card-brands/${payment.paymentMethod.brand}.svg`}
                              alt={payment.paymentMethod.brand}
                              className="h-6 w-6 mr-2"
                            />
                            •••• {payment.paymentMethod.last4}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data do Pedido
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valor
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Conta
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data da Conclusão
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transfers.map((transfer) => (
                        <tr key={transfer.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(transfer.requestDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              R$ {transfer.amount.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {transfer.bankAccount.bank}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Ag. {transfer.bankAccount.agency} • CC. {transfer.bankAccount.account}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transfer.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : transfer.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {transfer.status === 'completed'
                                ? 'Concluída'
                                : transfer.status === 'pending'
                                ? 'Em Processamento'
                                : 'Falhou'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {transfer.completionDate
                                ? new Date(transfer.completionDate).toLocaleDateString()
                                : '-'}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Bank Account Modal */}
      {showAddBankAccount && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Adicionar Conta Bancária
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Adicione uma conta bancária para receber seus pagamentos
                    </p>
                  </div>
                </div>
              </div>
              <form className="mt-6 space-y-4">
                <div>
                  <label htmlFor="bank" className="block text-sm font-medium text-gray-700">
                    Banco
                  </label>
                  <select
                    id="bank"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option>Selecione o banco</option>
                    <option>Banco do Brasil</option>
                    <option>Itaú</option>
                    <option>Bradesco</option>
                    <option>Santander</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="agency" className="block text-sm font-medium text-gray-700">
                      Agência
                    </label>
                    <input
                      type="text"
                      id="agency"
                      name="agency"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="account" className="block text-sm font-medium text-gray-700">
                      Conta
                    </label>
                    <input
                      type="text"
                      id="account"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="holder" className="block text-sm font-medium text-gray-700">
                    Titular da Conta
                  </label>
                  <input
                    type="text"
                    id="holder"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                    CPF/CNPJ
                  </label>
                  <input
                    type="text"
                    id="cpf"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </form>
              <div className="mt-6 sm:mt-8 sm:grid sm:grid-cols-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddBankAccount(false)}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="mt-3 sm:mt-0 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
