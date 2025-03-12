import React, { useState, FormEvent, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Users, Building2, TrendingUp, Shield, Zap, Instagram, Twitter, Facebook, Linkedin as LinkedIn, ChevronRight, Calculator, Youtube, Twitch, GitBranch as BrandTiktok, Menu, X as Close, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { WaitlistFormData } from './types/waitlist';
import { PostValueCalculator } from './components/PostValueCalculator';
import { WaitlistForm } from './components/WaitlistForm';
import { useAnalytics } from './hooks/useAnalytics';
import { SuccessModal } from './components/SuccessModal';
import { useCommunityStats } from './hooks/useCommunityStats';
import logoRetangulo from '@/assets/logo_retangulo_light.svg';
import logoLetter from '@/assets/logo_letter_light.svg';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ dia: 0, hora: 0, minuto: 0, segundo: 0 });

  const { trackButtonClick, trackFormSubmit, trackError, logEvent } = useAnalytics();
  const { totalMembers, recentMembers, isLoading, totalFollowers} = useCommunityStats();
  const [userType, setUserType] = useState<'influencer' | 'brand'>('influencer');
  const [followersCount, setFollowersCount] = useState<number | ''>(1000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState<WaitlistFormData>({
    full_name: '',
    email: '',
    profile_type: 'influencer',
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
      setTimeLeft({ dia: dia, hora: hora, minuto: minuto, segundo: segundo });
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  const handleCTAClick = (type: 'influencer' | 'advertiser') => {
    trackButtonClick(`cta_${type}`, 'conversion');
    setUserType(type);
    navigate(type)
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
            instagram_handle: userType === 'influencer' ? instagramHandle : null
          }])
          .select()
          .single();

      if (waitlistError) throw waitlistError;

      if (formData.profile_type === 'influencer' && formData.influencer_profile) {
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
            {formData.profile_type === 'influencer'
                ? 'Sua jornada como criador de conteúdo começa aqui!'
                : 'Sua marca está pronta para encontrar os melhores criadores!'}
          </span>
          </div>,
          {
            duration: 5000,
            style: {
              background: 'linear-gradient(to right, #7c3aed, #db2777)',
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
                    onClick={() => navigate('/advertiser')}
                    className="text-white/80 hover:text-white transition-colors">
                  Anunciantes
                </button>

                <button
                    onClick={() => navigate('/influencer')}
                    className="text-white/80 hover:text-white transition-colors">
                  Influenciadores
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
              <h1 className="text-4xl md:text-7xl font-bold mb-6 text-white leading-tight">
                Marketing de Influência
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-12">
                Em breve, a maior plataforma de Marketing de Influência do Brasil. Conectaremos negócios a
                influenciadores de todos os
                tamanhos, impulsionando campanhas autênticas e gerando resultados reais.
              </p>
            </div>
          </header>
        </div>

        <section id="calculator" className="relative z-20 -mt-20 mb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-8xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <section className="container mx-auto px-4 mb-20">
                <div className="grid md:grid-cols-2 gap-8">
                  <div
                      className="bg-white rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="relative h-48 mb-6 rounded-xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-blue-800/80 z-10"/>
                      <img
                          src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
                          alt="Influencer creating content"
                          className="absolute inset-0 w-full h-full object-cover"
                      />
                      <Users className="w-12 h-12 text-white absolute bottom-4 left-4 z-20"/>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold mb-4">Para Influenciadores</h2>
                    <p className="text-gray-600 mb-6">
                      Seja você um criador iniciante ou experiente, aqui sua voz tem valor. Conecte-se com anunciantes
                      que compartilham seus interesses e estilo, sem importar o seu alcance. Descubra novas formas de
                      crescer e gerar valor com seu conteúdo.
                    </p>

                    <div className="text-gray-600 mb-6 space-y-4">
                      <ul className="text-gray-500 mt-6 space-y-2">
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500"/>
                          Monetize sua criação de conteúdo
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500"/>
                          Receba oportunidades alinhadas com seu perfil
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500"/>
                          Transforme sua paixão em fonte de renda
                        </li>
                      </ul>

                      <button
                          onClick={() => handleCTAClick('influencer')}
                          className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center md:justify-start"
                      >
                        Sou Influencer
                        <ChevronRight className="w-4 h-4 ml-2"/>
                      </button>
                    </div>
                    </div>

                    <div
                        className="bg-white rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                      <div className="relative h-48 mb-6 rounded-xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-purple-800/80 z-10"/>
                        <img
                            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0"
                            alt="Equipe de marketing analisando dados em reunião"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <Building2 className="w-12 h-12 text-white absolute bottom-4 left-4 z-20"/>
                      </div>

                      <h2 className="text-xl md:text-2xl font-bold mb-4">Para Anunciantes</h2>
                      <div className="text-gray-600 mb-6 space-y-4">
                        <p>
                          Conecte seu negócio a influenciadores que realmente engajam seu público-alvo. De
                          microinfluenciadores em nichos específicos a grandes criadores de conteúdo, nossa inteligência
                          artificial encontra os parceiros ideais para maximizar seus resultados.
                        </p>

                        <ul className="text-gray-500 mt-6 space-y-2">
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500"/>
                            Alcance o público certo para o seu negócio
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500"/>
                            Aumente seu engajamento e conversões
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500"/>
                            Impulsione seu crescimento com campanhas estratégicas
                          </li>
                        </ul>
                      </div>

                      <button
                          onClick={() => handleCTAClick('advertiser')}
                          className="w-full md:w-auto bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 font-medium"
                      >
                        Sou Anunciante
                        <ChevronRight className="w-4 h-4 mt-0.5"/>
                      </button>
                    </div>
                  </div>
              </section>
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
                  <span className="text-4xl md:text-5xl font-bold text-blue-500">
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

export default LandingPage;