import React from 'react';
import { AtSign, Users, ChevronRight, Star, Sparkles } from 'lucide-react';
import type { CampaignType } from '../types';

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
  
  .type-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-base);
  }
  
  .type-card {
    padding: var(--spacing-base);
  }
  
  .features-list {
    margin-top: var(--spacing-base);
  }
  
  .button {
    width: 100%;
    min-height: var(--min-touch-target);
    justify-content: center;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .type-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .type-card {
    padding: calc(var(--spacing-base) * 1.25);
  }
}

@media (min-width: 769px) {
  .type-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .type-card {
    padding: calc(var(--spacing-base) * 1.5);
  }
}
`;

interface TypeStepProps {
  onTypeSelect: (type: CampaignType) => void;
}

interface FeatureProps {
  title: string;
  description: string;
}

function Feature({ title, description }: FeatureProps) {
  return (
    <div className="flex items-center space-x-2">
      <Star className="h-4 w-4 text-amber-400" />
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}

export function TypeStep({ onTypeSelect }: TypeStepProps) {
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
    <div className="max-w-3xl mx-auto container">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 mb-6 shadow-lg transform hover:scale-105 transition-transform duration-200">
          <Users className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Escolha seu perfil</h2>
        <p className="text-lg text-gray-600">
          Escolha o perfil ideal para impulsionar sua carreira como influenciador
        </p>
      </div>

      <div className="grid gap-6 type-grid">
        {/* Influencer Card */}
        <button
          onClick={() => onTypeSelect('influencer')}
          className="group relative rounded-2xl border-2 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-[1.02] touch-manipulation type-card min-h-[var(--min-touch-target)]"
        >
          <div className="absolute top-6 right-6">
            <div className="flex items-center space-x-2 text-blue-600">
              <Sparkles className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <ChevronRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg mb-6">
              <AtSign className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Sou Influenciador</h3>
            <p className="text-gray-600 mb-6">Quero me conectar com marcas e gerenciar campanhas</p>
            <div className="space-y-4 features-list">
              <Feature 
                title="Match Inteligente" 
                description="Encontre as marcas ideais para seu perfil"
              />
              <Feature 
                title="Gestão Completa" 
                description="Gerencie todas suas campanhas em um só lugar"
              />
            </div>
          </div>
        </button>

        {/* Advertiser Card */}
        <button
          onClick={() => onTypeSelect('advertiser')}
          className="group relative rounded-2xl border-2 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-[1.02] touch-manipulation type-card min-h-[var(--min-touch-target)]"
        >
          <div className="absolute top-6 right-6">
            <div className="flex items-center space-x-2 text-blue-600">
              <Sparkles className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <ChevronRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg mb-6">
              <Users className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Sou Anunciante</h3>
            <p className="text-gray-600 mb-6">Busco influenciadores para promover minha marca</p>
            <div className="space-y-4 features-list">
              <Feature 
                title="Alcance Direcionado" 
                description="Encontre influenciadores alinhados com sua marca"
              />
              <Feature 
                title="Resultados Mensuráveis" 
                description="Acompanhe métricas e ROI em tempo real"
              />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}