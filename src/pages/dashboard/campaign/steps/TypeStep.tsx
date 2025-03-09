import React from 'react';
import { AtSign, Users, ChevronRight, Star, Sparkles } from 'lucide-react';
import type { CampaignType } from '../types';

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
  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <button
          onClick={() => onTypeSelect('single')}
          className="group relative rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-8 shadow-lg hover:shadow-xl hover:border-indigo-400 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-[1.02]"
        >
          <div className="absolute top-6 right-6">
            <div className="flex items-center space-x-2 text-indigo-600">
              <Sparkles className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <ChevronRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg mb-6">
              <AtSign className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Influenciador Específico</h3>
            <p className="text-gray-600 mb-6">Escolha um influenciador específico para sua campanha</p>
            <div className="space-y-4">
              <Feature 
                title="Controle Total" 
                description="Escolha exatamente quem irá promover sua marca"
              />
              <Feature 
                title="Negociação Direta" 
                description="Comunique-se diretamente com o influenciador"
              />
            </div>
          </div>
        </button>

        <button
          onClick={() => onTypeSelect('multiple')}
          className="group relative rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-8 shadow-lg hover:shadow-xl hover:border-indigo-400 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-[1.02]"
        >
          <div className="absolute top-6 right-6">
            <div className="flex items-center space-x-2 text-indigo-600">
              <Sparkles className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <ChevronRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg mb-6">
              <Users className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Múltiplos Influenciadores</h3>
            <p className="text-gray-600 mb-6">Abra sua campanha para vários criadores de conteúdo</p>
            <div className="space-y-4">
              <Feature 
                title="Maior Alcance" 
                description="Atinja diferentes públicos e nichos"
              />
              <Feature 
                title="Melhor Custo-Benefício" 
                description="Otimize seu orçamento com múltiplos criadores"
              />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}