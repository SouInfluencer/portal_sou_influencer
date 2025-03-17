import React from 'react';
import { User, Mail, Building2, Instagram, Users } from 'lucide-react';
import type { WaitlistFormData } from './types/waitlist.ts';
import { MultiSelect } from './MultiSelect.tsx';

interface WaitlistFormProps {
  userType: 'influencer' | 'brand';
  formData: WaitlistFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string[]) => void;
  handleCTAClick: (type: 'influencer' | 'brand') => void;
  socialNetworkOptions: Array<{ value: string; label: string; icon: React.ReactNode }>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
}

export function WaitlistForm({
                               userType,
                               formData,
                               handleInputChange,
                               handleCTAClick,
                               socialNetworkOptions,
                               onSubmit,
                               isSubmitting
                             }: WaitlistFormProps) {
  return (
      <form onSubmit={onSubmit} className="space-y-6 animate-scale-in">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-blue-100 shadow-lg">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nome Completo <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow input-focus-animation animate-fade-in stagger-1"
                      placeholder="Seu nome completo"
                      required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  E-mail <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow input-focus-animation animate-fade-in stagger-2"
                      placeholder="seu@email.com"
                      required
                  />
                </div>
              </div>
            </div>

            {/* Profile Specific Fields */}
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Instagram <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Instagram className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        name="influencer_profile.instagram_handle"
                        value={formData.influencer_profile?.instagram_handle || ''}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow input-focus-animation animate-fade-in stagger-1"
                        placeholder="@seu.instagram"
                        required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Número de Seguidores <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Users className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="number"
                        name="influencer_profile.followers_count"
                        value={formData.influencer_profile?.followers_count || ''}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-shadow input-focus-animation animate-fade-in stagger-2"
                        placeholder="Ex: 1000"
                        required
                        min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Outras Redes Sociais
                </label>
                <MultiSelect
                    options={socialNetworkOptions}
                    value={formData.influencer_profile?.social_networks.split(',').filter(Boolean) || []}
                    onChange={handleInputChange}
                    placeholder="Selecione suas outras redes sociais"
                    className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-gradient-to-r button-pulse ${
                userType === 'influencer' ? 'from-blue-600 to-blue-600' : 'from-blue-600 to-blue-700'
            } text-white py-4 rounded-lg font-semibold transform hover:scale-[1.02] transition-all animate-fade-in stagger-3 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
            }`}
        >
          {isSubmitting ? 'Processando...' : 'Garantir Acesso Antecipado'}
        </button>

        <p className="text-xs text-gray-500 text-center animate-fade-in stagger-3">
          Ao se inscrever, você concorda com nossa{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700 underline">
            Política de Privacidade
          </a>
        </p>
      </form>
  );
}