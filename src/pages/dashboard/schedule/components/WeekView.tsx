import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import type { WeekViewProps } from '../types';
import { formatDateForInput, isSameDay } from '../utils';

export function WeekView({
  selectedDate,
  weekDays,
  onDateChange,
  onWeekChange,
  onEventClick
}: WeekViewProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);
  const datePickerRef = React.useRef<HTMLDivElement>(null);
  const [selectedMonth, setSelectedMonth] = React.useState(new Date(selectedDate));
  const [hasUserSelection, setHasUserSelection] = React.useState(false);

  const handleDateClick = (date: Date) => {
    // If clicking the same date, deselect it
    if (isSameDay(date, selectedDate)) {
      onDateChange(new Date(0)); // Use invalid date to represent no selection
      setHasUserSelection(false);
    } else {
      onDateChange(date);
      onWeekChange(date);
      setHasUserSelection(true);
    }
  };

  // Close date picker when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isSameMonth = (date: Date, month: Date) => {
    return date.getMonth() === month.getMonth() &&
      date.getFullYear() === month.getFullYear();
  };

  const handleMonthChange = (increment: number) => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(newMonth.getMonth() + increment);
    setSelectedMonth(newMonth);
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedMonth);
    const firstDayOfMonth = getFirstDayOfMonth(selectedMonth);
    const days = [];

    // Previous month days
    const prevMonthDays = getDaysInMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1));
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        date: new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, prevMonthDays - i)
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), i)
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, i)
      });
    }

    return days;
  };

  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-200/80 overflow-hidden">
      {/* Calendar Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onWeekChange('prev')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              {`${weekDays[0].date.toLocaleDateString('pt-BR', { month: 'long', day: 'numeric' })} - ${weekDays[6].date.toLocaleDateString('pt-BR', { month: 'long', day: 'numeric', year: 'numeric' })}`}
            </h2>
            <button
              onClick={() => onWeekChange('next')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative" ref={datePickerRef}>
              <button
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                {selectedMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </button>
              
              {isDatePickerOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => handleMonthChange(-1)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-600" />
                      </button>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                      </span>
                      <button
                        onClick={() => handleMonthChange(1)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <ChevronRight className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 mb-2">
                      {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                        <div key={day} className="py-1">{day}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {generateCalendarDays().map((day, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            onDateChange(day.date);
                            setIsDatePickerOpen(false);
                            setSelectedMonth(day.date);
                          }}
                          className={`
                            p-2 text-sm rounded-lg transition-all duration-200
                            ${isSameMonth(day.date, selectedMonth) ? 'text-gray-900' : 'text-gray-400'}
                            ${isToday(day.date) ? 'ring-2 ring-blue-500 font-medium' : ''}
                            ${day.date.toDateString() === selectedDate.toDateString() 
                              ? 'bg-blue-100 text-blue-700 font-medium' 
                              : 'hover:bg-gray-100'}
                          `}
                        >
                          {day.day}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => onWeekChange('today')}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            >
              Hoje
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        <div className="grid grid-cols-7 gap-px">
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((dayName) => (
            <div key={dayName} className="text-center text-sm font-medium text-gray-900 py-3">
              {dayName}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px mt-1">
          {weekDays.map((day, index) => (
            <div
              onClick={() => handleDateClick(day.date)}
              key={index}
              className={`
                min-h-[140px] p-3 relative bg-white border border-gray-100 hover:border-blue-200 cursor-pointer 
                ${isSameDay(day.date, selectedDate) && selectedDate.getTime() !== 0 && hasUserSelection ? 'ring-2 ring-blue-500' : ''}
                ${day.isToday && !hasUserSelection ? 'ring-2 ring-blue-500 bg-blue-50/30' : ''}
                ${day.isPast ? 'bg-gray-50/50' : ''}
                transition-colors duration-200
              `}
            >
              <div className={`flex items-center justify-center h-7 w-7 rounded-full text-sm font-medium ${
                isSameDay(day.date, selectedDate) && selectedDate.getTime() !== 0 && hasUserSelection
                  ? 'bg-blue-600 text-white'
                  : day.isToday && !hasUserSelection
                  ? 'bg-blue-600 text-white'
                  : day.isPast
                    ? 'text-gray-500'
                    : 'text-gray-900'
              }`}>
                {day.date.getDate()}
              </div>
              {day.events.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {day.events.map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      onClick={() => onEventClick(event)}
                      className={`px-2 py-1.5 text-xs rounded-lg cursor-pointer transform hover:scale-[1.02] transition-all duration-200 ${
                        event.platform === 'Instagram'
                          ? 'bg-gradient-to-br from-pink-100 to-pink-50 text-pink-800 shadow-sm'
                          : event.platform === 'YouTube'
                          ? 'bg-gradient-to-br from-red-100 to-red-50 text-red-800 shadow-sm'
                          : 'bg-gradient-to-br from-purple-100 to-purple-50 text-purple-800 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium truncate flex-1">{event.title}</div>
                        <div className="text-xs opacity-75 ml-2">{event.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}