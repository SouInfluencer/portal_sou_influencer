import React from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileCompletionAlertProps {
  onClose: () => void;
}

export function ProfileCompletionAlert({ onClose }: ProfileCompletionAlertProps) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-auto overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 mx-auto mb-4">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
            Complete seu perfil
          </h3>
          <p className="text-sm text-gray-500 text-center mb-6">
            Para receber propostas de campanhas e começar a monetizar seu conteúdo, 
            você precisa completar seu cadastro com algumas informações importantes.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => {
                navigate('/dashboard/complete-profile');
                onClose();
              }}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Completar Cadastro
              <ChevronRight className="ml-2 h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200"
            >
              Agora não
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}