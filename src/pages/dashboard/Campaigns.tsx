import React from 'react';
import { PlusCircle, Filter, Search, ChevronDown, ChevronRight, X, ExternalLink, Calendar, DollarSign, Hash, TrendingUp, AlertCircle, AlertTriangle, CheckCircle, Clock, LayoutGrid, List, MoreVertical, Pause, Copy, Edit, Eye, BarChart2, Users, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Campaign } from '../../types';

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
  const [filters, setFilters] = React.useState<FilterState>({
    status: [],
    platform: [],
    budget: []
  });
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = React.useState('date');
  const [itemsPerPage, setItemsPerPage] = React.useState(9);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showFilters, setShowFilters] = React.useState(false);
  const [profileStatus, setProfileStatus] = React.useState({
    isComplete: false,
    missingFields: [
      'Dados bancários',
      'Redes sociais',
      'Documentos'
    ]
  });

  const platforms = ['Instagram', 'YouTube', 'TikTok'];
  const budgetRanges = ['Até R$ 1.000', 'R$ 1.000 - R$ 5.000', 'Acima de R$ 5.000'];
  const statusOptions = ['pending', 'in_progress', 'completed', 'rejected'];

  const campaigns: Campaign[] = [
    {
      id: 1,
      title: "Lançamento Novo Gadget",
      brand: {
        name: "TechCorp",
        logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop"
      },
      description: "Criar um vídeo review do nosso novo smartphone, destacando os principais recursos e funcionalidades. Foco especial na câmera e bateria.",
      deadline: new Date("2024-04-15"),
      budget: 3500,
      requirements: [
        "Vídeo de 10-15 minutos",
        "Destacar câmera e bateria",
        "Mencionar preço promocional",
        "Incluir demonstração prática",
        "Comparar com modelo anterior"
      ],
      status: "in_progress",
      platform: "Instagram",
      contentType: "Post + Stories"
    },
    {
      id: 2,
      title: "Campanha Verão",
      brand: {
        name: "FitLife",
        logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop"
      },
      description: "Série de vídeos mostrando sua rotina fitness usando nossos produtos. Foco em resultados reais e motivação.",
      deadline: new Date("2024-04-20"),
      budget: 2800,
      requirements: [
        "3 vídeos de 1 minuto",
        "Mostrar resultados",
        "Usar hashtag #FitLifeVerao",
        "Incluir dicas de treino",
        "Destacar benefícios dos produtos"
      ],
      status: "pending",
      platform: "YouTube",
      contentType: "Vídeo Review"
    },
    {
      id: 3,
      title: "Linha Sustentável",
      brand: {
        name: "EcoBeauty",
        logo: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=100&h=100&fit=crop"
      },
      description: "Série de posts sobre produtos sustentáveis, destacando a importância da consciência ambiental na beleza.",
      deadline: new Date("2024-04-25"),
      budget: 4200,
      requirements: [
        "5 posts no feed",
        "2 reels",
        "Destacar embalagem sustentável",
        "Mostrar ingredientes naturais",
        "Compartilhar dicas de sustentabilidade"
      ],
      status: "completed",
      platform: "TikTok",
      contentType: "Série de Vídeos"
    }
  ];

  const getStatusBadgeColor = (status: Campaign['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-indigo-100 text-indigo-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: Campaign['status']) => {
    const icons = {
      pending: Clock,
      in_progress: TrendingUp,
      completed: CheckCircle,
      rejected: AlertCircle
    };
    return icons[status] || Clock;
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

  const getStatusColor = (status: Campaign['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800', 
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleFilterChange = (type: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: [],
      platform: [],
      budget: []
    });
    setSearchTerm('');
  };

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
            onClick={() => navigate('/new-campaign')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Nova Campanha
          </button>
        </div>
        <div className="py-4">
          {/* Profile Completion Alert */}
          {!profileStatus.isComplete && (
            <div className="mb-6 bg-amber-50 rounded-xl border border-amber-200/60 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">
                    Complete seu perfil para receber propostas de campanhas
                  </h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <p>
                      Para garantir que você receba propostas de campanhas relevantes, complete seu perfil com:
                    </p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {profileStatus.missingFields.map((field, index) => (
                        <li key={index}>{field}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => navigate('/dashboard/settings')}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-amber-800 bg-amber-100 hover:bg-amber-200 transition-colors duration-200"
                    >
                      Completar Perfil
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filters Bar */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200/80">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200"
                placeholder="Buscar campanhas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="date">Data</option>
                <option value="budget">Orçamento</option>
                <option value="engagement">Engajamento</option>
                <option value="status">Status</option>
              </select>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                {Object.values(filters).some(arr => arr.length > 0) && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {Object.values(filters).reduce((acc, curr) => acc + curr.length, 0)}
                  </span>
                )}
              </button>

              {/* Clear Filters */}
              {Object.values(filters).some(arr => arr.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <X className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </button>
              )}
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Status Filter */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
                    <div className="space-y-2">
                      {statusOptions.map(status => (
                        <label key={status} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.status.includes(status)}
                            onChange={() => handleFilterChange('status', status)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
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
                      {platforms.map(platform => (
                        <label key={platform} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.platform.includes(platform)}
                            onChange={() => handleFilterChange('platform', platform)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-600">{platform}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Budget Filter */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Orçamento</h4>
                    <div className="space-y-2">
                      {budgetRanges.map(range => (
                        <label key={range} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.budget.includes(range)}
                            onChange={() => handleFilterChange('budget', range)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-600">{range}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Grid View */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden"
                >
                  {/* Campaign Image */}
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={campaign.brand.logo}
                      alt={campaign.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {getStatusLabel(campaign.status)}
                      </span>
                    </div>
                  </div>

                  {/* Campaign Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {campaign.title}
                      </h3>
                      <button className="text-gray-400 hover:text-gray-500">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Metrics */}
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

                      {/* Quick Actions */}
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-50">
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
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow-sm border border-gray-200/80 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Marca
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Campanha
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Prazo
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Plataforma
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Tipo
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Valor
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {campaigns.map((campaign) => (
                        <tr
                          onClick={() => navigate(`/dashboard/campaign/${campaign.id}`)}
                          className="cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            <div className="flex items-center">
                              <img
                                src={campaign.brand.logo}
                                alt={campaign.brand.name}
                                className="h-8 w-8 rounded-full mr-3"
                              />
                              <div>
                                <div className="font-medium">{campaign.brand.name}</div>
                                <div className="text-gray-500">{campaign.title}</div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {campaign.deadline.toLocaleDateString()}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {campaign.platform}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {campaign.contentType}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            R$ {campaign.budget.toLocaleString()}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeColor(campaign.status)}`}>
                              {React.createElement(getStatusIcon(campaign.status), {
                                className: 'h-4 w-4 mr-1'
                              })}
                              {getStatusLabel(campaign.status)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {campaigns.length === 0 && (
                    <div className="text-center py-12">
                      <Search className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma campanha encontrada</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Tente ajustar seus filtros ou buscar por outros termos.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          )}
          
          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Anterior
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Próxima
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">1</span> até <span className="font-medium">10</span> de{' '}
                  <span className="font-medium">20</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="mr-4 rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="9">9 por página</option>
                    <option value="12">12 por página</option>
                    <option value="24">24 por página</option>
                  </select>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Anterior</span>
                    <ChevronDown className="h-5 w-5 rotate-90" />
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-indigo-50 text-sm font-medium text-indigo-600">
                    2
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    3
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Próxima</span>
                    <ChevronDown className="h-5 w-5 -rotate-90" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}