import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { InfluencerFilters, Platform } from '../types';

interface InfluencerFiltersPanelProps {
  filters: InfluencerFilters;
  onChange: (filters: InfluencerFilters) => void;
  onClose: () => void;
}

export function InfluencerFiltersPanel({ filters, onChange, onClose }: InfluencerFiltersPanelProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plataforma
          </label>
          <select
            value={filters.platform || ''}
            onChange={(e) => onChange({
              ...filters,
              platform: e.target.value as Platform || undefined
            })}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Todas</option>
            <option value="Instagram">Instagram</option>
            <option value="YouTube">YouTube</option>
            <option value="TikTok">TikTok</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md min-h-[120px]"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
              className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
              className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
            className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={() => {
            onChange({});
            onClose();
          }}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Limpar Filtros
        </button>
      </div>
    </div>
  );
}