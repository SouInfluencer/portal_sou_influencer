import React from 'react';
import { AtSign } from 'lucide-react';

interface UsernameStepProps {
  platform: string;
  username: string;
  onUsernameChange: (username: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function UsernameStep({
  platform,
  username,
  onUsernameChange,
  onNext,
  onBack
}: UsernameStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onNext();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Conectar {platform}</h2>
        <p className="mt-2 text-gray-600">
          Informe seu nome de usuário para iniciar a validação
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Nome de usuário
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AtSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="username"
                id="username"
                value={username}
                onChange={(e) => onUsernameChange(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-400"
                placeholder={`Seu usuário do ${platform}`}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
            >
              Voltar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              Continuar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}