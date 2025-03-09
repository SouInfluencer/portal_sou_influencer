import React from 'react';
import { X } from 'lucide-react';
import type { EventFormData } from '../types';

interface EventFormProps {
  onClose: () => void;
  onSubmit: (data: EventFormData) => void;
  initialData?: Partial<EventFormData>;
}

export function EventForm({ onClose, onSubmit, initialData }: EventFormProps) {
  const [formData, setFormData] = React.useState<EventFormData>({
    title: initialData?.title || '',
    date: initialData?.date || '',
    time: initialData?.time || '',
    type: initialData?.type || 'Post',
    location: initialData?.location || '',
    description: initialData?.description || '',
    participants: initialData?.participants || [],
    duration: initialData?.duration || '',
    campaign: initialData?.campaign
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl">
              <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900">
                    {initialData ? 'Editar Evento' : 'Novo Evento'}
                  </h2>
                  <button
                    onClick={onClose}
                    className="rounded-md text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Título
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Data
                      </label>
                      <input
                        type="date"
                        id="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                        Horário
                      </label>
                      <input
                        type="time"
                        id="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                      Tipo
                    </label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as EventFormData['type'] })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="Post">Post</option>
                      <option value="Story">Story</option>
                      <option value="Reels">Reels</option>
                      <option value="Live">Live</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
                      Plataforma
                    </label>
                    <select
                      id="platform"
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value as EventFormData['platform'] })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="Instagram">Instagram</option>
                      <option value="TikTok">TikTok</option>
                      <option value="YouTube">YouTube</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Legenda
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
                      placeholder="Digite a legenda do seu post aqui..."
                    />
                  </div>

                  <div>
                    <label htmlFor="hashtags" className="block text-sm font-medium text-gray-700">
                      Hashtags
                    </label>
                    <input
                      type="text"
                      id="hashtags"
                      value={formData.content?.hashtags?.join(' ') || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        content: {
                          ...formData.content,
                          hashtags: e.target.value.split(' ').filter(tag => tag.startsWith('#'))
                        }
                      })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="#exemplo #hashtag"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      {initialData ? 'Salvar' : 'Criar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}