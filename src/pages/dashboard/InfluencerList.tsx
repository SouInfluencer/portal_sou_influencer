import React, { useState, useEffect } from 'react';
import { Search, Filter, Users, MapPin, ChevronRight, DollarSign, Star, Info, Award, Clock, CheckCircle, Instagram, Youtube, Video, BarChart2, Heart, MessageSquare, X, Sliders, AlertTriangle } from 'lucide-react';
import type { Influencer } from '../../types';
import { influencerService, type InfluencerFilters } from '../../services/influencerService';
import { toast } from 'react-hot-toast';

interface InfluencerListProps {
  onViewProfile: (id: string) => void;
}

export function InfluencerList({ onViewProfile }: InfluencerListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<InfluencerFilters>({
    platform: undefined,
    categories: [],
    minFollowers: undefined,
    maxFollowers: undefined,
    location: undefined,
    page: 1,
    limit: 10
  });

  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setMounted(true);
    fetchInfluencers();
  }, [filters, currentPage, searchTerm]);

  const fetchInfluencers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await influencerService.getInfluencers({
        ...filters,
        search: searchTerm,
        page: currentPage
      });

      setInfluencers(response.data);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar influenciadores');
      toast.error('Erro ao carregar lista de influenciadores');
      setInfluencers([]); // Reset to empty state on error
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (type: keyof InfluencerFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [type]: value,
      page: 1 // Reset page when filters change
    }));
  };

  const clearFilters = () => {
    setFilters({
      platform: undefined,
      categories: [],
      minFollowers: undefined,
      maxFollowers: undefined,
      location: undefined,
      page: 1,
      limit: 10
    });
    setSearchTerm('');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading && !influencers.length) {
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
            <h3 className="text-lg font-medium text-red-800">Erro ao carregar influenciadores</h3>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchInfluencers}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Influenciadores</h1>
            <p className="mt-1 text-sm text-gray-500">
              Encontre os melhores influenciadores para sua campanha
            </p>
          </div>
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
                placeholder="Buscar influenciadores..."
              />
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                {Object.values(filters).some(val => 
                  Array.isArray(val) ? val.length > 0 : val !== undefined
                ) && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {Object.values(filters).filter(val => 
                      Array.isArray(val) ? val.length > 0 : val !== undefined
                    ).length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Platform Filter */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Plataforma</h4>
                  <select
                    value={filters.platform || ''}
                    onChange={(e) => handleFilterChange('platform', e.target.value || undefined)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
                  >
                    <option value="">Todas</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                  </select>
                </div>

                {/* Categories Filter */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Categorias</h4>
                  <select
                    multiple
                    value={filters.categories || []}
                    onChange={(e) => {
                      const options = Array.from(e.target.selectedOptions).map(option => option.value);
                      handleFilterChange('categories', options);
                    }}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
                  >
                    <option value="tech">Tecnologia</option>
                    <option value="fashion">Moda</option>
                    <option value="beauty">Beleza</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="gaming">Gaming</option>
                    <option value="food">Gastronomia</option>
                  </select>
                </div>

                {/* Followers Range */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Seguidores</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Mín"
                      value={filters.minFollowers || ''}
                      onChange={(e) => handleFilterChange('minFollowers', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Máx"
                      value={filters.maxFollowers || ''}
                      onChange={(e) => handleFilterChange('maxFollowers', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex justify-end mt-4 space-x-3">
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Influencers Grid */}
        {influencers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhum influenciador encontrado
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Tente ajustar seus filtros ou buscar por outros termos.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {influencers.map((influencer) => (
              <div
                key={influencer.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={influencer.avatar}
                        alt={influencer.name}
                        className="h-10 w-10 rounded-full"
                      />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{influencer.name}</h3>
                        <p className="text-sm text-gray-500">{influencer.location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-100">
                    <div className="text-center">
                      <Users className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-sm font-medium text-gray-900">{formatNumber(influencer.followers)}</p>
                      <p className="text-xs text-gray-500">Seguidores</p>
                    </div>
                    <div className="text-center">
                      <Heart className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-sm font-medium text-gray-900">{influencer.engagement}%</p>
                      <p className="text-xs text-gray-500">Engajamento</p>
                    </div>
                    <div className="text-center">
                      <Star className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-sm font-medium text-gray-900">4.8</p>
                      <p className="text-xs text-gray-500">Avaliação</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {influencer.niche.map((category) => (
                        <span
                          key={category}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => onViewProfile(influencer.id)}
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Ver Perfil
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
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
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Próxima
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{(currentPage - 1) * filters.limit! + 1}</span> até{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * filters.limit!, influencers.length)}
                  </span>{' '}
                  de <span className="font-medium">{influencers.length}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    Próxima
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}