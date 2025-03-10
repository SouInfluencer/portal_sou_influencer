import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
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
  .next-action {
    padding: var(--container-padding);
    margin: 0 calc(var(--container-padding) * -1);
    border-radius: 0;
  }
  
  .action-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-base);
  }
  
  .action-title {
    font-size: var(--font-size-lg);
  }
  
  .action-description {
    font-size: var(--font-size-base);
  }
  
  .action-button {
    width: 100%;
    min-height: var(--min-touch-target);
    justify-content: center;
    padding: calc(var(--spacing-base) * 0.75) var(--spacing-base);
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .next-action {
    padding: calc(var(--spacing-base) * 1.25);
  }
  
  .action-title {
    font-size: var(--font-size-lg);
  }
}

@media (min-width: 769px) {
  .next-action {
    padding: calc(var(--spacing-base) * 1.5);
  }
  
  .action-title {
    font-size: var(--font-size-xl);
  }
}
`;

interface NextActionProps {
  step: string;
  campaign: Campaign;
  onAction: () => void;
}

export function NextAction({ step, campaign, onAction }: NextActionProps) {
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
    <div className={`bg-gradient-to-br from-blue-50/50 to-white border border-blue-100/50 next-action transition-all duration-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      <div className="flex items-center justify-between mb-4 action-header">
        <div className="flex items-center">
          <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="font-medium text-blue-900 action-title">{stepDetails.nextAction.title}</h3>
        </div>
      </div>
      <p className="text-blue-700 mb-6 action-description">
        {stepDetails.nextAction.description}
      </p>
      <button
        onClick={onAction}
        className="inline-flex items-center border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] action-button"
      >
        {stepDetails.nextAction.buttonText}
        <ArrowRight className="ml-2 h-4 w-4" />
      </button>
    </div>
  );
}