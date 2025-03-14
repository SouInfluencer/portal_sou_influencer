import React from 'react';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface ValidationInstructionsStepProps {
  platform: string;
  username: string;
  onNext: () => void;
  onBack: () => void;
}

export function ValidationInstructionsStep({
  platform,
  username,
  onNext,
  onBack
}: ValidationInstructionsStepProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Etapas de Validação</h2>
        <p className="mt-2 text-gray-600">
          Para validar sua conta do {platform}, siga as etapas abaixo
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 space-y-8">
        {/* Steps */}
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <span className="text-sm font-medium text-blue-600">1</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Baixar Imagem</h3>
              <p className="mt-1 text-sm text-gray-600">
                Na próxima etapa, você receberá uma imagem especial para fazer uma publicação em seu perfil.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <span className="text-sm font-medium text-blue-600">2</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Publicar no {platform}</h3>
              <p className="mt-1 text-sm text-gray-600">
                Faça uma publicação em seu perfil usando a imagem e legenda fornecidas.
              </p>
              <div className="mt-2 bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">
                  <Info className="inline-block h-4 w-4 mr-1 text-gray-400" />
                  A publicação deve ficar visível em seu perfil por pelo menos 24 horas.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <span className="text-sm font-medium text-blue-600">3</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Fornecer o Link</h3>
              <p className="mt-1 text-sm text-gray-600">
                Copie e cole o link da sua publicação para que possamos verificar.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <span className="text-sm font-medium text-blue-600">4</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Aguardar Validação</h3>
              <p className="mt-1 text-sm text-gray-600">
                Nossa equipe irá verificar sua publicação e validar sua conta em até 24 horas.
              </p>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="rounded-lg bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Importante</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Seu perfil deve estar público durante a validação</li>
                  <li>Use exatamente a imagem e legenda fornecidas</li>
                  <li>Não edite ou aplique filtros na imagem</li>
                  <li>Aguarde a validação antes de remover a publicação</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements Check */}
        <div className="rounded-lg bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Você está pronto para começar se:</h3>
              <div className="mt-2 text-sm text-green-700">
                <ul className="space-y-1">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Seu perfil está público
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Você tem permissão para fazer publicações
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Você está logado como @{username}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
          >
            Voltar
          </button>
          <button
            onClick={onNext}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}