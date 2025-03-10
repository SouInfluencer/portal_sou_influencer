import React, { useState } from 'react';
import { ArrowRight, Building2, User } from 'lucide-react';
import type { User as UserType } from '../types';

export function RegisterForm() {
  const [step, setStep] = useState<'type' | 'details'>('type');
  const [userType, setUserType] = useState<UserType['type']>();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Business specific
    cnpj: '',
    segment: '',
    averageBudget: '',
    // Influencer specific
    niche: '',
    platforms: {
      instagram: '',
      youtube: '',
      tiktok: '',
      twitter: '',
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Form submitted:', { userType, formData });
  };

  if (step === 'type') {
    return (
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Escolha seu perfil</h2>
        <div className="space-y-4">
          <button
            onClick={() => {
              setUserType('influencer');
              setStep('details');
            }}
            className="w-full p-6 text-left border rounded-lg hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-lg font-medium text-gray-900">Sou Influenciador</p>
                <p className="text-sm text-gray-500">
                  Quero me conectar com marcas e gerenciar minhas campanhas
                </p>
              </div>
              <ArrowRight className="ml-auto h-5 w-5 text-gray-400" />
            </div>
          </button>

          <button
            onClick={() => {
              setUserType('business');
              setStep('details');
            }}
            className="w-full p-6 text-left border rounded-lg hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-lg font-medium text-gray-900">Sou Empresa</p>
                <p className="text-sm text-gray-500">
                  Quero encontrar influenciadores para minhas campanhas
                </p>
              </div>
              <ArrowRight className="ml-auto h-5 w-5 text-gray-400" />
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">
        {userType === 'influencer' ? 'Cadastro de Influenciador' : 'Cadastro de Empresa'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nome completo
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Senha
          </label>
          <input
            type="password"
            name="password"
            id="password"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirmar senha
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
        </div>

        {userType === 'business' ? (
          <>
            <div>
              <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">
                CNPJ
              </label>
              <input
                type="text"
                name="cnpj"
                id="cnpj"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={formData.cnpj}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="segment" className="block text-sm font-medium text-gray-700">
                Segmento
              </label>
              <input
                type="text"
                name="segment"
                id="segment"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={formData.segment}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="averageBudget" className="block text-sm font-medium text-gray-700">
                Orçamento médio mensal para campanhas
              </label>
              <input
                type="number"
                name="averageBudget"
                id="averageBudget"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={formData.averageBudget}
                onChange={handleInputChange}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label htmlFor="niche" className="block text-sm font-medium text-gray-700">
                Nicho principal
              </label>
              <input
                type="text"
                name="niche"
                id="niche"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={formData.niche}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-4">
              <p className="block text-sm font-medium text-gray-700">Redes sociais</p>
              
              <div>
                <label htmlFor="instagram" className="block text-sm text-gray-500">
                  Instagram
                </label>
                <input
                  type="text"
                  name="instagram"
                  id="instagram"
                  placeholder="@seuperfil"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={formData.platforms.instagram}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="youtube" className="block text-sm text-gray-500">
                  YouTube
                </label>
                <input
                  type="text"
                  name="youtube"
                  id="youtube"
                  placeholder="URL do canal"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={formData.platforms.youtube}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="tiktok" className="block text-sm text-gray-500">
                  TikTok
                </label>
                <input
                  type="text"
                  name="tiktok"
                  id="tiktok"
                  placeholder="@seuperfil"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={formData.platforms.tiktok}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </>
        )}

        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => setStep('type')}
            className="text-blue-600 hover:text-blue-500"
          >
            Voltar
          </button>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Criar conta
          </button>
        </div>
      </form>
    </div>
  );
}