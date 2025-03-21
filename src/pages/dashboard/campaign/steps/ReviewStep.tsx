import React from 'react';
import { Check, ChevronRight, DollarSign, Calendar, Hash, Image as ImageIcon, Users, MapPin, Star, Info, AlertCircle } from 'lucide-react';
import type { CampaignForm } from '../types';
import { formatCurrency } from '../utils';

interface ReviewStepProps {
  formData: CampaignForm;
  onBack: () => void;
  onSubmit: () => void;
}

export function ReviewStep({ formData, onBack, onSubmit }: ReviewStepProps) {
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = () => {
    // Remove budget validation since it's handled by the service
    setError(null);
    onSubmit();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 mb-6 shadow-lg">
          <Check className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Revisar e Criar Campanha</h2>
        <p className="text-lg text-gray-600">
          Confira todos os detalhes da sua campanha antes de criar
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 rounded-xl border border-red-200">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* Campaign Type and Budget */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Informações Gerais</h3>
          </div>
          <div className="px-6 py-5">
            <dl className="grid gap-x-4 gap-y-6 grid-cols-1 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Tipo de Campanha</dt>
                <dd className="mt-1 text-lg text-gray-900 capitalize">
                  {formData.type === 'single' ? 'Influenciador Específico' : 'Múltiplos Influenciadores'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Orçamento Total</dt>
                <dd className="mt-1 text-lg text-gray-900">
                  {formatCurrency(formData.budget)}
                </dd>
              </div>
              {formData.type === 'multiple' && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Categorias</dt>
                  <dd className="mt-1">
                    <div className="flex flex-wrap gap-2">
                      {formData.categories.map((category) => (
                        <span
                          key={category}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Platform and Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Detalhes do Conteúdo</h3>
          </div>
          <div className="px-6 py-5">
            <dl className="grid gap-x-4 gap-y-6 grid-cols-1 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Plataforma</dt>
                <dd className="mt-1 text-lg text-gray-900">{formData.platform}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Tipo de Conteúdo</dt>
                <dd className="mt-1 text-lg text-gray-900">{formData.contentType}</dd>
              </div>
              {formData.content && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Legenda</dt>
                  <dd className="mt-1">
                    <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
                      {formData.content.caption}
                    </div>
                    {formData.content.hashtags && formData.content.hashtags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.content.hashtags.map((hashtag) => (
                          <span
                            key={hashtag}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                          >
                            {hashtag}
                          </span>
                        ))}
                      </div>
                    )}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Influencer Details */}
        {formData.type === 'single' && formData.influencer && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">Influenciador Selecionado</h3>
            </div>
            <div className="px-6 py-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <img
                  src={formData.influencer.avatar}
                  alt={formData.influencer.name}
                  className="h-16 w-16 rounded-full ring-4 ring-white shadow-lg"
                />
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{formData.influencer.name}</h4>
                  <div className="flex items-center mt-1 space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {formData.influencer.followers.toLocaleString()} seguidores
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {formData.influencer.location}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.influencer.niche.map((category) => (
                      <span
                        key={category}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 sm:gap-3 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200"
          >
            Voltar e Editar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center px-8 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Criar Campanha
            <ChevronRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}