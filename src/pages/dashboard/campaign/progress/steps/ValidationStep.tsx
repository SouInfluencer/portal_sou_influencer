import React, { useState } from 'react';
import { FileCheck, CheckCircle, AlertTriangle, Star, ThumbsUp, ThumbsDown, Eye, BarChart2, Heart, MessageSquare, Globe2, TrendingUp, Award, Link as LinkIcon, ExternalLink } from 'lucide-react';
import type { Campaign } from '../../../../../types';

// Add mobile-first styles
const styles = `
/* Base styles */
:root {
  --min-touch-target: clamp(2.75rem, 8vw, 3rem); /* 44-48px */
  --container-padding: clamp(1rem, 5vw, 2rem);
  --font-size-base: clamp(0.875rem, 4vw, 1rem);
  --font-size-lg: clamp(1.125rem, 5vw, 1.25rem);
  --font-size-xl: clamp(1.5rem, 6vw, 1.875rem);
  --spacing-base: clamp(1rem, 4vw, 1.5rem);
  --border-radius: clamp(0.75rem, 3vw, 1rem);
}

/* Mobile-first media queries */
@media (max-width: 480px) {
  .container {
    padding: var(--container-padding);
  }
  
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-base);
  }
  
  .requirements-list {
    flex-direction: column;
    gap: var(--spacing-base);
  }
  
  .button {
    width: 100%;
    min-height: var(--min-touch-target);
    justify-content: center;
  }
  
  .input {
    min-height: var(--min-touch-target);
  }
  
  .card {
    padding: var(--spacing-base);
    margin-bottom: var(--spacing-base);
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .card {
    padding: calc(var(--spacing-base) * 1.25);
  }
}

@media (min-width: 769px) {
  .metrics-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .card {
    padding: calc(var(--spacing-base) * 1.5);
  }
}
`;

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
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Add styles to document
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Trigger mount animation
    setMounted(true);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleApprove = () => {
    const allRequirementsMet = Object.values(requirementsStatus).every(Boolean);
    if (allRequirementsMet && rating > 0) {
      setStatus('approved');
      onComplete?.();
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 container">
      {/* Step Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Validação de Conteúdo</h2>
            <p className="mt-1 text-sm text-gray-500">
              Verifique se o conteúdo atende aos requisitos da campanha
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <FileCheck className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Aguardando validação</span>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid gap-6 mb-8 metrics-grid">
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <span className="text-xs font-medium text-blue-600">Alcance</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">12.5k</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-pink-50 to-white border border-pink-100">
            <div className="flex items-center justify-between mb-2">
              <Heart className="h-5 w-5 text-pink-600" />
              <span className="text-xs font-medium text-pink-600">Engajamento</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">3.2k</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <span className="text-xs font-medium text-blue-600">Comentários</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">245</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-white border border-green-100">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-xs font-medium text-green-600">Taxa de Conversão</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">2.8%</p>
          </div>
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="bg-white shadow rounded-lg card">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Checklist de Requisitos</h3>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-gray-600">
                {Object.values(requirementsStatus).filter(Boolean).length} de {campaign.requirements.length} atendidos
              </span>
            </div>
          </div>
          <div className="space-y-4 requirements-list">
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
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded min-h-[var(--min-touch-target)]"
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
      <div className="bg-white shadow rounded-lg card">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Avaliação do Influenciador</h3>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  <Star className="h-6 w-6" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
              Feedback
            </label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-xl min-h-[var(--min-touch-target)] input"
              placeholder="Deixe um feedback para o influenciador..."
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-4 sm:space-x-4">
        <button
          onClick={() => setShowRejectConfirm(true)}
          disabled={!feedback.trim() || rating === 0}
          className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200 min-h-[var(--min-touch-target)] button"
        >
          <ThumbsDown className="h-5 w-5 mr-2 text-red-500" />
          Rejeitar
        </button>
        <button
          onClick={handleApprove}
          disabled={!Object.values(requirementsStatus).every(Boolean) || rating === 0}
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[var(--min-touch-target)] button"
        >
          <ThumbsUp className="h-5 w-5 mr-2" />
          Aprovar
        </button>
      </div>

      {/* Reject Confirmation Modal */}
      {showRejectConfirm && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
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
                    Confirmar Rejeição
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Tem certeza que deseja rejeitar este conteúdo? Esta ação não pode ser desfeita.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => {
                    setStatus('rejected');
                    setShowRejectConfirm(false);
                    onComplete?.();
                  }}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Confirmar Rejeição
                </button>
                <button
                  type="button"
                  onClick={() => setShowRejectConfirm(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm min-h-[var(--min-touch-target)] button"
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