import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import type { EventMenuProps } from '../types';

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
  .menu-container {
    position: fixed;
    inset: auto 0 0 0;
    margin: 0;
    border-radius: var(--border-radius) var(--border-radius) 0 0;
    transform: translateY(100%);
    transition: transform 0.3s ease-in-out;
  }
  
  .menu-container.open {
    transform: translateY(0);
  }
  
  .menu-button {
    min-height: var(--min-touch-target);
    width: 100%;
    justify-content: center;
    padding: calc(var(--spacing-base) * 0.75) var(--spacing-base);
    font-size: var(--font-size-base);
  }
  
  .menu-list {
    padding: calc(var(--spacing-base) * 0.5) 0;
  }
  
  .menu-item {
    padding: calc(var(--spacing-base) * 0.75) var(--spacing-base);
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .menu-container {
    width: 240px;
    margin-top: calc(var(--spacing-base) * 0.5);
  }
  
  .menu-button {
    padding: calc(var(--spacing-base) * 0.5) var(--spacing-base);
  }
  
  .menu-list {
    padding: calc(var(--spacing-base) * 0.25) 0;
  }
  
  .menu-item {
    padding: calc(var(--spacing-base) * 0.5) var(--spacing-base);
  }
}

@media (min-width: 769px) {
  .menu-container {
    width: 280px;
    margin-top: calc(var(--spacing-base) * 0.75);
  }
  
  .menu-button {
    padding: calc(var(--spacing-base) * 0.75) var(--spacing-base);
  }
  
  .menu-list {
    padding: calc(var(--spacing-base) * 0.5) 0;
  }
  
  .menu-item {
    padding: calc(var(--spacing-base) * 0.75) var(--spacing-base);
  }
}
`;

export function EventMenu({ event, onEdit, onDelete, onClose }: EventMenuProps) {
  const [mounted, setMounted] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Add styles to document
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Trigger mount animation
    setMounted(true);

    // Handle clicks outside menu
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.head.removeChild(styleSheet);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`} 
        onClick={onClose}
      />

      {/* Menu */}
      <div 
        ref={menuRef}
        className={`absolute right-0 mt-2 rounded-xl bg-white shadow-xl ring-1 ring-black/5 focus:outline-none z-50 menu-container ${
          mounted ? 'open' : ''
        }`}
      >
        <div className="menu-list">
          <button
            onClick={() => {
              onEdit(event.id);
              onClose();
            }}
            className="flex items-center w-full text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 menu-item"
          >
            <Edit2 className="h-4 w-4 mr-3 text-gray-400" />
            Editar Evento
          </button>
          <button
            onClick={() => {
              onDelete(event.id);
              onClose();
            }}
            className="flex items-center w-full text-left text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 menu-item"
          >
            <Trash2 className="h-4 w-4 mr-3 text-red-500" />
            Excluir Evento
          </button>
        </div>
      </div>
    </>
  );
}