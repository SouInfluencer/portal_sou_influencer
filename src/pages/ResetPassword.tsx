import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { KeyRound, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { authService } from '../services/auth';

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    passwordConfirmation: ''
  });
  const [status, setStatus] = useState<'validating' | 'invalid' | 'valid' | 'submitting' | 'success'>('validating');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateToken = async () => {
      if (token == null) {
        setStatus('invalid');
        setError('Token não fornecido');
        return;
      }

      try {
        const response = await fetch('https://api.souinfluencer.com.br/auth/check-code-reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ token })
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Token inválido');
        }

        if (data.success) {
          setStatus('valid');
        } else {
          setStatus('invalid');
          setError('Token inválido ou expirado');
        }
      } catch (err) {
        setStatus('invalid');
        setError(err instanceof Error ? err.message : 'Erro ao validar token');
      }
    };

    validateToken();
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('Token não fornecido');
      return;
    }

    if (formData.password !== formData.passwordConfirmation) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      return;
    }

    setStatus('submitting');
    setError(null);

    try {
      const response = await fetch('https://api.souinfluencer.com.br/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          token,
          password: formData.password,
          passwordConfirmation: formData.passwordConfirmation
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao alterar senha'); 
      }

      setStatus('success');

      // Auto login immediately after password reset
      try {
        await authService.login({
          email: data.email,
          password: formData.password,
          checkme: true
        });
        
        // Short delay to show success message before redirecting
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } catch (loginError) {
        console.error('Auto-login failed:', loginError);
        // Even if auto-login fails, we still show success since the password was reset
      }

    } catch (err) {
      setStatus('valid');
      setError(err instanceof Error ? err.message : 'Erro ao alterar senha');
    }
  };

  if (status === 'validating') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Validando token...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
              Link Inválido
            </h2>
            <p className="text-center text-gray-600 mb-8">
              {error || 'O link de redefinição de senha é inválido ou expirou.'}
            </p>
            <button
              onClick={() => navigate('/forgot-password')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Solicitar novo link
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
              Senha Alterada!
            </h2>
            <p className="text-center text-gray-600">
              Sua senha foi alterada com sucesso.
            </p>
            <p className="text-center text-gray-600 mt-2 animate-pulse">
              Redirecionando...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button
          onClick={() => navigate('/login')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para login
        </button>

        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Redefinir Senha
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Digite sua nova senha abaixo
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
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
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Nova Senha
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700">
                Confirme a Nova Senha
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  type="password"
                  required
                  value={formData.passwordConfirmation}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Alterando senha...
                  </>
                ) : (
                  'Alterar Senha'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}