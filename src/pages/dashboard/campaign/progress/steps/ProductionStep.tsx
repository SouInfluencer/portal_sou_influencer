import React, { useState } from 'react';
import { TrendingUp, Users, Star, Info, Award, Clock, CheckCircle, Instagram, Youtube, Video, BarChart2, Heart, MessageSquare, Eye, Download, Copy, Hourglass } from 'lucide-react';
import type { Campaign } from '../../../../../types';

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
  
  .grid-cols-2 {
    grid-template-columns: 1fr;
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
}

@media (min-width: 481px) and (max-width: 768px) {
  .grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .preview-card {
    margin: 0;
    border-radius: var(--border-radius);
  }
}

@media (min-width: 769px) {
  .grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .preview-card {
    margin: 0;
    border-radius: var(--border-radius);
  }
}
`;

interface ProductionStepProps {
  campaign: Campaign;
  userType?: 'influencer' | 'advertiser';
  onNext?: () => void;
  onComplete?: () => void;
}

export function ProductionStep({ campaign, userType = 'influencer', onNext, onComplete }: ProductionStepProps) {
  const [progress, setProgress] = React.useState({
    materialsDownloaded: false,
    briefingReviewed: false,
    contentInProduction: false,
    finalReview: false
  });
  const [mounted, setMounted] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(true);
  const [downloading, setDownloading] = React.useState(false);
  const [hashtags, setHashtags] = React.useState<string[]>([]);
  const [copied, setCopied] = React.useState<{
    caption: boolean;
    hashtags: boolean;
    mentions: boolean;
  }>({
    caption: false,
    hashtags: false,
    mentions: false
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

  const handleComplete = () => {
    // Call both onComplete and onNext to advance to the delivery step
    onComplete?.('in_production');
    onNext?.();
  };

  const handleDownloadImage = async () => {
    try {
      setDownloading(true);
      const response = await fetch('https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=800&fit=crop');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'campaign-image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopy = async (type: keyof typeof copied, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(prev => ({ ...prev, [type]: true }));
    setTimeout(() => {
      setCopied(prev => ({ ...prev, [type]: false }));
    }, 2000);
  };

  if (userType === 'advertiser') {
    return (
      <div className="text-center py-12">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
          <Hourglass className="h-6 w-6 text-blue-600 animate-pulse" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Aguardando Produção do Conteúdo
        </h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          O influenciador está produzindo o conteúdo conforme as especificações da campanha. 
          Você será notificado assim que o conteúdo estiver pronto para revisão.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 container">
      {/* Step Header */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Material da Postagem</h2>
              <p className="text-gray-500">Copie o material necessário para sua postagem</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 mb-8 stats-grid">
          <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-6 w-6 text-blue-600" />
              <BarChart2 className="h-4 w-4 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">45K+</p>
            <p className="text-sm text-gray-500">Alcance Estimado</p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-8 grid-cols-2">
        {/* Preview */}
        <div className="bg-white p-6 shadow-sm border border-gray-200/80 preview-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Visualização do Post</h3>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 min-h-[var(--min-touch-target)] button"
            >
              <Eye className="h-4 w-4 mr-1.5" />
              {showPreview ? 'Ocultar Preview' : 'Mostrar Preview'}
            </button>
          </div>
          {showPreview && (
            <div className="border rounded-xl overflow-hidden bg-white">
              <div className="flex items-center p-4 border-b">
                <img
                  src={campaign.brand.logo}
                  alt={campaign.brand.name}
                  className="h-8 w-8 rounded-full"
                />
                <div className="ml-3">
                  <p className="text-sm font-semibold">{campaign.brand.name}</p>
                  <p className="text-xs text-gray-500">Patrocinado</p>
                </div>
              </div>
              <div className="aspect-square w-full bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=800&fit=crop"
                  alt="Material da campanha"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 border-t">
                <div className="flex items-center space-x-4">
                  <Heart className="h-6 w-6 text-gray-800" />
                  <MessageSquare className="h-6 w-6 text-gray-800" />
                </div>
              </div>
              <div className="p-4 border-t">
                <p className="text-sm">
                  <span className="font-semibold">{campaign.brand.name}</span>{' '}
                  <span className="text-gray-700">{campaign.description}</span>
                </p>
                <p className="mt-2 text-sm text-blue-600">
                  {hashtags.join(' ')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Content Copy Section */}
        <div className="space-y-6">
          {/* Image */}
          <div className="bg-white p-6 shadow-sm border border-gray-200/80 preview-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Imagem</h3>
              <button
                onClick={handleDownloadImage}
                disabled={downloading}
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[var(--min-touch-target)] button"
              >
                <Download className="h-4 w-4 mr-2" />
                {downloading ? 'Baixando...' : 'Baixar Imagem'}
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=800&fit=crop"
                alt="Material da campanha"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Caption */}
          <div className="bg-white p-6 shadow-sm border border-gray-200/80 preview-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Legenda</h3>
              <button
                onClick={() => handleCopy('caption', campaign.description)}
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[var(--min-touch-target)] button"
              >
                <Copy className="h-4 w-4 mr-2" />
                {copied.caption ? 'Copiado!' : 'Copiar Legenda'}
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {campaign.description}
              </p>
            </div>
          </div>

          {/* Hashtags */}
          <div className="bg-white p-6 shadow-sm border border-gray-200/80 preview-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Hashtags</h3>
              <button
                onClick={() => handleCopy('hashtags', hashtags.join(' '))}
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[var(--min-touch-target)] button"
              >
                <Copy className="h-4 w-4 mr-2" />
                {copied.hashtags ? 'Copiado!' : 'Copiar Hashtags'}
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-blue-600">
                #TechReview #Tecnologia #Inovacao #Review #Unboxing #Tech #Gadgets #TechBrasil
              </p>
            </div>
          </div>

          {/* Mentions */}
          <div className="bg-white p-6 shadow-sm border border-gray-200/80 preview-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Marcações</h3>
              <button
                onClick={() => handleCopy('mentions', '@techcorp @techbrasil')}
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[var(--min-touch-target)] button"
              >
                <Copy className="h-4 w-4 mr-2" />
                {copied.mentions ? 'Copiado!' : 'Copiar Marcações'}
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-blue-600">
                @techcorp @techbrasil
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleComplete}
          className="inline-flex items-center px-8 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 min-h-[var(--min-touch-target)] button"
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          Prosseguir para Entrega
        </button>
      </div>
    </div>
  );
}