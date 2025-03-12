import React, { useState, FormEvent, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import {
  Users,
  Building2,
  TrendingUp,
  Shield,
  Zap,
  Instagram,
  Twitter,
  Facebook,
  Linkedin as LinkedIn,
  ChevronRight,
  Calculator,
  Youtube,
  Twitch,
  GitBranch as BrandTiktok,
  Menu,
  X as Close,
  Check,
  Sparkles
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { WaitlistFormData } from './types/waitlist';
import { useAnalytics } from './hooks/useAnalytics';
import { SuccessModal } from './components/SuccessModal';
import { useCommunityStats } from './hooks/useCommunityStats';
import {useNavigate} from "react-router-dom";
import {PostAdvertiserCalculator} from "./components/PostAdvertiserCalculator.tsx";
import {WaitlistInfluencerForm} from "./components/WaitlistInfluencerForm.tsx";

function AdvertiserLanding() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const { trackButtonClick, trackFormSubmit, trackError, logEvent } = useAnalytics();
  const { totalAdvertisers, recentMembers, isLoading, totalFollowers} = useCommunityStats();
  const [userType, setUserType] = useState<'influencer' | 'brand'>('brand');
  const [followersCount, setFollowersCount] = useState<number | ''>(1000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState<WaitlistFormData>({
    full_name: '',
    email: '',
    profile_type: 'brand',
    influencer_profile: {
      followers_count: 0,
      instagram_handle: '',
      social_networks: ''
    },
    brand_profile: {
      segment: '',
      company_size: 'small'
    }
  });

  const socialNetworkOptions = [
    { value: 'instagram', label: 'Instagram', icon: <Instagram className="w-4 h-4" /> },
    { value: 'tiktok', label: 'TikTok', icon: <BrandTiktok className="w-4 h-4" /> },
    { value: 'youtube', label: 'YouTube', icon: <Youtube className="w-4 h-4" /> },
    { value: 'facebook', label: 'Facebook', icon: <Facebook className="w-4 h-4" /> },
    { value: 'twitter', label: 'Twitter', icon: <Twitter className="w-4 h-4" /> },
    { value: 'linkedin', label: 'LinkedIn', icon: <LinkedIn className="w-4 h-4" /> },
    { value: 'twitch', label: 'Twitch', icon: <Twitch className="w-4 h-4" /> }
  ];

  const calculateTimeLeft = () => {
    const targetDate = new Date('2025-08-16'); // Target launch date
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference <= 0) {
      return { dia: 0, hora: 0, minuto: 0, segundo: 0 };
    }

    return {
      dia: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hora: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minuto: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      segundo: Math.floor((difference % (1000 * 60)) / 1000),
    };
  };

  useEffect(() => {
    if (followersCount !== '') {
      logEvent('calculator_use', {
        followers_count: followersCount,
        event_category: 'engagement',
        event_label: 'value_calculator'
      });
    }
  }, [followersCount, logEvent]);

  useEffect(() => {
    const timer: NodeJS.Timeout = setInterval(() => {
      const { dia, hora, minuto, segundo } = calculateTimeLeft();
      setTimeLeft({ days: dia, hours: hora, minutes: minuto, seconds: segundo });
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  const handleCTAClick = (type: 'influencer' | 'brand') => {
    trackButtonClick(`cta_${type}`, 'conversion');
    setUserType(type);
    setFormData(prev => ({ ...prev, profile_type: type }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check if email already exists
      const { data: existingUsers, error: checkError } = await supabase
          .from('waitlist')
          .select('id')
          .eq('email', formData.email);

      if (checkError) {
        throw checkError;
      }

      if (existingUsers && existingUsers.length > 0) {
        toast.error('Este e-mail já está cadastrado na lista de espera!');
        setIsSubmitting(false);
        return;
      }

      // Remove @ from Instagram handle if present
      const instagramHandle = formData.influencer_profile?.instagram_handle?.replace('@', '');

      const { data: waitlistData, error: waitlistError } = await supabase
          .from('waitlist')
          .insert([{
            full_name: formData.full_name,
            email: formData.email,
            profile_type: formData.profile_type,
            instagram_handle: userType === 'brand' ? instagramHandle : null
          }])
          .select()
          .single();

      if (waitlistError) throw waitlistError;

      if (formData.profile_type === 'brand' && formData.influencer_profile) {
        const { error: profileError } = await supabase
            .from('influencer_profiles')
            .insert([{
              waitlist_id: waitlistData.id,
              followers_count: formData.influencer_profile.followers_count,
              instagram_handle: instagramHandle,
              social_networks: formData.influencer_profile.social_networks
            }]);

        if (profileError) throw profileError;
      } else if (formData.profile_type === 'brand' && formData.brand_profile) {
        const { error: profileError } = await supabase
            .from('brand_profiles')
            .insert([{
              waitlist_id: waitlistData.id,
              segment: formData.brand_profile.segment,
              company_size: formData.brand_profile.company_size
            }]);

        if (profileError) throw profileError;
      }

      trackFormSubmit('waitlist', true);
      toast.success(
          <div className="flex flex-col gap-1">
            <span className="font-medium">Bem-vindo à comunidade! 🎉</span>
            <span className="text-sm">
            {formData.profile_type === 'brand'
                ? 'Sua jornada como criador de conteúdo começa aqui!'
                : 'Sua marca está pronta para encontrar os melhores criadores!'}
          </span>
          </div>,
          {
            duration: 5000,
            style: {
              background: 'linear-gradient(to right, #2563eb, #2563eb)',
              color: 'white',
            },
            icon: '👋'
          }
      );

      // Store the name before resetting form
      setSubmittedName(formData.full_name);
      setShowSuccessModal(true);

      setFormData({
        full_name: '',
        email: '',
        profile_type: userType,
        influencer_profile: {
          followers_count: 0,
          instagram_handle: '',
          social_networks: ''
        },
        brand_profile: {
          segment: '',
          company_size: 'small'
        }
      });
    } catch (error) {
      console.error('Error:', error);
      if (error instanceof Error) {
        trackError('waitlist_submission', error.message || 'Unknown error');
      } else {
        trackError('waitlist_submission', 'Unknown error');
      }

      // Handle specific error cases
      if ((error as { code?: string })?.code === '23505') {
        toast.error(
            <div className="flex flex-col gap-1">
              <span className="font-medium">E-mail já cadastrado</span>
              <span className="text-sm">Este e-mail já está na nossa lista de espera</span>
            </div>,
            {
              duration: 4000,
              icon: '⚠️'
            }
        );
      } else {
        toast.error(
            <div className="flex flex-col gap-1">
              <span className="font-medium">Ops! Algo deu errado</span>
              <span className="text-sm">Por favor, tente novamente em alguns instantes</span>
            </div>,
            {
              duration: 4000,
              icon: '❌'
            }
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string[]) => {
    if (Array.isArray(e)) {
      setFormData(prev => ({
        ...prev,
        influencer_profile: {
          ...prev.influencer_profile!,
          social_networks: e.join(',')
        }
      }));
      return;
    }

    const { name, value } = e.target;

    if (name.includes('.')) {
      const [profile, field] = name.split('.');
      if (field === 'followers_count') {
        if (value === '') {
          setFormData(prev => ({
            ...prev,
            [profile]: {
              ...(prev[profile as keyof WaitlistFormData] && typeof prev[profile as keyof WaitlistFormData] === 'object'
                  ? (prev[profile as keyof WaitlistFormData] as Record<string, unknown> | undefined) ?? {}
                  : {}),
              [field]: 0
            }
          }));
          return;
        }

        const numericValue = parseInt(value.replace(/\D/g, ''), 10);

        if (!isNaN(numericValue)) {
          setFormData(prev => ({
            ...prev,
            [profile]: {
              ...(prev[profile as keyof WaitlistFormData] && typeof prev[profile as keyof WaitlistFormData] === 'object'
                  ? (prev[profile as keyof WaitlistFormData] as Record<string, unknown> | undefined) ?? {}
                  : {}),
              [field]: numericValue
            }
          }));
        }
      } else {
        setFormData(prev => ({
          ...prev,
          [profile]: {
            ...(profile in prev && typeof prev[profile as keyof WaitlistFormData] === 'object'
                ? (prev[profile as keyof WaitlistFormData] as Record<string, unknown> | undefined) ?? {}
                : {}),
            [field]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        profile_type: name === 'profile_type' && (value === "influencer" || value === "brand")
            ? value
            : prev.profile_type
      }));
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Toaster position="top-right" />
        <SuccessModal
            isOpen={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            userName={submittedName.split(' ')[0]}
        />

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/80 z-10" />
          <div
              className="absolute inset-0 z-0 bg-cover bg-center"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80")'
              }}
          />

          <header className="relative z-20 container mx-auto px-4 py-6">
            <nav className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img width={188} alt="Logo"
                     src="https://firebasestorage.googleapis.com/v0/b/sou-influencer.firebasestorage.app/o/logo-sou-influencer_branca.png?alt=media&token=d47b1810-6ce0-4960-b033-95d12e2bc661"
                />
              </div>

              <button
                  className="md:hidden text-white p-2"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                    <Close className="w-6 h-6"/>
                ) : (
                    <Menu className="w-6 h-6"/>
                )}
              </button>

              <div className="hidden md:flex space-x-6">
                <button
                    onClick={() => navigate('/influencer')}
                    className="text-white/80 hover:text-white transition-colors">
                  Influencers
                </button>

                <button
                    onClick={() => navigate('/register')}
                    className="text-white/80 hover:text-white transition-colors">
                  Criar Conta
                </button>

                <button
                    onClick={() => navigate('/login')}
                    className="text-white/80 hover:text-white transition-colors"
                >
                  Login
                </button>
              </div>
            </nav>

            {isMobileMenuOpen && (
                <div
                    className="md:hidden absolute top-full left-0 right-0 bg-blue-900/95 backdrop-blur-lg py-4 px-4 z-50">
                  <div className="flex flex-col space-y-4">
                    <a
                        href="#calculator"
                        className="text-white/80 hover:text-white transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Calculadora
                    </a>
                    <a
                        href="#benefits"
                        className="text-white/80 hover:text-white transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Benefícios
                    </a>
                    <a
                        href="#waitlist"
                        className="text-white/80 hover:text-white transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Lista de Espera
                    </a>
                    <a
                        href="#contact"
                        className="text-white/80 hover:text-white transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Contato
                    </a>
                  </div>
                </div>
            )}

            <div className="text-center py-12 md:py-32 px-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-8">
                <span className="block text-white mb-2">Marketing de Influência</span>
                <span className="block text-white">Conquiste seu público</span>
              </h1>

              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-12">
              Do pequeno influencer ao famoso, temos quem faz seu negócio decolar!
                Aqui você acha influencers que realmente conectam com seu público.
              </p>
            </div>
          </header>
        </div>

        <section id="calculator" className="relative z-20 -mt-20 mb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
                Calculadora de Alcance
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <p className="text-gray-600">
                    Descubra o impacto potencial das suas campanhas! Nossa calculadora estima os
                    resultados com base no número de pessoas alcançadas e no formato do conteúdo
                  </p>
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Seu Orçamento da Campanha
                    </label>
                    <div className="flex flex-col md:flex-row gap-4">
                      <input
                          type="text"
                          value={followersCount}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '') {
                              setFollowersCount('');
                            } else {
                              const numericValue = parseInt(value.replace(/\D/g, ''), 10);
                              if (!isNaN(numericValue)) {
                                setFollowersCount(numericValue);
                              }
                            }
                          }}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow text-lg"
                          placeholder="Ex: 1000"
                      />
                      <button
                          onClick={() => setFollowersCount(1000)}
                          className="px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        Exemplo
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <PostAdvertiserCalculator followersCount={followersCount || 0}/>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 mb-20">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative h-48 mb-6 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-blue-800/80 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
                    alt="Influencer creating content"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <Users className="w-12 h-12 text-white absolute bottom-4 left-4 z-20" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-4">Para Influenciadores</h2>
              <p className="text-gray-600 mb-6">
                Seja você um criador iniciante ou já estabelecido, aqui sua voz tem valor.
                Conecte-se com anunciantes que combinam com seu perfil e estilo, independente do seu alcance.

                <p className="text-gray-500 mt-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500"/>
                    Monetize seu conteúdo
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500"/>
                    Receba oportunidades compatíveis com seu perfil
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500"/>
                    Transforme sua paixão em renda
                  </li>
                </p>
              </p>
              <button
                  onClick={() => handleCTAClick('brand')}
                  className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center md:justify-start"
              >
                Começar agora
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative h-48 mb-6 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-purple-800/80 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                    alt="Brand team meeting"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <Building2 className="w-12 h-12 text-white absolute bottom-4 left-4 z-20" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-4">Para Anunciantes</h2>
              <p className="text-gray-600 mb-6">
                Encontre criadores autênticos que falam a língua do seu público. Do nicho mais específico às grandes
                audiências, conectamos sua marca aos influenciadores ideais para campanhas de alto impacto.

                <p className="text-gray-500 mt-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500"/>
                    Acesse uma rede diversificada de criadores
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500"/>
                    Escolha influenciadores alinhados à sua estratégia
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500"/>
                    Acompanhe resultados com métricas precisas
                  </li>
                </p>
              </p>
              <button
                  onClick={() => handleCTAClick('brand')}
                  className="w-full md:w-auto bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center md:justify-start"
              >
                Encontrar influenciadores
                <ChevronRight className="w-4 h-4 ml-2"/>
              </button>
            </div>
          </div>
        </section>

        <section id="benefits" className="container mx-auto px-4 py-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            Benefícios Exclusivos
          </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Por que escolher nossa plataforma?
            </h2>
            <p className="text-lg text-gray-600">
              Conectamos influenciadores e marcas de forma simples, segura e eficiente. Nossa plataforma facilita
              parcerias, garante pagamentos seguros e ajuda você a alcançar os melhores resultados.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Dados e Resultados em Tempo Real
              </h3>
              <p className="text-gray-600 mb-4">
                Acompanhe o desempenho das suas campanhas com um <b>painel fácil de usar</b>, que mostra engajamento,
                alcance e ganhos de forma clara.
              </p>
              <ul className="space-y-3 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Métricas atualizadas automaticamente
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Relatórios simples e personalizados
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Informações sobre seu público
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Pagamentos Seguros e Garantidos
              </h3>
              <p className="text-gray-600 mb-4">
                Os pagamentos são feitos de forma rápida e protegida, garantindo segurança para influenciadores e anunciantes.
              </p>
              <ul className="space-y-3 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Dinheiro garantido para os influenciadores
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Pagamentos automáticos e sem complicação
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Acordos digitais para mais segurança
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Conexões Inteligentes
              </h3>
              <p className="text-gray-600 mb-4">
                Nosso sistema encontra as melhores parcerias para você, conectando influenciadores e anunciantes que realmente combinam.
              </p>
              <ul className="space-y-3 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Sugestões personalizadas para cada perfil
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Filtros para encontrar o parceiro ideal
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Maior chance de sucesso na parceria
                </li>
              </ul>
            </div>
          </div>

        </section>

        <section id="waitlist" className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-3xl p-8 md:p-16 shadow-2xl relative overflow-hidden border border-white/50">
              {/* ... conteúdo existente do background ... */}

              <div className="relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-100 to-blue-100 text-blue-600 rounded-full text-sm font-medium mb-6 gap-2 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
            <span className="relative">
              <span className="absolute -inset-1 bg-blue-200/80 blur-sm rounded-full animate-pulse"/>
              <span className="relative group-hover:scale-105 transition-transform duration-300">Vagas Limitadas</span>
            </span>
          </span>

                  <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700 mb-6 leading-tight">
                    Lista de Espera Exclusiva
                  </h2>

                  <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-12 max-w-xl mx-auto">
                    Seja um dos primeiros a acessar nossa plataforma e aproveitar todas as vantagens. Conecte-se com
                    marcas e influenciadores de forma fácil e segura!
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Total na lista de espera</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {isLoading ? '...' : `${totalAdvertisers.toLocaleString('pt-BR')}+`}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 rounded-lg">
                          <TrendingUp className="w-6 h-6 text-purple-700" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Seguidores totais</p>
                          <p className="text-2xl font-bold text-purple-700">
                            {isLoading ? '...' : `${totalFollowers.toLocaleString('pt-BR')}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between text-sm font-medium text-blue-600">
                      <span>Progresso da lista</span>
                      <span>{500 - totalAdvertisers} vagas restantes</span>
                    </div>

                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                      <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-500 ease-out"
                          style={{width: `${Math.min((totalAdvertisers / 500) * 100, 100)}%`}}
                      />
                    </div>
                  </div>

                  <div className="mb-8">
                    <p className="text-sm font-medium text-blue-600 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"/>
                      Membros recentes que entraram na lista:
                    </p>

                    <div className="flex -space-x-3 overflow-hidden relative">
                      {recentMembers.map((member) => (
                          <div
                              key={member.id}
                              className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center text-sm font-medium text-blue-600 shadow-md hover:z-10 hover:scale-110 transition-all duration-300"
                              title={member.full_name}
                          >
                            {member.full_name.charAt(0).toUpperCase()}
                          </div>
                      ))}
                      {totalAdvertisers > recentMembers.length && (
                          <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-50 flex items-center justify-center text-sm font-medium text-blue-600 shadow-md hover:scale-110 transition-transform duration-300">
                            +{totalAdvertisers - recentMembers.length}
                          </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <WaitlistInfluencerForm
                      userType={userType}
                      formData={formData}
                      handleInputChange={handleInputChange}
                      handleCTAClick={handleCTAClick}
                      socialNetworkOptions={socialNetworkOptions}
                      onSubmit={handleSubmit}
                      isSubmitting={isSubmitting}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer id="contact" className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center space-x-2 mb-6">
                  <img width={188} alt="Logo"
                       src="https://firebasestorage.googleapis.com/v0/b/sou-influencer.firebasestorage.app/o/logo-sou-influencer_branca.png?alt=media&token=d47b1810-6ce0-4960-b033-95d12e2bc661"
                  />
                </div>
                <p className="text-gray-400">
                  Democratizando o marketing de influência no Brasil
                </p>
              </div>
              <div>
                <h3 className="text-gray-400">Lançamento em:</h3>
                <ul className="space-y-4 text-gray-400">
                  <div
                      className="flex flex-col md:flex-row justify-center md:justify-start items-center gap-4 md:gap-8 mb-4 animate-fade-in-up">
                    {Object.entries(timeLeft).map(([interval, value]) => (
                        <div key={interval} className="flex flex-col items-center md:flex-row md:gap-2">
                  <span className="text-4xl md:text-5xl font-bold text-blue-400">
                    {String(value).padStart(2, '0')}
                  </span>
                          <span className="text-gray-500 text-sm md:text-base uppercase mt-1 md:mt-0">{interval}
                            {value !== 1 && 's'}
                  </span>
                        </div>
                    ))}
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
  );
}

export default AdvertiserLanding;