import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, ArrowRight, Calendar, Clock, AlertCircle, CheckCircle, Download, Plus, ChevronDown, Building2 } from 'lucide-react';
import { paymentsService, type Payment, type BankTransfer, type BankAccount } from '../../services/paymentsService';
import { toast } from 'react-hot-toast';

export function Payments() {
  const [showAddBankAccount, setShowAddBankAccount] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [activeTab, setActiveTab] = useState<'payments' | 'transfers'>('payments');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [payments, setPayments] = useState<Payment[]>([]);
  const [transfers, setTransfers] = useState<BankTransfer[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [stats, setStats] = useState<{
    totalEarnings: number;
    availableForWithdraw: number;
    pendingAmount: number;
  }>({
    totalEarnings: 0,
    availableForWithdraw: 0,
    pendingAmount: 0
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [paymentsData, transfersData, bankAccountsData, statsData] = await Promise.all([
          paymentsService.getPayments({
            page: currentPage,
            limit: itemsPerPage,
            ...(selectedMonth !== 'all' && {
              startDate: `${selectedMonth}-01`,
              endDate: new Date(new Date(selectedMonth).getFullYear(), new Date(selectedMonth).getMonth() + 1, 0).toISOString().split('T')[0]
            })
          }),
          paymentsService.getTransfers({
            page: currentPage,
            limit: itemsPerPage
          }),
          paymentsService.getBankAccounts(),
          paymentsService.getPaymentStats()
        ]);

        setPayments(paymentsData.data || []);
        setTransfers(transfersData.data || []);
        setBankAccounts(bankAccountsData || []);
        setStats(statsData || { totalEarnings: 0, availableForWithdraw: 0, pendingAmount: 0 });
        setTotalPages(paymentsData.totalPages || 1);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados de pagamento');
        toast.error('Erro ao carregar dados de pagamento');
        
        // Reset states to empty values on error
        setPayments([]);
        setTransfers([]);
        setBankAccounts([]);
        setStats({
          totalEarnings: 0,
          availableForWithdraw: 0,
          pendingAmount: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, selectedMonth, itemsPerPage]);

  const handleAddBankAccount = async (data: {
    bank: string;
    agency: string;
    account: string;
    holder: string;
  }) => {
    try {
      setLoading(true);
      const newAccount = await paymentsService.addBankAccount(data);
      setBankAccounts(prev => [...prev, newAccount]);
      setShowAddBankAccount(false);
      toast.success('Conta bancária adicionada com sucesso');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao adicionar conta bancária');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDefaultAccount = async (accountId: string) => {
    try {
      setLoading(true);
      await paymentsService.updateDefaultBankAccount(accountId);
      setBankAccounts(prev => prev.map(account => ({
        ...account,
        isDefault: account.id === accountId
      })));
      toast.success('Conta padrão atualizada com sucesso');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao atualizar conta padrão');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    try {
      setLoading(true);
      await paymentsService.deleteBankAccount(accountId);
      setBankAccounts(prev => prev.filter(account => account.id !== accountId));
      toast.success('Conta bancária removida com sucesso');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao remover conta bancária');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestTransfer = async (amount: number) => {
    try {
      setLoading(true);
      const transfer = await paymentsService.requestTransfer(amount);
      setTransfers(prev => [transfer, ...prev]);
      toast.success('Transferência solicitada com sucesso');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao solicitar transferência');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !payments.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg max-w-lg w-full mx-4">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
            <h3 className="text-lg font-medium text-red-800">Erro ao carregar pagamentos</h3>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

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
                          R$ {stats.totalEarnings.toLocaleString()}
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
                          R$ {stats.availableForWithdraw.toLocaleString()}
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
                          R$ {stats.pendingAmount.toLocaleString()}
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

              {/* Bank Account List */}
              <div className="mt-6 space-y-4">
                {bankAccounts.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma conta bancária</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Adicione uma conta bancária para receber seus pagamentos
                    </p>
                  </div>
                ) : (
                  bankAccounts.map((account) => (
                    <div key={account.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Building2 className="h-8 w-8 text-gray-400" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">{account.bank}</p>
                            <p className="text-sm text-gray-500">
                              Ag. {account.agency} • CC. {account.account}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          {account.isDefault ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Principal
                            </span>
                          ) : (
                            <button
                              onClick={() => handleUpdateDefaultAccount(account.id)}
                              className="text-sm text-blue-600 hover:text-blue-700"
                            >
                              Tornar Principal
                            </button>
                          )}
                          {!account.isDefault && (
                            <button
                              onClick={() => handleDeleteAccount(account.id)}
                              className="text-sm text-red-600 hover:text-red-700"
                            >
                              Remover
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
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
                  payments.length === 0 ? (
                    <div className="text-center py-12">
                      <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        Nenhum pagamento encontrado
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Você ainda não recebeu nenhum pagamento de campanha.
                      </p>
                    </div>
                  ) : (
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
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                payment.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : payment.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : payment.status === 'processing'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {payment.status === 'completed' ? 'Concluído' :
                                 payment.status === 'pending' ? 'Pendente' :
                                 payment.status === 'processing' ? 'Processando' : 'Falhou'}
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
                  )
                ) : (
                  transfers.length === 0 ? (
                    <div className="text-center py-12">
                      <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        Nenhuma transferência encontrada
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Você ainda não realizou nenhuma transferência bancária.
                      </p>
                    </div>
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
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}