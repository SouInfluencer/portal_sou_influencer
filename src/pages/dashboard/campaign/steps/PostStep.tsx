import React, { useState } from 'react';
import { Upload, Download, Copy, Heart, MessageSquare, Send, Image as ImageIcon, Camera, AtSign, Plus, X, Sparkles, Wand2, Hash, Info } from 'lucide-react';
import type { Platform, ContentType } from '../types';
import { HashtagDialog } from '../components/HashtagDialog';
import { storage } from '../../../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';

interface PostStepProps {
  platform: Platform;
  contentType: ContentType;
  onNext: () => void;
  onBack: () => void;
  onContentChange: (content: { caption?: string; hashtags?: string[]; mentions?: string[]; imageUrl?: string }) => void;
}

export function PostStep({ platform, contentType, onNext, onBack, onContentChange }: PostStepProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [mentions, setMentions] = useState<string[]>(['@marca']);
  const [showHashtagDialog, setShowHashtagDialog] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 10MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione uma imagem válida');
        return;
      }

      setUploading(true);

      // Generate unique filename
      const fileExtension = file.name.split('.').pop();
      const fileName = `campaign-images/${uuidv4()}.${fileExtension}`;
      
      // Create storage reference
      const storageRef = ref(storage, fileName);
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadUrl = await getDownloadURL(snapshot.ref);
      
      // Update state and notify parent
      setSelectedImage(downloadUrl);
      onContentChange({
        caption,
        hashtags,
        mentions,
        imageUrl: downloadUrl
      });

      toast.success('Imagem carregada com sucesso!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erro ao fazer upload da imagem. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const handleHashtagClick = (hashtag: string) => {
    if (!hashtags.includes(hashtag)) {
      const newHashtags = [...hashtags, hashtag];
      setHashtags(newHashtags);
      onContentChange({
        caption,
        hashtags: newHashtags,
        mentions,
        imageUrl: selectedImage || undefined
      });
    }
  };

  const handleRemoveHashtag = (hashtagToRemove: string) => {
    const newHashtags = hashtags.filter(hashtag => hashtag !== hashtagToRemove);
    setHashtags(newHashtags);
    onContentChange({
      caption,
      hashtags: newHashtags,
      mentions,
      imageUrl: selectedImage || undefined
    });
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCaption = e.target.value;
    setCaption(newCaption);
    onContentChange({
      caption: newCaption,
      hashtags,
      mentions,
      imageUrl: selectedImage || undefined
    });
  };

  const generateCaption = () => {
    const defaultCaption = `✨ Novidade que vocês vão amar! 🚀

Acabei de testar em primeira mão o novo lançamento da ${mentions[0]} e preciso compartilhar minha experiência com vocês! 🎯

O que mais me impressionou:
• Design moderno e elegante
• Performance incrível
• Custo-benefício surpreendente

Nos próximos dias vou trazer um review completo mostrando todos os detalhes e respondendo as principais dúvidas de vocês! 💫

E aí, o que vocês mais querem saber sobre esse lançamento? Me conta aqui nos comentários! 👇`;

    const contextHashtags = [
      '#TechReview',
      '#Tecnologia',
      '#Inovacao',
      '#Review',
      '#TechBrasil'
    ];

    setHashtags(contextHashtags);
    setCaption(defaultCaption);
    onContentChange({
      caption: defaultCaption,
      hashtags: contextHashtags,
      mentions,
      imageUrl: selectedImage || undefined
    });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/80">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Visualização do Post</h3>
          <div className="space-y-4">
            {/* Instagram Post Preview */}
            <div className="relative">
              {/* Instagram Header */}
              <div className="flex items-center p-3 border-b border-gray-200">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <AtSign className="h-4 w-4 text-gray-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold">Seu Perfil</p>
                  <p className="text-xs text-gray-500">Localização</p>
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
                      onClick={() => {
                        setSelectedImage(null);
                        onContentChange({
                          caption,
                          hashtags,
                          mentions,
                          imageUrl: undefined
                        });
                      }}
                      className="absolute top-2 right-2 p-1 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
                    >
                      <X className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-colors duration-200 cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-300"
                  >
                    <div className="text-center p-6">
                      {uploading ? (
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                          <ImageIcon className="h-8 w-8 text-blue-400" />
                        </div>
                      )}
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {uploading ? 'Enviando imagem...' : 'Selecione uma imagem'}
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
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
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
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 placeholder-gray-400 hover:border-gray-400 transition-colors duration-200 font-mono"
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
                    className="inline-flex items-center px-3 py-1.5 rounded-full border-2 border-dashed border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 transition-all duration-200"
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
                  mentions,
                  imageUrl: selectedImage || undefined
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
              className="px-6 py-2.5 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200"
            >
              Voltar
            </button>
            <button
              type="button"
              onClick={onNext}
              className="px-6 py-2.5 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}