import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import type { Campaign } from '../../../../types';
import { getStepDetails } from '../utils';

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
  .task-list {
    padding: var(--container-padding);
  }
  
  .task-item {
    padding: var(--spacing-base);
    margin-bottom: var(--spacing-base);
  }
  
  .task-checkbox {
    min-width: var(--min-touch-target);
    min-height: var(--min-touch-target);
  }
  
  .task-content {
    font-size: var(--font-size-base);
  }
  
  .task-description {
    font-size: calc(var(--font-size-base) * 0.875);
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .task-list {
    padding: calc(var(--spacing-base) * 1.25);
  }
  
  .task-item {
    padding: calc(var(--spacing-base) * 1.25);
    margin-bottom: calc(var(--spacing-base) * 0.75);
  }
}

@media (min-width: 769px) {
  .task-list {
    padding: calc(var(--spacing-base) * 1.5);
  }
  
  .task-item {
    padding: calc(var(--spacing-base) * 1.5);
    margin-bottom: calc(var(--spacing-base) * 1);
  }
}
`;

interface TaskListProps {
  step: string;
  campaign: Campaign;
  onTaskComplete: (taskIndex: number) => void;
}

export function TaskList({ step, campaign, onTaskComplete }: TaskListProps) {
  const stepDetails = getStepDetails(step, campaign);
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
  
  if (!stepDetails) return null;

  return (
    <div className={`space-y-4 task-list transition-all duration-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      <h3 className="text-sm font-medium text-gray-900 mb-4">Tarefas Pendentes</h3>
      <div className="space-y-3 divide-y divide-gray-100">
        {stepDetails.tasks.map((task, index) => (
          <div
            key={index}
            className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
              task.completed ? 'bg-green-50' : 'bg-gray-50 hover:bg-gray-100'
            } task-item`}
          >
            <button
              onClick={() => onTaskComplete(index)}
              className={`flex items-center justify-center rounded-full mr-3 transition-colors duration-200 task-checkbox ${
                task.completed
                  ? 'bg-green-100 text-green-600'
                  : 'border-2 border-gray-300 hover:border-blue-500'
              }`}
            >
              {task.completed ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${
                task.completed ? 'text-green-900' : 'text-gray-900'
              } task-content truncate`}>
                {task.title}
              </p>
              {task.description && (
                <p className="text-gray-500 mt-1 task-description line-clamp-2">{task.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}