import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './schedule/components/Header';
import { Toolbar } from './schedule/components/Toolbar';
import { EventItem } from './schedule/components/EventItem';
import { WeekView } from './schedule/components/WeekView';
import type { Event, ScheduleProps, WeekDay } from './schedule/types';
import { getWeekDays, formatDateForInput } from './schedule/utils';

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
  .container {
    padding: var(--container-padding);
  }
  
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-base);
  }
  
  .toolbar {
    flex-direction: column;
    gap: var(--spacing-base);
  }
  
  .view-toggle {
    width: 100%;
    justify-content: center;
  }
  
  .calendar-grid {
    margin: 0 calc(var(--container-padding) * -1);
    border-radius: 0;
  }
  
  .calendar-cell {
    min-height: 120px;
    padding: var(--spacing-base);
  }
  
  .event-card {
    padding: var(--spacing-base);
    margin-bottom: var(--spacing-base);
  }
  
  .button {
    width: 100%;
    min-height: var(--min-touch-target);
    justify-content: center;
  }
  
  .input {
    min-height: var(--min-touch-target);
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .calendar-grid {
    gap: calc(var(--spacing-base) * 0.5);
  }
  
  .calendar-cell {
    min-height: 140px;
  }
  
  .event-card {
    padding: calc(var(--spacing-base) * 1.25);
  }
}

@media (min-width: 769px) {
  .calendar-grid {
    gap: calc(var(--spacing-base) * 0.75);
  }
  
  .calendar-cell {
    min-height: 160px;
  }
  
  .event-card {
    padding: calc(var(--spacing-base) * 1.5);
  }
}
`;

export function Schedule({ onSelectCampaign }: ScheduleProps) {
  const navigate = useNavigate();
  const [filters, setFilters] = React.useState<FilterState>({
    status: 'all',
    platform: 'all',
    type: 'all'
  });
  const [selectedView, setSelectedView] = React.useState<'month' | 'week' | 'agenda'>('month');
  const [selectedFilter, setSelectedFilter] = React.useState<'all' | 'pending' | 'completed'>('all');
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [weekDays, setWeekDays] = React.useState<WeekDay[]>(getWeekDays(selectedDate));
  const [showEventForm, setShowEventForm] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
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

  const itemsPerPage = 5;

  const events = [
    {
      id: 1,
      campaignId: 1,
      title: "Review Galaxy S24 Ultra",
      date: "2024-03-25",
      time: "14:00",
      status: "scheduled",
      type: "Feed",
      platform: "Instagram",
      description: "Gravação do review do novo smartphone",
      campaign: {
        name: "Lançamento Galaxy S24",
        brand: "Samsung",
        logo: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop"
      }
    },
    {
      id: 2,
      campaignId: 2,
      title: "Rotina Fitness",
      date: "2024-03-26",
      time: "10:00",
      status: "pending",
      type: "Reels",
      platform: "Instagram",
      description: "Vídeo sobre rotina de treino",
      campaign: {
        name: "Campanha Verão",
        brand: "FitLife",
        logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop"
      }
    },
    {
      id: 3,
      campaignId: 3,
      title: "Unboxing Novo Produto",
      date: "2024-03-27",
      time: "15:00",
      status: "in_progress",
      type: "Video",
      platform: "YouTube",
      description: "Unboxing da nova linha de produtos",
      campaign: {
        name: "Lançamento Linha Tech",
        brand: "TechCorp",
        logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop"
      }
    }
  ];

  const handleNavigate = (direction: 'prev' | 'next' | 'today') => {
    const newDate = new Date(selectedDate);
    
    if (direction === 'next') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (direction === 'today') {
      newDate.setTime(new Date().getTime());
    }
    
    setSelectedDate(newDate);
    setWeekDays(getWeekDays(newDate));
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    onSelectCampaign(event.campaignId);
  };

  const handleEditEvent = (eventId: number) => {
    // TODO: Implement event editing
    console.log('Editing event:', eventId);
  };

  const handleDeleteEvent = (eventId: number) => {
    // TODO: Implement event deletion
    console.log('Deleting event:', eventId);
  };

  const handleWeekChange = (direction: 'prev' | 'next' | 'today' | Date) => {
    const newDate = new Date(selectedDate);
    
    if (direction === 'next') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (direction === 'today') {
      newDate.setTime(new Date().getTime());
    } else if (direction instanceof Date) {
      newDate.setTime(direction.getTime());
    }
    
    setSelectedDate(newDate);
    setWeekDays(getWeekDays(newDate));
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setWeekDays(getWeekDays(date));
  };

  const handleFilterChange = (filter: 'all' | 'pending' | 'completed') => {
    setSelectedFilter(filter);
  };

  // Calendar grid helpers
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getDaysInPreviousMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 0).getDate();
  };

  // Get events for a specific day
  const getEventsForDay = (day: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day &&
             eventDate.getMonth() === selectedDate.getMonth() &&
             eventDate.getFullYear() === selectedDate.getFullYear();
    });
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDayOfMonth = getFirstDayOfMonth(selectedDate);
    const daysInPrevMonth = getDaysInPreviousMonth(selectedDate);
    const days = [];

    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        isPast: true
      });
    }

    // Current month days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i);
      days.push({
        day: i,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        isPast: date < new Date(today.setHours(0, 0, 0, 0)),
        events: getEventsForDay(i)
      });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 rows * 7 days = 42
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        isPast: false
      });
    }

    return days;
  };

  // Calculate pagination
  const indexOfLastEvent = currentPage * itemsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(events.length / itemsPerPage);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col space-y-6">
          <Header
            title="Agenda de Postagens"
            subtitle="Gerencie suas entregas e compromissos das campanhas"
            onNewEvent={() => setShowEventForm(true)}
          />

          <Toolbar
            selectedView={selectedView}
            onViewChange={setSelectedView}
            selectedFilter={selectedFilter}
            onFilterChange={handleFilterChange}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            onNavigate={handleNavigate}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4 space-y-6">
          {/* Calendar */}
          <div>
            <WeekView
              selectedDate={selectedDate}
              weekDays={weekDays}
              onDateChange={handleDateChange}
              onWeekChange={handleWeekChange}
              onEventClick={handleEventClick}
            />
          </div>

          {/* Events List */}
          <div className="bg-white shadow-sm rounded-xl border border-gray-200/80 overflow-hidden event-card">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Próximas Postagens</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {events.length} postagens agendadas
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value as 'all' | 'pending' | 'completed')}
                    className="block w-40 pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg min-h-[var(--min-touch-target)]"
                  >
                    <option value="all">Todas as postagens</option>
                    <option value="pending">Pendentes</option>
                    <option value="completed">Concluídas</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              <ul>
                {currentEvents.map((event) => (
                  <EventItem
                    key={event.id}
                    event={event}
                    onClick={() => handleEventClick(event)}
                    onEdit={handleEditEvent}
                    onDelete={handleDeleteEvent}
                  />
                ))}
              </ul>
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{indexOfFirstEvent + 1}</span> até{' '}
                    <span className="font-medium">{Math.min(indexOfLastEvent, events.length)}</span> de{' '}
                    <span className="font-medium">{events.length}</span> postagens
                  </p>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}