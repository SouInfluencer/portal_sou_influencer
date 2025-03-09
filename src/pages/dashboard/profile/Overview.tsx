import React, { useState } from 'react';
import { Users, BarChart2, Heart, Star, Clock, ChevronRight, Eye } from 'lucide-react';

interface OverviewProps {
  profile: any; // TODO: Add proper type
}

export function Overview({ profile }: OverviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(profile.bio);

  const handleSave = () => {
    // TODO: Implement API call to save bio
    profile.bio = editedBio;
    setIsEditing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
        {/* About */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 min-h-[44px]"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 min-h-[44px]"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 min-h-[88px]"
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
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 min-h-[32px]"
                    >
                      {specialty}
                      <button
                        onClick={() => {
                          const newSpecialties = [...editedBio.specialties];
                          newSpecialties.splice(index, 1);
                          setEditedBio({ ...editedBio, specialties: newSpecialties });
                        }}
                        className="ml-2 text-indigo-600 hover:text-indigo-800 p-1 min-h-[24px] min-w-[24px]"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Nova especialidade"
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm border border-dashed border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-h-[32px]"
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
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 min-h-[32px]"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Areas of Expertise */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
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
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
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
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Investimento</h2>
            <span className="text-sm text-gray-500">Valores médios</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-4">
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
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Idiomas</h2>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {profile.languages.map((language: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800 min-h-[32px]"
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