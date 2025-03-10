import React from 'react';
import { Instagram, Youtube, Video, Check } from 'lucide-react';
import type { Platform, ContentType } from '../types';
import { contentTypes } from '../constants';

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
  
  .platform-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-base);
  }
  
  .content-type-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-base);
  }
  
  .platform-card {
    padding: var(--spacing-base);
  }
  
  .content-type-card {
    padding: var(--spacing-base);
  }
  
  .button {
    width: 100%;
    min-height: var(--min-touch-target);
    justify-content: center;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .platform-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .content-type-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .platform-card {
    padding: calc(var(--spacing-base) * 1.25);
  }
  
  .content-type-card {
    padding: calc(var(--spacing-base) * 1.25);
  }
}

@media (min-width: 769px) {
  .platform-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .content-type-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .platform-card {
    padding: calc(var(--spacing-base) * 1.5);
  }
  
  .content-type-card {
    padding: calc(var(--spacing-base) * 1.5);
  }
}
`;

interface PlatformStepProps {
  selectedPlatform: Platform;
  selectedContentType: ContentType;
  onPlatformSelect: (platform: Platform) => void;
  onContentTypeSelect: (type: ContentType) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PlatformStep({
  selectedPlatform,
  selectedContentType,
  onPlatformSelect,
  onContentTypeSelect,
  onNext,
  onBack
}: PlatformStepProps) {
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

  const platforms = [
    { id: 'Instagram', icon: Instagram },
    { id: 'YouTube', icon: Youtube },
    { id: 'TikTok', icon: Video }
  ];

  return (
    <div className="max-w-3xl mx-auto container">
      <h2 className={`text-lg font-medium text-gray-900 mb-6 transition-all duration-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        Plataforma e Tipo de Conteúdo
      </h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plataforma
          </label>
          <div className="grid gap-4 platform-grid">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => onPlatformSelect(platform.id as Platform)}
                className={`platform-card ${
                  selectedPlatform === platform.id
                    ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50/50'
                    : 'border-gray-300'
                } relative rounded-xl border bg-white shadow-sm hover:shadow-lg flex items-center hover:border-blue-400 focus:outline-none transition-all duration-200 transform hover:scale-[1.02] min-h-[var(--min-touch-target)]`}
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                    <platform.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="ml-4 text-lg font-medium text-gray-900">{platform.id}</span>
                </div>
                {selectedPlatform === platform.id && (
                  <Check className="h-6 w-6 text-blue-600 absolute top-4 right-4" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Conteúdo
            <span className="ml-2 text-sm text-gray-500">
              {selectedPlatform ? `Opções para ${selectedPlatform}` : 'Selecione uma plataforma primeiro'}
            </span>
          </label>
          <div className="grid gap-4 content-type-grid">
            {contentTypes
              .filter(type => type.platforms.includes(selectedPlatform))
              .map((type) => (
                <button
                  key={type.id}
                  onClick={() => onContentTypeSelect(type.id)}
                  className={`content-type-card ${
                    selectedContentType === type.id
                      ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50/50'
                      : 'border-gray-300'
                  } relative rounded-xl border bg-white shadow-sm hover:shadow-lg hover:border-blue-400 focus:outline-none transition-all duration-200 min-h-[var(--min-touch-target)]`}
                >
                  <div className="flex flex-col items-start">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <type.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="mt-3 text-base font-medium text-gray-900">{type.label}</span>
                    <p className="mt-1 text-sm text-gray-500">{type.description}</p>
                  </div>
                  {selectedContentType === type.id && (
                    <Check className="h-5 w-5 text-blue-600 absolute top-3 right-3" />
                  )}
                </button>
              ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-4 sm:gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200 min-h-[var(--min-touch-target)] button"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!selectedPlatform || !selectedContentType}
            className="px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[var(--min-touch-target)] button"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}