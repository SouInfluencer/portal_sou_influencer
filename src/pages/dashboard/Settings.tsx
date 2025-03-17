import React, { useState } from 'react';
import { User, Bell, Shield, CreditCard, AlertTriangle, Building2, Home, Building as Bank, CheckCircle, X, Info } from 'lucide-react';
import { ProfileSettings } from '../../components/settings/ProfileSettings';
import { NotificationSettings } from '../../components/settings/NotificationSettings';
import { SecuritySettings } from '../../components/settings/SecuritySettings';
import { SettingsTab } from '../../components/settings/SettingsTab';
import type { SettingsFormData, FormErrors } from '../../components/settings/types';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/authService';

export function Settings() {
  const [activeTab, setActiveTab] = useState<'personal' | 'address' | 'bank' | 'notifications' | 'security'>('personal');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const [showCompletionDetails, setShowCompletionDetails] = useState(false);

  const [formData, setFormData] = useState<SettingsFormData>({
    firstName: '',
    lastName: '',
    email: '',
    cpf: '',
    birthDate: '',
    phone: '',
    bio: '',
    location: '',
    website: '',
    // Address fields
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    // Bank fields
    bank: '',
    accountType: 'checking',
    agency: '',
    account: '',
    // Notification preferences
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

  // Calculate completion status
  const getCompletionStatus = () => {
    const personalFields = {
      firstName: { value: formData.firstName, label: 'Nome' },
      lastName: { value: formData.lastName, label: 'Sobrenome' },
      cpf: { value: formData.cpf, label: 'CPF' },
      birthDate: { value: formData.birthDate, label: 'Data de Nascimento' },
      email: { value: formData.email, label: 'Email' },
      phone: { value: formData.phone, label: 'Telefone' },
      bio: { value: formData.bio, label: 'Bio' }
    };

    const addressFields = {
      cep: { value: formData.cep, label: 'CEP' },
      street: { value: formData.street, label: 'Rua' },
      number: { value: formData.number, label: 'Número' },
      neighborhood: { value: formData.neighborhood, label: 'Bairro' },
      city: { value: formData.city, label: 'Cidade' },
      state: { value: formData.state, label: 'Estado' }
    };

    const bankFields = {
      bank: { value: formData.bank, label: 'Banco' },
      accountType: { value: formData.accountType, label: 'Tipo de Conta' },
      agency: { value: formData.agency, label: 'Agência' },
      account: { value: formData.account, label: 'Conta' }
    };

    const getMissingFields = (fields: Record<string, { value: string; label: string }>) => {
      return Object.entries(fields)
        .filter(([_, { value }]) => !value)
        .map(([_, { label }]) => label);
    };

    const personalComplete = Object.values(personalFields).every(field => field.value);
    const addressComplete = Object.values(addressFields).every(field => field.value);
    const bankComplete = Object.values(bankFields).every(field => field.value);

    const missingFields = {
      personal: getMissingFields(personalFields),
      address: getMissingFields(addressFields),
      bank: getMissingFields(bankFields)
    };

    return {
      personal: personalComplete,
      address: addressComplete,
      bank: bankComplete,
      total: personalComplete && addressComplete && bankComplete,
      percentage: Math.round(
        ((Object.values(personalFields).filter(field => field.value).length +
          Object.values(addressFields).filter(field => field.value).length +
          Object.values(bankFields).filter(field => field.value).length) /
          (Object.keys(personalFields).length +
            Object.keys(addressFields).length +
            Object.keys(bankFields).length)) *
          100
      ),
      missingFields
    };
  };

  React.useEffect(() => {
    loadUserData();
    setMounted(true);
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Load user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      // Load address data
      const { data: addressData } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Load bank account data
      const { data: bankData } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (userData) {
        setFormData({
          firstName: userData.first_name || '',
          lastName: userData.last_name || '',
          email: userData.email || '',
          cpf: userData.cpf || '',
          birthDate: userData.birth_date || '',
          phone: userData.phone || '',
          bio: userData.bio || '',
          location: userData.location || '',
          website: userData.website || '',
          // Address fields from separate table
          cep: addressData?.cep || '',
          street: addressData?.street || '',
          number: addressData?.number || '',
          complement: addressData?.complement || '',
          neighborhood: addressData?.neighborhood || '',
          city: addressData?.city || '',
          state: addressData?.state || '',
          // Bank fields from separate table
          bank: bankData?.bank || '',
          accountType: bankData?.account_type || 'checking',
          agency: bankData?.agency || '',
          account: bankData?.account || '',
          emailNotifications: userData.email_notifications || {
            campaigns: true,
            messages: true,
            updates: false,
            marketing: false
          },
          pushNotifications: userData.push_notifications || {
            campaigns: true,
            messages: true,
            updates: true,
            marketing: false
          }
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Erro ao carregar dados do usuário');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
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
    
    // Personal Data Validation
    if (activeTab === 'personal') {
      if (!formData.firstName.trim()) errors.firstName = 'Nome é obrigatório';
      if (!formData.lastName.trim()) errors.lastName = 'Sobrenome é obrigatório';
      if (!formData.email.trim()) {
        errors.email = 'Email é obrigatório';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Email inválido';
      }
      if (formData.cpf && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
        errors.cpf = 'CPF inválido';
      }
    }
    
    // Address Validation
    if (activeTab === 'address') {
      if (!formData.cep) errors.cep = 'CEP é obrigatório';
      if (!formData.street) errors.street = 'Rua é obrigatória';
      if (!formData.number) errors.number = 'Número é obrigatório';
      if (!formData.neighborhood) errors.neighborhood = 'Bairro é obrigatório';
      if (!formData.city) errors.city = 'Cidade é obrigatória';
      if (!formData.state) errors.state = 'Estado é obrigatório';
    }
    
    // Bank Data Validation
    if (activeTab === 'bank') {
      if (!formData.bank) errors.bank = 'Banco é obrigatório';
      if (!formData.accountType) errors.accountType = 'Tipo de conta é obrigatório';
      if (!formData.agency) errors.agency = 'Agência é obrigatória';
      if (!formData.account) errors.account = 'Conta é obrigatória';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Update data based on active tab
      switch (activeTab) {
        case 'personal':
          const { error: userError } = await supabase
            .from('users')
            .update({
              first_name: formData.firstName,
              last_name: formData.lastName,
              cpf: formData.cpf,
              birth_date: formData.birthDate,
              phone: formData.phone,
              bio: formData.bio,
              location: formData.location,
              website: formData.website
            })
            .eq('id', user.id);

          if (userError) throw userError;
          break;

        case 'address':
          const { error: addressError } = await supabase
            .from('addresses')
            .upsert({
              user_id: user.id,
              cep: formData.cep,
              street: formData.street,
              number: formData.number,
              complement: formData.complement,
              neighborhood: formData.neighborhood,
              city: formData.city,
              state: formData.state
            }, {
              onConflict: 'user_id'
            });

          if (addressError) throw addressError;
          break;

        case 'bank':
          const { error: bankError } = await supabase
            .from('bank_accounts')
            .upsert({
              user_id: user.id,
              bank: formData.bank,
              account_type: formData.accountType,
              agency: formData.agency,
              account: formData.account
            }, {
              onConflict: 'user_id'
            });

          if (bankError) throw bankError;
          break;
      }

      setFormSuccess('Alterações salvas com sucesso!');
      toast.success('Alterações salvas com sucesso!');
      
      setTimeout(() => setFormSuccess(null), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setFormErrors({ submit: 'Erro ao salvar alterações. Tente novamente.' });
      toast.error('Erro ao salvar alterações');
    }
  };

  const handleNotificationChange = async (type: 'email' | 'push', setting: keyof typeof formData.emailNotifications) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const newSettings = {
        ...formData,
        [`${type}Notifications`]: {
          ...formData[`${type}Notifications`],
          [setting]: !formData[`${type}Notifications`][setting]
        }
      };

      const { error } = await supabase
        .from('users')
        .update({
          [`${type}_notifications`]: newSettings[`${type}Notifications`]
        })
        .eq('id', user.id);

      if (error) throw error;

      setFormData(newSettings);
      toast.success('Preferências de notificação atualizadas');
    } catch (error) {
      console.error('Error updating notifications:', error);
      toast.error('Erro ao atualizar preferências de notificação');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await authService.deleteAccount();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Erro ao excluir conta');
    }
  };

  const completionStatus = getCompletionStatus();

  const tabs = [
    { id: 'personal', label: 'Meus Dados', icon: User },
    { id: 'address', label: 'Endereço', icon: Home },
    { id: 'bank', label: 'Dados Bancários', icon: Bank },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'security', label: 'Segurança', icon: Shield }
  ];

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Configurações</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gerencie suas preferências e informações da conta
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowCompletionDetails(!showCompletionDetails)}
                className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {['personal', 'address', 'bank'].map((section) => (
                      <div
                        key={section}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                          completionStatus[section] 
                            ? 'bg-green-100 border-green-500 text-green-600' 
                            : 'bg-gray-100 border-gray-300 text-gray-400'
                        }`}
                      >
                        {completionStatus[section] ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{completionStatus.percentage}%</span>
                    <span className="text-gray-500 ml-1">completo</span>
                  </div>
                </div>
                <Info className="w-4 h-4 text-gray-400" />
              </button>

              {/* Completion Details Popover */}
              {showCompletionDetails && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Status do Cadastro</h3>
                  <div className="space-y-4">
                    {['personal', 'address', 'bank'].map((section) => {
                      const sectionLabel = {
                        personal: 'Meus Dados',
                        address: 'Endereço',
                        bank: 'Dados Bancários'
                      }[section];
                      
                      const missingFields = completionStatus.missingFields[section];
                      
                      return (
                        <div key={section} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">{sectionLabel}</span>
                            {completionStatus[section] ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Completo
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                <Info className="w-3 h-3 mr-1" />
                                Pendente
                              </span>
                            )}
                          </div>
                          {!completionStatus[section] && missingFields.length > 0 && (
                            <div className="pl-4 border-l-2 border-gray-100">
                              <p className="text-xs text-gray-500 mb-1">Campos pendentes:</p>
                              <ul className="space-y-1">
                                {missingFields.map((field) => (
                                  <li key={field} className="text-xs text-gray-600 flex items-center">
                                    <X className="w-3 h-3 text-gray-400 mr-1" />
                                    {field}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <SettingsTab
                key={tab.id}
                id={tab.id}
                label={tab.label}
                icon={tab.icon}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
              />
            ))}
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
                  onClick={handleDeleteAccount}
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