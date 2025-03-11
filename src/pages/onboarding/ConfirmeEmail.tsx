import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const styles = `
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 8s ease infinite;
}
@keyframes slide-up {
  from { transform: translateY(1.25rem); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-slide-up {
  animation: slide-up 0.6s ease-out forwards;
}
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}
/* Styling for mobile responsiveness */
@media (max-width: 640px) {
  .heading {
    font-size: 1.75rem;
  }
  .container {
    padding-left: 1em;
    padding-right: 1em;
  }
}
`;

export function ConfirmeEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailToken = searchParams.get('emailToken');
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<'validating' | 'invalid' | 'valid' | 'submitting' | 'success'>('validating');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    setMounted(true);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    const validateToken = async () => {
      if (!emailToken) {
        setStatus('invalid');
        setError('Token de verificação não fornecido.');
        return;
      }

      try {
        const response = await fetch('https://api.souinfluencer.com.br/auth/confirm-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ emailToken }),
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Token inválido.');
        }

        if (data.success) {
          setStatus('valid');
          setTimeout(() => {
            setStatus('success');
          }, 2000);
        } else {
          setStatus('invalid');
          setError('Token inválido ou expirado.');
        }
      } catch (err) {
        setStatus('invalid');
        setError(
            err instanceof Error
                ? err.message
                : 'Ocorreu um erro durante o processo de validação.'
        );
      }
    };

    validateToken();
  }, [emailToken]);

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-20 blur-[100px] transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-20' : 'translate-y-12 opacity-0'}`} />
          <div className={`absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full opacity-20 blur-[100px] transition-all duration-1000 delay-300 ${mounted ? 'translate-x-0 opacity-20' : '-translate-x-12 opacity-0'}`} />
          <div className={`absolute -bottom-40 right-1/3 w-96 h-96 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full opacity-20 blur-[100px] transition-all duration-1000 delay-500 ${mounted ? 'translate-y-0 opacity-20' : 'translate-y-12 opacity-0'}`} />
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-8 min-h-[44px] px-3 py-2 rounded-lg hover:bg-gray-100/80 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para login
          </button>

          <h2 className={`text-center text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-blue-500 animate-gradient mb-2 transition-all duration-1000 delay-200 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Confirmar E-mail
          </h2>
        </div>

        <div className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md transition-all duration-1000 delay-600 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="bg-white/90 backdrop-blur-sm py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100">
            {/* Validating State */}
            {status === 'validating' && (
                <div className="flex items-center justify-center gap-3 animate-fade-in">
                  <Loader className="h-6 w-6 animate-spin text-blue-500" />
                  <p className="text-sm text-gray-700">Validando seu token...</p>
                </div>
            )}
            {/* Invalid State */}
            {status === 'invalid' && error && (
                <div className="mb-4 rounded-md bg-red-50 p-4 animate-fade-in">
                  <div className="flex">
                    <AlertCircle className="h-6 w-6 text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-800 ml-3 font-medium">{error}</p>
                  </div>
                </div>
            )}
            {/* Success State */}
            {status === 'success' && (
                <div className="mb-4 rounded-md bg-green-50 p-4 animate-fade-in">
                  <div className="flex">
                    <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                    <p className="text-sm text-green-800 ml-3 font-medium">
                      Seu e-mail foi confirmado com sucesso!
                    </p>
                  </div>
                  <button
                      onClick={() => navigate('/login')}
                      className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all"
                  >
                    Continuar para Login
                  </button>
                </div>
            )}
          </div>
        </div>
      </div>
  );
}