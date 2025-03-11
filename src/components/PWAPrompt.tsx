import { useState, useEffect } from 'react';
import { Download, X, Plus } from 'lucide-react';
import logoRetangulo from '@/assets/logo_retangulo_light.svg';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface WindowEventMap {
    'beforeinstallprompt': BeforeInstallPromptEvent;
  }
}

export function PWAPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showBrowserPrompt, setShowBrowserPrompt] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobileDevice(isMobile);

    const hasPrompted = localStorage.getItem('pwaPrompted');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    if (hasPrompted || isStandalone) return;

    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    const timeout = setTimeout(() => {
      if (!deferredPrompt) setShowBrowserPrompt(true);
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(timeout);
    };
  }, [deferredPrompt]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        localStorage.setItem('pwaPrompted', 'true');
      }
    } catch (err) {
      console.error('Erro ao instalar PWA:', err);
    } finally {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const createDesktopShortcut = () => {
      try {
        const url = window.location.href;
        const shortcutContent = `[InternetShortcut]\nURL=${url}\nIconFile=${url}/favicon.ico\nIconIndex=0`;
        const blob = new Blob([shortcutContent], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'SouInfluencer.url';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert('Atalho baixado! Salve-o em sua área de trabalho para acesso rápido.');
      } catch (err) {
        console.error('Erro ao criar o atalho:', err);
        alert('Use o menu do navegador (⋮) e selecione "Mais ferramentas" > "Criar atalho".');
      }
    };

    // Use createDesktopShortcut inside the component logic
    if (!isMobileDevice && !showPrompt && showBrowserPrompt) {
      createDesktopShortcut();
    }

  const handleAddToHomeScreen = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    const instructions = isIOS && isSafari
        ? 'Toque no botão de compartilhar e selecione "Adicionar à Tela de Início"'
        : isMobileDevice
            ? 'Toque no menu (⋮) e selecione "Adicionar à tela inicial"'
            : 'Adicione esta página aos favoritos para acesso rápido';

    alert(instructions);
    localStorage.setItem('pwaPrompted', 'true');
    setShowBrowserPrompt(false);
  };

  if (!showPrompt && !showBrowserPrompt) return null;

  return (
      <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 max-w-md mx-auto">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <img width={40} alt="Logo" src={logoRetangulo} className="flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {showPrompt ? 'Instalar Aplicativo' : 'Adicionar Atalho'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {showPrompt
                      ? 'Instale nosso app para uma experiência melhor'
                      : isMobileDevice
                          ? 'Adicione à tela inicial para acesso rápido'
                          : 'Adicione um atalho à área de trabalho'}
                </p>
              </div>
            </div>
            <button
                onClick={() => {
                  setShowPrompt(false);
                  setShowBrowserPrompt(false);
                  localStorage.setItem('pwaPrompted', 'true');
                }}
                className="flex-shrink-0 ml-4 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button
                onClick={showPrompt ? handleInstall : handleAddToHomeScreen}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-200"
            >
              {showPrompt ? (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Instalar
                  </>
              ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    {isMobileDevice ? 'Adicionar' : 'Baixar Atalho'}
                  </>
              )}
            </button>
          </div>
        </div>
      </div>
  );
}