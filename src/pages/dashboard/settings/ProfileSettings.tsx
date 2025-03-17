import React from 'react';
import { Camera, User, AtSign, Phone, Globe2, Info, Check, Building2, Home, Ban as Bank, CreditCard } from 'lucide-react';
import type { ProfileSettingsProps } from './types.ts';

export const ProfileSettings = React.memo(function ProfileSettings({
  formData,
  formErrors,
  onInputChange,
  onSubmit,
  formSuccess,
  activeTab = 'personal'
}: ProfileSettingsProps) {

  const renderPersonalFields = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            Nome
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={onInputChange}
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                formErrors.firstName
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
            />
          </div>
          {formErrors.firstName && (
            <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Sobrenome
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={onInputChange}
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                formErrors.lastName
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
            />
          </div>
          {formErrors.lastName && (
            <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
          )}
        </div>

        <div>
          <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
            CPF
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={(e) => {
                // Format CPF as user types (###.###.###-##)
                const value = e.target.value.replace(/\D/g, '');
                const formattedValue = value
                  .replace(/(\d{3})(\d)/, '$1.$2')
                  .replace(/(\d{3})(\d)/, '$1.$2')
                  .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
                  .slice(0, 14);
                
                const event = {
                  ...e,
                  target: {
                    ...e.target,
                    name: 'cpf',
                    value: formattedValue
                  }
                };
                onInputChange(event);
              }}
              maxLength={14}
              placeholder="000.000.000-00"
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                formErrors.cpf
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
            />
          </div>
          {formErrors.cpf && (
            <p className="mt-1 text-sm text-red-600">{formErrors.cpf}</p>
          )}
        </div>

        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
            Data de Nascimento
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={onInputChange}
              max={new Date().toISOString().split('T')[0]} // Prevents future dates
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                formErrors.birthDate
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
            />
          </div>
          {formErrors.birthDate && (
            <p className="mt-1 text-sm text-red-600">{formErrors.birthDate}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <AtSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                formErrors.email
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
            />
          </div>
          {formErrors.email && (
            <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Telefone
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={(e) => {
                // Format phone number as user types ((##) #####-####)
                const value = e.target.value.replace(/\D/g, '');
                const formattedValue = value
                  .replace(/^(\d{2})(\d)/g, '($1) $2')
                  .replace(/(\d)(\d{4})$/, '$1-$2')
                  .slice(0, 15);
                
                const event = {
                  ...e,
                  target: {
                    ...e.target,
                    name: 'phone',
                    value: formattedValue
                  }
                };
                onInputChange(event);
              }}
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                formErrors.phone
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              placeholder="(00) 00000-0000"
              maxLength={15}
            />
          </div>
          {formErrors.phone && (
            <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <div className="mt-1">
            <textarea
              id="bio"
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={onInputChange}
              className={`block w-full px-3 py-2 border rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                formErrors.bio
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
            />
          </div>
          {formErrors.bio && (
            <p className="mt-1 text-sm text-red-600">{formErrors.bio}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderAddressFields = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="cep" className="block text-sm font-medium text-gray-700">
            CEP
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Home className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="cep"
              name="cep"
              value={formData.cep}
              onChange={onInputChange}
              maxLength={9}
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                formErrors.cep
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              placeholder="00000-000"
            />
          </div>
          {formErrors.cep && (
            <p className="mt-1 text-sm text-red-600">{formErrors.cep}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="street" className="block text-sm font-medium text-gray-700">
            Rua
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={onInputChange}
              className={`block w-full px-3 py-2 border rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                formErrors.street
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
            />
          </div>
          {formErrors.street && (
            <p className="mt-1 text-sm text-red-600">{formErrors.street}</p>
          )}
        </div>

        <div>
          <label htmlFor="number" className="block text-sm font-medium text-gray-700">
            Número
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="number"
              name="number"
              value={formData.number}
              onChange={onInputChange}
              className={`block w-full px-3 py-2 border rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                formErrors.number
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
            />
          </div>
          {formErrors.number && (
            <p className="mt-1 text-sm text-red-600">{formErrors.number}</p>
          )}
        </div>

        <div>
          <label htmlFor="complement" className="block text-sm font-medium text-gray-700">
            Complemento
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="complement"
              name="complement"
              value={formData.complement}
              onChange={onInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700">
            Bairro
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="neighborhood"
              name="neighborhood"
              value={formData.neighborhood}
              onChange={onInputChange}
              className={`block w-full px-3 py-2 border rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                formErrors.neighborhood
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
            />
          </div>
          {formErrors.neighborhood && (
            <p className="mt-1 text-sm text-red-600">{formErrors.neighborhood}</p>
          )}
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            Cidade
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={onInputChange}
              className={`block w-full px-3 py-2 border rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                formErrors.city
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
            />
          </div>
          {formErrors.city && (
            <p className="mt-1 text-sm text-red-600">{formErrors.city}</p>
          )}
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            Estado
          </label>
          <div className="mt-1">
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={onInputChange}
              className={`block w-full px-3 py-2 border rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                formErrors.state
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
            >
              <option value="">Selecione...</option>
              {[
                'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
                'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
              ].map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
          {formErrors.state && (
            <p className="mt-1 text-sm text-red-600">{formErrors.state}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderBankFields = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Bank */}
        <div className="sm:col-span-2">
          <label htmlFor="bank" className="block text-sm font-medium text-gray-700">
            Banco
          </label>
          <div className="mt-1">
            <select
              id="bank"
              name="bank"
              value={formData.bank}
              onChange={onInputChange}
              className={`block w-full px-3 py-2 border rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                formErrors.bank
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
            >
              <option value="">Selecione o banco...</option>
              <option value="001">Banco do Brasil</option>
              <option value="341">Itaú</option>
              <option value="033">Santander</option>
              <option value="104">Caixa Econômica Federal</option>
              <option value="237">Bradesco</option>
              <option value="077">Inter</option>
              <option value="260">Nubank</option>
              <option value="336">C6 Bank</option>
            </select>
          </div>
          {formErrors.bank && (
            <p className="mt-1 text-sm text-red-600">{formErrors.bank}</p>
          )}
        </div>

        {/* Account Type */}
        <div>
          <label htmlFor="accountType" className="block text-sm font-medium text-gray-700">
            Tipo de Conta
          </label>
          <div className="mt-1">
            <select
              id="accountType"
              name="accountType"
              value={formData.accountType}
              onChange={onInputChange}
              className={`block w-full px-3 py-2 border rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                formErrors.accountType
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
            >
              <option value="checking">Conta Corrente</option>
              <option value="savings">Conta Poupança</option>
            </select>
          </div>
          {formErrors.accountType && (
            <p className="mt-1 text-sm text-red-600">{formErrors.accountType}</p>
          )}
        </div>

        {/* Agency */}
        <div>
          <label htmlFor="agency" className="block text-sm font-medium text-gray-700">
            Agência
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Bank className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="agency"
              name="agency"
              value={formData.agency}
              onChange={onInputChange}
              maxLength={4}
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                formErrors.agency
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              placeholder="0000"
            />
          </div>
          {formErrors.agency && (
            <p className="mt-1 text-sm text-red-600">{formErrors.agency}</p>
          )}
        </div>

        {/* Account */}
        <div>
          <label htmlFor="account" className="block text-sm font-medium text-gray-700">
            Conta
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="account"
              name="account"
              value={formData.account}
              onChange={onInputChange}
              maxLength={10}
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                formErrors.account
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              placeholder="00000000-0"
            />
          </div>
          {formErrors.account && (
            <p className="mt-1 text-sm text-red-600">{formErrors.account}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <form onSubmit={onSubmit} className="space-y-6">
          {activeTab === 'personal' && renderPersonalFields()}
          {activeTab === 'address' && renderAddressFields()}
          {activeTab === 'bank' && renderBankFields()}

          {/* Form Actions */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Check className="h-4 w-4 mr-2" />
              Salvar Alterações
            </button>
          </div>

          {/* Success Message */}
          {formSuccess && (
            <div className="mt-4 p-4 rounded-md bg-green-50 flex items-center">
              <Check className="h-5 w-5 text-green-400 mr-2" />
              <p className="text-sm font-medium text-green-800">{formSuccess}</p>
            </div>
          )}

          {/* Form Error */}
          {formErrors.submit && (
            <div className="mt-4 p-4 rounded-md bg-red-50 flex items-center">
              <Info className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-sm font-medium text-red-800">{formErrors.submit}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
});