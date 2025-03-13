import React, { useState } from 'react';
import { CreditCard, X } from 'lucide-react';
import type { NewCardData } from '../../../../services/paymentService';

interface PaymentMethodFormProps {
  onSubmit: (data: NewCardData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function PaymentMethodForm({ onSubmit, onCancel, loading }: PaymentMethodFormProps) {
  const [formData, setFormData] = useState<NewCardData>({
    number: '',
    expMonth: '',
    expYear: '',
    cvc: '',
    holderName: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="holderName" className="block text-sm font-medium text-gray-700">
          Nome no Cartão
        </label>
        <input
          type="text"
          id="holderName"
          name="holderName"
          value={formData.holderName}
          onChange={(e) => setFormData(prev => ({ ...prev, holderName: e.target.value }))}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="number" className="block text-sm font-medium text-gray-700">
          Número do Cartão
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CreditCard className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="number"
            name="number"
            value={formData.number}
            onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
            className="block w-full pl-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="4242 4242 4242 4242"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="expMonth" className="block text-sm font-medium text-gray-700">
            Mês
          </label>
          <input
            type="text"
            id="expMonth"
            name="expMonth"
            value={formData.expMonth}
            onChange={(e) => setFormData(prev => ({ ...prev, expMonth: e.target.value }))}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="MM"
            maxLength={2}
            required
          />
        </div>

        <div>
          <label htmlFor="expYear" className="block text-sm font-medium text-gray-700">
            Ano
          </label>
          <input
            type="text"
            id="expYear"
            name="expYear"
            value={formData.expYear}
            onChange={(e) => setFormData(prev => ({ ...prev, expYear: e.target.value }))}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="AAAA"
            maxLength={4}
            required
          />
        </div>

        <div>
          <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
            CVC
          </label>
          <input
            type="text"
            id="cvc"
            name="cvc"
            value={formData.cvc}
            onChange={(e) => setFormData(prev => ({ ...prev, cvc: e.target.value }))}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="123"
            maxLength={4}
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Salvando...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Salvar Cartão
            </>
          )}
        </button>
      </div>
    </form>
  );
}