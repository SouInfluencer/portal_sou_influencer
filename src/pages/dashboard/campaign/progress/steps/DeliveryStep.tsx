import React, { useState } from 'react';
import { Link as LinkIcon, AlertTriangle, Info, X } from 'lucide-react';
import type { Campaign } from '../../../../../types';

interface DeliveryStepProps {
  campaign: Campaign;
  onNext?: () => void;
  onComplete?: () => void;
}

export function DeliveryStep({ campaign, onNext, onComplete }: DeliveryStepProps) {
  const [postUrl, setPostUrl] = useState('');
  const [showError, setShowError] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [requirementsStatus, setRequirementsStatus] = useState<Record<string, boolean>>(
    campaign.requirements.reduce((acc, req) => ({
      ...acc,
      [req]: false
    }), {})
  );

  const handleSubmit = (e: React.FormEvent) => {
    // e.preventDefault();
    // const allRequirementsMet = Object.values(requirementsStatus).every(status => status.checked);
    
    // if (!postUrl || !allRequirementsMet) {
    //   setShowError(true);
    //   return;
    // }
    
    // Call both onComplete and onNext to proceed to the next step
    onComplete?.('delivered');
    onNext?.();
  };

  const getPlatformInstructions = () => {
    switch (campaign.platform) {
      case 'Instagram':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Como encontrar o link do post no Instagram</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">1. Abra o Instagram no seu celular</p>
              <p className="text-sm text-gray-600">2. Vá até a publicação que você deseja compartilhar</p>
              <p className="text-sm text-gray-600">3. Toque nos três pontos (...) no canto superior direito da publicação</p>
              <p className="text-sm text-gray-600">4. Selecione "Copiar link"</p>
              <p className="text-sm text-gray-600">5. Cole o link aqui</p>
            </div>
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3 flex-1">
                  <h4 className="text-sm font-medium text-yellow-800">Importante</h4>
                  <p className="mt-2 text-sm text-yellow-700">Certifique-se de que:</p>
                  <ul className="list-disc ml-4 mt-2 space-y-1 text-sm text-yellow-700">
                    <li>A publicação está pública</li>
                    <li>O link começa com "instagram.com/p/" ou "instagram.com/reel/"</li>
                    <li>Você está usando o perfil correto para a publicação</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      case 'YouTube':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Como encontrar o link do vídeo no YouTube</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">1. Abra o YouTube e vá até o seu vídeo</p>
              <p className="text-sm text-gray-600">2. Clique no botão "Compartilhar" abaixo do vídeo</p>
              <p className="text-sm text-gray-600">3. Copie o link que aparece na janela de compartilhamento</p>
              <p className="text-sm text-gray-600">4. Cole o link aqui</p>
            </div>
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3 flex-1">
                  <h4 className="text-sm font-medium text-yellow-800">Importante</h4>
                  <p className="mt-2 text-sm text-yellow-700">Certifique-se de que:</p>
                  <ul className="list-disc ml-4 mt-2 space-y-1 text-sm text-yellow-700">
                    <li>O vídeo está público ou não listado</li>
                    <li>O link começa com "youtube.com/watch?v="</li>
                    <li>Você está usando o canal correto para a publicação</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      case 'TikTok':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Como encontrar o link do vídeo no TikTok</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">1. Abra o TikTok no seu celular</p>
              <p className="text-sm text-gray-600">2. Vá até o vídeo que você deseja compartilhar</p>
              <p className="text-sm text-gray-600">3. Toque no botão "Compartilhar" (ícone de seta)</p>
              <p className="text-sm text-gray-600">4. Selecione "Copiar link"</p>
              <p className="text-sm text-gray-600">5. Cole o link aqui</p>
            </div>
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3 flex-1">
                  <h4 className="text-sm font-medium text-yellow-800">Importante</h4>
                  <p className="mt-2 text-sm text-yellow-700">Certifique-se de que:</p>
                  <ul className="list-disc ml-4 mt-2 space-y-1 text-sm text-yellow-700">
                    <li>O vídeo está público</li>
                    <li>O link começa com "tiktok.com/@"</li>
                    <li>Você está usando o perfil correto para a publicação</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {showError && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Erro na Entrega
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Por favor, verifique:</p>
                <ul className="list-disc ml-5 mt-1">
                  {!postUrl && <li>Forneça o link da publicação</li>}
                  {!Object.values(requirementsStatus).every(Boolean) && (
                    <li>Confirme todos os requisitos antes de prosseguir</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post URL Section */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Link da Publicação</h3>
            <button
              onClick={() => setShowHelpModal(true)}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition-colors duration-200"
            >
              <Info className="h-4 w-4 mr-1.5" />
              Como encontrar o link?
            </button>
          </div>
          
          <div className="mt-5">
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="url"
                value={postUrl}
                onChange={(e) => {
                  setPostUrl(e.target.value);
                  setShowError(false);
                }}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder={`https://${campaign.platform.toLowerCase()}.com/...`}
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Cole o link direto da publicação na plataforma {campaign.platform}
            </p>
          </div>
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">Checklist de Requisitos</h3>
          <p className="mt-1 text-sm text-gray-500">
            Confirme cada item antes de enviar o link da publicação
          </p>
          <div className="mt-5">
            <div className="space-y-4">
              {campaign.requirements.map((requirement, index) => (
                <div key={index} className="relative flex items-start py-4">
                  <div className="min-w-0 flex-1 text-sm">
                    <div className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        checked={requirementsStatus[requirement]}
                        onChange={(e) => {
                          setRequirementsStatus(prev => ({
                            ...prev,
                            [requirement]: e.target.checked
                          }));
                          setShowError(false);
                        }}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label className="ml-3 font-medium text-gray-700">{requirement}</label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleSubmit}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <LinkIcon className="h-5 w-5 mr-2" />
          Enviar Link
        </button>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {getPlatformInstructions()}
              
              <div className="mt-6">
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                >
                  Entendi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}