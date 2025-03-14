import React, { useState, useEffect } from 'react';
import { Tag, ChevronRight, Star, Check, Sparkles, AlertTriangle } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { toast } from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

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

export function CategoriesStep({
  selectedCategories,
  onCategoriesSelect,
  onNext,
  onBack
}: CategoriesStepProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    fetchCategories();
    setMounted(true);
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;

      setCategories(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Erro ao carregar categorias');
      toast.error('Erro ao carregar categorias');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (category: Category) => {
    const newSelection = selectedCategories.includes(category.name)
      ? selectedCategories.filter(c => c !== category.name)
      : [...selectedCategories, category.name];
    
    onCategoriesSelect(newSelection);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar categorias</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={fetchCategories}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 mb-6 shadow-lg transform hover:scale-105 transition-transform duration-200">
          <Tag className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Selecione as Categorias</h2>
        <p className="text-lg text-gray-600">
          Escolha as categorias relevantes para sua campanha
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategorySelect(category)}
            className={`group relative rounded-2xl border ${
              selectedCategories.includes(category.name)
                ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50/50'
                : 'border-gray-200 hover:border-blue-300'
            } p-6 cursor-pointer transition-all duration-300 transform hover:scale-[1.02]`}
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
              <p className="text-gray-600 mb-6">{category.description}</p>
              <div className="space-y-4">
                <Feature 
                  title="Alcance Direcionado" 
                  description="Encontre seu público-alvo ideal"
                />
                <Feature 
                  title="Métricas Específicas" 
                  description="Acompanhe resultados da categoria"
                />
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-end space-x-4 mt-12">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={selectedCategories.length === 0}
          className="inline-flex items-center px-8 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          Continuar
          <ChevronRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
}