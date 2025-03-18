import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import type { NotificationSettingsProps } from './types.ts';
import { notificationService } from '../../../services/notificationService.ts';

/**
 * Notification settings component for managing email and push notifications
 * @param props - Notification settings properties
 */
export const NotificationSettings = React.memo(function NotificationSettings({
  formData,
  onNotificationChange
}: NotificationSettingsProps) {
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState(formData);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setLoading(true);
        const data = await notificationService.getNotificationPreferences();
        setPreferences(data);
      } catch (error) {
        toast.error('Erro ao carregar preferências de notificação');
        console.error('Error fetching notification preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  const handleNotificationChange = async (type: 'email' | 'push', setting: string) => {
    try {
      setLoading(true);
      
      // Get current value to toggle
      const currentValue = type === 'email' 
        ? preferences.emailNotifications[setting as keyof typeof preferences.emailNotifications]
        : preferences.pushNotifications[setting as keyof typeof preferences.pushNotifications];
      
      // Update local state immediately for better UX
      const newPreferences = {
        ...preferences,
        [`${type}Notifications`]: {
          ...preferences[`${type}Notifications`],
          [setting]: !currentValue
        }
      };
      setPreferences(newPreferences);
      
      // Call parent handler
      onNotificationChange(type, setting);

      // Update on server
      await notificationService.updateNotificationPreferences(type, setting, !currentValue);
      
      toast.success('Preferências atualizadas com sucesso');
    } catch (error) {
      // Revert local state on error
      setPreferences(formData);
      toast.error('Erro ao atualizar preferências');
      console.error('Error updating notification preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !preferences) {
    return (
      <div className="bg-white shadow sm:rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Preferências de Notificação</h3>
        <div className="mt-6 space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Email</h4>
            <div className="mt-4 space-y-4">
              {Object.entries(preferences.emailNotifications).map(([key, value]) => (
                <div key={key} className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id={`email-${key}`}
                      name={`email-${key}`}
                      type="checkbox"
                      checked={value}
                      onChange={() => handleNotificationChange('email', key)}
                      disabled={loading}
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
              {Object.entries(preferences.pushNotifications).map(([key, value]) => (
                <div key={key} className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id={`push-${key}`}
                      name={`push-${key}`}
                      type="checkbox"
                      checked={value}
                      onChange={() => handleNotificationChange('push', key)}
                      disabled={loading}
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