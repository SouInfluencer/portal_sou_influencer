import React, { useState, useEffect } from 'react';
import { Bell, X, Calendar, MessageSquare, DollarSign, Star, ChevronRight, CheckCircle, Clock, Filter, Search, LayoutGrid, List, MoreVertical, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notificationsService, type Notification } from '../../services/notificationsService';
import { toast } from 'react-hot-toast';

export function Notifications() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchNotifications();
  }, [selectedFilter, currentPage, itemsPerPage]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await notificationsService.getNotifications({
        read: selectedFilter === 'all' ? undefined : selectedFilter === 'read',
        page: currentPage,
        limit: itemsPerPage
      });

      setNotifications(response.data);
      setTotalItems(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar notificações');
      toast.error('Erro ao carregar notificações');
      // Keep existing notifications on error
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsService.markAsRead(id);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (err) {
      toast.error('Erro ao marcar notificação como lida');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
      toast.success('Todas as notificações foram marcadas como lidas');
    } catch (err) {
      toast.error('Erro ao marcar todas notificações como lidas');
    }
  };

  const handleClearAll = async () => {
    try {
      await notificationsService.deleteAllNotifications();
      setNotifications([]);
      toast.success('Todas as notificações foram removidas');
    } catch (err) {
      toast.error('Erro ao remover notificações');
    }
  };

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

  if (loading && !notifications.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg max-w-lg w-full mx-4">
          <div className="flex items-center mb-4">
            <X className="h-6 w-6 text-red-500 mr-3" />
            <h3 className="text-lg font-medium text-red-800">Erro ao carregar notificações</h3>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchNotifications}
            className="w-full bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

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
          {notifications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Nenhuma notificação
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Você será notificado quando houver novidades.
              </p>
            </div>
          ) : (
            notifications.map((notification) => {
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
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Próxima
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> até{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, totalItems)}
                  </span>{' '}
                  de <span className="font-medium">{totalItems}</span> notificações
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    Próxima
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}