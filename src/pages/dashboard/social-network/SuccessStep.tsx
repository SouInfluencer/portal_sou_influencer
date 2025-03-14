import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

interface SuccessStepProps {
  platform: string;
  username: string;
  onFinish: () => void;
}

export function SuccessStep({
  platform,
  username,
  onFinish
}: SuccessStepProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
          <Clock className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Solicitação Enviada!
        </h2>
        <p className="text-gray-600 mb-8">
          Sua solicitação para conectar a conta {platform} (@{username}) foi enviada com sucesso.
          Nossa equipe irá verificar a publicação e validar sua conta em até 24 horas.
        </p>

        <div className="bg-blue-50 rounded-xl p-6 mb-8 max-w-md mx-auto">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Próximos Passos:</h3>
          <ul className="text-sm text-blue-700 space-y-2">
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-blue-500" />
              Mantenha a publicação de verificação ativa
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-blue-500" />
              Aguarde a validação da nossa equipe
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-blue-500" />
              Você receberá uma notificação quando a validação for concluída
            </li>
          </ul>
        </div>

        <button
          onClick={onFinish}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Voltar para Redes Sociais
        </button>
      </div>
    </div>
  );
}