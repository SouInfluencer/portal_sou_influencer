import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import type { Campaign } from '../../../../types';
import { getStepDetails } from '../utils';

interface TaskListProps {
  step: string;
  campaign: Campaign;
  onTaskComplete: (taskIndex: number) => void;
}

export function TaskList({ step, campaign, onTaskComplete }: TaskListProps) {
  const stepDetails = getStepDetails(step, campaign);
  
  if (!stepDetails) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900">Tarefas Pendentes</h3>
      <div className="space-y-3">
        {stepDetails.tasks.map((task, index) => (
          <div
            key={index}
            className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
              task.completed ? 'bg-green-50' : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <button
              onClick={() => onTaskComplete(index)}
              className={`flex items-center justify-center h-5 w-5 rounded-full mr-3 transition-colors duration-200 ${
                task.completed
                  ? 'bg-green-100 text-green-600'
                  : 'border-2 border-gray-300 hover:border-indigo-500'
              }`}
            >
              {task.completed ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
            </button>
            <div>
              <p className={`text-sm font-medium ${
                task.completed ? 'text-green-900' : 'text-gray-900'
              }`}>
                {task.title}
              </p>
              {task.description && (
                <p className="text-xs text-gray-500 mt-1">{task.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}