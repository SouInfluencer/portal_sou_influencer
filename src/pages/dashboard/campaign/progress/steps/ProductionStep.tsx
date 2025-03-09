import React from 'react';
import { TrendingUp, CheckCircle, Clock, AlertCircle, Eye, Heart, MessageSquare, Share2, Image as ImageIcon, Copy, X, Info, AtSign, Download, Hourglass } from 'lucide-react';
import type { Campaign } from '../../../../../types';

interface ProductionStepProps {
  campaign: Campaign;
  userType?: 'influencer' | 'advertiser';
  onNext?: () => void;
  onComplete?: () => void;
}

export function ProductionStep({ campaign, userType = 's', onNext, onComplete }: ProductionStepProps) {
  const [progress, setProgress] = React.useState({
    materialsDownloaded: false,
    briefingReviewed: false,
    contentInProduction: false,
    finalReview: false
  });

  const [showAlert, setShowAlert] = React.useState(false);

  const handleComplete = () => {
    // Call both onComplete and onNext to advance to the delivery step
    onComplete?.('in_production');
    onNext?.();
  };
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [caption, setCaption] = React.useState('');
  const [showPreview, setShowPreview] = React.useState(true);
  const [hashtags, setHashtags] = React.useState<string[]>([]);
  const [mentions, setMentions] = React.useState<string[]>([]);
  const [downloading, setDownloading] = React.useState(false);
  const [copied, setCopied] = React.useState<{
    caption: boolean;
    hashtags: boolean;
    mentions: boolean;
  }>({
    caption: false,
    hashtags: false,
    mentions: false
  });

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
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
          <Hourglass className="h-6 w-6 text-indigo-600 animate-pulse" />
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
    <div className="space-y-8">
      {/* Step Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Material da Postagem</h2>
        <p className="mt-1 text-sm text-gray-500">Copie o material necessário para sua postagem</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Preview */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Visualização do Post</h3>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
            >
              <Eye className="h-4 w-4 mr-1.5" />
              {showPreview ? 'Ocultar Preview' : 'Mostrar Preview'}
            </button>
          </div>

          {showPreview && (
            <div className="border rounded-xl overflow-hidden bg-white">
              {/* Instagram Header */}
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

              {/* Post Image */}
              <div className="aspect-square w-full bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=800&fit=crop"
                  alt="Material da campanha"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Post Actions */}
              <div className="p-4 border-t">
                <div className="flex items-center space-x-4">
                  <Heart className="h-6 w-6 text-gray-800" />
                  <MessageSquare className="h-6 w-6 text-gray-800" />
                  <Share2 className="h-6 w-6 text-gray-800" />
                </div>
              </div>

              {/* Caption Preview */}
              <div className="p-4 border-t">
                <p className="text-sm">
                  <span className="font-semibold">{campaign.brand.name}</span>{' '}
                  <span className="text-gray-700">{campaign.description}</span>
                </p>
                <p className="mt-2 text-sm text-indigo-600">
                  {hashtags.join(' ')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Content Copy Section */}
        <div className="space-y-6">
          {/* Image */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Imagem</h3>
              <button
                onClick={handleDownloadImage}
                disabled={downloading}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  downloading
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
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
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Legenda</h3>
              <button
                onClick={() => handleCopy('caption', campaign.description)}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  copied.caption
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
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
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Hashtags</h3>
              <button
                onClick={() => handleCopy('hashtags', hashtags.join(' '))}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  copied.hashtags
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Copy className="h-4 w-4 mr-2" />
                {copied.hashtags ? 'Copiado!' : 'Copiar Hashtags'}
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-indigo-600">
                #TechReview #Tecnologia #Inovacao #Review #Unboxing #Tech #Gadgets #TechBrasil
              </p>
            </div>
          </div>

          {/* Mentions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Marcações</h3>
              <button
                onClick={() => handleCopy('mentions', '@techcorp @techbrasil')}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  copied.mentions
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Copy className="h-4 w-4 mr-2" />
                {copied.mentions ? 'Copiado!' : 'Copiar Marcações'}
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-indigo-600">
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
          className="inline-flex items-center px-8 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          Prosseguir para Entrega
        </button>
      </div>
    </div>
  );
}