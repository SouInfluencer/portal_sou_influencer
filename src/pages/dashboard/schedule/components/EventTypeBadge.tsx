import React from 'react';
import type { Event } from '../types';

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
  .type-badge {
    padding: calc(var(--spacing-base) * 0.375) calc(var(--spacing-base) * 0.75);
    font-size: calc(var(--font-size-base) * 0.75);
    min-height: calc(var(--min-touch-target) * 0.5);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    border-radius: 9999px;
    font-weight: 500;
    transform: translateZ(0);
    backface-visibility: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .type-badge {
    padding: calc(var(--spacing-base) * 0.4) calc(var(--spacing-base) * 0.8);
    font-size: calc(var(--font-size-base) * 0.8);
    min-height: calc(var(--min-touch-target) * 0.6);
  }
}

@media (min-width: 769px) {
  .type-badge {
    padding: calc(var(--spacing-base) * 0.5) calc(var(--spacing-base));
    font-size: var(--font-size-base);
    min-height: calc(var(--min-touch-target) * 0.7);
  }
}

/* High-contrast mode support */
@media (forced-colors: active) {
  .type-badge {
    border: 1px solid currentColor;
  }
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .type-badge {
    transition: none;
  }
}
`;

interface EventTypeBadgeProps {
  type: Event['type'];
}

export function EventTypeBadge({ type }: EventTypeBadgeProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Add styles to document
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Trigger mount animation
    setMounted = true;

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const getEventTypeColor = (type: Event['type']) => {
    const colors = {
      Post: 'bg-purple-100 text-purple-800',
      Story: 'bg-blue-100 text-blue-800',
      Reels: 'bg-green-100 text-green-800',
      Live: 'bg-red-100 text-red-800'
    };
    return colors[type];
  };

  return (
    <span 
      className={`type-badge ${getEventTypeColor(type)} transition-all duration-300 ${
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
      }`}
      role="status"
    >
      {type}
    </span>
  );
}