import React from 'react';
import { Search, Filter, Users, MapPin, ChevronRight, DollarSign, Star, Info, Award, Clock, CheckCircle, Instagram, Youtube, Video, BarChart2, Heart, MessageSquare } from 'lucide-react';
import type { Platform, Influencer, InfluencerFilters } from '../types';
import { calculateInfluencerPrice, formatCurrency, getPriceForContentType } from '../utils';
import { InfluencerFiltersPanel } from '../components/InfluencerFiltersPanel';
import { InfluencerCard } from '../components/InfluencerCard';
import { Pagination } from '../components/Pagination';

const mockInfluencers: Influencer[] = [
  {
    id: '1',
    name: 'Ana Silva',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    platform: 'Instagram',
    followers: 125000,
    engagement: 4.8,
    categories: ['Tech', 'Lifestyle', 'Gadgets'],
    location: 'São Paulo, SP',
    metrics: {
      avgLikes: 12500,
      avgComments: 850,
      reachRate: 28,
      completionRate: 98
    }
  },
  {
    id: '2',
    name: 'Pedro Santos',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    platform: 'YouTube',
    followers: 450000,
    engagement: 3.9,
    categories: ['Tech Reviews', 'Gaming', 'Hardware'],
    location: 'Rio de Janeiro, RJ',
    metrics: {
      avgViews: 85000,
      avgLikes: 15000,
      completionRate: 95,
      reachRate: 22
    }
  },
  {
    id: '3',
    name: 'Julia Costa',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    platform: 'TikTok',
    followers: 850000,
    engagement: 5.2,
    categories: ['Tech', 'Trends', 'Tutorials'],
    location: 'Curitiba, PR',
    metrics: {
      avgViews: 150000,
      avgLikes: 45000,
      completionRate: 96,
      reachRate: 32
    }
  },
  {
    id: '4',
    name: 'Lucas Oliveira',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    platform: 'Instagram',
    followers: 275000,
    engagement: 4.2,
    categories: ['Tech', 'Productivity', 'Apps'],
    location: 'Belo Horizonte, MG',
    metrics: {
      avgLikes: 25000,
      avgComments: 1200,
      completionRate: 97,
      reachRate: 25
    }
  }
];

const getPlatformIcon = (platform: Platform) => {
  const icons = {
    Instagram,
    YouTube: Youtube,
    TikTok: Video
  };
  return icons[platform];
};

const getPlatformColor = (platform: Platform) => {
  const colors = {
    Instagram: 'bg-pink-100 text-pink-800',
    YouTube: 'bg-red-100 text-red-800',
    TikTok: 'bg-gray-900 text-white'
  };
  return colors[platform];
};

interface InfluencerStepProps {
  influencers: Influencer[];
  filters: InfluencerFilters;
  contentType: string;
  platform: Platform;
  searchTerm: string;
  currentPage: number;
  onSearch: (term: string) => void;
  onFilterChange: (filters: InfluencerFilters) => void;
  onPageChange: (page: number) => void;
  onInfluencerSelect: (influencer: Influencer) => void;
  onBack: () => void;
}

export function InfluencerStep({
  influencers,
  filters,
  contentType,
  platform,
  searchTerm,
  currentPage,
  onSearch,
  onFilterChange,
  onPageChange,
  onInfluencerSelect,
  onBack
}: InfluencerStepProps) {
  const [showFilters, setShowFilters] = React.useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = React.useState<string | null>(null);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(mockInfluencers.length / itemsPerPage);
  const [hoveredInfluencer, setHoveredInfluencer] = React.useState<Influencer | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Trigger mount animation
    setMounted(true);
  }, []);

  const paginatedInfluencers = mockInfluencers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate price based on content type and platform
  const getInfluencerPrice = React.useCallback((influencer: Influencer) => {
    return getPriceForContentType(influencer, contentType, platform);
  }, [contentType, platform]);

  return (
    <div className="max-w-5xl mx-auto container">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Escolha o Influenciador</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 search-bar">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm min-h-[var(--min-touch-target)] search-input"
              placeholder="Buscar influenciadores..."
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 min-h-[var(--min-touch-target)] filters-button"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            {Object.keys(filters).length > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {Object.keys(filters).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {showFilters && (
        <InfluencerFiltersPanel
          filters={filters}
          onChange={onFilterChange}
          onClose={() => setShowFilters(false)}
        />
      )}

      <div className="grid gap-4 influencer-grid">
        {paginatedInfluencers.map((influencer) => (
          <button
            key={influencer.id}
            onClick={() => {
              setSelectedInfluencer(selectedInfluencer === influencer.id ? null : influencer.id);
              if (selectedInfluencer !== influencer.id) {
                onInfluencerSelect(influencer);
              }
            }}
            onMouseEnter={() => setHoveredInfluencer(influencer)}
            className={`relative rounded-xl border influencer-card ${
              selectedInfluencer === influencer.id
                ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50/50'
                : 'border-gray-200 bg-white hover:border-blue-300'
            } shadow-sm hover:shadow-lg focus:outline-none transition-all duration-200 transform hover:scale-[1.02]`}
          >
            <div className="flex flex-col space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center space-x-4">
                  <img 
                    src={influencer.avatar}
                    alt={influencer.name}
                    className="h-16 w-16 rounded-full ring-4 ring-white shadow-lg"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-gray-900">{influencer.name}</h3>
                      <div className={`flex items-center px-2 py-1 rounded-lg text-xs font-medium ${getPlatformColor(influencer.platform)}`}>
                        {React.createElement(getPlatformIcon(influencer.platform), { className: 'h-3 w-3 mr-1' })}
                        {influencer.platform}
                      </div>
                    </div>
                    <div className="flex items-center mt-1 space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {influencer.followers.toLocaleString()} seguidores
                      </div>
                      <div className="flex items-center">
                        <BarChart2 className="h-4 w-4 mr-1" />
                        {influencer.engagement}% eng.
                      </div>
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-1 text-amber-400" />
                        <span className="text-amber-600">Top 10%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6 text-blue-400" />
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-3 gap-3 bg-gray-50/50 p-4 rounded-xl">
                <div className="col-span-3 relative group">
                  <div className={`p-3 rounded-lg bg-white border ${
                    selectedInfluencer === influencer.id || hoveredInfluencer?.id === influencer.id
                      ? 'border-blue-300 bg-blue-50/50 shadow-md'
                      : 'border-gray-200 hover:border-blue-200 hover:bg-gray-100/50'
                  } transition-all duration-200`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-600 capitalize">{contentType}</span>
                    </div>
                    <div className="flex items-center text-gray-900">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className={`font-semibold ${
                        selectedInfluencer === influencer.id || hoveredInfluencer?.id === influencer.id
                          ? 'text-blue-600'
                          : 'text-gray-900'
                      }`}>
                        {formatCurrency(getInfluencerPrice(influencer))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Categories and Location */}
              <div className="flex flex-wrap gap-2">
                {influencer.categories.map(category => (
                  <span
                    key={category}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {category}
                  </span>
                ))}
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  <MapPin className="h-3 w-3 mr-1" />
                  {influencer.location}
                </span>
              </div>

              {/* Metrics */}
              <div className="grid gap-3 pt-4 border-t border-gray-100 metrics-grid">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Clock className="h-4 w-4 text-blue-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">98%</p>
                  <p className="text-xs text-gray-500">Entregas no Prazo</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Star className="h-4 w-4 text-amber-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">4.9</p>
                  <p className="text-xs text-gray-500">Nota Média</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">45+</p>
                  <p className="text-xs text-gray-500">Campanhas</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Heart className="h-4 w-4 text-red-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{influencer.metrics?.reachRate}%</p>
                  <p className="text-xs text-gray-500">Alcance</p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            totalItems={mockInfluencers.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between mt-8 gap-4 sm:gap-3 navigation-buttons">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200 min-h-[var(--min-touch-target)] button"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={() => selectedInfluencer && onInfluencerSelect(mockInfluencers.find(i => i.id === selectedInfluencer)!)}
          disabled={!selectedInfluencer}
          className="inline-flex items-center px-8 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-h-[var(--min-touch-target)] button"
        >
          Continuar
          <ChevronRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
}