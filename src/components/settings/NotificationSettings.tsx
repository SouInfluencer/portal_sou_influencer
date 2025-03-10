import React from 'react';
import type { NotificationSettingsProps } from './types';

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
            <h4 className="text-sm font-medium text-gray-900">Email</h4>
            <div className="mt-4 space-y-4">
              {Object.entries(formData.emailNotifications).map(([key, value]) => (
                <div key={key} className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id={`email-${key}`}
                      name={`email-${key}`}
                      type="checkbox"
                      checked={value}
                      onChange={() => onNotificationChange('email', key)}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor={`email-${key}`} className="font-medium text-gray-700">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <p className="text-gray-500">Receba notificações por email sobre {key}.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900">Push</h4>
            <div className="mt-4 space-y-4">
              {Object.entries(formData.pushNotifications).map(([key, value]) => (
                <div key={key} className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id={`push-${key}`}
                      name={`push-${key}`}
                      type="checkbox"
                      checked={value}
                      onChange={() => onNotificationChange('push', key)}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor={`push-${key}`} className="font-medium text-gray-700">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <p className="text-gray-500">Receba notificações push sobre {key}.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});