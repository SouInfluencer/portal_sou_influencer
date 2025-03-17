import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Search, Phone, Video as VideoIcon, MoreVertical, Image, Paperclip, Send, Smile, Check, Clock, User, Star, Pin, Archive, Trash2, X, ChevronDown, Filter, Plus, AlertTriangle } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
    online?: boolean;
  };
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  deleted?: boolean;
  attachments?: Array<{
    type: 'image' | 'file';
    url: string;
    name: string;
    size?: string;
  }>;
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  online?: boolean;
  lastMessage?: Message;
  unreadCount?: number;
  pinned?: boolean;
  typing?: boolean;
}

export function Messages() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! Gostaria de discutir os detalhes da próxima campanha.',
      sender: {
        id: '2',
        name: 'Ana Silva',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      timestamp: new Date('2024-03-20T10:30:00'),
      status: 'read',
      attachments: [
        {
          type: 'file',
          url: '#',
          name: 'briefing.pdf',
          size: '2.4 MB'
        }
      ]
    },
    {
      id: '2',
      content: 'Claro! Podemos agendar uma call para discutir os detalhes?',
      sender: {
        id: '1',
        name: 'Você',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      timestamp: new Date('2024-03-20T10:35:00'),
      status: 'delivered'
    }
  ]);

  const chats: Chat[] = [
    {
      id: '1',
      name: 'Ana - TechCorp',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      online: true,
      unreadCount: 2,
      pinned: true,
      typing: true
    },
    {
      id: '2',
      name: 'Pedro - FitLife',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      online: false
    }
  ];

  const handleDeleteMessage = (message: Message) => {
    setMessageToDelete(message);
  };

  const confirmDeleteMessage = () => {
    if (messageToDelete) {
      setMessages(messages.map(msg => 
        msg.id === messageToDelete.id 
          ? { ...msg, deleted: true }
          : msg
      ));
      setMessageToDelete(null);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // TODO: Implement message sending
      setMessage('');
      scrollToBottom();
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
          {/* Search and Filters */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar conversas..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <Filter className="h-4 w-4 mr-1" />
                Filtros
              </button>
              <button className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700">
                <Plus className="h-4 w-4 mr-1" />
                Nova Mensagem
              </button>
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`w-full flex items-center px-4 py-3 border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                  selectedChat?.id === chat.id ? 'bg-gray-50' : ''
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="h-12 w-12 rounded-full"
                  />
                  {chat.online && (
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-green-400" />
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {chat.name}
                    </p>
                    <div className="flex items-center">
                      {chat.pinned && (
                        <Pin className="h-4 w-4 text-gray-400 mr-2" />
                      )}
                      {chat.unreadCount && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-blue-100 bg-blue-600 rounded-full">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    {chat.typing ? (
                      <span className="flex items-center text-blue-600">
                        <span className="mr-2">Digitando</span>
                        <span className="flex space-x-1">
                          <span className="animate-bounce">.</span>
                          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                          <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
                        </span>
                      </span>
                    ) : (
                      <span className="truncate">Última mensagem aqui...</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col bg-gray-50">
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative">
                    <img
                      src={selectedChat.avatar}
                      alt={selectedChat.name}
                      className="h-10 w-10 rounded-full"
                    />
                    {selectedChat.online && (
                      <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-green-400" />
                    )}
                  </div>
                  <div className="ml-3">
                    <h2 className="text-lg font-medium text-gray-900">
                      {selectedChat.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {selectedChat.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <Phone className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <VideoIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <Search className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender.id === '1' ? 'justify-end' : 'justify-start'
                    } group`}
                  >
                    <div
                      className={`flex max-w-lg ${
                        msg.sender.id === '1' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      {msg.sender.id !== '1' && !msg.deleted && (
                        <img
                          src={msg.sender.avatar}
                          alt={msg.sender.name}
                          className="h-8 w-8 rounded-full flex-shrink-0"
                        />
                      )}
                      <div
                        className={`mx-2 ${
                          msg.deleted
                            ? 'bg-gray-100 text-gray-500 italic'
                            : msg.sender.id === '1'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-900'
                        } rounded-xl px-4 py-2 shadow-sm`}
                      >
                        <div className="relative">
                          {!msg.deleted && msg.sender.id === '1' && (
                            <button
                              onClick={() => handleDeleteMessage(msg)}
                              className="absolute -right-2 -top-2 p-1 rounded-full bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                              <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                            </button>
                          )}
                          <p className="text-sm">
                            {msg.deleted ? 'Mensagem apagada' : msg.content}
                          </p>
                        </div>
                        {!msg.deleted && msg.attachments?.map((attachment, index) => (
                          <div
                            key={index}
                            className="mt-2 flex items-center p-2 rounded bg-black/5"
                          >
                            <Paperclip className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="text-sm font-medium">
                              {attachment.name}
                            </span>
                            <span className="ml-2 text-sm text-gray-500">
                              {attachment.size}
                            </span>
                          </div>
                        ))}
                        {!msg.deleted && <div className="mt-1 flex items-center justify-end space-x-2">
                          <span className="text-xs opacity-75">
                            {msg.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {msg.sender.id === '1' && (
                            <span>
                              {msg.status === 'sent' && (
                                <Check className="h-4 w-4" />
                              )}
                              {msg.status === 'delivered' && (
                                <div className="flex">
                                  <Check className="h-4 w-4" />
                                  <Check className="h-4 w-4 -ml-2" />
                                </div>
                              )}
                              {msg.status === 'read' && (
                                <div className="flex text-blue-400">
                                  <Check className="h-4 w-4" />
                                  <Check className="h-4 w-4 -ml-2" />
                                </div>
                              )}
                            </span>
                          )}
                        </div>}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 px-6 py-4">
              <form onSubmit={handleSendMessage} className="flex items-end space-x-4">
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleFileUpload}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                  />
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <textarea
                      rows={1}
                      placeholder="Digite sua mensagem..."
                      className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="absolute right-2 bottom-2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    >
                      <Smile className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Nenhuma conversa selecionada
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Selecione uma conversa para começar a interagir
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Message Confirmation Modal */}
      {messageToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
              Apagar Mensagem
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Tem certeza que deseja apagar esta mensagem? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setMessageToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteMessage}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Apagar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
