import React from 'react';
import { Key, AlertTriangle, Trash2 } from 'lucide-react';
import type { SecuritySettingsProps } from './types';

/**
 * Security settings component for managing password and account deletion
 * @param props - Security settings properties
 */
export const SecuritySettings = React.memo(function SecuritySettings({
  onDeleteAccount
}: SecuritySettingsProps) {
  return (
    <div className="space-y-6">
      {/* Password Section */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Alterar Senha</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Atualize sua senha para manter sua conta segura.</p>
          </div>
          <form className="mt-5 space-y-4">
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                Senha Atual
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="current-password"
                  id="current-password"
                  className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                Nova Senha
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="new-password"
                  id="new-password"
                  className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirmar Nova Senha
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Atualizar Senha
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Account */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Excluir Conta</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              Depois que sua conta for excluída, todos os seus recursos e dados serão permanentemente removidos.
            </p>
          </div>
          <div className="mt-5">
            <button
              type="button"
              onClick={onDeleteAccount}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
            >
              <Trash2 className="h-5 w-5 mr-2" />
              Excluir conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});