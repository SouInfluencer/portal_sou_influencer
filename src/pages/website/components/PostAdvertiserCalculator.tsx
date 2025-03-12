
import { Calculator } from 'lucide-react';

interface PostValueCalculatorProps {
  followersCount: number | '';
}

export function PostAdvertiserCalculator({ followersCount }: PostValueCalculatorProps) {
  const calculatePostValue = (budget: number | '') => {
    if (budget === '') return '';
    const reach = Math.floor((budget / 50) * 1000); // Post no Feed = R$ 50 por 1000 impressões
    return reach.toLocaleString('pt-BR') + ' pessoas';
  };

  const calculateStoryValue = (budget: number | '') => {
    if (budget === '') return '';
    const reach = Math.floor((budget / 35) * 1000); // Story = R$ 85 por 1000 impressões (70% mais caro)
    return reach.toLocaleString('pt-BR') + ' pessoas';
  };

  const calculateReelsValue = (budget: number | '') => {
    if (budget === '') return '';
    const reach = Math.floor((budget / 125) * 1000); // Reels = R$ 125 por 1000 impressões (150% mais caro)
    return reach.toLocaleString('pt-BR') + ' pessoas';
  };


  if (followersCount === '') {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-7 h-7 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-800">Pessoas Alcançadas</h3>
          </div>
          <div className="text-center text-gray-500 py-8">
            Digite seu número de seguidores para ver os valores estimados
          </div>
        </div>
    );
  }

  return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="w-7 h-7 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-800">Pessoas Alcançadas</h3>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-white/80 backdrop-blur rounded-lg border border-blue-100">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-blue-700">Post no Feed</p>
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Valor Base</span>
            </div>
            <p className="text-2xl font-bold text-blue-800">{calculatePostValue(followersCount)}</p>
          </div>

          <div className="p-4 bg-white/80 backdrop-blur rounded-lg border border-purple-100">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-purple-700">Story</p>
              <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">-30% do post</span>
            </div>
            <p className="text-2xl font-bold text-purple-800">{calculateStoryValue(followersCount)}</p>
          </div>

          <div className="p-4 bg-white/80 backdrop-blur rounded-lg border border-indigo-100">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-indigo-700">Reels</p>
              <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">-40% do post</span>
            </div>
            <p className="text-2xl font-bold text-indigo-800">{calculateReelsValue(followersCount)}</p>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-6 text-center">
          *Os valores são estimados com base no seu alcance e engajamento.
        </p>
      </div>
  );
}