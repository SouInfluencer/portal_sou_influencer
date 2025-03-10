import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Camera, AtSign, Plus, X, Sparkles, Wand2, Hash, Info } from 'lucide-react';
import type { Platform, ContentType } from '../types';
import { HashtagDialog } from '../components/HashtagDialog';

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
  .container {
    padding: var(--container-padding);
  }
  
  .content-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-base);
  }
  
  .preview-card {
    margin: 0 calc(var(--container-padding) * -1);
    border-radius: 0;
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
  .content-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .hashtag-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 769px) {
  .content-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .hashtag-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
`;

interface PostStepProps {
  platform: Platform;
  contentType: ContentType;
  onNext: () => void;
  onBack: () => void;
  onContentChange: (content: { caption?: string; hashtags?: string[]; mentions?: string[] }) => void;
}

export function PostStep({ platform, contentType, onNext, onBack, onContentChange }: PostStepProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [showHashtagDialog, setShowHashtagDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const suggestedHashtags = [
    '#TechReview',
    '#Tecnologia',
    '#Inovacao',
    '#Review',
    '#Unboxing',
    '#Tech',
    '#Gadgets',
    '#TechBrasil'
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 10MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHashtagClick = (hashtag: string) => {
    if (!hashtags.includes(hashtag)) {
      const newHashtags = [...hashtags, hashtag];
      setHashtags(newHashtags);
      onContentChange({
        caption,
        hashtags: newHashtags,
        mentions
      });
    }
  };

  const handleRemoveHashtag = (hashtagToRemove: string) => {
    const newHashtags = hashtags.filter(hashtag => hashtag !== hashtagToRemove);
    setHashtags(newHashtags);
    onContentChange({
      caption,
      hashtags: newHashtags,
      mentions
    });
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCaption = e.target.value;
    setCaption(newCaption);
    onContentChange({
      caption: newCaption,
      hashtags,
      mentions
    });
  };

  const generateCaption = () => {
    // Estrutura da legenda com parágrafos bem definidos
    const defaultCaption = `✨ Novidade que vocês vão amar! 🚀

Acabei de testar em primeira mão o novo lançamento da @marca e preciso compartilhar minha experiência com vocês! 🎯

O que mais me impressionou:
• Design moderno e elegante
• Performance incrível
• Custo-benefício surpreendente

Nos próximos dias vou trazer um review completo mostrando todos os detalhes e respondendo as principais dúvidas de vocês! 💫

E aí, o que vocês mais querem saber sobre esse lançamento? Me conta aqui nos comentários! 👇`;

    // Hashtags sugeridas baseadas no contexto
    const contextHashtags = [
      '#TechReview',
      '#Tecnologia',
      '#Inovacao',
      '#Review',
      '#TechBrasil'
    ];

    // Adiciona as hashtags sugeridas
    setHashtags(contextHashtags);
    setCaption(defaultCaption);
    onContentChange({
      caption: defaultCaption,
      hashtags: contextHashtags,
      mentions
    });
  };

  return (
    <div className="max-w-5xl mx-auto container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/80">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Visualização do Post</h3>
          <div className="space-y-4">
            {/* Instagram Post Preview */}
            <div className="relative">
              {/* Instagram Header */}
              <div className="flex items-center p-3 border-b border-gray-200">
                <div className="flex items-center flex-1">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <AtSign className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-semibold">Seu Perfil</p>
                    <p className="text-xs text-gray-500">Localização</p>
                  </div>
                </div>
              </div>
              
              {/* Post Image */}
              <div className="aspect-square w-full border-y border-gray-200">
                {selectedImage ? (
                  <div className="relative group">
                    <img
                      src={selectedImage}
                      alt="Preview do post"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-2 right-2 p-1 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
                    >
                      <X className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-colors duration-200 cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-300"
                  >
                    <div className="text-center p-6">
                      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                        <ImageIcon className="h-8 w-8 text-blue-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        Selecione uma imagem
                      </p>
                      <p className="text-xs text-gray-500">
                        Arraste uma imagem ou clique para selecionar
                      </p>
                      <div className="flex items-center justify-center space-x-3 mt-3 text-xs text-gray-500">
                        <span>Formato 1:1</span>
                        <span>•</span>
                        <span>JPG/PNG</span>
                        <span>•</span>
                        <span>Máx 10MB</span>
                      </div>
                    </div>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
              
              {/* Caption Preview */}
              <div className="p-3">
                <p className="text-sm">
                  <span className="font-semibold">Seu Perfil</span>{' '}
                  <span className="text-gray-700">
                    {caption || 'A legenda do seu post aparecerá aqui...'}
                  </span>
                </p>
                {hashtags.length > 0 && (
                  <p className="text-sm text-blue-600 mt-1">
                    {hashtags.join(' ')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="space-y-6">
          {/* Caption Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Legenda</h3>
              <button
                onClick={generateCaption}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 min-h-[var(--min-touch-target)] button"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Gerar Legenda
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Texto Principal
                  </label>
                  <div className="flex items-center text-xs text-gray-500">
                    <Info className="h-4 w-4 mr-1" />
                    Dicas para uma boa legenda:
                  </div>
                </div>
                <div className="mb-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 space-y-1">
                  <p>• Use emojis relacionados ao contexto (2-3 por parágrafo)</p>
                  <p>• Divida o texto em parágrafos curtos para melhor leitura</p>
                  <p>• Inclua uma chamada para ação ao final</p>
                  <p>• Mencione a marca usando @</p>
                  <p>• Limite de 2000 caracteres</p>
                </div>
                <textarea
                  rows={4}
                  value={caption}
                  onChange={handleCaptionChange}
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 placeholder-gray-400 hover:border-gray-400 transition-colors duration-200 font-mono min-h-[var(--min-touch-target)] input"
                  placeholder="💡 Comece com uma introdução chamativa...

📝 Desenvolva o conteúdo em parágrafos curtos...

✨ Termine com uma call-to-action..."
                  maxLength={2000}
                />
                <div className="mt-1 flex justify-end">
                  <span className="text-xs text-gray-500">
                    {caption.length}/2000 caracteres
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Hash className="h-4 w-4 text-gray-400 mr-1" />
                    <label className="block text-sm font-medium text-gray-700">
                      Hashtags
                      <span className="ml-1 text-xs text-gray-500">(Opcional)</span>
                    </label>
                  </div>
                  <span className="text-xs text-gray-500">{hashtags.length} selecionadas</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {hashtags.map(hashtag => (
                    <span
                      key={hashtag}
                      className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors duration-200"
                    >
                      {hashtag}
                      <button
                        onClick={() => handleRemoveHashtag(hashtag)}
                        className="ml-1.5 text-blue-400 hover:text-blue-600 p-0.5 hover:bg-blue-200/50 rounded-full transition-colors duration-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={() => setShowHashtagDialog(true)}
                    className="inline-flex items-center px-3 py-1.5 rounded-full border-2 border-dashed border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 transition-all duration-200 min-h-[var(--min-touch-target)] button"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Hashtag Dialog */}
          <HashtagDialog
            isOpen={showHashtagDialog}
            onClose={() => setShowHashtagDialog(false)}
            onAddHashtag={(hashtag) => {
              if (!hashtags.includes(hashtag)) {
                const newHashtags = [...hashtags, hashtag];
                setHashtags(newHashtags);
                onContentChange({
                  caption,
                  hashtags: newHashtags,
                  mentions
                });
              }
            }}
            existingHashtags={hashtags}
            suggestedHashtags={suggestedHashtags}
          />

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 sm:gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2.5 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200 min-h-[var(--min-touch-target)] button"
            >
              Voltar
            </button>
            <button
              type="button"
              onClick={onNext}
              className="px-6 py-2.5 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 min-h-[var(--min-touch-target)] button"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}