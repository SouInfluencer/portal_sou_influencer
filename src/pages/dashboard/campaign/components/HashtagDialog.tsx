import React, { useState } from 'react';
import { Hash, X, Plus, Search, Sparkles } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg mx-4 overflow-hidden shadow-xl transform transition-all">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Adicionar Hashtag</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
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
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button
                  type="submit"
                  disabled={!newHashtag}
                  className="p-1 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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
                <Sparkles className="h-4 w-4 text-indigo-500 mr-1.5" />
                Hashtags Sugeridas
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar..."
                  className="block w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {filteredSuggestions.map((hashtag) => (
                <button
                  key={hashtag}
                  onClick={() => onAddHashtag(hashtag)}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-sm text-gray-600 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50/50 transform hover:scale-[1.02] transition-all duration-200"
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
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}