import React, { useState } from 'react';
import { Users, BarChart2, Heart, Star, Clock, ChevronRight, Eye } from 'lucide-react';

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
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-base);
  }
  
  .card {
    padding: var(--container-padding);
    margin-bottom: var(--spacing-base);
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
  .content-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .card {
    padding: calc(var(--spacing-base) * 1.25);
  }
}

@media (min-width: 769px) {
  .content-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .card {
    padding: calc(var(--spacing-base) * 1.5);
  }
}
`;

interface OverviewProps {
  profile: any; // TODO: Add proper type
}

export function Overview({ profile }: OverviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(profile.bio);
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

  const handleSave = () => {
    // TODO: Implement API call to save bio
    profile.bio = editedBio;
    setIsEditing(false);
  };

  return (
    <div className="grid content-grid">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
        {/* About */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Sobre</h2>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 min-h-[44px] ${
                isEditing
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isEditing ? 'Salvar' : 'Editar'}
            </button>
          </div>
          
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Headline
                </label>
                <input
                  type="text"
                  value={editedBio.headline}
                  onChange={(e) => setEditedBio({ ...editedBio, headline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={editedBio.tagline}
                  onChange={(e) => setEditedBio({ ...editedBio, tagline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={editedBio.description}
                  onChange={(e) => setEditedBio({ ...editedBio, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 min-h-[88px]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especialidades
                </label>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                  {editedBio.specialties.map((specialty: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 min-h-[32px]"
                    >
                      {specialty}
                      <button
                        onClick={() => {
                          const newSpecialties = [...editedBio.specialties];
                          newSpecialties.splice(index, 1);
                          setEditedBio({ ...editedBio, specialties: newSpecialties });
                        }}
                        className="ml-2 text-blue-600 hover:text-blue-800 p-0.5 min-h-[var(--min-touch-target)] min-w-[var(--min-touch-target)] button"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input 
                    type="text"
                    placeholder="Nova especialidade"
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm border border-dashed border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[var(--min-touch-target)] input"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = (e.target as HTMLInputElement).value.trim();
                        if (value && !editedBio.specialties.includes(value)) {
                          setEditedBio({
                            ...editedBio,
                            specialties: [...editedBio.specialties, value]
                          });
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 min-h-[calc(var(--min-touch-target)*2)] input"
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                <p className="text-xl font-medium text-gray-900">{profile.bio.headline}</p>
                <p className="text-lg text-gray-600">{profile.bio.tagline}</p>
                <p className="text-gray-600 leading-relaxed">{profile.bio.description}</p>
              </div>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {profile.bio.specialties.map((specialty: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 min-h-[32px]"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Areas of Expertise */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Áreas de Expertise</h2>
          <div className="grid gap-4 sm:gap-6">
            {profile.expertise.map((item: any, index: number) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-start p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 space-y-2 sm:space-y-0">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
                <div className="flex items-center space-x-2 sm:ml-4">
                  <span className="text-sm text-gray-500">{item.campaigns} campanhas</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Campaigns */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Campanhas Recentes</h2>
          <div className="grid gap-4 sm:gap-6">
            {profile.recentCampaigns.map((campaign: any, index: number) => (
              <div key={index} className="flex items-start p-4 rounded-xl bg-gray-50">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900">{campaign.brand}</h3>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-600">{campaign.product}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{campaign.type}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Eye className="h-4 w-4 mr-1" />
                      {campaign.performance.views} views
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Heart className="h-4 w-4 mr-1" />
                      {campaign.performance.engagement} eng.
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <ChevronRight className="h-4 w-4 mr-1" />
                      {campaign.performance.clicks} clicks
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Pricing */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Investimento</h2>
            <span className="text-sm text-gray-500">Valores médios</span>
          </div>
          <div className="grid stats-grid">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
              <span className="text-gray-600">Post Feed</span>
              <span className="font-medium text-gray-900">R$ {profile.pricing.feed.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
              <span className="text-gray-600">Stories</span>
              <span className="font-medium text-gray-900">R$ {profile.pricing.story.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
              <span className="text-gray-600">Reels/TikTok</span>
              <span className="font-medium text-gray-900">R$ {profile.pricing.reels.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
              <span className="text-gray-600">Vídeo YouTube</span>
              <span className="font-medium text-gray-900">R$ {profile.pricing.video.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Languages */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Idiomas</h2>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {profile.languages.map((language: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800 min-h-[var(--min-touch-target)]"
              >
                {language}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}