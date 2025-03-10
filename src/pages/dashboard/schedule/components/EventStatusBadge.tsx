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
  .status-badge {
    padding: calc(var(--spacing-base) * 0.375) calc(var(--spacing-base) * 0.75);
    font-size: calc(var(--font-size-base) * 0.75);
    min-height: calc(var(--min-touch-target) * 0.5);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .status-badge {
    padding: calc(var(--spacing-base) * 0.4) calc(var(--spacing-base) * 0.8);
    font-size: calc(var(--font-size-base) * 0.8);
    min-height: calc(var(--min-touch-target) * 0.6);
  }
}

@media (min-width: 769px) {
  .status-badge {
    padding: calc(var(--spacing-base) * 0.5) calc(var(--spacing-base));
    font-size: var(--font-size-base);
    min-height: calc(var(--min-touch-target) * 0.7);
  }
}
`;

interface EventStatusBadgeProps {
  status: Event['status'];
}

export function EventStatusBadge({ status }: EventStatusBadgeProps) {
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

  const getStatusColor = (status: Event['status']) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      rescheduled: 'bg-orange-100 text-orange-800'
    };
    return colors[status];
  };

  const getStatusLabel = (status: Event['status']) => {
    const labels = {
      scheduled: 'Agendado',
      in_progress: 'Em Andamento',
      completed: 'Concluído',
      cancelled: 'Cancelado',
      rescheduled: 'Reagendado'
    };
    return labels[status];
  };

  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium status-badge transition-all duration-300 ${getStatusColor(status)} ${
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
      }`}
    >
      {getStatusLabel(status)}
    </span>
  );
}