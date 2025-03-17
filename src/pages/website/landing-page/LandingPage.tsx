import React, { useState, useEffect } from 'react';
import { Users, Building2, Instagram, Facebook, ChevronRight, Menu, X as Close, Check } from 'lucide-react';
import { SuccessModal } from '../../../components/SuccessModal.tsx';
import { useNavigate } from 'react-router-dom';
import {Toaster} from "react-hot-toast";

function LandingPage() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ dia: 0, hora: 0, minuto: 0, segundo: 0 });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedName] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const calculateTimeLeft = () => {
    const targetDate = new Date('2025-07-01');
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
    const timer: NodeJS.Timeout = setInterval(() => {
      const { dia, hora, minuto, segundo } = calculateTimeLeft();
      setTimeLeft({ dia: dia, hora: hora, minuto: minuto, segundo: segundo });
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Toaster position="top-right"/>
        <SuccessModal
            isOpen={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            userName={submittedName.split(' ')[0]}
        />

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/80 z-10"/>
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
                          onClick={() => navigate('/influencer')}
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
                        onClick={() => navigate('/advertiser')}
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


        <footer id="contact" className="bg-gradient-to-t from-blue-700 to-blue-700  text-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center space-x-2 mb-6">
                  <img width={188} alt="Logo"
                       src="https://firebasestorage.googleapis.com/v0/b/sou-influencer.firebasestorage.app/o/logo-sou-influencer_branca.png?alt=media&token=d47b1810-6ce0-4960-b033-95d12e2bc661"
                  />
                </div>
                <p className="text-white">
                  Somos uma plataforma inovadora que conecta influenciadores e anunciantes, promovendo campanhas
                  eficazes e parcerias duradouras.
                </p>
              </div>
              {/* Links */}
              <div className="flex flex-col items-start">
                <h3 className="text-xl font-semibold mb-4">Links Rápidos</h3>
                <ul className="space-y-2">
                  <li>
                    <a onClick={() => navigate('/about')} className="hover:text-blue-400 transition-colors duration-300">Sobre</a>
                  </li>
                  <li>
                    <a onClick={() => navigate('/terms')} className="hover:text-blue-400 transition-colors duration-300">Termos de Uso</a>
                  </li>
                  <li>
                    <a onClick={() => navigate('/privacy')} className="hover:text-blue-400 transition-colors duration-300">Política de
                      Privacidade</a>
                  </li>
                  <li>
                    <a onClick={() => navigate('/contact')} className="hover:text-blue-400 transition-colors duration-300">Contato</a>
                  </li>
                </ul>
              </div>

              {/* Redes Sociais */}
              <div className="flex flex-col items-start">
                <h3 className="text-xl font-semibold mb-4">Siga-nos</h3>
                <div className="flex space-x-6">
                  <a
                      href="https://www.facebook.com/profile.php?id=61572996658426"
                      target="_blank"
                      className="text-white hover:text-blue-600 transition-colors duration-300"
                      aria-label="Facebook"
                  >
                    <Facebook className="h-6 w-6"/>
                  </a>
                  <a
                      href="https://www.instagram.com/souinfluenceroficial/"
                      target="_blank"
                      className="text-white hover:text-pink-600 transition-colors duration-300"
                      aria-label="Instagram"
                  >
                    <Instagram className="h-6 w-6"/>
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-4 border-t border-blue-700/90 pt-8 text-center">
              <p className="text-sm text-white">
                &copy; {new Date().getFullYear()} Sou Influencer. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </footer>
      </div>
  );
}

export default LandingPage;