import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { InfluencerFilters, Platform } from '../types';

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
  .filters-panel {
    padding: var(--container-padding);
    margin: 0 calc(var(--container-padding) * -1);
    border-radius: 0;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-base);
  }
  
  .filter-group {
    padding: var(--spacing-base);
  }
  
  .input {
    min-height: var(--min-touch-target);
  }
  
  .button {
    width: 100%;
    min-height: var(--min-touch-target);
    justify-content: center;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .filters-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: calc(var(--spacing-base) * 1.25);
  }
  
  .filter-group {
    padding: calc(var(--spacing-base) * 1.25);
  }
}

@media (min-width: 769px) {
  .filters-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: calc(var(--spacing-base) * 1.5);
  }
  
  .filter-group {
    padding: calc(var(--spacing-base) * 1.5);
  }
}
`;

interface InfluencerFiltersPanelProps {
  filters: InfluencerFilters;
  onChange: (filters: InfluencerFilters) => void;
  onClose: () => void;
}

export function InfluencerFiltersPanel({ filters, onChange, onClose }: InfluencerFiltersPanelProps) {
  const [mounted, setMounted] = React.useState(false);

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
    <div className={`bg-white shadow-lg mb-6 border border-gray-200 filters-panel transition-all duration-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      <div className="grid filters-grid">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 filter-group">
            Plataforma
          </label>
          <select
            value={filters.platform || ''}
            onChange={(e) => onChange({
              ...filters,
              platform: e.target.value as Platform || undefined
            })}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg min-h-[var(--min-touch-target)] input"
          >
            <option value="">Todas</option>
            <option value="Instagram">Instagram</option>
            <option value="YouTube">YouTube</option>
            <option value="TikTok">TikTok</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 filter-group">
            Categorias
          </label>
          <div className="relative">
            <select
              multiple
              value={filters.categories || []}
              onChange={(e) => {
                const options = Array.from(e.target.selectedOptions).map(option => option.value);
                onChange({
                  ...filters,
                  categories: options
                });
              }}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg min-h-[120px] input"
            >
              <option value="Tech">Tecnologia</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Gaming">Gaming</option>
              <option value="Fashion">Moda</option>
              <option value="Beauty">Beleza</option>
              <option value="Dance">Dança</option>
              <option value="Entertainment">Entretenimento</option>
              <option value="Education">Educação</option>
              <option value="Comedy">Comédia</option>
              <option value="Sports">Esportes</option>
              <option value="Food">Gastronomia</option>
              <option value="Travel">Viagens</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Pressione Ctrl (Cmd no Mac) para selecionar múltiplas categorias
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 filter-group">
            Seguidores
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Mín"
              value={filters.minFollowers || ''}
              onChange={(e) => onChange({
                ...filters,
                minFollowers: Number(e.target.value) || undefined
              })}
              className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg min-h-[var(--min-touch-target)] input"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              placeholder="Máx"
              value={filters.maxFollowers || ''}
              onChange={(e) => onChange({
                ...filters,
                maxFollowers: Number(e.target.value) || undefined
              })}
              className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg min-h-[var(--min-touch-target)] input"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 filter-group">
            Localização
          </label>
          <input
            type="text"
            placeholder="Ex: São Paulo"
            value={filters.location || ''}
            onChange={(e) => onChange({
              ...filters,
              location: e.target.value || undefined
            })}
            className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg min-h-[var(--min-touch-target)] input"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-4 sm:gap-2 mt-6 p-4 sm:p-6 border-t border-gray-200">
        <button
          onClick={() => {
            onChange({});
            onClose();
          }}
          className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200 min-h-[var(--min-touch-target)] button"
        >
          Limpar Filtros
        </button>
        <button
          onClick={onClose}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow transition-all duration-200 min-h-[var(--min-touch-target)] button"
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
}