import React from 'react';
import { AlertTriangle, Info, X, Download, Link as LinkIcon, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';

const VALIDATION_IMAGE_URL = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop';

interface ValidationStepProps {
  platform: string;
  username: string;
  postUrl: string;
  onPostUrlChange: (url: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ValidationStep({
  platform,
  username,
  postUrl,
  onPostUrlChange,
  onNext,
  onBack
}: ValidationStepProps) {
  const [showHelp, setShowHelp] = React.useState(false);
  const [validationPost] = React.useState({
    image: VALIDATION_IMAGE_URL,
    caption: '#SouInfluencer #Verificação\n\nEste post confirma que sou eu mesmo(a) conectando minha conta à plataforma Sou Influencer.'
  });

  const handleImageDownload = async () => {
    try {
      const response = await fetch(VALIDATION_IMAGE_URL);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'validacao-sou-influencer.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Imagem baixada com sucesso!', {
        duration: 2000,
        position: 'top-right',
        style: {
          background: 'linear-gradient(to right, #2563eb, #2563eb)',
          color: 'white',
        }
      });
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Erro ao baixar imagem. Tente novamente.');
    }
  };

  const getPlatformInstructions = () => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Como encontrar o link do post no Instagram</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">1. Abra o Instagram no seu celular</p>
              <p className="text-sm text-gray-600">2. Vá até a publicação que você deseja compartilhar</p>
              <p className="text-sm text-gray-600">3. Toque nos três pontos (...) no canto superior direito da publicação</p>
              <p className="text-sm text-gray-600">4. Selecione "Copiar link"</p>
              <p className="text-sm text-gray-600">5. Cole o link aqui</p>
            </div>
          </div>
        );
      case 'youtube':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Como encontrar o link do vídeo no YouTube</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">1. Abra o YouTube e vá até o seu vídeo</p>
              <p className="text-sm text-gray-600">2. Clique no botão "Compartilhar" abaixo do vídeo</p>
              <p className="text-sm text-gray-600">3. Copie o link que aparece na janela de compartilhamento</p>
              <p className="text-sm text-gray-600">4. Cole o link aqui</p>
            </div>
          </div>
        );
      case 'tiktok':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Como encontrar o link do vídeo no TikTok</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">1. Abra o TikTok no seu celular</p>
              <p className="text-sm text-gray-600">2. Vá até o vídeo que você deseja compartilhar</p>
              <p className="text-sm text-gray-600">3. Toque no botão "Compartilhar" (ícone de seta)</p>
              <p className="text-sm text-gray-600">4. Selecione "Copiar link"</p>
              <p className="text-sm text-gray-600">5. Cole o link aqui</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Validação da Conta</h2>
        <p className="mt-2 text-gray-600">
          Para validar sua conta, faça uma publicação com a imagem e legenda fornecidas
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 space-y-6">
        {/* Image Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Imagem para Publicação</h3>
          <div className="relative rounded-lg overflow-hidden shadow-lg">
            <img
              src={validationPost.image}
              alt="Imagem de validação"
              className="w-full h-64 object-cover"
            />
            <button
              onClick={handleImageDownload}
              className="absolute bottom-4 right-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-black/50 backdrop-blur-sm hover:bg-black/60 transition-all duration-200"
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar Imagem
            </button>
          </div>
        </div>

        {/* Caption Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Legenda</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 whitespace-pre-line">{validationPost.caption}</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(validationPost.caption);
                toast.success('Legenda copiada!', {
                  duration: 2000,
                  position: 'top-right',
                  style: {
                    background: 'linear-gradient(to right, #2563eb, #2563eb)',
                    color: 'white',
                  }
                });
              }}
              className="mt-4 inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copiar Legenda
            </button>
          </div>
        </div>

        {/* Post URL Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Link da Publicação</h3>
            <button
              onClick={() => setShowHelp(true)}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
            >
              <Info className="h-4 w-4 mr-1.5" />
              Como encontrar o link?
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LinkIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              value={postUrl}
              onChange={(e) => onPostUrlChange(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder={`https://${platform.toLowerCase()}.com/...`}
            />
          </div>
        </div>

        {/* Warning */}
        <div className="rounded-lg bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Importante</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Certifique-se de que:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>A publicação está pública</li>
                  <li>Você usou a imagem e legenda fornecidas</li>
                  <li>O link está correto e acessível</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
          >
            Voltar
          </button>
          <button
            onClick={onNext}
            disabled={!postUrl}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Continuar
          </button>
        </div>

        {/* Help Modal */}
        {showHelp && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    onClick={() => setShowHelp(false)}
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                {getPlatformInstructions()}
                
                <div className="mt-6">
                  <button
                    onClick={() => setShowHelp(false)}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                  >
                    Entendi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}