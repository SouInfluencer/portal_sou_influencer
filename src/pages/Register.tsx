import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Building2, AlertCircle } from 'lucide-react';
import { authService } from '../services/auth';

// Add keyframes for animations
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

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
`;

export function Register() {
  const navigate = useNavigate();
  const [mounted, setMounted] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('Nome é obrigatório');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Sobrenome é obrigatório');
      return false;
    }
    if (!formData.password) {
      setError('Senha é obrigatória');
      return false;
    }
    if (formData.password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });

      // User is now automatically logged in
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-200 to-indigo-300 rounded-full opacity-20 blur-[100px] transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-20' : 'translate-y-12 opacity-0'}`} />
        <div className={`absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full opacity-20 blur-[100px] transition-all duration-1000 delay-300 ${mounted ? 'translate-x-0 opacity-20' : '-translate-x-12 opacity-0'}`} />
        <div className={`absolute -bottom-40 right-1/3 w-96 h-96 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full opacity-20 blur-[100px] transition-all duration-1000 delay-500 ${mounted ? 'translate-y-0 opacity-20' : 'translate-y-12 opacity-0'}`} />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className={`flex items-center justify-center transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center shadow-lg">
            <Building2 className="h-7 w-7 text-white" />
          </div>
        </div>
        <h2 className={`mt-6 text-center text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-500 animate-gradient transition-all duration-1000 delay-200 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          Crie sua conta
        </h2>
        <p className={`mt-2 text-center text-sm text-gray-600 transition-all duration-1000 delay-400 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          Já tem uma conta?{' '}
          <button
            onClick={() => navigate('/login')}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Faça login
          </button>
        </p>
      </div>

      <div className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md transition-all duration-1000 delay-600 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="bg-white/90 backdrop-blur-sm py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100 relative overflow-hidden">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <div className="mt-1">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/80 hover:bg-white focus:bg-white transition-all duration-200 hover:border-gray-400 transform hover:translate-y-[-1px]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Sobrenome
                </label>
                <div className="mt-1">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/80 hover:bg-white focus:bg-white transition-all duration-200 hover:border-gray-400 transform hover:translate-y-[-1px]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/80 hover:bg-white focus:bg-white transition-all duration-200 hover:border-gray-400 transform hover:translate-y-[-1px]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/80 hover:bg-white focus:bg-white transition-all duration-200 hover:border-gray-400 transform hover:translate-y-[-1px]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirme sua senha
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/80 hover:bg-white focus:bg-white transition-all duration-200 hover:border-gray-400 transform hover:translate-y-[-1px]"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-200" />
                <div className="relative">
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Criando conta...
                  </div>
                ) : (
                  'Criar conta'
                )}
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}