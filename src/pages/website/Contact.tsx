import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Send, Instagram, Facebook, Linkedin, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

// Add mobile-first styles
const styles = `
/* Base styles */
:root {
  --min-touch-target: clamp(2.75rem, 8vw, 3rem);
  --container-padding: clamp(1rem, 5vw, 2rem);
  --font-size-base: clamp(0.875rem, 4vw, 1rem);
  --font-size-lg: clamp(1.125rem, 5vw, 1.25rem);
  --font-size-xl: clamp(1.5rem, 6vw, 1.875rem);
  --spacing-base: clamp(1rem, 4vw, 1.5rem);
  --border-radius: clamp(0.75rem, 3vw, 1rem);
}

/* Mobile-first media queries */
@media (max-width: 480px) {
  .container {
    padding: var(--container-padding);
  }
  
  .content-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-base);
  }
  
  .contact-form {
    padding: var(--spacing-base);
  }
  
  .contact-info {
    padding: var(--spacing-base);
  }
  
  .button {
    width: 100%;
    min-height: var(--min-touch-target);
    justify-content: center;
  }
  
  .input {
    min-height: var(--min-touch-target);
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .content-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .contact-form {
    padding: calc(var(--spacing-base) * 1.25);
  }
  
  .contact-info {
    padding: calc(var(--spacing-base) * 1.25);
  }
}

@media (min-width: 769px) {
  .content-grid {
    grid-template-columns: 2fr 1fr;
  }
  
  .contact-form {
    padding: calc(var(--spacing-base) * 1.5);
  }
  
  .contact-info {
    padding: calc(var(--spacing-base) * 1.5);
  }
}
`;

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function Contact() {
  const navigate = useNavigate();
  const [mounted, setMounted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  React.useEffect(() => {
    // Add styles to document
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Trigger mount animation
    setMounted(true);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement contact form submission
      // For now, just simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success(
        <div className="flex flex-col gap-1">
          <span className="font-medium">Mensagem enviada com sucesso!</span>
          <span className="text-sm">Retornaremos em breve.</span>
        </div>
      );

      // Clear form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 container">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-20 blur-[100px] transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-20' : 'translate-y-12 opacity-0'}`} />
        <div className={`absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full opacity-20 blur-[100px] transition-all duration-1000 delay-300 ${mounted ? 'translate-x-0 opacity-20' : '-translate-x-12 opacity-0'}`} />
        <div className={`absolute -bottom-40 right-1/3 w-96 h-96 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full opacity-20 blur-[100px] transition-all duration-1000 delay-500 ${mounted ? 'translate-y-0 opacity-20' : 'translate-y-12 opacity-0'}`} />
      </div>

      <div className="max-w-7xl mx-auto py-12">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6 min-h-[44px] px-3 py-2 rounded-lg hover:bg-gray-100/80 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </button>

          <h1 className={`text-4xl font-bold text-gray-900 mb-4 transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Entre em Contato
          </h1>
          <p className={`text-lg text-gray-600 transition-all duration-1000 delay-200 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Estamos aqui para ajudar! Envie sua mensagem e retornaremos em breve.
          </p>
        </div>

        {/* Content Grid */}
        <div className={`grid gap-8 content-grid transition-all duration-1000 delay-400 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 contact-form">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nome
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm input"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm input"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Assunto
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm input"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Mensagem
                </label>
                <div className="mt-1">
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm resize-none"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed button"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Enviar Mensagem
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            {/* Quick Contact */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 contact-info">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Informações de Contato</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <a href="mailto:contato@souinfluencer.com.br" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      contato@souinfluencer.com.br
                    </a>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Telefone</p>
                    <a href="tel:+551199999999" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      +55 (11) 9999-9999
                    </a>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Endereço</p>
                    <p className="text-sm text-gray-600">
                      Av. Paulista, 1000<br />
                      São Paulo - SP, 01310-100
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 contact-info">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Redes Sociais</h3>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="https://www.instagram.com/souinfluenceroficial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 rounded-lg bg-gradient-to-br from-pink-50 to-white border border-pink-100 hover:border-pink-200 transition-all duration-200 group"
                >
                  <Instagram className="h-6 w-6 text-pink-600 mr-3" />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900">Instagram</span>
                </a>

                <a
                  href="https://www.facebook.com/profile.php?id=61572996658426"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-white border border-blue-100 hover:border-blue-200 transition-all duration-200 group"
                >
                  <Facebook className="h-6 w-6 text-blue-600 mr-3" />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900">Facebook</span>
                </a>

                <a
                  href="https://www.linkedin.com/company/sou-influencer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-white border border-blue-100 hover:border-blue-200 transition-all duration-200 group"
                >
                  <Linkedin className="h-6 w-6 text-blue-600 mr-3" />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900">LinkedIn</span>
                </a>

                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/dashboard/messages');
                  }}
                  className="flex items-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-white border border-purple-100 hover:border-purple-200 transition-all duration-200 group"
                >
                  <MessageSquare className="h-6 w-6 text-purple-600 mr-3" />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900">Chat</span>
                </a>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 contact-info">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Horário de Atendimento</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Segunda - Sexta</span>
                  <span className="text-sm font-medium text-gray-900">09:00 - 18:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sábado</span>
                  <span className="text-sm font-medium text-gray-900">10:00 - 14:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Domingo</span>
                  <span className="text-sm font-medium text-gray-900">Fechado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}