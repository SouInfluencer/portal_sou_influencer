import React from 'react';
import type { Event } from '../types';

interface EventStatusBadgeProps {
  status: Event['status'];
}

export function EventStatusBadge({ status }: EventStatusBadgeProps) {
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
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {getStatusLabel(status)}
    </span>
  );
}