import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ToolbarProps } from '../types';

export function Toolbar({
  selectedView,
  onViewChange,
  selectedFilter,
  onFilterChange,
  selectedDate,
  onDateChange,
  onNavigate
}: ToolbarProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200/80">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onViewChange('month')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                selectedView === 'month'
                  ? 'bg-white text-indigo-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mês
            </button>
            <button
              onClick={() => onViewChange('week')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                selectedView === 'week'
                  ? 'bg-white text-indigo-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => onViewChange('agenda')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                selectedView === 'agenda'
                  ? 'bg-white text-indigo-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Agenda
            </button>
          </div>

          {/* Filter */}
          <select
            value={selectedFilter}
            onChange={(e) => onFilterChange(e.target.value as 'all' | 'pending' | 'completed')}
            className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg"
          >
            <option value="all">Todas as postagens</option>
            <option value="pending">Pendentes</option>
            <option value="completed">Concluídas</option>
          </select>
        </div>

        <div className="flex items-center space-x-4">
          {/* Date Navigation */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigate('prev')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => onNavigate('today')}
              className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
            >
              Hoje
            </button>
            <button
              onClick={() => onNavigate('next')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Date Picker */}
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => onDateChange(new Date(e.target.value))}
            className="block w-auto px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
}