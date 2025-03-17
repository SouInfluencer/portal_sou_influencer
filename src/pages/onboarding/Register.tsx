import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, User, Building2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { userService } from '../../services/userService';

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

@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
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
`;

function Register() {
  const navigate = useNavigate();
  const [mounted, setMounted] = React.useState(false);
  const [step, setStep] = useState<'type' | 'username' | 'details'>('type');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'INFLUENCER' as 'INFLUENCER' | 'ADVERTISER',
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const validateForm = async () => {
    switch (step) {
      case 'type':
        if (!formData.type) {
          setError('Selecione seu tipo de perfil');
          return false;
        }
        break;

      case 'username':
        if (!formData.username.trim()) {
          setError('Nome de usuário é obrigatório');
          return false;
        }
        if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
          setError('Nome de usuário deve conter entre 3 e 20 caracteres e apenas letras, números e _');
          return false;
        }

        try {
          const isAvailable = await userService.checkUsernameAvailability(formData.username);
          if (!isAvailable) {
            setError('Este nome de usuário já está em uso');
            return false;
          }
        } catch (err) {
          console.error('Error checking username:', err);
          setError('Erro ao verificar disponibilidade do nome de usuário');
          return false;
        }
        break;

      case 'details':
        if (!formData.firstName.trim()) {
          setError('Nome é obrigatório');
          return false;
        }
        if (!/^[a-zA-ZÀ-ú\s]+$/.test(formData.firstName)) {
          setError('O nome deve conter apenas letras e espaços');
          return false;
        }

        if (!formData.lastName.trim()) {
          setError('Sobrenome é obrigatório');
          return false;
        }
        if (!/^[a-zA-ZÀ-ú\s]+$/.test(formData.lastName)) {
          setError('O sobrenome deve conter apenas letras e espaços');
          return false;
        }

        if (!formData.email.trim()) {
          setError('Email é obrigatório');
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          setError('Email inválido');
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

        // Check if email already exists
        try {
          const { data } = await supabase
            .from('users')
            .select('email')
            .eq('email', formData.email);

          if (data && data.length > 0) {
            setError('Este email já está cadastrado');
            return false;
          }
        } catch (err) {
          console.error('Error checking email:', err);
          setError('Erro ao verificar disponibilidade do email');
          return false;
        }
        break;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await validateForm();
    if (!isValid) {
      return;
    }

    if (step !== 'details') {
      setStep(step === 'type' ? 'username' : 'details');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Sign up with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            username: formData.username,
            profile: formData.type,
            full_name: `${formData.firstName} ${formData.lastName}`
          }
        }
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // Create user profile in users table
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email: formData.email,
              username: formData.username,
              first_name: formData.firstName,
              last_name: formData.lastName,
              profile: formData.type,
              full_name: `${formData.firstName} ${formData.lastName}`,
              complete_registration: false
            }
          ]);

        if (profileError) {
          // Rollback auth user creation if profile creation fails
          const { error: deleteError } = await supabase.auth.admin.deleteUser(authData.user.id);
          if (deleteError) console.error('Error rolling back user creation:', deleteError);
          throw new Error('Erro ao criar perfil do usuário');
        }

        // Show success message
        toast.success(
          <div className="flex flex-col gap-1">
            <span className="font-medium">Conta criada com sucesso! 🎉</span>
            <span className="text-sm">Verifique seu email para confirmar sua conta.</span>
          </div>,
          { duration: 5000 }
        );

        // Redirect to login
        navigate('/login');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Erro ao criar conta');
      
      toast.error(
        <div className="flex flex-col gap-1">
          <span className="font-medium">Erro ao criar conta</span>
          <span className="text-sm">{err instanceof Error ? err.message : 'Tente novamente mais tarde'}</span>
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-20 blur-[100px] transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-20' : 'translate-y-12 opacity-0'}`} />
        <div className={`absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full opacity-20 blur-[100px] transition-all duration-1000 delay-300 ${mounted ? 'translate-x-0 opacity-20' : '-translate-x-12 opacity-0'}`} />
        <div className={`absolute -bottom-40 right-1/3 w-96 h-96 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full opacity-20 blur-[100px] transition-all duration-1000 delay-500 ${mounted ? 'translate-y-0 opacity-20' : 'translate-y-12 opacity-0'}`} />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className={`text-center text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-blue-500 animate-gradient mb-2 transition-all duration-1000 delay-200 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          Crie sua conta
        </h2>
        <p className={`mt-2 text-center text-gray-600 transition-all duration-1000 delay-400 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          Já tem uma conta?{' '}
          <button
            onClick={() => navigate('/login')}
            className="font-medium text-blue-600 hover:text-blue-500 min-h-[44px] px-3 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
          >
            Faça login
          </button>
        </p>
      </div>

      <div className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md transition-all duration-1000 delay-600 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="bg-white/90 backdrop-blur-sm py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {['type', 'username', 'details'].map((s, i) => (
                <React.Fragment key={s}>
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
                      step === s
                        ? 'bg-blue-600 text-white'
                        : step === 'details' && s === 'username'
                          ? 'bg-blue-600 text-white'
                          : step === 'details' && s === 'type'
                            ? 'bg-blue-600 text-white'
                            : step === 'username' && s === 'type'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-400'
                    }`}>
                      {i + 1}
                    </div>
                    <span className={`ml-2 text-sm font-medium ${
                      step === s ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {s === 'type' ? 'Perfil' : s === 'username' ? 'Usuário' : 'Detalhes'}
                    </span>
                  </div>
                  {i < 2 && (
                    <div className="hidden sm:block flex-1 mx-4 h-0.5 bg-gray-200" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

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
            {step === 'type' && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Escolha seu perfil</h3>
                  <p className="mt-1 text-sm text-gray-500">Selecione como você deseja se cadastrar</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'INFLUENCER' })}
                  className={`w-full p-4 text-left border rounded-lg hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                    formData.type === 'INFLUENCER' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center">
                    <User className="h-6 w-6 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-base font-medium text-gray-900">Sou Influenciador</p>
                      <p className="text-sm text-gray-500">Quero criar conteúdo e participar de campanhas</p>
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'ADVERTISER' })}
                  className={`w-full p-4 text-left border rounded-lg hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                    formData.type === 'ADVERTISER' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center">
                    <Building2 className="h-6 w-6 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-base font-medium text-gray-900">Sou Anunciante</p>
                      <p className="text-sm text-gray-500">Quero encontrar influenciadores para minhas campanhas</p>
                    </div>
                  </div>
                </button>
              </div>
            )}

            {step === 'username' && (
              <div className="space-y-12">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Escolha seu @usuário</h3>
                  <p className="mt-1 text-sm text-gray-500">Este será seu identificador único na plataforma e sua URL personalizada</p>
                </div>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Nome de usuário
                  </label>
                  <div className="mt-1 space-y-2">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white/80 hover:bg-white focus:bg-white transition-all duration-200 hover:border-gray-400 transform hover:translate-y-[-1px] min-h-[44px]"
                      placeholder="seu_username"
                    />
                    <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
                      <span className="text-sm text-gray-500">www.souinfluencer.com.br/</span>
                      <span className="text-sm font-medium text-gray-900">{formData.username || 'seu_username'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 'details' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    Nome
                  </label>
                  <div className="mt-1 space-y-2">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white/80 hover:bg-white focus:bg-white transition-all duration-200 hover:border-gray-400 transform hover:translate-y-[-1px] min-h-[44px]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Sobrenome
                  </label>
                  <div className="mt-1 space-y-2">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white/80 hover:bg-white focus:bg-white transition-all duration-200 hover:border-gray-400 transform hover:translate-y-[-1px] min-h-[44px]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1 space-y-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white/80 hover:bg-white focus:bg-white transition-all duration-200 hover:border-gray-400 transform hover:translate-y-[-1px] min-h-[44px]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Senha
                  </label>
                  <div className="mt-1 space-y-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white/80 hover:bg-white focus:bg-white transition-all duration-200 hover:border-gray-400 transform hover:translate-y-[-1px] min-h-[44px]"
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
                      minLength={8}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white/80 hover:bg-white focus:bg-white transition-all duration-200 hover:border-gray-400 transform hover:translate-y-[-1px] min-h-[44px]"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] min-h-[44px]"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Criando conta...
                  </>
                ) : (
                  step === 'details' ? 'Criar conta' : 'Continuar'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;

export { Register }