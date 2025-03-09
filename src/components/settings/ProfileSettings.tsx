import React from 'react';
import { Camera, User, AtSign, Phone, Globe, Info, Check, Building2, CreditCard, MapPin, Calendar, Building, Briefcase, Home, Ban as Bank, BarChart as ChartBar } from 'lucide-react';
import type { ProfileSettingsProps } from './types';

type TabType = 'personal' | 'business' | 'address' | 'bank';

/**
 * Profile settings component for managing user profile information
 * @param props - Profile settings properties
 */
export const ProfileSettings = React.memo(function ProfileSettings({
  formData,
  formErrors,
  onInputChange,
  onSubmit,
  formSuccess
}: ProfileSettingsProps) {
  const [activeTab, setActiveTab] = React.useState<TabType>('personal');

  // Helper function to check if a tab is complete
  const isTabComplete = (tab: TabType, data: any): boolean => {
    switch (tab) {
      case 'personal':
        return Boolean(data.name && data.email && data.phone && data.cpf);
      case 'business':
        return Boolean(data.cnpj && data.companyName);
      case 'address':
        return Boolean(data.cep && data.street && data.number && data.city && data.state);
      case 'bank':
        return Boolean(data.bank && data.accountType && data.agency && data.account);
      default:
        return false;
    }
  };

  // Calculate overall profile completion percentage
  const calculateProfileCompletion = (data: any): number => {
    const tabs: TabType[] = ['personal', 'business', 'address', 'bank'];
    const completedTabs = tabs.filter(tab => isTabComplete(tab, data)).length;
    return Math.round((completedTabs / tabs.length) * 100);
  };

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'personal', label: 'Dados Pessoais', icon: User },
    { id: 'business', label: 'Dados Empresariais', icon: Building2 },
    { id: 'address', label: 'Endereço', icon: Home },
    { id: 'bank', label: 'Dados Bancários', icon: Bank }
  ];

  return (
    <div className="bg-white shadow sm:rounded-lg">
      {/* Profile Completion Status */}
      <div className="px-4 py-5 sm:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <ChartBar className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Status do Cadastro</h3>
          </div>
          <span className="text-sm font-medium text-gray-500">
            {calculateProfileCompletion(formData)}% completo
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${calculateProfileCompletion(formData)}%` }}
          />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="flex items-center">
            <div className={`h-2.5 w-2.5 rounded-full ${isTabComplete('personal', formData) ? 'bg-green-500' : 'bg-gray-300'} mr-2`} />
            <span className="text-sm text-gray-600">Dados Pessoais</span>
          </div>
          <div className="flex items-center">
            <div className={`h-2.5 w-2.5 rounded-full ${isTabComplete('business', formData) ? 'bg-green-500' : 'bg-gray-300'} mr-2`} />
            <span className="text-sm text-gray-600">Dados Empresariais</span>
          </div>
          <div className="flex items-center">
            <div className={`h-2.5 w-2.5 rounded-full ${isTabComplete('address', formData) ? 'bg-green-500' : 'bg-gray-300'} mr-2`} />
            <span className="text-sm text-gray-600">Endereço</span>
          </div>
          <div className="flex items-center">
            <div className={`h-2.5 w-2.5 rounded-full ${isTabComplete('bank', formData) ? 'bg-green-500' : 'bg-gray-300'} mr-2`} />
            <span className="text-sm text-gray-600">Dados Bancários</span>
          </div>
        </div>
      </div>

      {/* Profile Photo */}
      <div className="px-4 py-5 sm:p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Profile"
              className="h-20 w-20 rounded-full"
            />
            <button className="absolute bottom-0 right-0 p-1 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50">
              <Camera className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="ml-6">
            <h3 className="text-lg font-medium text-gray-900">Foto do Perfil</h3>
            <p className="mt-1 text-sm text-gray-500">
              JPG, GIF ou PNG. Máximo 2MB.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-200`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Basic Info */}
      <div className="px-4 py-5 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          {/* Personal Data Tab */}
          {activeTab === 'personal' && (
            <>
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={onInputChange}
                    className={`block w-full pl-10 pr-10 py-2.5 sm:text-sm rounded-lg transition-colors duration-200
                      ${formErrors.name 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' 
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400'}`}
                    placeholder="Digite seu nome completo"
                    aria-invalid={Boolean(formErrors.name)}
                    aria-describedby={formErrors.name ? 'name-error' : undefined}
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AtSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={onInputChange}
                    className={`block w-full pl-10 pr-10 py-2.5 sm:text-sm rounded-lg transition-colors duration-200
                      ${formErrors.email 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' 
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400'}`}
                    placeholder="seu@email.com"
                    aria-invalid={Boolean(formErrors.email)}
                    aria-describedby={formErrors.email ? 'email-error' : undefined}
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
                  CPF
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="cpf"
                    id="cpf"
                    className="block w-full pl-10 pr-10 py-2.5 sm:text-sm rounded-lg transition-colors duration-200 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400"
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Nascimento
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="birthDate"
                    id="birthDate"
                    className="block w-full pl-10 pr-10 py-2.5 sm:text-sm rounded-lg transition-colors duration-200 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative rounded-md shadow-sm group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={onInputChange}
                    className={`block w-full pl-10 pr-10 py-2.5 sm:text-sm rounded-lg transition-colors duration-200
                      ${formErrors.phone 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' 
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400'}`}
                    placeholder="+55 (11) 99999-9999"
                    aria-invalid={Boolean(formErrors.phone)}
                    aria-describedby={formErrors.phone ? 'phone-error' : undefined}
                  />
                  {formErrors.phone && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <Info className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-600" id="phone-error">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    name="website"
                    id="website"
                    value={formData.website}
                    onChange={onInputChange}
                    className={`block w-full pl-10 pr-10 py-2.5 sm:text-sm rounded-lg transition-colors duration-200
                      ${formErrors.website 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' 
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400'}`}
                    placeholder="www.seusite.com.br"
                    aria-invalid={Boolean(formErrors.website)}
                    aria-describedby={formErrors.website ? 'website-error' : undefined}
                  />
                  {formErrors.website && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <Info className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {formErrors.website && (
                  <p className="mt-1 text-sm text-red-600" id="website-error">
                    {formErrors.website}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Business Data Tab */}
          {activeTab === 'business' && (
            <>
              <div className="sm:col-span-2">
                <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">
                  CNPJ
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="cnpj"
                    id="cnpj"
                    className="block w-full pl-10 pr-10 py-2.5 sm:text-sm rounded-lg transition-colors duration-200 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400"
                    placeholder="00.000.000/0000-00"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                  Razão Social
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="companyName"
                    id="companyName"
                    className="block w-full pl-10 pr-10 py-2.5 sm:text-sm rounded-lg transition-colors duration-200 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400"
                    placeholder="Razão Social"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="tradeName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Fantasia
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="tradeName"
                    id="tradeName"
                    className="block w-full pl-10 pr-10 py-2.5 sm:text-sm rounded-lg transition-colors duration-200 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400"
                    placeholder="Nome Fantasia"
                  />
                </div>
              </div>
            </>
          )}

          {/* Address Tab */}
          {activeTab === 'address' && (
            <>
              <div className="sm:col-span-2">
                <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">
                  CEP
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="cep"
                    id="cep"
                    className="block w-full pl-10 pr-10 py-2.5 sm:text-sm rounded-lg transition-colors duration-200 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400"
                    placeholder="00000-000"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                  Rua
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="street"
                  id="street"
                  className="block w-full py-2.5 sm:text-sm rounded-lg transition-colors duration-200 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400"
                  placeholder="Nome da rua"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                  Número
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="number"
                  id="number"
                  className="block w-full py-2.5 sm:text-sm rounded-lg transition-colors duration-200 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400"
                  placeholder="Número"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-1">
                  Bairro
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="neighborhood"
                  id="neighborhood"
                  className="block w-full py-2.5 sm:text-sm rounded-lg transition-colors duration-200 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400"
                  placeholder="Bairro"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  className="block w-full py-2.5 sm:text-sm rounded-lg transition-colors duration-200 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400"
                  placeholder="Cidade"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  id="state"
                  name="state"
                  className="block w-full py-2.5 sm:text-sm rounded-lg transition-colors duration-200 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400"
                >
                  <option value="">Selecione...</option>
                  <option value="SP">São Paulo</option>
                  <option value="RJ">Rio de Janeiro</option>
                  {/* Add other states */}
                </select>
              </div>
            </>
          )}

          {/* Bank Data Tab */}
          {activeTab === 'bank' && (
            <>
              <div className="sm:col-span-2">
                <label htmlFor="bank" className="block text-sm font-medium text-gray-700 mb-1">
                  Banco
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  id="bank"
                  name="bank"
                  className="block w-full py-2.5 sm:text-sm rounded-lg transition-colors duration-200 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400"
                >
                  <option value="">Selecione...</option>
                  <option value="001">Banco do Brasil</option>
                  <option value="341">Itaú</option>
                  <option value="033">Santander</option>
                  {/* Add other banks */}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo da Conta
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  id="accountType"
                  name="accountType"
                  className="block w-full py-2.5 sm:text-sm rounded-lg transition-colors duration-200 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400"
                >
                  <option value="">Selecione...</option>
                  <option value="corrente">Conta Corrente</option>
                  <option value="poupanca">Conta Poupança</option>
                </select>
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="agency" className="block text-sm font-medium text-gray-700 mb-1">
                  Agência
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="agency"
                  id="agency"
                  maxLength={4}
                  className="block w-full py-2.5 sm:text-sm rounded-lg transition-colors duration-200 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400"
                  placeholder="0000"
                />
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="account" className="block text-sm font-medium text-gray-700 mb-1">
                  Conta
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="account"
                  id="account"
                  className="block w-full py-2.5 sm:text-sm rounded-lg transition-colors duration-200 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400"
                  placeholder="00000000-0"
                />
              </div>
            </>
          )}

          <div className="sm:col-span-6">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <div className="relative">
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={onInputChange}
                className="block w-full sm:text-sm border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400 transition-colors duration-200 resize-none"
                placeholder="Conte um pouco sobre você..."
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Breve descrição para seu perfil.
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="px-4 py-3 bg-gray-50 sm:px-6 rounded-b-lg flex items-center justify-between">
        {formSuccess && (
          <div className="flex items-center text-green-700 bg-green-50 px-4 py-2 rounded-lg">
            <Check className="h-5 w-5 mr-2" />
            {formSuccess}
          </div>
        )}
        {formErrors.submit && (
          <div className="flex items-center text-red-700 bg-red-50 px-4 py-2 rounded-lg">
            <Info className="h-5 w-5 mr-2" />
            {formErrors.submit}
          </div>
        )}
        <button
          type="submit"
          onClick={onSubmit}
          className="inline-flex items-center justify-center py-2.5 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02]"
        >
          <Check className="h-5 w-5 mr-2" />
          Salvar Alterações
        </button>
      </div>
    </div>
  );
});