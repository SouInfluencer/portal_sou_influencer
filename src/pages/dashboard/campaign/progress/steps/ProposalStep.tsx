import React from 'react';
import { CheckCircle, ThumbsUp, ThumbsDown, AlertTriangle, Calendar, DollarSign, Hash, TrendingUp, Users, Globe2, Target, Clock, Shield, Star, Award, Heart, MessageSquare, Share2, Image as ImageIcon, Video, Download, Copy, AtSign } from 'lucide-react';
import type { Campaign } from '../../../../../types';

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
  
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
  
  .campaign-header {
    flex-direction: column;
    gap: var(--spacing-base);
  }
  
  .campaign-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .button {
    width: 100%;
    min-height: var(--min-touch-target);
    justify-content: center;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .campaign-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 769px) {
  .grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .campaign-stats {
    grid-template-columns: repeat(3, 1fr);
  }
}
`;

interface ProposalStepProps {
  campaign: Campaign;
  onAcceptProposal?: () => void;
  onRejectProposal?: () => void;
}

export function ProposalStep({ campaign, onAcceptProposal, onRejectProposal }: ProposalStepProps) {
  const [showRejectConfirm, setShowRejectConfirm] = React.useState(false);
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
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 container">
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-blue-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Atenção</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Revise cuidadosamente os detalhes da proposta antes de aceitar.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-4 sm:space-x-4">
        <button
          onClick={() => setShowRejectConfirm(true)}
          className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 min-h-[var(--min-touch-target)] button"
        >
          <ThumbsDown className="h-5 w-5 mr-2 text-red-500" />
          Recusar Proposta
        </button>
        <button
          onClick={onAcceptProposal}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 min-h-[var(--min-touch-target)] button"
        >
          <ThumbsUp className="h-5 w-5 mr-2" />
          Aceitar Proposta
        </button>
      </div>
    </div>
  );
}