import React from 'react';
import { X, Share2, Copy, Check } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

export function SuccessModal({ isOpen, onClose, userName }: SuccessModalProps) {
  const [copied, setCopied] = React.useState(false);
  const [showShareError, setShowShareError] = React.useState(false);
  const shareUrl = 'https://www.souinfluencer.com.br';

  const handleShare = async () => {
    setShowShareError(false);
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Sou Influencer - Plataforma para Criadores de Conteúdo',
          text: 'Acabei de me juntar à lista de espera do Sou Influencer! 🚀 Uma plataforma incrível que conecta criadores e marcas. Junte-se a mim em https://www.souinfluencer.com.br',
          url: shareUrl
        });
      } catch {
        // If sharing fails, fallback to copy
        handleCopy();
        setShowShareError(true);
        setTimeout(() => setShowShareError(false), 3000);
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 transform transition-all animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Parabéns, {userName}!
          </h3>
          <p className="text-gray-600">
            Você está na lista de espera! Ajude a comunidade a crescer compartilhando com seus amigos.
          </p>
        </div>

        <div className="space-y-4">
          {typeof navigator.share === 'function' && (
            <button
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="Compartilhar ou copiar link"
            >
              <Share2 className="w-5 h-5" />
              Compartilhar
            </button>
          )}

          {showShareError && (
            <p className="text-sm text-blue-600 text-center animate-fade-in">
              Não foi possível compartilhar diretamente. Link copiado para a área de transferência!
            </p>
          )}

          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border-2 border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                Link Copiado!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copiar Link
              </>
            )}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-500 mt-4">
              Fique de olho em seu e-mail para novidades!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}