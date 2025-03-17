import React, { useState, useEffect } from 'react';
import { PlusCircle, Filter, Search, ChevronDown, ChevronRight, X, ExternalLink, Calendar, DollarSign, Hash, TrendingUp, AlertCircle, AlertTriangle, CheckCircle, Clock, LayoutGrid, List, MoreVertical, Pause, Copy, Edit, Eye, BarChart2, Users, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Campaign } from '../../../types';
import { campaignService, type CampaignFilters } from '../../../services/campaignService.ts';
import { toast } from 'react-hot-toast';

interface CampaignsProps {
  onSelectCampaign: (id: number) => void;
  onNewCampaign?: () => void;
}

interface FilterState {
  status: string[];
  platform: string[];
  budget: string[];
}

export function Campaigns({ onSelectCampaign }: CampaignsProps) {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<CampaignFilters>({
    status: [],
    platform: [],
    page: 1,
    limit: 10
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchCampaigns();
  }, [filters, searchTerm, currentPage, itemsPerPage]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await campaignService.getCampaigns({
        ...filters,
        search: searchTerm || undefined,
        page: currentPage,
        limit: itemsPerPage
      });
      
      setCampaigns(response.data || []);
      setTotalItems(response.total || 0);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar campanhas');
      toast.error('Erro ao carregar campanhas');
      setCampaigns([]); // Reset to empty state on error
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (type: keyof CampaignFilters, value: string[]) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type]?.includes(value[0])
        ? prev[type]?.filter(item => item !== value[0])
        : [...(prev[type] || []), ...value]
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      status: [],
      platform: [],
      page: 1,
      limit: itemsPerPage
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const getStatusColor = (status: Campaign['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: Campaign['status']) => {
    const labels = {
      pending: 'Pendente',
      in_progress: 'Em Andamento',
      completed: 'Concluída',
      rejected: 'Rejeitada'
    };
    return labels[status] || status;
  };

  if (loading && !campaigns.length) {
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
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
            <h3 className="text-lg font-medium text-red-800">Erro ao carregar campanhas</h3>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchCampaigns}
            className="w-full bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-lg mx-4">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma campanha encontrada
          </h3>
          <p className="text-gray-500 mb-6">
            {filters.status.length > 0 || filters.platform.length > 0 || searchTerm
              ? 'Tente ajustar seus filtros ou buscar por outros termos.'
              : 'Comece criando sua primeira campanha!'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard/new-campaign')}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Nova Campanha
            </button>
            {(filters.status.length > 0 || filters.platform.length > 0 || searchTerm) && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
              >
                <X className="h-5 w-5 mr-2" />
                Limpar Filtros
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Campanhas</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gerencie suas campanhas e propostas
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard/new-campaign')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Nova Campanha
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200/80">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Buscar campanhas..."
              />
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full sm:w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
              >
                <option value="date">Data</option>
                <option value="budget">Orçamento</option>
                <option value="status">Status</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                {Object.values(filters).some(arr => Array.isArray(arr) ? arr.length > 0 : false) && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {Object.values(filters).reduce((acc, curr) => acc + (Array.isArray(curr) ? curr.length : 0), 0)}
                  </span>
                )}
              </button>

              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
                  <div className="space-y-2">
                    {['pending', 'in_progress', 'completed', 'rejected'].map(status => (
                      <label key={status} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.status?.includes(status)}
                          onChange={() => handleFilterChange('status', [status])}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          {getStatusLabel(status as Campaign['status'])}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Platform Filter */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Plataforma</h4>
                  <div className="space-y-2">
                    {['Instagram', 'YouTube', 'TikTok'].map(platform => (
                      <label key={platform} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.platform?.includes(platform)}
                          onChange={() => handleFilterChange('platform', [platform])}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-600">{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {Object.values(filters).some(arr => Array.isArray(arr) ? arr.length > 0 : false) && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Limpar Filtros
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Campaigns Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={campaign.brand.logo}
                        alt={campaign.brand.name}
                        className="h-10 w-10 rounded-lg"
                      />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{campaign.title}</h3>
                        <p className="text-sm text-gray-500">{campaign.brand.name}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-500">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-100">
                    <div className="text-center">
                      <Users className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-sm font-medium text-gray-900">45K</p>
                      <p className="text-xs text-gray-500">Alcance</p>
                    </div>
                    <div className="text-center">
                      <BarChart2 className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-sm font-medium text-gray-900">4.2%</p>
                      <p className="text-xs text-gray-500">Engajamento</p>
                    </div>
                    <div className="text-center">
                      <MessageSquare className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-sm font-medium text-gray-900">156</p>
                      <p className="text-xs text-gray-500">Interações</p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-50">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-yellow-600 rounded-lg hover:bg-gray-50">
                        <Pause className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-gray-50">
                        <Copy className="h-5 w-5" />
                      </button>
                    </div>
                    <button
                      onClick={() => navigate(`/dashboard/campaign/${campaign.id}`)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden border border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campanha
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plataforma
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orçamento
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prazo
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaigns.map((campaign) => (
                  <tr
                    key={campaign.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-lg"
                            src={campaign.brand.logo}
                            alt={campaign.brand.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{campaign.title}</div>
                          <div className="text-sm text-gray-500">{campaign.brand.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {getStatusLabel(campaign.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {campaign.platform}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      R$ {campaign.budget.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(campaign.deadline).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => navigate(`/dashboard/campaign/${campaign.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Ver detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Próxima
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> até{' '}
                <span className="font-medium">
                
                  {Math.min(currentPage * itemsPerPage, totalItems)}
                </span>{' '}
                de <span className="font-medium">{totalItems}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="mr-4 rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value={10}>10 por página</option>
                  <option value={20}>20 por página</option>
                  <option value={50}>50 por página</option>
                </select>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Anterior</span>
                  <ChevronDown className="h-5 w-5 rotate-90" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Próxima</span>
                  <ChevronDown className="h-5 w-5 -rotate-90" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}