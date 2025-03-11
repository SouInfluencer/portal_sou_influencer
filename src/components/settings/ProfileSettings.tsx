import React from 'react';
import { Camera, User, AtSign, Phone, Globe, Info, Check, Building2, CreditCard, MapPin, Calendar, Building, Briefcase, Home, Ban as Bank, BarChart as ChartBar } from 'lucide-react';
import type { ProfileSettingsProps } from './types';

type TabType = 'personal' | 'business' | 'address' | 'bank';

export const ProfileSettings = React.memo(function ProfileSettings({
                                                                     formData,
                                                                     formErrors,
                                                                     onInputChange,
                                                                     onSubmit,
                                                                     formSuccess
                                                                   }: ProfileSettingsProps) {
  const [activeTab, setActiveTab] = React.useState<TabType>('personal');

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
              <ChartBar className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Status do Cadastro</h3>
            </div>
            <span className="text-sm font-medium text-gray-500">
            {calculateProfileCompletion(formData)}% completo
          </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${calculateProfileCompletion(formData)}%` }}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {tabs.map(tab => (
                <div key={tab.id} className="flex items-center">
                  <div className={`h-2.5 w-2.5 rounded-full ${isTabComplete(tab.id, formData) ? 'bg-green-500' : 'bg-gray-300'} mr-2`} />
                  <span className="text-sm text-gray-600">{tab.label}</span>
                </div>
            ))}
          </div>
        </div>

        {/* Profile Photo */}
        <div className="px-4 py-5 sm:p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="relative">
              <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
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
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-200`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
            ))}
          </nav>
        </div>

        {/* Form Content */}
        <div className="px-4 py-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {/* Personal Data */}
            {activeTab === 'personal' && <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <User className="inline mr-2 h-4 w-4" />
                  Nome Completo
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={onInputChange}
                    className={`w-full p-2 border rounded-lg ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <AtSign className="inline mr-2 h-4 w-4" />
                  Email
                </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={onInputChange}
                    className={`w-full p-2 border rounded-lg ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <User className="inline mr-2 h-4 w-4" />
                  CPF
                </label>
                <input
                    type="text"
                    name="cpf"
                    className="w-full p-2 border rounded-lg border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <Calendar className="inline mr-2 h-4 w-4" />
                  Nascimento
                </label>
                <input
                    type="date"
                    name="birthDate"
                    className="w-full p-2 border rounded-lg border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <Phone className="inline mr-2 h-4 w-4" />
                  Telefone
                </label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={onInputChange}
                    className={`w-full p-2 border rounded-lg ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <Globe className="inline mr-2 h-4 w-4" />
                  Website
                </label>
                <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={onInputChange}
                    className="w-full p-2 border rounded-lg border-gray-300"
                />
              </div>
            </>}

            {/* Business Data */}
            {activeTab === 'business' && <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <Building2 className="inline mr-2 h-4 w-4" />
                  CNPJ
                </label>
                <input
                    type="text"
                    name="cnpj"
                    className="w-full p-2 border rounded-lg border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <Building2 className="inline mr-2 h-4 w-4" />
                  Razão Social
                </label>
                <input
                    type="text"
                    name="companyName"
                    className="w-full p-2 border rounded-lg border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <Building2 className="inline mr-2 h-4 w-4" />
                  Nome Fantasia
                </label>
                <input
                    type="text"
                    name="tradeName"
                    className="w-full p-2 border rounded-lg border-gray-300"
                />
              </div>
            </>}

            {/* Address Data */}
            {activeTab === 'address' && <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <MapPin className="inline mr-2 h-4 w-4" />
                  CEP
                </label>
                <input
                    type="text"
                    name="cep"
                    className="w-full p-2 border rounded-lg border-gray-300"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Rua
                </label>
                <input
                    type="text"
                    name="street"
                    className="w-full p-2 border rounded-lg border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Número
                </label>
                <input
                    type="text"
                    name="number"
                    className="w-full p-2 border rounded-lg border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Bairro
                </label>
                <input
                    type="text"
                    name="neighborhood"
                    className="w-full p-2 border rounded-lg border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cidade
                </label>
                <input
                    type="text"
                    name="city"
                    className="w-full p-2 border rounded-lg border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <select
                    name="state"
                    className="w-full p-2 border rounded-lg border-gray-300"
                >
                  <option value="">Selecione...</option>
                  <option value="SP">São Paulo</option>
                  <option value="RJ">Rio de Janeiro</option>
                </select>
              </div>
            </>}

            {/* Bank Data */}
            {activeTab === 'bank' && <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Banco
                </label>
                <select
                    name="bank"
                    className="w-full p-2 border rounded-lg border-gray-300"
                >
                  <option value="">Selecione...</option>
                  <option value="001">Banco do Brasil</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de Conta
                </label>
                <select
                    name="accountType"
                    className="w-full p-2 border rounded-lg border-gray-300"
                >
                  <option value="">Selecione...</option>
                  <option value="corrente">Conta Corrente</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Agência
                </label>
                <input
                    type="text"
                    name="agency"
                    className="w-full p-2 border rounded-lg border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Conta
                </label>
                <input
                    type="text"
                    name="account"
                    className="w-full p-2 border rounded-lg border-gray-300"
                />
              </div>
            </>}
          </div>

          {/* Bio */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
                rows={3}
                name="bio"
                value={formData.bio}
                onChange={onInputChange}
                className="w-full p-2 border rounded-lg border-gray-300"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 sm:px-6 flex justify-between items-center">
          <div>
            {formSuccess && (
                <div className="flex items-center text-green-700">
                  <Check className="h-5 w-5 mr-2" />
                  {formSuccess}
                </div>
            )}
            {formErrors.submit && (
                <div className="flex items-center text-red-700">
                  <Info className="h-5 w-5 mr-2" />
                  {formErrors.submit}
                </div>
            )}
          </div>
          <button
              onClick={onSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Check className="h-5 w-5 mr-2" />
            Salvar Alterações
          </button>
        </div>
      </div>
  );
});