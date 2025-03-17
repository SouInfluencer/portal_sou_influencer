import React, { useState } from 'react';
import { Hash, X, Plus, Search, Sparkles } from 'lucide-react';

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
  .dialog {
    margin: var(--container-padding);
    width: calc(100% - 2 * var(--container-padding));
    max-width: none;
  }
  
  .dialog-content {
    padding: var(--spacing-base);
  }
  
  .button {
    width: 100%;
    min-height: var(--min-touch-target);
    justify-content: center;
  }
  
  .input {
    min-height: var(--min-touch-target);
  }
  
  .hashtag-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-base);
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .dialog {
    max-width: 32rem;
  }
  
  .dialog-content {
    padding: calc(var(--spacing-base) * 1.25);
  }
  
  .hashtag-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 769px) {
  .dialog {
    max-width: 36rem;
  }
  
  .dialog-content {
    padding: calc(var(--spacing-base) * 1.5);
  }
  
  .hashtag-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
`;

interface HashtagDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHashtag: (hashtag: string) => void;
  existingHashtags: string[];
  suggestedHashtags: string[];
}

export function HashtagDialog({
  isOpen,
  onClose,
  onAddHashtag,
  existingHashtags,
  suggestedHashtags
}: HashtagDialogProps) {
  const [newHashtag, setNewHashtag] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = React.useState(false);

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
    if (newHashtag) {
      const formattedHashtag = newHashtag.startsWith('#') ? newHashtag : `#${newHashtag}`;
      onAddHashtag(formattedHashtag);
      setNewHashtag('');
    }
  };

  const filteredSuggestions = suggestedHashtags.filter(
    hashtag => !existingHashtags.includes(hashtag) &&
    hashtag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg mx-4 overflow-hidden shadow-xl transform transition-all">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Adicionar Hashtag</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 transition-colors duration-200 min-h-[var(--min-touch-target)] min-w-[var(--min-touch-target)]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 dialog-content">
          {/* Add New Hashtag Form */}
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Hash className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={newHashtag}
                onChange={(e) => setNewHashtag(e.target.value.replace(/\s+/g, ''))}
                placeholder="Digite uma nova hashtag"
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[var(--min-touch-target)] input"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button
                  type="submit"
                  disabled={!newHashtag}
                  className="p-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </form>

          {/* Suggested Hashtags */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-sm font-medium text-gray-700">
                <Sparkles className="h-4 w-4 text-blue-500 mr-1.5" />
                Hashtags Sugeridas
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar..."
                  className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 min-h-[var(--min-touch-target)] input"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {filteredSuggestions.map((hashtag) => (
                <button
                  key={hashtag}
                  onClick={() => onAddHashtag(hashtag)}
                  disabled={existingHashtags.includes(hashtag)}
                  className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[var(--min-touch-target)] button"
                >
                  {hashtag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-h-[var(--min-touch-target)] button"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}