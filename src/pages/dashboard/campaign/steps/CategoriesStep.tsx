import React from 'react';
import { Tag, ChevronRight, Star, Check, Sparkles } from 'lucide-react';

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
  
  .categories-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-base);
  }
  
  .category-card {
    padding: var(--spacing-base);
  }
  
  .button {
    width: 100%;
    min-height: var(--min-touch-target);
    justify-content: center;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .category-card {
    padding: calc(var(--spacing-base) * 1.25);
  }
}

@media (min-width: 769px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .category-card {
    padding: calc(var(--spacing-base) * 1.5);
  }
}
`;

interface CategoriesStepProps {
  selectedCategories: string[];
  onCategoriesSelect: (categories: string[]) => void;
  onNext: () => void;
  onBack: () => void;
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

export function CategoriesStep({ selectedCategories, onCategoriesSelect, onNext, onBack }: CategoriesStepProps) {
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
          <Tag className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Selecione as Categorias</h2>
        <p className="text-lg text-gray-600">
          Escolha as categorias relevantes para sua campanha
        </p>
      </div>

      <div className="grid gap-6 categories-grid">
        <button
          onClick={() => onCategoriesSelect(['Tech', 'Lifestyle', 'Gadgets'])}
          className="group relative rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl hover:border-blue-400 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-[1.02] category-card"
        >
          <div className="absolute top-6 right-6">
            <div className="flex items-center space-x-2 text-blue-600">
              <Sparkles className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <ChevronRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg mb-6">
              <Tag className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Tecnologia</h3>
            <p className="text-gray-600 mb-6">Conteúdo focado em tecnologia e inovação</p>
            <div className="space-y-4">
              <Feature 
                title="Reviews" 
                description="Análises detalhadas de produtos"
              />
              <Feature 
                title="Tutoriais" 
                description="Guias e dicas práticas"
              />
            </div>
          </div>
        </button>

        <button
          onClick={() => onCategoriesSelect(['Fashion', 'Beauty', 'Lifestyle'])}
          className="group relative rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl hover:border-blue-400 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-[1.02] category-card"
        >
          <div className="absolute top-6 right-6">
            <div className="flex items-center space-x-2 text-blue-600">
              <Sparkles className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <ChevronRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg mb-6">
              <Tag className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Lifestyle</h3>
            <p className="text-gray-600 mb-6">Conteúdo sobre moda, beleza e estilo de vida</p>
            <div className="space-y-4">
              <Feature 
                title="Tendências" 
                description="Novidades do mundo da moda"
              />
              <Feature 
                title="Dicas" 
                description="Sugestões práticas de estilo"
              />
            </div>
          </div>
        </button>
      </div>

      <div className="flex justify-end space-x-4 mt-12">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200 min-h-[var(--min-touch-target)] button"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={selectedCategories.length === 0}
          className="inline-flex items-center px-8 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[var(--min-touch-target)] button"
        >
          Continuar
          <ChevronRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
}