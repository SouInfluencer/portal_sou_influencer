import React, { useState, useEffect } from 'react';
import { Download, X, Plus } from 'lucide-react';

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

  useEffect(() => {
    // Check if already installed or prompted
    const hasPrompted = localStorage.getItem('pwaPrompted');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    if (hasPrompted || isStandalone) {
      return;
    }

    // Listen for beforeinstallprompt event
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Show browser prompt if PWA is not available
    setTimeout(() => {
      if (!deferredPrompt) {
        setShowBrowserPrompt(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        localStorage.setItem('pwaPrompted', 'true');
      }
    } catch (err) {
      console.error('Error installing PWA:', err);
    } finally {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleAddToHomeScreen = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    let instructions = '';
    if (isIOS && isSafari) {
      instructions = 'Toque no botão de compartilhar e selecione "Adicionar à Tela de Início"';
    } else if (isAndroid) {
      instructions = 'Toque no menu (⋮) e selecione "Adicionar à tela inicial"';
    } else {
      instructions = 'Adicione esta página aos favoritos para acesso rápido';
    }

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
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  {showPrompt ? (
                      <Download className="h-5 w-5 text-indigo-600" />
                  ) : (
                      <Plus className="h-5 w-5 text-indigo-600" />
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {showPrompt ? 'Instalar Aplicativo' : 'Adicionar Atalho'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {showPrompt
                      ? 'Instale nosso app para uma experiência melhor'
                      : 'Adicione à tela inicial para acesso rápido'
                  }
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
                onClick={() => {
                  showPrompt ? handleInstall() : handleAddToHomeScreen();
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all duration-200"
            >
              {showPrompt ? (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Instalar
                  </>
              ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </>
              )}
            </button>
          </div>
        </div>
      </div>
  );
}