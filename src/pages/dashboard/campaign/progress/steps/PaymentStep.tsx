import React from 'react';
import { CreditCard, CheckCircle, Clock, AlertTriangle, DollarSign, Shield, TrendingUp, BarChart2, Award, Star } from 'lucide-react';
import type { Campaign } from '../../../../../types';

interface PaymentStepProps {
  campaign: Campaign;
  onNext?: () => void;
  onComplete?: () => void;
}

export function PaymentStep({ campaign, onNext, onComplete }: PaymentStepProps) {
  const [status, setStatus] = React.useState<'processing' | 'completed'>('processing');

  React.useEffect(() => {
    // Simulate payment processing
    if (status === 'processing') {
      const timer = setTimeout(() => {
        setStatus('completed');
        onComplete?.('completed');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-50 to-white border border-green-100 flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Pagamento</h2>
              <p className="text-gray-500">Acompanhe o status do seu pagamento</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-indigo-600" />
            <span className="text-sm font-medium text-gray-600">Pagamento Seguro</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-5 w-5 text-indigo-600" />
              <BarChart2 className="h-4 w-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">R$ {campaign.budget.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Valor Total</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-white border border-green-100">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <BarChart2 className="h-4 w-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">3.8x</p>
            <p className="text-sm text-gray-500">ROI Estimado</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-white border border-amber-100">
            <div className="flex items-center justify-between mb-2">
              <Star className="h-5 w-5 text-amber-600" />
              <BarChart2 className="h-4 w-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">4.9</p>
            <p className="text-sm text-gray-500">Avaliação</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <Award className="h-5 w-5 text-purple-600" />
              <BarChart2 className="h-4 w-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">98%</p>
            <p className="text-sm text-gray-500">Taxa de Sucesso</p>
          </div>
        </div>
      </div>

      {/* Payment Status */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Status do Pagamento</h3>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">Atualizado há 5 minutos</span>
            </div>
          </div>
          <div className="mt-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {status === 'completed' ? (
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" />
                  </div>
                )}
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-lg font-medium text-gray-900">
                  {status === 'completed' ? 'Pagamento Concluído' : 'Processando Pagamento'}
                </h4>
                <p className="text-sm text-gray-500">
                  {status === 'completed'
                    ? 'O pagamento foi processado e será depositado em sua conta'
                    : 'O pagamento está sendo processado'}
                </p>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: status === 'completed' ? '100%' : '60%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Detalhes do Pagamento</h3>
          <div className="mt-5">
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Valor Bruto</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      R$ {campaign.budget.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Taxa da Plataforma</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      R$ {(campaign.budget * 0.1).toLocaleString()}
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Valor Líquido</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      R$ {(campaign.budget * 0.9).toLocaleString()}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
    </div>
  );
}