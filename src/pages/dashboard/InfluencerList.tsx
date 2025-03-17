import React, { useState } from 'react';
import { Search, Filter, Users, MapPin, ChevronRight, DollarSign, Star, Info, Award, Clock, CheckCircle, Instagram, Youtube, Video, BarChart2, Heart, MessageSquare, X, Sliders } from 'lucide-react';
import type { Influencer } from '../../types';

// Add mobile-first styles
const styles = `
/* Base styles */
:root {
  --min-touch-target: clamp(2.75rem, 8vw, 3rem); /* 44-48px */
  --container-padding: clamp(1rem, 5vw, 2rem);
  --font-size-base: clamp(0.875rem, 4vw, 1rem);
  --font-size-lg: clamp(1.125rem, 5vw, 1.25rem);
  --font-size-xl: clamp(1.5rem, 6vw, 1.875rem);
  --spacing-base: clamp(1rem, 4vw, 1.5rem);
  --border-radius: clamp(0.75rem, 3vw, 1rem);
}

/* Mobile-first media queries */
@media (max-width: 480px) {
  .container {
    padding: var(--container-padding);
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  .influencer-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-base);
  }
  
  .search-bar {
    flex-direction: column;
    gap: var(--spacing-base);
  }
  
  .filter-panel {
    grid-template-columns: 1fr;
  }
  
  .influencer-card {
    padding: var(--spacing-base);
  }
  
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .influencer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .filter-panel {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .metrics-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 769px) {
  .influencer-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .filter-panel {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .metrics-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
`;

interface Filters {
  platform: string[];
  categories: string[];
  location: string[];
  followers: {
    min?: number;
    max?: number;
  };
  engagement: {
    min?: number;
    max?: number;
  };
  price: {
    min?: number;
    max?: number;
  };
}

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
  }
];

interface InfluencerListProps {
  onViewProfile: (id: string) => void;
}

export function InfluencerList({ onViewProfile }: InfluencerListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [filters, setFilters] = useState<Filters>({
    platform: [] as string[],
    categories: [] as string[],
    location: [] as string[],
    followers: {},
    engagement: {},
    price: {}
  });

  const [sortBy, setSortBy] = useState<'followers' | 'engagement' | 'price'>('followers');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleFilter = (type: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      platform: [],
      categories: [],
      location: [],
      followers: {},
      engagement: {},
      price: {}
    });
    setSearchTerm('');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  React.useEffect(() => {
    // Add styles to document
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Trigger mount animation
    setMounted(true);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div className="py-6 container">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Influenciadores</h1>
            <p className="mt-1 text-sm text-gray-500">
              Encontre os melhores influenciadores para sua campanha
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200/80 search-bar">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch">
            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm min-h-[var(--min-touch-target)]"
                placeholder="Buscar influenciadores..."
              />
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <select
                className="block w-full sm:w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg min-h-[var(--min-touch-target)]"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'followers' | 'engagement' | 'price')}
              >
                <option value="followers">Seguidores</option>
                <option value="engagement">Engajamento</option>
                <option value="price">Preço</option>
              </select>
              <button
                onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 min-h-[var(--min-touch-target)] min-w-[var(--min-touch-target)]"
              >
                <Sliders className={`h-5 w-5 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 min-h-[var(--min-touch-target)]"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
              {Object.values(filters).some(arr => arr.length > 0) && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {Object.values(filters).reduce((acc, curr) => acc + curr.length, 0)}
                </span>
              )}
            </button>

            {/* Clear Filters */}
            {(Object.values(filters).some(arr => Array.isArray(arr) ? arr.length > 0 : Object.keys(arr).length > 0) || searchTerm) && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center justify-center px-3 py-1 border border-transparent text-sm font-medium rounded-lg text-red-600 bg-red-50 hover:bg-red-100 min-h-[var(--min-touch-target)]"
              >
                <X className="h-4 w-4 mr-1" />
                Limpar
              </button>
            )}
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Platform Filter */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Plataforma</h4>
                  <div className="space-y-2">
                    {['Instagram', 'YouTube', 'TikTok'].map(platform => (
                      <label key={platform} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.platform.includes(platform)}
                          onChange={() => handleFilter('platform', platform)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-600">{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Categories Filter */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Categorias</h4>
                  <div className="space-y-2">
                    {[
                      'Tech', 'Lifestyle', 'Gaming', 'Beauty', 'Fashion', 'Food',
                      'Travel', 'Fitness', 'Education', 'Entertainment'
                    ].map(category => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(category)}
                          onChange={() => handleFilter('categories', category)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-600">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Métricas</h4>
                  <div className="space-y-6">
                    {/* Followers Range */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Seguidores</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Mín"
                          value={filters.followers.min || ''}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            followers: { ...prev.followers, min: Number(e.target.value) || undefined }
                          }))}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Máx"
                          value={filters.followers.max || ''}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            followers: { ...prev.followers, max: Number(e.target.value) || undefined }
                          }))}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>

                    {/* Engagement Range */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Taxa de Engajamento (%)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Mín"
                          value={filters.engagement.min || ''}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            engagement: { ...prev.engagement, min: Number(e.target.value) || undefined }
                          }))}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Máx"
                          value={filters.engagement.max || ''}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            engagement: { ...prev.engagement, max: Number(e.target.value) || undefined }
                          }))}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Faixa de Preço (R$)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Mín"
                          value={filters.price.min || ''}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            price: { ...prev.price, min: Number(e.target.value) || undefined }
                          }))}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Máx"
                          value={filters.price.max || ''}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            price: { ...prev.price, max: Number(e.target.value) || undefined }
                          }))}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {Object.values(filters).some(arr => arr.length > 0) && (
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

        {/* Influencers Grid */}
        <div className="grid gap-6 influencer-grid">
          {mockInfluencers.map((influencer) => (
            <div
              key={influencer.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden influencer-card"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={influencer.avatar}
                      alt={influencer.name}
                      className="h-16 w-16 rounded-full ring-4 ring-white shadow-lg"
                    />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{influencer.name}</h3>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          influencer.platform === 'Instagram' ? 'bg-pink-100 text-pink-800' :
                          influencer.platform === 'YouTube' ? 'bg-red-100 text-red-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {influencer.platform}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="flex items-center text-gray-500 text-sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          {influencer.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid gap-4 py-4 border-y border-gray-100 metrics-grid">
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
                    <MessageSquare className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                    <p className="text-sm font-medium text-gray-900">{formatNumber(influencer.metrics.avgComments || 0)}</p>
                    <p className="text-xs text-gray-500">Comentários</p>
                  </div>
                </div>

                {/* Categories */}
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {influencer.categories.map((category, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-6">
                  <button
                    onClick={() => onViewProfile(influencer.id)}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 min-h-[var(--min-touch-target)]"
                  >
                    Ver Perfil
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}