import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ToolbarProps } from '../types';

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
  .toolbar-container {
    margin: 0 calc(var(--container-padding) * -1);
    border-radius: 0;
    flex-direction: column;
    gap: var(--spacing-base);
    padding: var(--container-padding);
    position: sticky;
    top: 0;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(8px);
    z-index: 40;
    border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  }
  
  .toolbar-group {
    flex-direction: column;
    width: 100%;
    gap: calc(var(--spacing-base) * 0.75);
  }
  
  .view-toggle {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  .view-toggle::-webkit-scrollbar {
    display: none;
  }
  
  .view-toggle-inner {
    display: inline-flex;
    min-width: max-content;
    padding: 0.25rem;
  }
  
  .view-button {
    min-height: var(--min-touch-target);
    min-width: 5rem;
    justify-content: center;
    white-space: nowrap;
  }
  
  .filter-select {
    width: 100%;
    min-height: var(--min-touch-target);
  }
  
  .date-navigation {
    width: 100%;
    justify-content: space-between;
  }
  
  .nav-button {
    min-height: var(--min-touch-target);
    min-width: var(--min-touch-target);
    padding: 0;
    justify-content: center;
  }
  
  .date-picker {
    width: 100%;
    min-height: var(--min-touch-target);
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .toolbar-container {
    padding: calc(var(--spacing-base) * 1.25);
    flex-direction: row;
    flex-wrap: wrap;
    gap: calc(var(--spacing-base) * 0.75);
  }
  
  .toolbar-group {
    flex: 1;
    min-width: 200px;
  }
  
  .view-button {
    min-height: var(--min-touch-target);
    min-width: 6rem;
  }
  
  .filter-select {
    min-width: 180px;
  }
}

@media (min-width: 769px) {
  .toolbar-container {
    padding: calc(var(--spacing-base) * 1.5);
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  
  .toolbar-group {
    flex: none;
  }
  
  .view-button {
    min-height: var(--min-touch-target);
    min-width: 7rem;
  }
  
  .filter-select {
    min-width: 200px;
  }
}

/* High-contrast mode support */
@media (forced-colors: active) {
  .view-button,
  .nav-button,
  .filter-select {
    border: 1px solid currentColor;
  }
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .view-button,
  .nav-button,
  .filter-select {
    transition: none;
  }
}
`;

export function Toolbar({
  selectedView,
  onViewChange,
  selectedFilter,
  onFilterChange,
  selectedDate,
  onDateChange,
  onNavigate
}: ToolbarProps) {
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
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200/80 toolbar-container transition-all duration-300 ${
      mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
    }`}>
      <div className="flex items-center space-x-4 toolbar-group">
        {/* View Toggle */}
        <div className="view-toggle">
          <div className="bg-gray-100 rounded-lg p-1 view-toggle-inner">
            <button
              onClick={() => onViewChange('month')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 view-button ${
                selectedView === 'month'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mês
            </button>
            <button
              onClick={() => onViewChange('week')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 view-button ${
                selectedView === 'week'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => onViewChange('agenda')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 view-button ${
                selectedView === 'agenda'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Agenda
            </button>
          </div>
        </div>

        {/* Filter */}
        <select
          value={selectedFilter}
          onChange={(e) => onFilterChange(e.target.value as 'all' | 'pending' | 'completed')}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg transition-colors duration-200 hover:border-gray-400 filter-select"
        >
          <option value="all">Todas as postagens</option>
          <option value="pending">Pendentes</option>
          <option value="completed">Concluídas</option>
        </select>
      </div>

      <div className="flex items-center space-x-4 toolbar-group">
        {/* Date Navigation */}
        <div className="flex items-center space-x-2 date-navigation">
          <button
            onClick={() => onNavigate('prev')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 nav-button"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => onNavigate('today')}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200 nav-button"
          >
            Hoje
          </button>
          <button
            onClick={() => onNavigate('next')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 nav-button"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Date Picker */}
        <input
          type="date"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={(e) => onDateChange(new Date(e.target.value))}
          className="block w-auto px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200 hover:border-gray-400 date-picker"
        />
      </div>
    </div>
  );
}