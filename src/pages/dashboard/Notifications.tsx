import React, { useState } from 'react';
import { Bell, X, Calendar, MessageSquare, DollarSign, Star, ChevronRight, CheckCircle, Clock, Filter, Search, LayoutGrid, List, MoreVertical, ArrowLeft } from 'lucide-react';
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

export function Notifications() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' ||
                         (selectedFilter === 'unread' && !notification.read) ||
                         (selectedFilter === 'read' && notification.read);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Notificações</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gerencie suas notificações e atualizações
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Marcar todas como lidas
            </button>
            <button
              onClick={handleClearAll}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-red-600 bg-white hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-2" />
              Limpar todas
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200/80">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Buscar notificações..."
              />
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value as 'all' | 'unread' | 'read')}
                className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
              >
                <option value="all">Todas</option>
                <option value="unread">Não lidas</option>
                <option value="read">Lidas</option>
              </select>

              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => {
              const Icon = getIcon(notification.type);
              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 ${
                    !notification.read ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start">
                      <div className={`${getIconColor(notification.type)} flex-shrink-0 p-2 rounded-lg bg-gray-100/80`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <div className="flex items-center">
                            <div className="flex items-center text-xs text-gray-400">
                              <Clock className="h-3 w-3 mr-1" />
                              {notification.time}
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
                        <p className="mt-1 text-sm text-gray-500">
                          {notification.description}
                        </p>
                        {notification.action && (
                          <div className="mt-3">
                            <a
                              href={notification.action.href}
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            >
                              {notification.action.label}
                              <ChevronRight className="ml-1.5 h-4 w-4" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
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
    </div>
  );
}