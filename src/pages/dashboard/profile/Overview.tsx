import React, { useState } from 'react';
import { Star, Info, AlertTriangle, X } from 'lucide-react';
import type { ProfileData } from '../../../services/profileService';
import { profileService } from '../../../services/profileService';
import { toast } from 'react-hot-toast';

interface OverviewProps {
  profile: ProfileData;
}

interface FeatureProps {
  title: string;
  description: string;
}

function Feature({ title, description }: FeatureProps) {
  return (
    <div className="flex items-center space-x-2">
      <Star className="h-4 w-4 text-amber-400" />
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}

export function Overview({ profile }: OverviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(profile.bio);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      await profileService.updateProfile({
        bio: editedBio
      });

      setIsEditing(false);
      toast.success('Perfil atualizado com sucesso');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar perfil');
      toast.error('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {error && (
        <div className="rounded-lg bg-red-50 p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setError(null)}
                  className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Sobre</h2>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={loading}
            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 min-h-[44px] ${
              isEditing
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {loading ? 'Salvando...' : isEditing ? 'Salvar' : 'Editar'}
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
                {editedBio.specialties.map((specialty, index) => (
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
                      className="ml-2 text-blue-600 hover:text-blue-800 p-0.5 min-h-[44px] min-w-[44px]"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input 
                  type="text"
                  placeholder="Nova especialidade"
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm border border-dashed border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[44px]"
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
              {profile.bio.specialties.map((specialty, index) => (
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

      {/* Pricing */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Investimento</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
          {profile.languages.map((language, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800 min-h-[44px]"
            >
              {language}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}