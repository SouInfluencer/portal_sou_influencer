import { Instagram, Youtube, Video } from 'lucide-react';
import type { Platform } from './types';

export function getPlatformIcon(platform: Platform) {
  const icons = {
    Instagram,
    YouTube: Youtube,
    TikTok: Video
  };
  return icons[platform];
}

export function getPlatformColor(platform: Platform) {
  const colors = {
    Instagram: 'text-pink-600',
    YouTube: 'text-red-600',
    TikTok: 'text-gray-900'
  };
  return colors[platform];
}

export function getStatusColor(status: string) {
  const colors = {
    scheduled: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    rescheduled: 'bg-orange-100 text-orange-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getStatusLabel(status: string) {
  const labels = {
    scheduled: 'Agendado',
    in_progress: 'Em Andamento',
    completed: 'Concluído',
    cancelled: 'Cancelado',
    rescheduled: 'Reagendado'
  };
  return labels[status] || status;
}

export function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();
}

export function getWeekDays(selectedDate: Date) {
  const start = new Date(selectedDate);
  start.setDate(start.getDate() - start.getDay() + (start.getDay() === 0 ? -6 : 1));
  
  const days = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    days.push({
      date: day,
      isToday: day.toDateString() === new Date().toDateString(),
      isPast: day < new Date(new Date().setHours(0, 0, 0, 0)),
      events: []
    });
  }
  
  return days;
}

export function getDaysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function getFirstDayOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
}

export function getDaysInPreviousMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 0).getDate();
}