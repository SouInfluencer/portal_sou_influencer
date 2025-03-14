import React, { useState } from 'react';
import { User, Bell, Shield, CreditCard, AlertTriangle, Building2, Home, Building as Bank } from 'lucide-react';
import { ProfileSettings } from '../../components/settings/ProfileSettings';
import { NotificationSettings } from '../../components/settings/NotificationSettings';
import { SecuritySettings } from '../../components/settings/SecuritySettings';
import { SettingsTab } from '../../components/settings/SettingsTab';
import type { SettingsFormData, FormErrors } from '../../components/settings/types';
import { toast, Toaster } from 'react-hot-toast';

export function Settings() {
  const [activeTab, setActiveTab] = useState<'personal' | 'business' | 'address' | 'bank' | 'notifications' | 'security'>('personal');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formSuccess, setFormSuccess] = useState<string | null>(null);


  const [formData, setFormData] = useState<SettingsFormData>({
    name: 'João Silva',
    email: 'joao@example.com',
    phone: '+55 11 99999-9999',
    bio: 'Criador de conteúdo digital especializado em tecnologia e lifestyle.',
    location: 'São Paulo, SP',
    website: 'www.joaosilva.com.br',
    type: 'pf',
    firstName: '',
    lastName: '',
    cpf: '',
    birthDate: '',
    cnpj: '',
    companyName: '',
    tradeName: '',
    cep: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    bank: '',
    accountType: '',
    agency: '',
    account: '',
    emailNotifications: {
      campaigns: true,
      messages: true,
      updates: false,
      marketing: false
    },
    pushNotifications: {
      campaigns: true,
      messages: true,
      updates: true,
      marketing: false
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    
    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      errors.phone = 'Telefone inválido';
    }
    
    if (formData.website && !/^[\w-]+(\.[\w-]+)+$/.test(formData.website)) {
      errors.website = 'Website inválido';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {



    // e.preventDefault();
    // if (validateForm()) {
    //   try {
    //     // TODO: Implement API call
    //     setFormSuccess('Alterações salvas com sucesso!');
    //     setTimeout(() => setFormSuccess(null), 3000);
    //   } catch {
    //     setFormErrors({ submit: 'Erro ao salvar alterações. Tente novamente.' });
    //   }
    // }
  };

  const handleNotificationChange = (type: 'email' | 'push', setting: keyof typeof formData['emailNotifications']) => {
    setFormData(prev => ({
      ...prev,
      [`${type}Notifications`]: {
        ...prev[`${type}Notifications`],
        [setting]: !prev[`${type}Notifications`][setting as keyof typeof formData['emailNotifications']]
      }
    }));
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Configurações</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gerencie suas preferências e informações da conta
        </p>
      </div>
      <Toaster position="bottom-right" reverseOrder={false} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-6">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <SettingsTab
                id="personal"
                label="Meus Dados"
                icon={User}
                isActive={activeTab === 'personal'}
                onClick={() => setActiveTab('personal')}
              />
              <SettingsTab
                id="address"
                label="Endereço"
                icon={Home}
                isActive={activeTab === 'address'}
                onClick={() => setActiveTab('address')}
              />
              <SettingsTab
                id="bank"
                label="Dados Bancários"
                icon={Bank}
                isActive={activeTab === 'bank'}
                onClick={() => setActiveTab('bank')}
              />
              <SettingsTab
                id="notifications"
                label="Notificações"
                icon={Bell}
                isActive={activeTab === 'notifications'}
                onClick={() => setActiveTab('notifications')}
              />
              <SettingsTab
                id="security"
                label="Segurança"
                icon={Shield}
                isActive={activeTab === 'security'}
                onClick={() => setActiveTab('security')}
              />
            </nav>
          </div>

          {/* Content */}
          <div className="mt-6">
            {(activeTab === 'personal' || activeTab === 'address' || activeTab === 'bank') && (
              <ProfileSettings
                formData={formData}
                formErrors={formErrors}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                formSuccess={formSuccess}
                activeTab={activeTab}
              />
            )}

            {activeTab === 'notifications' && (
              <NotificationSettings
                formData={formData}
                onNotificationChange={handleNotificationChange}
              />
            )}

            {activeTab === 'security' && (
              <SecuritySettings
                onDeleteAccount={() => setShowDeleteConfirm(true)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
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
                    Excluir Conta
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Tem certeza que deseja excluir sua conta? Todos os seus dados serão permanentemente removidos.
                      Esta ação não pode ser desfeita.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    // TODO: Implement account deletion
                    setShowDeleteConfirm(false);
                  }}
                >
                  Excluir
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteConfirm(false)}
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