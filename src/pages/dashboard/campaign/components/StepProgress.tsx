import React from 'react';
import { CheckCircle } from 'lucide-react';
import type { Step } from '../types';

interface StepProgressProps {
  steps: Step[];
  currentStep: string;
}

export function StepProgress({ steps, currentStep }: StepProgressProps) {
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="relative">
      <div className="absolute left-4 inset-y-0 transform -translate-x-1/2 w-0.5 bg-gray-200" />
      <div className="space-y-8 relative">
        {steps.map((step, index) => {
          const status = index < currentStepIndex ? 'completed' : index === currentStepIndex ? 'current' : 'upcoming';
          
          return (
            <div key={step.id} className="flex items-center">
              <div className={`relative flex items-center justify-center flex-shrink-0 h-8 w-8 rounded-full ${
                status === 'completed'
                  ? 'bg-green-500'
                  : status === 'current'
                  ? 'bg-blue-500'
                  : 'bg-gray-200'
              } shadow-sm`}>
                {status === 'completed' ? (
                  <CheckCircle className="h-5 w-5 text-white" />
                ) : (
                  <step.icon className="h-5 w-5 text-white" />
                )}
                {index < steps.length - 1 && (
                  <div className={`absolute top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-8 ${
                    status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-medium ${
                    status === 'completed'
                      ? 'text-green-600'
                      : status === 'current'
                      ? 'text-blue-600'
                      : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  {status === 'completed' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Concluído
                    </span>
                  )}
                  {status === 'current' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Em Andamento
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}