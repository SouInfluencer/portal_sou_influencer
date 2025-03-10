import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  .calendar-container {
    margin: 0 calc(var(--container-padding) * -1);
    border-radius: 0;
  }
  
  .calendar-header {
    padding: var(--container-padding);
  }
  
  .calendar-grid {
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
  }
  
  .calendar-day {
    aspect-ratio: 1;
    min-height: calc(100vw / 7);
    font-size: var(--font-size-base);
  }
  
  .calendar-nav-button {
    min-height: var(--min-touch-target);
    min-width: var(--min-touch-target);
  }
  
  .weekday-label {
    font-size: calc(var(--font-size-base) * 0.875);
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .calendar-container {
    border-radius: var(--border-radius);
  }
  
  .calendar-header {
    padding: calc(var(--spacing-base) * 1.25);
  }
  
  .calendar-day {
    min-height: 80px;
  }
}

@media (min-width: 769px) {
  .calendar-container {
    border-radius: var(--border-radius);
  }
  
  .calendar-header {
    padding: calc(var(--spacing-base) * 1.5);
  }
  
  .calendar-day {
    min-height: 100px;
  }
}
`;

interface CalendarProps {
  selectedDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export function Calendar({ selectedDate, onPreviousMonth, onNextMonth }: CalendarProps) {
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
    <div className={`bg-white shadow calendar-container transition-all duration-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      {/* Calendar Header */}
      <div className="border-b border-gray-200 calendar-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 calendar-nav-button"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="mx-4 text-lg font-semibold text-gray-900">
              {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={onNextMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 calendar-nav-button"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        <div className="grid grid-cols-7 gap-px calendar-grid">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <div key={day} className="text-center font-medium text-gray-500 py-2 weekday-label">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px mt-2 calendar-grid">
          {Array.from({ length: 35 }, (_, i) => (
            <button
              key={i}
              className="flex items-center justify-center p-2 hover:bg-gray-100 transition-colors duration-200 calendar-day"
            >
              <span className="text-gray-700">{i + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}