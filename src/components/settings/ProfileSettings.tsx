import React from 'react';
import { MapPin, User, AtSign, Phone, Calendar, Building2, Home, Ban as Bank } from 'lucide-react';
import type { ProfileSettingsProps } from './types';
import { profileService } from '../../services/profileService';
import { toast } from 'react-hot-toast';
import MaskedInput from 'react-input-mask';

export const ProfileSettings = React.memo(function ProfileSettings({
  formData,
  formErrors,
  activeTab,
  onInputChange,
  onSubmit,
  formSuccess
}: ProfileSettingsProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [isFetchingCep, setIsFetchingCep] = React.useState(false);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    onInputChange(e);
  };

  const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    
    switch (name) {
      case 'cpf':
        if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value)) {
          error = 'CPF inválido';
        }
        break;
      case 'phone':
        if (!/^\(\d{2}\) \d\.\d{4}-\d{4}$/.test(value)) {
          error = 'Telefone inválido';
        }
        break;
      case 'cep':
        if (!/^\d{5}-\d{3}$/.test(value)) {
          error = 'CEP inválido';
        }
        break;
    }

    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));

    return !error;
  };

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      setIsFetchingCep(true);
      try {
        const addressData = await profileService.searchCEP(cep);
        if (addressData) {
          // Update form with address data
          const event = {
            target: {
              name: 'street',
              value: addressData.street
            }
          } as React.ChangeEvent<HTMLInputElement>;
          handleFieldChange(event);
          
          handleFieldChange({
            target: {
              name: 'neighborhood',
              value: addressData.neighborhood
            }
          } as React.ChangeEvent<HTMLInputElement>);
          
          handleFieldChange({
            target: {
              name: 'city',
              value: addressData.city
            }
          } as React.ChangeEvent<HTMLInputElement>);
          
          handleFieldChange({
            target: {
              name: 'state',
              value: addressData.state
            }
          } as React.ChangeEvent<HTMLInputElement>);
        } else {
          toast.error('CEP não encontrado');
        }
      } catch (error) {
        toast.error('Erro ao buscar CEP');
      } finally {
        setIsFetchingCep(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onSubmit()

    try {
      let success = false;

      switch (activeTab) {
        case 'personal':
          success = await handlePersonalSubmit();
          break;
        case 'address':
          success = await handleAddressSubmit();
          break;
        case 'bank':
          success = await handleBankSubmit();
          break;
      }

      if (success) {
        toast.success('Dados salvos com sucesso!');
        setIsEditing(false);
      }
    } catch (error) {
      // toast.error(error instanceof Error ? error.message : 'Erro ao salvar dados');
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalSubmit = async () => {

    const personalData = {
      type: formData.type,
      firstName: formData.firstName,
      lastName: formData.lastName,
      cpf: formData.cpf,
      birthDate: formData.birthDate,
      phone: formData.phone,
      ...(formData.type === 'pj' && {
        cnpj: formData.cnpj,
        companyName: formData.companyName,
        tradeName: formData.tradeName
      })
    };

    // const result = await profileService.updatePersonalInfo(personalData);
    return result.success;
  };

  const handleAddressSubmit = async () => {
    const addressData = {
      cep: formData.cep,
      street: formData.street,
      number: formData.number,
      neighborhood: formData.neighborhood,
      city: formData.city,
      state: formData.state
    };

    const result = await profileService.updateAddress(addressData);
    return result.success;
  };

  const handleBankSubmit = async () => {
    const bankData = {
      bank: formData.bank,
      accountType: formData.accountType,
      agency: formData.agency,
      account: formData.account
    };

    const result = await profileService.updateBankInfo(bankData);
    return result.success;
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {activeTab === 'personal' && 'Dados Pessoais'}
            {activeTab === 'address' && 'Endereço'}
            {activeTab === 'bank' && 'Dados Bancários'}
          </h3>
          {activeTab !== 'address' && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isEditing
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isEditing ? 'Salvar' : 'Editar'}
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  <User className="inline mr-2 h-4 w-4" />
                  Nome
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleFieldChange}
                  className={`mt-1 block w-full border ${
                    fieldErrors.firstName ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {fieldErrors.firstName && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  <User className="inline mr-2 h-4 w-4" />
                  Sobrenome
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleFieldChange}
                  className={`mt-1 block w-full border ${
                    fieldErrors.lastName ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {fieldErrors.lastName && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.lastName}</p>
                )}
              </div>

              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                  <User className="inline mr-2 h-4 w-4" />
                  CPF
                </label>

                <MaskedInput
                  mask="999.999.999-99"
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleFieldChange}
                  onBlur={handleFieldBlur}
                  className={`mt-1 block w-full border ${
                    fieldErrors.cpf ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="000.000.000-00"
                />
                {fieldErrors.cpf && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.cpf}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  <Phone className="inline mr-2 h-4 w-4" />
                  Telefone
                </label>
                <MaskedInput
                  mask="(99) 9.9999-9999"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFieldChange}
                  onBlur={handleFieldBlur}
                  className={`mt-1 block w-full border ${
                    fieldErrors.phone ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="(00) 0.0000-0000"
                />
                {fieldErrors.phone && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.phone}</p>
                )}
              </div>

              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                  <Calendar className="inline mr-2 h-4 w-4" />
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  name="birthDate"
                  id="birthDate"
                  value={formData.birthDate}
                  onChange={handleFieldChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  <AtSign className="inline mr-2 h-4 w-4" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleFieldChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          )}

          {activeTab === 'address' && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="cep" className="block text-sm font-medium text-gray-700">
                  <MapPin className="inline mr-2 h-4 w-4" />
                  CEP
                </label>
                <MaskedInput
                  type="text"
                  mask="99999-999"
                  id="cep"
                  name="cep"
                  value={formData.cep}
                  onChange={handleFieldChange}
                  onBlur={(e) => {
                    handleFieldBlur(e);
                    handleCepBlur(e);
                  }}
                  className={`mt-1 block w-full border ${
                    fieldErrors.cep ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-400`}
                  placeholder="00000-000"
                  disabled={false}
                />
                {isFetchingCep && (
                  <div className="mt-2 text-sm text-blue-600">
                    Buscando endereço...
                  </div>
                )}
                {fieldErrors.cep && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.cep}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                  <Home className="inline mr-2 h-4 w-4" />
                  Rua
                </label>
                <input
                  type="text"
                  name="street"
                  id="street"
                  value={formData.street}
                  onChange={handleFieldChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="number" className="block text-sm font-medium text-gray-700">
                  <Home className="inline mr-2 h-4 w-4" />
                  Número
                </label>
                <input
                  type="text"
                  name="number"
                  id="number"
                  value={formData.number}
                  onChange={handleFieldChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700">
                  <Home className="inline mr-2 h-4 w-4" />
                  Bairro
                </label>
                <input
                  type="text"
                  name="neighborhood"
                  id="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleFieldChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  <Building2 className="inline mr-2 h-4 w-4" />
                  Cidade
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={formData.city}
                  onChange={handleFieldChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  <Building2 className="inline mr-2 h-4 w-4" />
                  Estado
                </label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleFieldChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Selecione...</option>
                  {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {activeTab === 'bank' && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="bank" className="block text-sm font-medium text-gray-700">
                  <Bank className="inline mr-2 h-4 w-4" />
                  Banco
                </label>
                <select
                  id="bank"
                  name="bank"
                  value={formData.bank}
                  onChange={handleFieldChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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

              <div className="sm:col-span-2">
                <label htmlFor="accountType" className="block text-sm font-medium text-gray-700">
                  <Bank className="inline mr-2 h-4 w-4" />
                  Tipo de Conta
                </label>
                <select
                  id="accountType"
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleFieldChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Selecione o tipo de conta...</option>
                  <option value="corrente">Conta Corrente</option>
                  <option value="poupanca">Conta Poupança</option>
                </select>
              </div>

              <div>
                <label htmlFor="agency" className="block text-sm font-medium text-gray-700">
                  <Bank className="inline mr-2 h-4 w-4" />
                  Agência
                </label>
                <MaskedInput
                  mask="9999"
                  id="agency"
                  name="agency"
                  value={formData.agency}
                  onChange={handleFieldChange}
                  placeholder="0000"
                  error={fieldErrors.agency}
                />
                {fieldErrors.agency && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.agency}</p>
                )}
              </div>

              <div>
                <label htmlFor="account" className="block text-sm font-medium text-gray-700">
                  <Bank className="inline mr-2 h-4 w-4" />
                  Conta
                </label>
                <MaskedInput
                  mask="99999999-9"
                  id="account"
                  name="account"
                  value={formData.account}
                  onChange={handleFieldChange}
                  placeholder="00000000-0"
                  error={fieldErrors.account}
                />
                {fieldErrors.account && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.account}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});