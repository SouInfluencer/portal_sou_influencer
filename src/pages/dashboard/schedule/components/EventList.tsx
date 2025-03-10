import React from 'react';
import { Clock, MapPin, Users, MoreVertical } from 'lucide-react';
import type { Event } from '../types';
import { EventMenu } from './EventMenu';
import { EventStatusBadge } from './EventStatusBadge';
import { EventTypeBadge } from './EventTypeBadge';

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
  .event-list {
    margin: 0 calc(var(--container-padding) * -1);
    border-radius: 0;
  }
  
  .list-header {
    padding: var(--container-padding);
    position: sticky;
    top: 0;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(8px);
    z-index: 10;
  }
  
  .list-content {
    max-height: calc(100vh - var(--min-touch-target) * 3);
  }
  
  .event-item {
    padding: var(--container-padding);
    flex-direction: column;
    gap: var(--spacing-base);
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
  .event-list {
    border-radius: var(--border-radius);
  }
  
  .list-header {
    padding: calc(var(--spacing-base) * 1.25);
  }
  
  .event-item {
    padding: calc(var(--spacing-base) * 1.25);
  }
  
  .event-image {
    width: 3.5rem;
    height: 3.5rem;
  }
}

@media (min-width: 769px) {
  .event-list {
    border-radius: var(--border-radius);
  }
  
  .list-header {
    padding: calc(var(--spacing-base) * 1.5);
  }
  
  .event-item {
    padding: calc(var(--spacing-base) * 1.5);
  }
  
  .event-image {
    width: 4rem;
    height: 4rem;
  }
}
`;

interface EventListProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  onEditEvent: (eventId: number) => void;
  onDeleteEvent: (eventId: number) => void;
}

export function EventList({ events, onEventClick, onEditEvent, onDeleteEvent }: EventListProps) {
  const [showEventMenu, setShowEventMenu] = React.useState<number | null>(null);
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
    <div className={`bg-white shadow overflow-hidden event-list transition-all duration-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      <div className="border-b border-gray-200 list-header">
        <h3 className="text-lg font-medium text-gray-900">Próximos Eventos</h3>
      </div>
      <ul className="divide-y divide-gray-200 overflow-y-auto list-content">
        {events.map((event) => (
          <li
            key={event.id}
            className="relative hover:bg-gray-50 transition-colors duration-150 event-item"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center space-x-3">
                  {event.campaign && (
                    <img
                      src={event.campaign.logo}
                      alt={`${event.campaign.brand} - ${event.platform}`}
                      className="rounded-full event-image"
                    />
                  )}
                  <div className="flex-1 min-w-0 event-info">
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1 event-meta">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        <p className="text-sm text-gray-500">
                          {event.date} às {event.time}
                        </p>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{event.platform}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 event-actions">
                  <div className="flex flex-col items-end space-y-1">
                    <span className="text-xs text-gray-500">{event.campaign?.name}</span>
                    <EventTypeBadge type={event.type} />
                    <EventStatusBadge status={event.status} />
                  </div>
                  <button
                    onClick={() => setShowEventMenu(event.id)}
                    className="rounded-lg hover:bg-gray-100 transition-colors duration-200 action-button"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {event.content?.caption && (
                <div className="mt-2 text-sm text-gray-500">
                  <p className="line-clamp-1">{event.content.caption}</p>
                </div>
              )}

              {event.content?.hashtags && event.content.hashtags.length > 0 && (
                <div className="mt-2 text-sm text-gray-500">
                  <p className="line-clamp-1 text-blue-600">
                    {event.content.hashtags.join(' ')}
                  </p>
                </div>
              )}

              {/* Event Menu */}
              {showEventMenu === event.id && (
                <EventMenu
                  event={event}
                  onEdit={onEditEvent}
                  onDelete={onDeleteEvent}
                  onClose={() => setShowEventMenu(null)}
                />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}