import React from 'react';
import { Plus } from 'lucide-react';
import type { HeaderProps } from '../types';

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
  .header-container {
    padding: var(--container-padding);
    flex-direction: column;
    gap: var(--spacing-base);
    align-items: stretch;
  }
  
  .header-content {
    text-align: center;
  }
  
  .header-title {
    font-size: var(--font-size-lg);
    margin-bottom: calc(var(--spacing-base) * 0.5);
  }
  
  .header-subtitle {
    font-size: var(--font-size-base);
  }
  
  .header-actions {
    display: grid;
    gap: calc(var(--spacing-base) * 0.75);
  }
  
  .action-button {
    width: 100%;
    min-height: var(--min-touch-target);
    justify-content: center;
    padding: calc(var(--spacing-base) * 0.75) var(--spacing-base);
    font-size: var(--font-size-base);
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .header-container {
    padding: calc(var(--spacing-base) * 1.25);
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  
  .header-title {
    font-size: var(--font-size-lg);
  }
  
  .action-button {
    min-height: var(--min-touch-target);
    padding: calc(var(--spacing-base) * 0.5) calc(var(--spacing-base) * 1.25);
  }
}

@media (min-width: 769px) {
  .header-container {
    padding: calc(var(--spacing-base) * 1.5);
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  
  .header-title {
    font-size: var(--font-size-xl);
  }
  
  .action-button {
    min-height: var(--min-touch-target);
    padding: calc(var(--spacing-base) * 0.75) calc(var(--spacing-base) * 1.5);
  }
}

/* High-contrast mode support */
@media (forced-colors: active) {
  .action-button {
    border: 1px solid currentColor;
  }
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .action-button {
    transition: none;
  }
}
`;

export function Header({ title, subtitle, onNewEvent }: HeaderProps) {
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
    <div className={`flex header-container transition-all duration-300 ${
      mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
    }`}>
      <div className="header-content">
        <h1 className="font-semibold text-gray-900 header-title">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-500 header-subtitle">
            {subtitle}
          </p>
        )}
      </div>

      <div className="header-actions">
        <button
          onClick={onNewEvent}
          className="inline-flex items-center border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] action-button"
        >
          <Plus className="h-5 w-5 mr-2" />
          Novo Evento
        </button>
      </div>
    </div>
  );
}