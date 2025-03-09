import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  selectedDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export function Calendar({ selectedDate, onPreviousMonth, onNextMonth }: CalendarProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      {/* Calendar Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="mx-4 text-lg font-semibold text-gray-900">
              {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={onNextMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        <div className="grid grid-cols-7 gap-px">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        {/* Calendar days would go here */}
        <div className="text-center text-sm text-gray-500 mt-4">
          [Grid do calendário será implementado aqui]
        </div>
      </div>
    </div>
  );
}