import React from 'react';
import { X } from 'lucide-react';
import type { EventFormData } from '../types';

// Add mobile-first styles
const styles = `
/* Base styles */
:root {
  --min-touch-target: clamp(2.75rem, 8vw, 3rem); /* 44-48px */
  --container-padding: clamp(1rem, 5vw, 2rem);
  --font-size-base: clamp(0.875rem, 4vw, 1rem);
  --font-size-lg: clamp(1.125rem, 5vw, 1.25rem);
  --font-size-xl: clamp(1.5rem, 6vw, 1.875rem);
  --spacing-base: clamp(1rem, 4vw, 1.5rem);
  --border-radius: clamp(0.75rem, 3vw, 1rem);
}

/* Mobile-first media queries */
@media (max-width: 480px) {
  .event-form {
    width: 100%;
    height: 100%;
    margin: 0;
    border-radius: 0;
  }
  
  .form-header {
    padding: var(--container-padding);
    position: sticky;
    top: 0;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(8px);
    z-index: 10;
  }
  
  .form-content {
    padding: var(--container-padding);
    padding-bottom: calc(var(--container-padding) + env(safe-area-inset-bottom));
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-base);
  }
  
  .form-input {
    min-height: var(--min-touch-target);
    font-size: var(--font-size-base);
  }
  
  .form-button {
    width: 100%;
    min-height: var(--min-touch-target);
    justify-content: center;
  }
  
  .form-footer {
    position: sticky;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(8px);
    padding: var(--container-padding);
    border-top: 1px solid rgba(229, 231, 235, 0.5);
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .event-form {
    width: 90%;
    max-width: 600px;
    margin: 2rem auto;
  }
  
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: calc(var(--spacing-base) * 1.25);
  }
  
  .form-content {
    padding: calc(var(--spacing-base) * 1.25);
  }
}

@media (min-width: 769px) {
  .event-form {
    width: 80%;
    max-width: 800px;
    margin: 3rem auto;
  }
  
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: calc(var(--spacing-base) * 1.5);
  }
  
  .form-content {
    padding: calc(var(--spacing-base) * 1.5);
  }
}
`;

interface EventFormProps {
  onClose: () => void;
  onSubmit: (data: EventFormData) => void;
  initialData?: Partial<EventFormData>;
}

export function EventForm({ onClose, onSubmit, initialData }: EventFormProps) {
  const [mounted, setMounted] = React.useState(false);
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

  React.useEffect(() => {
    // Add styles to document
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Trigger mount animation
    setMounted(true);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={`fixed inset-0 overflow-hidden z-50 transition-all duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="fixed inset-y-0 right-0 max-w-full flex event-form">
          <div className="w-full bg-white shadow-xl rounded-lg flex flex-col">
            <div className="form-header flex items-center justify-between border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                    {initialData ? 'Editar Evento' : 'Novo Evento'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto form-content">
              <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Título
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-400 form-input"
                      required
                    />
                  </div>

                  <div className="grid form-grid">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Data
                      </label>
                      <input
                        type="date"
                        id="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-400 form-input"
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
                        className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-400 form-input"
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
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-400 form-input"
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
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-400 form-input"
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
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono transition-all duration-200 hover:border-gray-400 form-input"
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
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-400 form-input"
                      placeholder="#exemplo #hashtag"
                    />
                  </div>
              </form>
            </div>

            <div className="form-footer">
              <div className="flex flex-col sm:flex-row justify-end gap-4 sm:gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200 form-button"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 form-button"
                >
                  {initialData ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}