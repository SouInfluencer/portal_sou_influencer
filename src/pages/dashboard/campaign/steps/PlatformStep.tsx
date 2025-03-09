import React from 'react';
import { Instagram, Youtube, Video, Check } from 'lucide-react';
import type { Platform, ContentType } from '../types';
import { contentTypes } from '../constants';

interface PlatformStepProps {
  selectedPlatform: Platform;
  selectedContentType: ContentType;
  onPlatformSelect: (platform: Platform) => void;
  onContentTypeSelect: (type: ContentType) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PlatformStep({
  selectedPlatform,
  selectedContentType,
  onPlatformSelect,
  onContentTypeSelect,
  onNext,
  onBack
}: PlatformStepProps) {
  const platforms = [
    { id: 'Instagram', icon: Instagram },
    { id: 'YouTube', icon: Youtube },
    { id: 'TikTok', icon: Video }
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Plataforma e Tipo de Conteúdo</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plataforma
          </label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => onPlatformSelect(platform.id as Platform)}
                className={`${
                  selectedPlatform === platform.id
                    ? 'border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50/50'
                    : 'border-gray-300'
                } relative rounded-xl border bg-white px-6 py-6 shadow-sm hover:shadow-lg flex items-center hover:border-indigo-400 focus:outline-none transition-all duration-200 transform hover:scale-[1.02]`}
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <platform.icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <span className="ml-4 text-lg font-medium text-gray-900">{platform.id}</span>
                </div>
                {selectedPlatform === platform.id && (
                  <Check className="h-6 w-6 text-indigo-600 absolute top-4 right-4" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Conteúdo
            <span className="ml-2 text-sm text-gray-500">
              {selectedPlatform ? `Opções para ${selectedPlatform}` : 'Selecione uma plataforma primeiro'}
            </span>
          </label>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {contentTypes
              .filter(type => type.platforms.includes(selectedPlatform))
              .map((type) => (
                <button
                  key={type.id}
                  onClick={() => onContentTypeSelect(type.id)}
                  className={`${
                    selectedContentType === type.id
                      ? 'border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50/50'
                      : 'border-gray-300'
                  } relative rounded-xl border bg-white p-4 shadow-sm hover:shadow-lg hover:border-indigo-400 focus:outline-none transition-all duration-200`}
                >
                  <div className="flex flex-col items-start">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                      <type.icon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <span className="mt-3 text-base font-medium text-gray-900">{type.label}</span>
                    <p className="mt-1 text-sm text-gray-500">{type.description}</p>
                  </div>
                  {selectedContentType === type.id && (
                    <Check className="h-5 w-5 text-indigo-600 absolute top-3 right-3" />
                  )}
                </button>
              ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!selectedPlatform || !selectedContentType}
            className="px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}