import React from 'react';
import { Menu, Search, Bell, UserCircle, LogIn } from 'lucide-react';

export function Header({ onLoginClick, currentView, onLogoClick }: { 
  onLoginClick?: () => void;
  currentView?: string;
  onLogoClick?: () => void;
}) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {currentView !== 'home' && (
              <button 
                onClick={onLogoClick}
                className="flex-shrink-0 flex items-center"
              >
                <span className="text-2xl font-bold text-blue-600">Sou Influencer</span>
              </button>
            )}
          </div>
          
          {currentView === 'dashboard' && (
            <div className="flex-1 max-w-xl px-8 hidden lg:flex">
              <div className="w-full">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Buscar influenciadores ou campanhas..."
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center">
            {currentView !== 'dashboard' && currentView !== 'login' && (
              <button
                onClick={onLoginClick}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Entrar
              </button>
            )}
            {currentView === 'dashboard' && (
              <>
                <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none">
                  <Bell className="h-6 w-6" />
                </button>
                <div className="ml-4 relative flex-shrink-0">
                  <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                    <UserCircle className="h-8 w-8" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}