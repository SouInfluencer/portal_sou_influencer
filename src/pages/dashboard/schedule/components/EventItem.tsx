import React from 'react';
import { Clock, MoreVertical, ChevronRight } from 'lucide-react';
import type { EventItemProps } from '../types';
import { getPlatformIcon, getPlatformColor, getStatusColor, getStatusLabel } from '../utils';

export function EventItem({ event, onClick, onEdit, onDelete }: EventItemProps) {
  const [showMenu, setShowMenu] = React.useState(false);
  const Icon = getPlatformIcon(event.platform);

  return (
    <div className="relative hover:bg-gray-50/50 transition-all duration-200 group">
      <div className="px-6 py-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <img
              src={event.campaign.logo}
              alt={`${event.campaign.brand} - ${event.platform}`}
              className="h-12 w-12 rounded-xl shadow-sm ring-1 ring-black/5"
            />
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-base font-medium text-gray-900">
                  {event.title}
                </h4>
                <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPlatformColor(event.platform)}`}>
                  {event.type}
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 space-x-4">
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
                  className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 group/link"
                >
                  Ver Campanha
                  <ChevronRight className="h-4 w-4 ml-1 transform group-hover/link:translate-x-0.5 transition-transform duration-200" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusColor(event.status)}`}>
              {getStatusLabel(event.status)}
            </span>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}