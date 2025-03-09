import React from 'react';
import type { Event } from '../types';

interface EventTypeBadgeProps {
  type: Event['type'];
}

export function EventTypeBadge({ type }: EventTypeBadgeProps) {
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
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(type)}`}>
      {type}
    </span>
  );
}