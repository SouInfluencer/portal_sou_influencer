import React, { useState } from 'react';
import { Bell, X, Calendar, MessageSquare, DollarSign, Star, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  type: 'campaign' | 'message' | 'payment' | 'review';
  title: string;
  description: string;
  time: string;
  read: boolean;
  action?: {
    label: string;
    href: string;
  };
}

export function NotificationBell() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'campaign',
      title: 'Nova Proposta de Campanha',
      description: 'TechCorp convidou você para uma nova campanha',
      time: '5 minutos atrás',
      read: false,
      action: {
        label: 'Ver Proposta',
        href: '/dashboard/campaigns'
      }
    },
    {
      id: '2',
      type: 'message',
      title: 'Nova Mensagem',
      description: 'Ana Silva enviou uma mensagem sobre a campanha',
      time: '1 hora atrás',
      read: false,
      action: {
        label: 'Responder',
        href: '/dashboard/messages'
      }
    },
    {
      id: '3',
      type: 'payment',
      title: 'Pagamento Liberado',
      description: 'R$ 3.500,00 foram depositados em sua conta',
      time: '2 horas atrás',
      read: true,
      action: {
        label: 'Ver Detalhes',
        href: '/dashboard/payments'
      }
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'campaign':
        return Calendar;
      case 'message':
        return MessageSquare;
      case 'payment':
        return DollarSign;
      case 'review':
        return Star;
      default:
        return Bell;
    }
  };

  const getIconColor = (type: Notification['type']) => {
    switch (type) {
      case 'campaign':
        return 'text-blue-500';
      case 'message':
        return 'text-blue-500';
      case 'payment':
        return 'text-green-500';
      case 'review':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="relative">
      <button
        onClick={() => navigate('/dashboard/notifications')}
        className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg transition-all duration-200 group min-h-[44px] min-w-[44px]"
      >
        <span className="sr-only">Ver notificações</span>
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <>
            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-400 ring-2 ring-white animate-pulse" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-400/20 animate-ping" />
          </>
        )}
        <span className="absolute inset-0 rounded-lg bg-gray-100/0 group-hover:bg-gray-100/80 transition-colors duration-200" />
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 transform opacity-0 scale-95 animate-in slide-in-from-top-1 duration-100">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Notificações</h3>
              <div className="flex items-center space-x-4">
                {unreadCount > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {unreadCount} não lidas
                  </span>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 px-2 py-1 rounded-lg transition-colors duration-200"
                  >
                    Limpar todas
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => {
                  const Icon = getIcon(notification.type);
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02] ${
                        !notification.read ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`${getIconColor(notification.type)} flex-shrink-0 p-2 rounded-lg bg-gray-100/80`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {notification.description}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center text-xs text-gray-400">
                              <Clock className="h-3 w-3 mr-1" />
                              {notification.time}
                            </div>
                            {notification.action && (
                              <a
                                href={notification.action.href}
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                              >
                                {notification.action.label}
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </div>
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="ml-4 bg-blue-100 text-blue-600 rounded-full p-1.5 hover:bg-blue-200 transition-all duration-200 transform hover:scale-110"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center">
                <Bell className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Nenhuma notificação
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Você será notificado quando houver novidades.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}