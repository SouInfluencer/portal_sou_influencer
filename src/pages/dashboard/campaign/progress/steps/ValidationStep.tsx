import React, { useState } from 'react';
import { FileCheck, CheckCircle, AlertTriangle, Star, ThumbsUp, ThumbsDown, Eye, BarChart2, Heart, MessageSquare, Globe2, TrendingUp, Award, Link as LinkIcon, ExternalLink } from 'lucide-react';
import type { Campaign } from '../../../../../types';

interface ValidationStepProps {
  campaign: Campaign;
  onNext?: () => void;
  onComplete?: () => void;
}

export function ValidationStep({ campaign, onNext, onComplete }: ValidationStepProps) {
  const [status, setStatus] = useState<'pending' | 'reviewing' | 'approved' | 'rejected'>('pending');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [requirementsStatus, setRequirementsStatus] = useState<Record<string, boolean>>(
    campaign.requirements.reduce((acc, req) => ({ ...acc, [req]: false }), {})
  );
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  const handleApprove = () => {
    const allRequirementsMet = Object.values(requirementsStatus).every(Boolean);
    if (!allRequirementsMet || rating === 0) {
      return;
    }
    setStatus('approved');
    onComplete?.('approved');
  };

  const handleReject = () => {
    if (!feedback.trim()) {
      return;
    }
    setStatus('rejected');
    setShowRejectConfirm(false);
  };

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Validação do Conteúdo</h2>
        <p className="mt-1 text-sm text-gray-500 max-w-2xl">
          Verifique se o conteúdo publicado atende aos requisitos da campanha e avalie o influenciador.
        </p>
      </div>

      {/* Post Link Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl border border-indigo-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <LinkIcon className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Link da Publicação</h3>
          </div>
          <a
            href={campaign.deliveryProof?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all duration-200"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver Publicação
          </a>
        </div>
        <div className="bg-white rounded-lg p-4 border border-indigo-100">
          <p className="text-sm text-gray-600 break-all font-mono">
            {campaign.deliveryProof?.url || 'Link não fornecido'}
          </p>
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Checklist de Requisitos</h3>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-amber-400" />
              <span className="text-sm font-medium text-gray-600">
                {Object.values(requirementsStatus).filter(Boolean).length} de {campaign.requirements.length} atendidos
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {campaign.requirements.map((requirement, index) => (
              <div key={index} className="flex items-start p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={requirementsStatus[requirement]}
                    onChange={(e) => setRequirementsStatus(prev => ({
                      ...prev,
                      [requirement]: e.target.checked
                    }))}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-medium text-gray-700">{requirement}</label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Influencer Rating */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Avaliação do Influenciador</h3>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-gray-600">
                Histórico de Entregas: 98%
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 ${
                        rating >= star ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      <Star className="h-8 w-8" />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  {rating === 0 ? 'Selecione uma nota' : `Nota ${rating} de 5`}
                </p>
              </div>
            </div>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-xl"
              placeholder="Deixe um feedback para o influenciador..."
            />
          </div>
        </div>
      </div>

      {/* Validation Status */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 flex items-center justify-center">
                <FileCheck className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Validação do Conteúdo</h2>
                <p className="text-gray-500">Avalie o conteúdo publicado</p>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100">
              <div className="flex items-center justify-between mb-2">
                <Eye className="h-5 w-5 text-indigo-600" />
                <BarChart2 className="h-4 w-4 text-indigo-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">45K</p>
              <p className="text-sm text-gray-500">Visualizações</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-pink-50 to-white border border-pink-100">
              <div className="flex items-center justify-between mb-2">
                <Heart className="h-5 w-5 text-pink-600" />
                <BarChart2 className="h-4 w-4 text-pink-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">4.8%</p>
              <p className="text-sm text-gray-500">Engajamento</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-100">
              <div className="flex items-center justify-between mb-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                <BarChart2 className="h-4 w-4 text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">156</p>
              <p className="text-sm text-gray-500">Comentários</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-white border border-green-100">
              <div className="flex items-center justify-between mb-2">
                <Globe2 className="h-5 w-5 text-green-600" />
                <BarChart2 className="h-4 w-4 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">28%</p>
              <p className="text-sm text-gray-500">Taxa de Conversão</p>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {status === 'approved' ? (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                ) : status === 'rejected' ? (
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                ) : (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
                )}
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">
                  {status === 'approved'
                    ? 'Conteúdo Aprovado'
                    : status === 'rejected'
                    ? 'Conteúdo Rejeitado'
                    : 'Em Revisão'}
                </h4>
                <p className="text-sm text-gray-500">
                  {status === 'approved'
                    ? 'O conteúdo foi aprovado e o pagamento será liberado'
                    : status === 'rejected'
                    ? 'O conteúdo precisa de ajustes'
                    : 'O anunciante está revisando o conteúdo'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => setShowRejectConfirm(true)}
          className="inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200"
        >
          <ThumbsDown className="h-5 w-5 mr-2 text-red-500" />
          Rejeitar
        </button>
        <button
          onClick={handleApprove}
          disabled={!Object.values(requirementsStatus).every(Boolean) || rating === 0}
          className="inline-flex items-center px-8 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ThumbsUp className="h-5 w-5 mr-2" />
          Aprovar
        </button>
      </div>

      {/* Reject Confirmation Modal */}
      {showRejectConfirm && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Rejeitar Conteúdo
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Por favor, forneça um feedback detalhado sobre os motivos da rejeição.
                    </p>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={4}
                      className="mt-4 shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Descreva os motivos da rejeição..."
                    />
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={!feedback.trim()}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Rejeitar
                </button>
                <button
                  type="button"
                  onClick={() => setShowRejectConfirm(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}