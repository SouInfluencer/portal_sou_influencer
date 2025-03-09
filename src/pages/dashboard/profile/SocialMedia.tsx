import React from 'react';
import { Instagram, Youtube, Video, BarChart2, ChevronRight, Users, Heart } from 'lucide-react';
import { SocialMetrics } from './SocialMetrics';

interface SocialMediaProps {
  profile: any; // TODO: Add proper type
}

export function SocialMedia({ profile }: SocialMediaProps) {
  const [selectedPlatform, setSelectedPlatform] = React.useState<any | null>(null);
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (selectedPlatform) {
    return <SocialMetrics platform={selectedPlatform} onBack={() => setSelectedPlatform(null)} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {profile.platforms.map((platform: any, index: number) => (
        <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-gray-50">
                  {platform.name === 'Instagram' && <Instagram className="h-6 w-6 text-pink-600" />}
                  {platform.name === 'YouTube' && <Youtube className="h-6 w-6 text-red-600" />}
                  {platform.name === 'TikTok' && <Video className="h-6 w-6" />}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{platform.name}</h3>
                  <p className="text-sm text-gray-500">{platform.username}</p>
                </div>
              </div>
              <a
                href={platform.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <ChevronRight className="h-5 w-5" />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-5 w-5 text-indigo-500" />
                  <BarChart2 className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(platform.followers)}</p>
                <p className="text-sm text-gray-500">Seguidores</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  <BarChart2 className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{platform.engagement}%</p>
                <p className="text-sm text-gray-500">Engajamento</p>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setSelectedPlatform(platform)}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
              >
                Ver Métricas Detalhadas
                <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}