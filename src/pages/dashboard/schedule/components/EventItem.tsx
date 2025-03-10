import React from 'react';
import { Clock, MoreVertical, ChevronRight } from 'lucide-react';
import type { EventItemProps } from '../types';
import { getPlatformIcon, getPlatformColor, getStatusColor, getStatusLabel } from '../utils'; 

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
  .event-item {
    padding: var(--container-padding);
    flex-direction: column;
    gap: var(--spacing-base);
  }
  
  .event-header {
    flex-direction: column;
    align-items: flex-start;
    gap: calc(var(--spacing-base) * 0.75);
  }
  
  .event-image {
    width: 3rem;
    height: 3rem;
  }
  
  .event-info {
    width: 100%;
  }
  
  .event-meta {
    flex-wrap: wrap;
    gap: calc(var(--spacing-base) * 0.5);
  }
  
  .event-actions {
    width: 100%;
    justify-content: space-between;
    padding-top: calc(var(--spacing-base) * 0.75);
    border-top: 1px solid rgba(229, 231, 235, 0.5);
  }
  
  .action-button {
    min-height: var(--min-touch-target);
    min-width: var(--min-touch-target);
    padding: calc(var(--spacing-base) * 0.5);
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .event-item {
    padding: calc(var(--spacing-base) * 1.25);
  }
  
  .event-image {
    width: 3.5rem;
    height: 3.5rem;
  }
  
  .event-meta {
    gap: calc(var(--spacing-base) * 0.75);
  }
}

@media (min-width: 769px) {
  .event-item {
    padding: calc(var(--spacing-base) * 1.5);
  }
  
  .event-image {
    width: 4rem;
    height: 4rem;
  }
  
  .event-meta {
    gap: var(--spacing-base);
  }
}
`;

export function EventItem({ event, onClick, onEdit, onDelete }: EventItemProps) {
  const [showMenu, setShowMenu] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const Icon = getPlatformIcon(event.platform);

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
    <div className={`relative hover:bg-gray-50/50 transition-all duration-200 group event-item ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      <div className="flex items-start justify-between event-header">
        <div className="flex items-start space-x-4">
          <img
            src={event.campaign.logo}
            alt={`${event.campaign.brand} - ${event.platform}`}
            className="rounded-xl shadow-sm ring-1 ring-black/5 event-image"
          />
            <div className="flex-1 min-w-0 event-info">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h4 className="text-base font-medium text-gray-900">
                  {event.title}
                </h4>
                <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPlatformColor(event.platform)}`}>
                  {event.type}
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 event-meta">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1.5 text-gray-400" />
                  {event.date} às {event.time}
                </div>
                <div className="flex items-center">
                  <Icon className={`h-4 w-4 mr-1.5 ${getPlatformColor(event.platform)}`} />
                  {event.platform}
                </div>
              </div>
              {event.description && (
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {event.description}
                </p>
              )}
              <div className="mt-4">
                <button
                  onClick={() => onClick(event)}
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 group/link min-h-[var(--min-touch-target)] px-3 py-2 rounded-lg hover:bg-blue-50/80 transition-all duration-200"
                >
                  Ver Campanha
                  <ChevronRight className="h-4 w-4 ml-1 transform group-hover/link:translate-x-0.5 transition-transform duration-200" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 event-actions">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusColor(event.status)}`}>
              {getStatusLabel(event.status)}
            </span>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors duration-200 action-button"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
    </div>
  );
}