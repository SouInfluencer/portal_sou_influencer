import React, { useState } from 'react';
import { AlertTriangle, ArrowDown, CheckCircle, X } from 'lucide-react';

interface DowngradeFlowProps {
  onBack: () => void;
  onConfirm: () => void;
}

export function DowngradeFlow({ onBack, onConfirm }: DowngradeFlowProps) {
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async () => {
    if (!confirmed) {
      return;
    }

    setProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      onConfirm();
    } catch (error) {
      console.error('Error downgrading plan:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-100 mb-6">
          <ArrowDown className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Fazer Downgrade</h2>
        <p className="text-lg text-gray-600">
          Tem certeza que deseja fazer downgrade para o plano Starter?
        </p>
      </div>

      {/* Warning Card */}
      <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100 mb-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Importante</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p className="mb-2">Ao fazer downgrade para o plano Starter:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Você perderá acesso aos recursos premium</li>
                <li>Limite de 2 campanhas por mês</li>
                <li>Sem acesso a métricas avançadas</li>
                <li>Sem prioridade no matching de campanhas</li>
                <li>Suporte apenas por email</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Form */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Nos ajude a melhorar</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
              Por que você está fazendo downgrade?
            </label>
            <textarea
              id="reason"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="Conte-nos o motivo do downgrade..."
            />
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="confirm"
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="confirm" className="font-medium text-gray-700">
                Confirmo o downgrade
              </label>
              <p className="text-gray-500">
                Entendo que perderei acesso aos recursos premium imediatamente após o downgrade.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={!confirmed || processing}
          className="inline-flex items-center px-8 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              Processando...
            </>
          ) : (
            'Confirmar Downgrade'
          )}
        </button>
      </div>
    </div>
  );
}