import React from 'react';
import { Users, BarChart2, MapPin, ChevronRight } from 'lucide-react';
import type { Influencer } from '../types';

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
  .influencer-card {
    padding: var(--container-padding);
    margin-bottom: var(--spacing-base);
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-base);
  }
  
  .avatar {
    width: 4rem;
    height: 4rem;
  }
  
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-base);
  }
  
  .categories-list {
    flex-wrap: wrap;
    gap: calc(var(--spacing-base) * 0.5);
  }
  
  .action-button {
    width: 100%;
    min-height: var(--min-touch-target);
    justify-content: center;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .influencer-card {
    padding: calc(var(--spacing-base) * 1.25);
  }
  
  .avatar {
    width: 4.5rem;
    height: 4.5rem;
  }
  
  .metrics-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 769px) {
  .influencer-card {
    padding: calc(var(--spacing-base) * 1.5);
  }
  
  .avatar {
    width: 5rem;
    height: 5rem;
  }
  
  .metrics-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
`;

interface InfluencerCardProps {
  influencer: Influencer;
  onClick: () => void;
}

export function InfluencerCard({ influencer, onClick }: InfluencerCardProps) {
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
    <button
      onClick={onClick}
      className={`relative rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-lg hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] influencer-card ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 card-header">
        <div className="flex-shrink-0">
        <img 
          src={influencer.avatar}
          alt={influencer.name}
          className="rounded-full ring-4 ring-white shadow-lg avatar"
        />
        </div>
        <div className="flex-1 min-w-0">
          <div className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <p className="text-lg font-semibold text-gray-900">{influencer.name}</p>
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                influencer.platform === 'Instagram' ? 'bg-pink-100 text-pink-800' :
                influencer.platform === 'YouTube' ? 'bg-red-100 text-red-800' :
                'bg-black bg-opacity-10 text-gray-900'
              }`}>
                {influencer.platform}
              </div>
            </div>
            <div className="grid gap-4 text-sm text-gray-600 metrics-grid">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {influencer.followers.toLocaleString()} seguidores
              </div>
              <div className="flex items-center">
                <BarChart2 className="h-4 w-4 mr-1" />
                {influencer.engagement}% eng.
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {influencer.location}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 categories-list">
              {influencer.categories.map(category => (
                <span
                  key={category}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
        <ChevronRight className="h-6 w-6 text-blue-400 hidden sm:block" />
      </div>
    </button>
  );
}