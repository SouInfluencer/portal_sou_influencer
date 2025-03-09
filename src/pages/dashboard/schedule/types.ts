export interface ScheduleProps {
  onSelectCampaign: (id: number) => void;
}

export interface WeekDay {
  date: Date;
  isToday: boolean;
  isPast: boolean;
  events: Event[];
}

export interface Event {
  id: number;
  campaignId: number;
  title: string;
  date: string;
  time: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';
  type: string;
  platform: Platform;
  description?: string;
  campaign: {
    name: string;
    brand: string;
    logo: string;
  };
}

export type Platform = 'Instagram' | 'YouTube' | 'TikTok';

export interface WeekViewProps {
  selectedDate: Date;
  weekDays: WeekDay[];
  onDateChange: (date: Date) => void;
  onWeekChange: (direction: 'prev' | 'next' | 'today' | Date) => void;
  onEventClick: (event: Event) => void;
}

export interface HeaderProps {
  title: string;
  subtitle?: string;
  onNewEvent: () => void;
}

export interface ToolbarProps {
  selectedView: 'month' | 'week' | 'agenda';
  onViewChange: (view: 'month' | 'week' | 'agenda') => void;
  selectedFilter: 'all' | 'pending' | 'completed';
  onFilterChange: (filter: 'all' | 'pending' | 'completed') => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onNavigate: (direction: 'prev' | 'next' | 'today') => void;
}

export interface EventItemProps {
  event: Event;
  onClick: (event: Event) => void;
  onEdit?: (eventId: number) => void;
  onDelete?: (eventId: number) => void;
}