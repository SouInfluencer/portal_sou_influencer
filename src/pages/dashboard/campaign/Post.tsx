import React, { useState } from 'react';
import { Upload, Download, Copy, Heart, MessageSquare, Send, Image as ImageIcon, Camera, AtSign, Plus, X } from 'lucide-react';
import type { Campaign } from '../../../types';

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
  
  .emoji-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-base);
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .content-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .preview-card {
    margin: 0;
    border-radius: var(--border-radius);
  }
  
  .emoji-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

@media (min-width: 769px) {
  .content-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .preview-card {
    margin: 0;
    border-radius: var(--border-radius);
  }
  
  .emoji-grid {
    grid-template-columns: repeat(8, 1fr);
  }
}
`;

interface CampaignPostProps {
  campaign: Campaign;
}

export function CampaignPost({ campaign }: CampaignPostProps) {
  const [caption, setCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
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

  const generateCaption = () => {
    const defaultCaption = `✨ Confira o novo lançamento! 🚀\n\n${campaign.description}\n\n${campaign.brand.name}\n\n#TechCorpBR #NovoProduto #Tecnologia #Inovacao #TechReview #Gadgets`;
    setCaption(defaultCaption);
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 container">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Layout do Post</h3>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              if (selectedImage) {
                const link = document.createElement('a');
                link.href = selectedImage;
                link.download = 'post-image.jpg';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 min-h-[var(--min-touch-target)] button"
            disabled={!selectedImage}
          >
            <Download className="h-4 w-4 mr-2" />
            Baixar Imagem
          </button>
          <button
            onClick={() => {
              if (caption) {
                navigator.clipboard.writeText(caption);
              } else {
                generateCaption();
              }
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 min-h-[var(--min-touch-target)] button"
          >
            <Copy className="h-4 w-4 mr-2" />
            {caption ? 'Copiar Legenda' : 'Gerar Legenda'}
          </button>
        </div>
      </div>

      <div className="grid gap-6 sm:gap-8 content-grid">
        {/* Visual Layout Preview */}
        <div className="bg-white p-6 shadow-sm border border-gray-200/80 preview-card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Visualização do Post</h3>
          <div className="space-y-4">
            {/* Instagram Post Preview */}
            <div className="relative">
              {/* Instagram Header */}
              <div className="flex items-center p-3 border-b border-gray-200">
                <img
                  src={campaign.brand.logo}
                  alt={campaign.brand.name}
                  className="h-8 w-8 rounded-full"
                />
                <div className="ml-3">
                  <p className="text-sm font-semibold">{campaign.brand.name}</p>
                  <p className="text-xs text-gray-500">Localização</p>
                </div>
              </div>
              
              {/* Post Image */}
              <div className="aspect-square w-full border-y border-gray-200">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Post preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <div className="text-center p-6">
                      <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-sm text-gray-500 mb-2">
                        1080 x 1080px (1:1)
                      </p>
                      <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Escolher Imagem
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Post Actions */}
              <div className="p-3 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <button className="text-gray-800 hover:text-gray-600">
                    <Heart className="h-6 w-6" />
                  </button>
                  <button className="text-gray-800 hover:text-gray-600">
                    <MessageSquare className="h-6 w-6" />
                  </button>
                  <button className="text-gray-800 hover:text-gray-600">
                    <Send className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              {/* Caption Preview */}
              <div className="p-3">
                <p className="text-sm">
                  <span className="font-semibold">{campaign.brand.name}</span>{' '}
                  <span className="text-gray-700">
                    {caption || 'A legenda do seu post aparecerá aqui...'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Caption and Tags */}
        <div className="space-y-6">
          {/* Caption Section */}
          <div className="bg-white p-6 shadow-sm border border-gray-200/80 preview-card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Legenda</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texto Principal
                </label>
                <textarea
                  rows={4}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-[var(--min-touch-target)] input"
                  placeholder="Digite a legenda do seu post..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emojis Sugeridos
                </label>
                <div className="grid gap-2 emoji-grid">
                  <button className="inline-flex items-center px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
                    🚀
                  </button>
                  <button className="inline-flex items-center px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
                    📱
                  </button>
                  <button className="inline-flex items-center px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
                    ✨
                  </button>
                  <button className="inline-flex items-center px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
                    💡
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="bg-white p-6 shadow-sm border border-gray-200/80 preview-card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Marcações</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Perfis na Foto
                </label>
                <div className="flex flex-wrap gap-2">
                  <div className="inline-flex items-center px-3 py-1 rounded-md bg-blue-100 text-blue-700">
                    @techcorp
                    <button className="ml-2 text-blue-500 hover:text-blue-600">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <button className="inline-flex items-center px-3 py-1 rounded-md border border-dashed border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500">
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Hashtags Section */}
          <div className="bg-white p-6 shadow-sm border border-gray-200/80 preview-card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Hashtags</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hashtags da Marca
                </label>
                <div className="flex flex-wrap gap-2">
                  <div className="inline-flex items-center px-3 py-1 rounded-md bg-purple-100 text-purple-700">
                    #TechCorpBR
                  </div>
                  <div className="inline-flex items-center px-3 py-1 rounded-md bg-purple-100 text-purple-700">
                    #NovoProduto
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hashtags do Segmento
                </label>
                <div className="flex flex-wrap gap-2">
                  <div className="inline-flex items-center px-3 py-1 rounded-md bg-blue-100 text-blue-700">
                    #Tecnologia
                  </div>
                  <div className="inline-flex items-center px-3 py-1 rounded-md bg-blue-100 text-blue-700">
                    #Inovacao
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}