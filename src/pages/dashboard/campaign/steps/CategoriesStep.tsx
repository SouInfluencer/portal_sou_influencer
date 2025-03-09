import React from 'react';
import { Tag, ChevronRight, Star, Check, Sparkles } from 'lucide-react';

interface CategoriesStepProps {
  selectedCategories: string[];
  onCategoriesSelect: (categories: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const categories = [
  {
    name: 'Tecnologia',
    subcategories: ['Gadgets', 'Apps', 'Games', 'Hardware', 'Software']
  },
  {
    name: 'Lifestyle',
    subcategories: ['Moda', 'Beleza', 'Fitness', 'Viagens', 'Gastronomia']
  },
  {
    name: 'Entretenimento',
    subcategories: ['Música', 'Cinema', 'TV', 'Literatura', 'Arte']
  },
  {
    name: 'Educação',
    subcategories: ['Cursos', 'Idiomas', 'Carreira', 'Desenvolvimento Pessoal']
  },
  {
    name: 'Negócios',
    subcategories: ['Empreendedorismo', 'Marketing', 'Finanças', 'Startups']
  }
];

export function CategoriesStep({ selectedCategories, onCategoriesSelect, onNext, onBack }: CategoriesStepProps) {
  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    onCategoriesSelect(newCategories);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 mb-6 shadow-lg transform hover:scale-105 transition-transform duration-200">
          <Tag className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Selecione as Categorias</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Escolha as categorias relevantes para sua campanha. Isso nos ajudará a encontrar os influenciadores mais adequados.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((category) => (
          <div key={category.name} className="relative">
            <button
              onClick={() => handleCategoryToggle(category.name)}
              className={`group w-full text-left p-8 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                selectedCategories.includes(category.name)
                  ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-white shadow-xl'
                  : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedCategories.includes(category.name)
                      ? 'bg-indigo-100'
                      : 'bg-gray-100 group-hover:bg-indigo-50'
                  } transition-colors duration-200`}>
                    <Sparkles className={`h-5 w-5 ${
                      selectedCategories.includes(category.name)
                        ? 'text-indigo-600'
                        : 'text-gray-500 group-hover:text-indigo-500'
                    } transition-colors duration-200`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                </div>
                {selectedCategories.includes(category.name) && (
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-amber-400" />
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {category.subcategories.map((sub) => (
                  <span
                    key={sub}
                    className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedCategories.includes(category.name)
                        ? 'bg-indigo-100 text-indigo-800 shadow-sm'
                        : 'bg-gray-100/80 text-gray-700 group-hover:bg-gray-200/80'
                    }`}
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-4 mt-12">
        <button
          type="button"
          onClick={onBack}
          className="px-8 py-3 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={selectedCategories.length === 0}
          className="inline-flex items-center px-8 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          Continuar
          <ChevronRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
}