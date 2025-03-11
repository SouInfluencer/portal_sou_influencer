import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Building2,
  Home,
  Ban as Bank,
  ChevronRight,
  ArrowLeft,
  AlertCircle,
  FilePlus,
  UserCircle, Briefcase, MapPin, BanknoteIcon, PiggyBankIcon
} from 'lucide-react';
import InputMask from 'react-input-mask';

interface FormData {
  type: 'pf' | 'pj' | '';
  // Personal Data
  firstName: string;
  lastName: string;
  cpf: string;
  birthDate: string;
  phone: string;
  // Business Data
  cnpj?: string;
  companyName?: string;
  tradeName?: string;
  // Address
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  // Bank Info
  bank: string;
  accountType: string;
  agency: string;
  account: string;
}

const initialFormData: FormData = {
  type: '',
  firstName: '',
  lastName: '',
  cpf: '',
  birthDate: '',
  phone: '',
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
  account: ''
};

const states = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const banks = [
  { code: '001', name: 'Banco do Brasil' },
  { code: '341', name: 'Itaú' },
  { code: '033', name: 'Santander' },
  { code: '104', name: 'Caixa Econômica Federal' },
  { code: '237', name: 'Bradesco' },
  { code: '077', name: 'Inter' },
  { code: '260', name: 'Nubank' },
  { code: '336', name: 'C6 Bank' },
];

export function CompleteProfile() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);

  const steps = [
    { id: 1, title: 'Tipo de Cadastro', icon: FilePlus },
    { id: 2, title: 'Dados Pessoais', icon: User },
    { id: 3, title: 'Dados Empresariais', icon: Briefcase, showIf: () => formData.type === 'pj' },
    { id: 4, title: 'Endereço', icon: MapPin },
    { id: 5, title: 'Dados Bancários', icon: BanknoteIcon }
  ].filter(step => !step.showIf || step.showIf());

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    switch (step) {
      case 1:
        if (formData.type == null) {
          newErrors.type = 'Selecione o tipo de cadastro';
        }
        break;

      case 2:
        if (!formData.firstName) newErrors.firstName = 'Nome é obrigatório';
        if (!formData.lastName) newErrors.lastName = 'Sobrenome é obrigatório';
        if (!formData.cpf) newErrors.cpf = 'CPF é obrigatório';
        if (!formData.birthDate) newErrors.birthDate = 'Data de nascimento é obrigatória';
        if (!formData.phone) newErrors.phone = 'Telefone é obrigatório';
        break;

      case 3:
        if (formData.type === 'pj') {
          if (!formData.cnpj) newErrors.cnpj = 'CNPJ é obrigatório';
          if (!formData.companyName) newErrors.companyName = 'Razão Social é obrigatória';
          if (!formData.tradeName) newErrors.tradeName = 'Nome Fantasia é obrigatório';
        }
        break;

      case 4:
        if (!formData.cep) newErrors.cep = 'CEP é obrigatório';
        if (!formData.street) newErrors.street = 'Rua é obrigatória';
        if (!formData.number) newErrors.number = 'Número é obrigatório';
        if (!formData.neighborhood) newErrors.neighborhood = 'Bairro é obrigatório';
        if (!formData.city) newErrors.city = 'Cidade é obrigatória';
        if (!formData.state) newErrors.state = 'Estado é obrigatório';
        break;

      case 5:
        if (!formData.bank) newErrors.bank = 'Banco é obrigatório';
        if (!formData.accountType) newErrors.accountType = 'Tipo de conta é obrigatório';
        if (!formData.agency) newErrors.agency = 'Agência é obrigatória';
        if (!formData.account) newErrors.account = 'Conta é obrigatória';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Qual é o seu perfil?</h2>
              <p className="text-gray-600">Selecione o tipo de cadastro que melhor se adequa a você</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                  onClick={() => {
                    setFormData({...formData, type: 'pj'});
                    handleNext();
                  }}
                  className={`relative rounded-xl border-2 p-6 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${
                      formData.type === 'pj'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white'
                  }`}
              >
                <div className="flex flex-col items-start text-left">
                  <div className="flex items-center justify-between w-full mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-blue-600"/>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400"/>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Pessoa Jurídica</h3>
                  <p className="text-sm text-gray-600">
                    Cadastro para influenciadores que possuem empresa constituída
                  </p>
                </div>
              </button>

              <button
                  onClick={() => {
                    setFormData({...formData, type: 'pf'});
                    handleNext();
                  }}
                  className={`relative rounded-xl border-2 p-6 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${
                      formData.type === 'pf'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white'
                  }`}
              >
                <div className="flex flex-col items-start text-left">
                  <div className="flex items-center justify-between w-full mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600"/>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400"/>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Pessoa Física</h3>
                  <p className="text-sm text-gray-600">
                    Cadastro para influenciadores que atuam como pessoa física
                  </p>
                </div>
              </button>
            </div>

            {errors.type && (
                <div className="mt-4 text-sm text-red-600">
                  {errors.type}
                </div>
            )}
          </div>
        );

      case 2:
        return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    Nome
                  </label>
                  <input
                      type="text"
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, firstName: e.target.value})}
                      className={`block w-full pl-6 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white/80 placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-400 hover:bg-white focus:bg-white transform hover:translate-y-[-1px] ${
                          errors.firstName
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}                  />
                  {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Sobrenome
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, lastName: e.target.value })}
                  className={`block w-full pl-6 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white/80 placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-400 hover:bg-white focus:bg-white transform hover:translate-y-[-1px] ${
                    errors.lastName
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                  CPF
                </label>
                <InputMask
                  mask="999.999.999-99"
                  value={formData.cpf}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, cpf: e.target.value })}
                  className={`block w-full pl-6 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white/80 placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-400 hover:bg-white focus:bg-white transform hover:translate-y-[-1px] ${
                    errors.cpf
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="000.000.000-00"
                />
                {errors.cpf && (
                  <p className="mt-1 text-sm text-red-600">{errors.cpf}</p>
                )}
              </div>

              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                  Data de Nascimento
                </label>
                <InputMask
                  mask="99/99/9999"
                  placeholder="24/12/2025"
                  value={formData.birthDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, birthDate: e.target.value })}
                  className={`block w-full pl-6 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white/80 placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-400 hover:bg-white focus:bg-white transform hover:translate-y-[-1px] ${
                    errors.birthDate
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
                {errors.birthDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Telefone
                </label>
                <InputMask
                  mask="(99) 9.9999-9999"
                  value={formData.phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
                  className={`block w-full pl-6 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white/80 placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-400 hover:bg-white focus:bg-white transform hover:translate-y-[-1px] ${
                    errors.phone
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="(00) 00000-0000"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">
                CNPJ
              </label>
              <InputMask
                mask="99.999.999/9999-99"
                value={formData.cnpj}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, cnpj: e.target.value })}
                className={`block w-full pl-6 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white/80 placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-400 hover:bg-white focus:bg-white transform hover:translate-y-[-1px] ${
                  errors.cnpj
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="00.000.000/0000-00"
              />
              {errors.cnpj && (
                <p className="mt-1 text-sm text-red-600">{errors.cnpj}</p>
              )}
            </div>

            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                Razão Social
              </label>
              <input
                type="text"
                id="companyName"
                value={formData.companyName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, companyName: e.target.value })}
                className={`block w-full pl-6 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white/80 placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-400 hover:bg-white focus:bg-white transform hover:translate-y-[-1px] ${
                  errors.companyName
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
              )}
            </div>

            <div>
              <label htmlFor="tradeName" className="block text-sm font-medium text-gray-700">
                Nome Fantasia
              </label>
              <input
                type="text"
                id="tradeName"
                value={formData.tradeName}
                onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                className={`block w-full pl-6 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white/80 placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-400 hover:bg-white focus:bg-white transform hover:translate-y-[-1px] ${
                  errors.tradeName
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {errors.tradeName && (
                <p className="mt-1 text-sm text-red-600">{errors.tradeName}</p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="cep" className="block text-sm font-medium text-gray-700">
                  CEP
                </label>
                <InputMask
                  mask="99999-999"
                  value={formData.cep}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, cep: e.target.value })}
                >
                  {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => (
                    <input
                      {...inputProps}
                      type="text"
                      id="cep"
                      className={`block w-full pl-6 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white/80 placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-400 hover:bg-white focus:bg-white transform hover:translate-y-[-1px] ${
                        errors.cep
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder="00000-000"
                    />
                  )}
                </InputMask>
                {errors.cep && (
                  <p className="mt-1 text-sm text-red-600">{errors.cep}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                  Rua
                </label>
                <input
                  type="text"
                  id="street"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className={`block w-full pl-6 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white/80 placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-400 hover:bg-white focus:bg-white transform hover:translate-y-[-1px] ${
                    errors.street
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
                {errors.street && (
                  <p className="mt-1 text-sm text-red-600">{errors.street}</p>
                )}
              </div>

              <div>
                <label htmlFor="number" className="block text-sm font-medium text-gray-700">
                  Número
                </label>
                <input
                  type="text"
                  id="number"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  className={`block w-full pl-6 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white/80 placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-400 hover:bg-white focus:bg-white transform hover:translate-y-[-1px] ${
                    errors.number
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
                {errors.number && (
                  <p className="mt-1 text-sm text-red-600">{errors.number}</p>
                )}
              </div>

              <div>
                <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700">
                  Bairro
                </label>
                <input
                  type="text"
                  id="neighborhood"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  className={`block w-full pl-6 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white/80 placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-400 hover:bg-white focus:bg-white transform hover:translate-y-[-1px] ${
                    errors.neighborhood
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
                {errors.neighborhood && (
                  <p className="mt-1 text-sm text-red-600">{errors.neighborhood}</p>
                )}
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  Cidade
                </label>
                <input
                  type="text"
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className={`block w-full pl-6 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white/80 placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-400 hover:bg-white focus:bg-white transform hover:translate-y-[-1px] ${
                    errors.city
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <select
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className={`block w-full pl-6 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white/80 placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-400 hover:bg-white focus:bg-white transform hover:translate-y-[-1px] ${
                    errors.state
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                >
                  <option value="">Selecione...</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="bank" className="block text-sm font-medium text-gray-700">
                  Banco
                </label>
                <select
                  id="bank"
                  value={formData.bank}
                  onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                  className={`block w-full pl-6 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white/80 placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-400 hover:bg-white focus:bg-white transform hover:translate-y-[-1px] ${
                    errors.bank
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                >
                  <option value="">Selecione o banco...</option>
                  {banks.map(bank => (
                    <option key={bank.code} value={bank.code}>{bank.name}</option>
                  ))}
                </select>
                {errors.bank && (
                  <p className="mt-1 text-sm text-red-600">{errors.bank}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="accountType" className="block text-sm font-medium text-gray-700">
                  Tipo de Conta
                </label>
                <select
                  id="accountType"
                  value={formData.accountType}
                  onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                  className={`block w-full pl-6 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white/80 placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-400 hover:bg-white focus:bg-white transform hover:translate-y-[-1px] ${
                    errors.accountType
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                >
                  <option value="">Selecione o tipo de conta...</option>
                  <option value="corrente">Conta Corrente</option>
                  <option value="poupanca">Conta Poupança</option>
                </select>
                {errors.accountType && (
                  <p className="mt-1 text-sm text-red-600">{errors.accountType}</p>
                )}
              </div>

              <div>
                <label htmlFor="agency" className="block text-sm font-medium text-gray-700">
                  Agência
                </label>
                <input
                  type="text"
                  id="agency"
                  value={formData.agency}
                  onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                  className={`block w-full pl-6 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white/80 placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-400 hover:bg-white focus:bg-white transform hover:translate-y-[-1px] ${
                    errors.agency
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="0000"
                />
                {errors.agency && (
                  <p className="mt-1 text-sm text-red-600">{errors.agency}</p>
                )}
              </div>

              <div>
                <label htmlFor="account" className="block text-sm font-medium text-gray-700">
                  Conta
                </label>
                <input
                  type="text"
                  id="account"
                  value={formData.account}
                  onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                  className={`block w-full pl-6 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white/80 placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-400 hover:bg-white focus:bg-white transform hover:translate-y-[-1px] ${
                    errors.account
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="00000000-0"
                />
                {errors.account && (
                  <p className="mt-1 text-sm text-red-600">{errors.account}</p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="max-w-4xl mx-auto py-6 px-4 sm:py-10 sm:px-6 lg:px-8">
          {/* Progress Steps - Versão Super Responsiva */}
          <nav aria-label="Progresso" className="mb-6 sm:mb-10">
            <ol className="flex items-center justify-between">
              {steps.map((step, stepIdx) => (
                  <li key={step.id} className="relative flex-1 flex items-center">
                    {/* Linha de progresso */}
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className={`h-[2px] w-full ${stepIdx < currentStep - 1 ? 'bg-blue-600' : 'bg-gray-200'}`}/>
                    </div>

                    {/* Ícone e Label */}
                    <div className="relative group flex flex-col items-center w-full">
                      <div
                          className={`flex items-center justify-center rounded-full border-2 transition-all duration-200
                  ${stepIdx < currentStep - 1 ? 'border-blue-600 bg-blue-600' :
                              stepIdx === currentStep - 1 ? 'border-blue-600 bg-white shadow-step-active' :
                                  'border-gray-200 bg-white'}
                  h-8 w-8 xs:h-9 xs:w-9 sm:h-11 sm:w-11`}
                      >
                        <step.icon
                            className={`${stepIdx < currentStep - 1 ? 'text-white' :
                                stepIdx === currentStep - 1 ? 'text-blue-600' :
                                    'text-gray-400'}
                    h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5`}
                        />
                      </div>

                      {/* Label Adaptativo */}
                      <div className="absolute -bottom-[22px] sm:-bottom-7 w-full text-center px-1">
                <span
                    className={`font-medium transition-all
                    ${stepIdx === currentStep - 1 ? 'text-blue-600 font-semibold' : 'text-gray-500'}
                    text-[10px] xs:text-[11px] sm:text-xs
                    ${stepIdx === currentStep - 1 ? 'scale-100 opacity-100' : 'scale-90 opacity-0 sm:opacity-100'}
                    truncate inline-block max-w-full`}
                    title={step.title}
                >
                  {step.title}
                </span>
                      </div>
                    </div>
                  </li>
              ))}
            </ol>
          </nav>

          {/* Form Content */}
          <div className="bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-5 sm:p-6">{renderStep()}</div>

            {/* Form Actions */}
            <div className="px-4 py-3 bg-gray-50 sm:px-6 flex justify-between items-center">
              <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="inline-flex items-center px-6 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-100 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-5 w-5 mr-2"/>
                Voltar
              </button>
              <button
                  type="button"
                  onClick={handleNext}
                  disabled={loading}
                  className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                    <>
                      <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processando...
                    </>
                ) : (
                    <>
                      {currentStep === steps.length ? 'Concluir' : 'Continuar'}
                      <ChevronRight className="ml-2 h-4 w-4"/>
                    </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}