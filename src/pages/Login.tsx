import React, { useState } from 'react';
import { KeyRound, Mail, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

export function Login({ onLogin }: { onLogin: (view: string) => void }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
    remember: boolean;
  }>({
    email: '',
    password: '',
    remember: false
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authService.login({
        email: formData.email,
        password: formData.password,
        checkme: true
      });

      onLogin('dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-8">
          <svg width="320" height="36" viewBox="0 0 1979 228" fill="none" className="transform hover:scale-105 transition-transform duration-300 text-indigo-600" xmlns="http://www.w3.org/2000/svg">
            <path d="M146.649 117.101L99.9171 118.315C99.4313 115.077 98.113 112.21 95.962 109.714C93.811 107.151 91.0008 105.161 87.5315 103.744C84.1315 102.26 80.1765 101.518 75.6663 101.518C69.7685 101.518 64.7379 102.665 60.5747 104.959C56.4809 107.252 54.4687 110.355 54.5381 114.268C54.4687 117.303 55.7176 119.934 58.2849 122.16C60.9216 124.386 65.6053 126.174 72.3358 127.523L103.144 133.189C119.103 136.157 130.968 141.082 138.739 147.962C146.58 154.843 150.535 163.95 150.604 175.282C150.535 185.941 147.274 195.216 140.821 203.108C134.437 211.001 125.694 217.139 114.592 221.524C103.49 225.841 90.7927 228 76.499 228C53.6707 228 35.6648 223.447 22.4813 214.34C9.36722 205.166 1.87345 192.889 0 177.509L50.2708 176.294C51.381 181.961 54.2605 186.278 58.9094 189.246C63.5583 192.214 69.4909 193.698 76.7072 193.698C83.2295 193.698 88.5376 192.518 92.6314 190.157C96.7252 187.796 98.8069 184.659 98.8762 180.746C98.8069 177.239 97.211 174.439 94.0885 172.348C90.9661 170.189 86.0744 168.503 79.4132 167.289L51.5197 162.128C35.4914 159.295 23.5568 154.067 15.7161 146.445C7.87541 138.755 3.98974 128.973 4.05913 117.101C3.98974 106.713 6.83461 97.842 12.5937 90.4892C18.3528 83.0689 26.5405 77.4025 37.1567 73.49C47.7728 69.5775 60.2972 67.6213 74.7296 67.6213C96.3783 67.6213 113.447 72.0397 125.937 80.8766C138.427 89.646 145.331 101.721 146.649 117.101Z" fill="#4F46E5"/>
            <path d="M250.287 228C233.495 228 219.063 224.661 206.99 217.983C194.986 211.237 185.723 201.86 179.2 189.853C172.747 177.778 169.521 163.781 169.521 147.861C169.521 131.874 172.747 117.877 179.2 105.869C185.723 93.7945 194.986 84.418 206.99 77.7398C219.063 70.9941 233.495 67.6213 250.287 67.6213C267.079 67.6213 281.476 70.9941 293.48 77.7398C305.554 84.418 314.817 93.7945 321.27 105.869C327.792 117.877 331.053 131.874 331.053 147.861C331.053 163.781 327.792 177.778 321.27 189.853C314.817 201.86 305.554 211.237 293.48 217.983C281.476 224.661 267.079 228 250.287 228ZM250.599 190.663C256.705 190.663 261.875 188.841 266.107 185.199C270.34 181.556 273.566 176.497 275.787 170.021C278.076 163.545 279.221 156.057 279.221 147.558C279.221 138.923 278.076 131.368 275.787 124.892C273.566 118.416 270.34 113.357 266.107 109.714C261.875 106.072 256.705 104.25 250.599 104.25C244.285 104.25 238.942 106.072 234.571 109.714C230.269 113.357 226.973 118.416 224.683 124.892C222.463 131.368 221.353 138.923 221.353 147.558C221.353 156.057 222.463 163.545 224.683 170.021C226.973 176.497 230.269 181.556 234.571 185.199C238.942 188.841 244.285 190.663 250.599 190.663Z" fill="#4F46E5"/>
            <path d="M460.269 157.98V69.645H511.06V225.066H462.559V196.127H460.893C457.355 205.638 451.318 213.193 442.783 218.792C434.318 224.324 424.084 227.089 412.08 227.089C401.186 227.089 391.611 224.661 383.354 219.804C375.097 214.947 368.678 208.168 364.099 199.466C359.519 190.696 357.195 180.443 357.125 168.705V69.645H408.021V158.992C408.09 167.424 410.38 174.068 414.89 178.925C419.4 183.782 425.541 186.21 433.312 186.21C438.377 186.21 442.922 185.131 446.947 182.973C451.04 180.746 454.267 177.542 456.626 173.36C459.055 169.11 460.269 163.983 460.269 157.98Z" fill="#4F46E5"/>
            {/* Add remaining paths from the SVG */}
          </svg>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-500">
          Bem-vindo de volta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Não tem uma conta?{' '}
          <button
            onClick={() => navigate('/register')}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Cadastre-se gratuitamente
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-4">
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

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email ou usuário
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  autoFocus
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200 hover:border-gray-400"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  required
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200 hover:border-gray-400"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={formData.remember}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Lembrar-me
                </label>
              </div>

              <div className="text-sm">
                <button
                  onClick={() => navigate('/forgot-password')}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Esqueceu sua senha?
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !formData.email || !formData.password}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Entrando...
                  </div>
                ) : (
                  'Entrar'
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}