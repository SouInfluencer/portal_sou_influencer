import React from 'react';
import type { NotificationSettingsProps } from './types.ts';

/**
 * Notification settings component for managing email and push notifications
 * @param props - Notification settings properties
 */
export const NotificationSettings = React.memo(function NotificationSettings({
  formData,
  onNotificationChange
}: NotificationSettingsProps) {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Preferências de Notificação</h3>
        <div className="mt-6 space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Notificações por Email</h4>
            <div className="mt-4 space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="email-novas-campanhas"
                    name="email-novas-campanhas"
                    type="checkbox"
                    checked={formData.emailNotifications.campaigns}
                    onChange={() => onNotificationChange('email', 'campaigns')}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="email-novas-campanhas" className="font-medium text-gray-700">
                    Novas Campanhas
                  </label>
                  <p className="text-gray-500">Receba notificações quando novas campanhas estiverem disponíveis.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="email-novas-mensagens"
                    name="email-novas-mensagens"
                    type="checkbox"
                    checked={formData.emailNotifications.messages}
                    onChange={() => onNotificationChange('email', 'messages')}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="email-novas-mensagens" className="font-medium text-gray-700">
                    Novas Mensagens
                  </label>
                  <p className="text-gray-500">Receba notificações quando receber novas mensagens.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="email-atualizacoes-plataforma"
                    name="email-atualizacoes-plataforma"
                    type="checkbox"
                    checked={formData.emailNotifications.updates}
                    onChange={() => onNotificationChange('email', 'updates')}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="email-atualizacoes-plataforma" className="font-medium text-gray-700">
                    Atualizações da Plataforma
                  </label>
                  <p className="text-gray-500">Receba notificações sobre novidades e atualizações da plataforma.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="email-conteudo-marketing"
                    name="email-conteudo-marketing"
                    type="checkbox"
                    checked={formData.emailNotifications.marketing}
                    onChange={() => onNotificationChange('email', 'marketing')}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="email-conteudo-marketing" className="font-medium text-gray-700">
                    Conteúdo e Marketing
                  </label>
                  <p className="text-gray-500">Receba dicas, novidades e conteúdo exclusivo.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900">Notificações Push</h4>
            <div className="mt-4 space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="push-novas-campanhas"
                    name="push-novas-campanhas"
                    type="checkbox"
                    checked={formData.pushNotifications.campaigns}
                    onChange={() => onNotificationChange('push', 'campaigns')}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="push-novas-campanhas" className="font-medium text-gray-700">
                    Novas Campanhas
                  </label>
                  <p className="text-gray-500">Receba notificações push quando novas campanhas estiverem disponíveis.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="push-novas-mensagens"
                    name="push-novas-mensagens"
                    type="checkbox"
                    checked={formData.pushNotifications.messages}
                    onChange={() => onNotificationChange('push', 'messages')}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="push-novas-mensagens" className="font-medium text-gray-700">
                    Novas Mensagens
                  </label>
                  <p className="text-gray-500">Receba notificações push quando receber novas mensagens.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="push-atualizacoes-plataforma"
                    name="push-atualizacoes-plataforma"
                    type="checkbox"
                    checked={formData.pushNotifications.updates}
                    onChange={() => onNotificationChange('push', 'updates')}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="push-atualizacoes-plataforma" className="font-medium text-gray-700">
                    Atualizações da Plataforma
                  </label>
                  <p className="text-gray-500">Receba notificações push sobre novidades e atualizações da plataforma.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="push-conteudo-marketing"
                    name="push-conteudo-marketing"
                    type="checkbox"
                    checked={formData.pushNotifications.marketing}
                    onChange={() => onNotificationChange('push', 'marketing')}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="push-conteudo-marketing" className="font-medium text-gray-700">
                    Conteúdo e Marketing
                  </label>
                  <p className="text-gray-500">Receba notificações push com dicas, novidades e conteúdo exclusivo.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});