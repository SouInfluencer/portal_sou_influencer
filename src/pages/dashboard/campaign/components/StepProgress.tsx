import React from 'react';
import { CheckCircle } from 'lucide-react';
import type { Step } from '../types';

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
  .steps-container {
    padding: var(--container-padding);
  }
  
  .step-item {
    flex-direction: column;
    padding-left: calc(var(--spacing-base) * 2);
    margin-bottom: var(--spacing-base);
  }
  
  .step-icon {
    width: var(--min-touch-target);
    height: var(--min-touch-target);
    margin-bottom: var(--spacing-base);
  }
  
  .step-content {
    padding-left: 0;
  }
  
  .step-title {
    font-size: var(--font-size-lg);
    margin-bottom: calc(var(--spacing-base) * 0.5);
  }
  
  .step-description {
    font-size: var(--font-size-base);
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .step-item {
    padding-left: calc(var(--spacing-base) * 2.5);
    margin-bottom: calc(var(--spacing-base) * 1.25);
  }
  
  .step-icon {
    width: calc(var(--min-touch-target) * 1.1);
    height: calc(var(--min-touch-target) * 1.1);
  }
}

@media (min-width: 769px) {
  .step-item {
    padding-left: calc(var(--spacing-base) * 3);
    margin-bottom: calc(var(--spacing-base) * 1.5);
  }
  
  .step-icon {
    width: calc(var(--min-touch-target) * 1.2);
    height: calc(var(--min-touch-target) * 1.2);
  }
}
`;

interface StepProgressProps {
  steps: Step[];
  currentStep: string;
}

export function StepProgress({ steps, currentStep }: StepProgressProps) {
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
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
    <div className={`relative steps-container transition-all duration-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      <div className="absolute left-4 inset-y-0 transform -translate-x-1/2 w-0.5 bg-gray-200" />
      <div className="space-y-8 relative">
        {steps.map((step, index) => {
          const status = index < currentStepIndex ? 'completed' : index === currentStepIndex ? 'current' : 'upcoming';
          
          return (
            <div key={step.id} className="flex items-start step-item">
              <div className={`relative flex items-center justify-center flex-shrink-0 h-8 w-8 rounded-full ${
                status === 'completed'
                  ? 'bg-green-500'
                  : status === 'current'
                  ? 'bg-blue-500'
                  : 'bg-gray-200'
              } shadow-sm step-icon`}>
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
              <div className="min-w-0 flex-1 step-content">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-medium ${
                    status === 'completed'
                      ? 'text-green-600'
                      : status === 'current'
                      ? 'text-blue-600'
                      : 'text-gray-500'
                  } step-title`}>
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
                <p className="text-gray-500 step-description">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}