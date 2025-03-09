import React from 'react';
import { Clock, MapPin, Users, MoreVertical } from 'lucide-react';
import type { Event } from '../types';
import { EventMenu } from './EventMenu';
import { EventStatusBadge } from './EventStatusBadge';
import { EventTypeBadge } from './EventTypeBadge';

interface EventListProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  onEditEvent: (eventId: number) => void;
  onDeleteEvent: (eventId: number) => void;
}

export function EventList({ events, onEventClick, onEditEvent, onDeleteEvent }: EventListProps) {
  const [showEventMenu, setShowEventMenu] = React.useState<number | null>(null);

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Próximos Eventos</h3>
      </div>
      <ul className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
        {events.map((event) => (
          <li
            key={event.id}
            className="relative hover:bg-gray-50 transition-colors duration-150"
          >
            <div className="px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {event.campaign && (
                    <img
                      src={event.campaign.logo}
                      alt={`${event.campaign.brand} - ${event.platform}`}
                      className="h-10 w-10 rounded-full"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        <p className="text-sm text-gray-500">
                          {event.date} às {event.time}
                        </p>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{event.platform}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex flex-col items-end space-y-1">
                    <span className="text-xs text-gray-500">{event.campaign?.name}</span>
                    <EventTypeBadge type={event.type} />
                    <EventStatusBadge status={event.status} />
                  </div>
                  <button
                    onClick={() => setShowEventMenu(event.id)}
                    className="ml-2 p-1 rounded-full hover:bg-gray-100"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {event.content?.caption && (
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <p className="line-clamp-1">{event.content.caption}</p>
                </div>
              )}

              {event.content?.hashtags && event.content.hashtags.length > 0 && (
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <p className="line-clamp-1 text-indigo-600">
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