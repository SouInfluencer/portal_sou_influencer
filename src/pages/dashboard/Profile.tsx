import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Link as LinkIcon, Instagram, Youtube, Video, Edit2, AtSign, Users, Globe2, Heart, MessageSquare, Globe, Award, ChevronRight, Star, BarChart2, Sparkles, Crown, X } from 'lucide-react';
import { profileService, type ProfileData } from '../../services/profileService';
import { Overview } from './profile/Overview';
import { Portfolio } from './profile/Portfolio';
import { SocialMedia } from './profile/SocialMedia';
import { Reviews } from './profile/Reviews';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showAddSocialNetwork, setShowAddSocialNetwork] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'social' | 'reviews'>('overview');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData>({
    id: '',
    name: '',
    username: '',
    verified: false,
    avatar: '',
    coverImage: '',
    bio: {
      headline: '',
      tagline: '',
      description: '',
      specialties: []
    },
    location: '',
    languages: [],
    website: '',
    contact: {
      email: '',
      phone: ''
    },
    metrics: {
      totalReach: '0',
      avgEngagement: '0%',
      completedCampaigns: 0,
      rating: 0
    },
    pricing: {
      feed: 0,
      story: 0,
      reels: 0,
      video: 0
    },
    platforms: [],
    expertise: [],
    recentCampaigns: []
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      toast.error('Erro ao carregar dados do perfil');
      // Profile state will remain with default empty values
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File, type: 'avatar' | 'cover') => {
    try {
      setLoading(true);
      const imageUrl = await profileService.uploadProfileImage(file, type);
      
      setProfile(prev => ({
        ...prev,
        [type === 'avatar' ? 'avatar' : 'coverImage']: imageUrl
      }));
      
      toast.success('Imagem atualizada com sucesso');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao atualizar imagem');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      handleSaveProfile();
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const updatedProfile = await profileService.updateProfile(profile);
      setProfile(updatedProfile);
      setIsEditing(false);
      toast.success('Perfil atualizado com sucesso');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const keys = name.split('.');

    if (keys.length === 1) {
      setProfile({ ...profile, [name]: value });
    } else {
      setProfile({
        ...profile,
        [keys[0]]: {
          ...profile[keys[0] as keyof ProfileData],
          [keys[1]]: value
        }
      });
    }
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Cover Image */}
      <div className="relative h-48 sm:h-64 md:h-80 w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-200 z-10">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <label
              htmlFor="cover-upload"
              className="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-200 group min-h-[44px]"
            >
              <Camera className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Alterar Capa</span>
              <input
                type="file"
                id="cover-upload"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImageUpload(file, 'cover');
                  }
                }}
              />
            </label>
            <button
              onClick={() => {
                setProfile({
                  ...profile,
                  coverImage: ''
                });
              }}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white/95 transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Remover capa"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <div className="absolute bottom-4 left-4">
            <p className="text-xs text-white/90 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5">
              Tamanho recomendado: 1920x400px • Máximo: 5MB
            </p>
          </div>
        </div>
        <img
          src={profile.coverImage || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80'}
          alt="Cover"
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 relative z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent pointer-events-none z-[1]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24 md:-mt-32 relative z-10">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex items-start justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="relative group">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-2xl object-cover ring-4 ring-white shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  >
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-200">
                      <Camera className="h-5 w-5 text-gray-600" />
                      <span className="sr-only">Alterar foto de perfil</span>
                    </div>
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file, 'avatar');
                        }
                      }}
                    />
                  </label>
                  {profile.verified && (
                    <div className="absolute -bottom-3 -right-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-lg">
                        <Crown className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{profile.name}</h1>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      Influenciador Verificado
                    </span>
                  </div>
                  <p className="mt-1 text-lg sm:text-xl text-gray-600">{profile.bio.headline}</p>
                  <div className="flex flex-wrap items-center mt-4 gap-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-2" />
                      {profile.location}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Globe className="h-5 w-5 mr-2" />
                      <a href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 truncate max-w-[200px]">
                        {profile.website}
                      </a>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <AtSign className="h-5 w-5 mr-2" />
                      <span className="truncate max-w-[200px]">{profile.contact.email}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden sm:block">
                <button
                  onClick={() => navigate('/dashboard/new-campaign')}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] transition-all duration-200"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Criar Campanha
                  <ChevronRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-6 sm:mt-8">
              <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  <BarChart2 className="h-5 w-5 text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{profile.metrics.totalReach}</p>
                <p className="text-sm text-gray-600">Alcance Total</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <Heart className="h-6 w-6 text-green-600" />
                  <BarChart2 className="h-5 w-5 text-green-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{profile.metrics.avgEngagement}</p>
                <p className="text-sm text-gray-600">Engajamento Médio</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-xl border border-amber-100">
                <div className="flex items-center justify-between mb-2">
                  <Star className="h-6 w-6 text-amber-600" />
                  <BarChart2 className="h-5 w-5 text-amber-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{profile.metrics.rating}</p>
                <p className="text-sm text-gray-600">Avaliação Média</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-4 sm:gap-8 mt-6 sm:mt-8 border-b border-gray-200 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-4 border-b-2 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Visão Geral
              </button>
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`pb-4 border-b-2 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'portfolio'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Portfólio
              </button>
              <button
                onClick={() => setActiveTab('social')}
                className={`pb-4 border-b-2 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'social'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Redes Sociais
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-4 border-b-2 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'reviews'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Avaliações
              </button>
            </div>
            {/* Tab Content */}
            <div className="mt-6 sm:mt-8">
              {activeTab === 'overview' && <Overview profile={profile} />}
              {activeTab === 'portfolio' && <Portfolio profile={profile} />}
              {activeTab === 'social' && <SocialMedia profile={profile} />}
              {activeTab === 'reviews' && <Reviews profile={profile} />}
            </div>
          </div>
        </div>
        {/* Mobile CTA Button */}
        <div className="fixed bottom-4 left-4 right-4 sm:hidden z-50">
          <button
            onClick={() => navigate('/dashboard/new-campaign')}
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Criar Campanha
            <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}