import React from 'react';
import { BarChart2 } from 'lucide-react';
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
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-base);
  }
  
  .metric-card {
    padding: var(--spacing-base);
  }
  
  .metric-value {
    font-size: var(--font-size-lg);
  }
  
  .metric-label {
    font-size: var(--font-size-base);
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: calc(var(--spacing-base) * 1.25);
  }
  
  .metric-card {
    padding: calc(var(--spacing-base) * 1.25);
  }
}

@media (min-width: 769px) {
  .metrics-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: calc(var(--spacing-base) * 1.5);
  }
  
  .metric-card {
    padding: calc(var(--spacing-base) * 1.5);
  }
}
`;

interface StepMetricsProps {
  step: string;
  campaign: Campaign;
}

export function StepMetrics({ step, campaign }: StepMetricsProps) {
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
    <div className={`grid gap-4 metrics-grid transition-all duration-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      {stepDetails.metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-gray-200/80 hover:border-blue-200 transition-all duration-200 metric-card"
        >
          <div className="flex items-center justify-between mb-2">
            <metric.icon className={`h-5 w-5 ${metric.color || 'text-gray-400'}`} />
            <BarChart2 className="h-4 w-4 text-gray-300" />
          </div>
          <p className="font-medium text-gray-900 metric-value">{metric.value}</p>
          <p className="text-gray-500 metric-label">{metric.label}</p>
        </div>
      ))}
    </div>
  );
}