import React, { useState } from 'react';
import { Camera, MapPin, Link as LinkIcon, Instagram, Youtube, Video, Edit2, AtSign, Users, Globe2, Heart, MessageSquare, Globe, Award, ChevronRight, Star, BarChart2, Sparkles, Crown, X } from 'lucide-react';
import { AddSocialNetwork } from './AddSocialNetwork';
import { Overview } from './profile/Overview';
import { Portfolio } from './profile/Portfolio';
import { SocialMedia } from './profile/SocialMedia';
import { Reviews } from './profile/Reviews';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

export function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showAddSocialNetwork, setShowAddSocialNetwork] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'social' | 'reviews'>('overview');
  const [editingBio, setEditingBio] = useState(false);
  const [bioHeadline, setBioHeadline] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [profile, setProfile] = useState({
    name: '',
    username: '',
    verified: false,
    avatar: 'https://firebasestorage.googleapis.com/v0/b/sou-influencer.firebasestorage.app/o/logo_retangular.png?alt=media&token=c62a5fbf-0d39-49fd-8f8f-52df3dce9bf6',
    coverImage: '',
    bio: {
      headline: 'Sou Influencer',
      tagline: 'Transformando tecnologia em conteúdo acessível e engajador',
      description: 'Com mais de 5 anos de experiência, crio conteúdo autêntico que conecta marcas ao público tech-savvy. Especializado em reviews, unboxings e lifestyle tech.',
      specialties: ['Tech Reviews', 'Lifestyle Tech', 'Unboxing', 'Tutorial']
    },
    location: '',
    languages: ['Português', 'Inglês', 'Espanhol'],
    website: 'www.souinfluencer.com.br/usuario',
    contact: {
      email: '',
      phone: '+55 11 99999-9999'
    },
    metrics: {
      totalReach: '2.5M+',
      avgEngagement: '4.8%',
      completedCampaigns: 45,
      rating: 4.9
    },
    pricing: {
      feed: 3500,
      story: 1500,
      reels: 5000,
      video: 8000
    },
    platforms: [
      {
        name: 'Instagram',
        username: '@joaosilva',
        followers: 150000,
        engagement: 4.8,
        link: 'https://instagram.com/joaosilva'
      },
      {
        name: 'YouTube',
        username: 'João Silva Tech',
        followers: 250000,
        engagement: 3.9,
        link: 'https://youtube.com/joaosilvatech'
      },
      {
        name: 'TikTok',
        username: '@joaosilva',
        followers: 180000,
        engagement: 5.2,
        link: 'https://tiktok.com/@joaosilva'
      }
    ],
    expertise: [
      {
        name: 'Reviews de Smartphones',
        description: 'Análises detalhadas dos últimos lançamentos',
        campaigns: 15
      },
      {
        name: 'Tecnologia no Dia a Dia',
        description: 'Como a tecnologia melhora nossa rotina',
        campaigns: 12
      },
      {
        name: 'Setup & Produtividade',
        description: 'Dicas e reviews de equipamentos',
        campaigns: 8
      }
    ],
    recentCampaigns: [
      {
        brand: 'Samsung',
        product: 'Galaxy S24 Ultra',
        type: 'Review',
        performance: {
          views: '450K',
          engagement: '5.2%',
          clicks: '12K'
        }
      },
      {
        brand: 'Apple',
        product: 'MacBook Pro M3',
        type: 'Unboxing + Review',
        performance: {
          views: '380K',
          engagement: '4.8%',
          clicks: '9.5K'
        }
      }
    ]
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  // Fetch user data on mount
  React.useEffect(() => {
    fetchUserData();
  }, []);

  const handleCoverImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não encontrado');

      // Create unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-cover-${Date.now()}.${fileExt}`.toLowerCase();
      const filePath = `covers/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = await supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);

      // Update user profile with new cover image URL
      const { error: updateError } = await supabase
        .from('users')
        .update({ cover_image: publicUrl })
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Update local state
      setProfile(prev => ({
        ...prev,
        coverImage: publicUrl
      }));

      toast.success('Imagem de capa atualizada com sucesso!');
    } catch (err) {
      console.error('Error uploading cover image:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar imagem de capa';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveCover = async () => {
    try {
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não encontrado');

      // Update user profile to remove cover image
      const { error: updateError } = await supabase
        .from('users')
        .update({ cover_image: null })
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Update local state
      setProfile(prev => ({
        ...prev,
        coverImage: ''
      }));

      toast.success('Imagem de capa removida com sucesso!');
    } catch (err) {
      console.error('Error removing cover image:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover imagem de capa';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Get user profile data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      // Get user address
      const { data: addressData } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Update profile state with fetched data
      setProfile(prev => ({
        ...prev,
        name: `${userData.first_name} ${userData.last_name}`,
        verified: userData.verified || false,
        bio: {
          ...prev.bio,
          headline: userData.bio_headline || 'Sou Influencer'
        },
        username: userData.username ? `@${userData.username}` : '',
        avatar: userData.avatar_url || 'https://firebasestorage.googleapis.com/v0/b/sou-influencer.firebasestorage.app/o/logo_retangular.png?alt=media&token=c62a5fbf-0d39-49fd-8f8f-52df3dce9bf6',
        coverImage: userData.cover_image || '',
        location: addressData ? `${addressData.city}, ${addressData.state}` : '',
        contact: {
          ...prev.contact,
          email: userData.email
        }
      }));

    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados do usuário');
      toast.error('Erro ao carregar dados do usuário');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBioSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({ bio_headline: profile.bio.headline })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setEditingBio(false);
      toast.success('Bio atualizada com sucesso!');
    } catch (err) {
      console.error('Error updating bio:', err);
      toast.error('Erro ao atualizar bio');
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setProfile(editedProfile);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const handleHireClick = () => {
    // Store influencer data in localStorage for the new campaign
    localStorage.setItem('selectedInfluencer', JSON.stringify({
      id: '1', // This would come from the actual profile data
      name: profile.name,
      avatar: profile.avatar,
      platform: profile.platforms[0].name,
      followers: profile.platforms[0].followers,
      engagement: profile.platforms[0].engagement,
      categories: profile.bio.specialties,
      location: profile.location
    }));
    
    // Navigate to new campaign with influencer type
    navigate('/dashboard/new-campaign?type=single&influencer=1');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar perfil</h3>
          <p className="text-gray-500">{error}</p>
          <button
            onClick={fetchUserData}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Cover Image */}
      <div className="relative h-48 sm:h-64 md:h-80 w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-200 z-10">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <label
              htmlFor="cover-upload"
              className={`inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-200 group min-h-[44px] ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Enviando...</span>
                </>
              ) : (
                <>
                  <Camera className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Alterar Capa</span>
                </>
              )}
              <input
                type="file"
                id="cover-upload"
                className="hidden"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Validate file size (max 10MB)
                    if (file.size > 10 * 1024 * 1024) {
                      toast.error('A imagem deve ter no máximo 10MB');
                      return;
                    }
                    
                    // Validate file type
                    if (!file.type.startsWith('image/')) {
                      toast.error('Por favor, selecione uma imagem válida');
                      return;
                    }
                    
                    await handleCoverImageUpload(file);
                  }
                }}
                disabled={isUploading}
              />
            </label>
            {profile.coverImage && (
              <button
                onClick={handleRemoveCover}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white/95 transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Remover capa"
                disabled={isUploading}
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            )}
          </div>
          <div className="absolute bottom-4 left-4">
            <p className="text-xs text-white/90 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5">
              Tamanho recomendado: 1920x400px • Máximo: 10MB
            </p>
          </div>
        </div>
        {profile.coverImage ? (
          <img
            src={profile.coverImage}
            alt="Cover"
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 relative z-0"
          />
        ) : (
          <div className="w-full h-full bg-[#2563EB] relative z-0" />
        )}
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
                          // Validate file size (max 2MB)
                          if (file.size > 2 * 1024 * 1024) {
                            alert('A imagem deve ter no máximo 2MB');
                            return;
                          }
                          
                          // Create preview URL
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setProfile(prev => ({
                              ...prev,
                              avatar: reader.result as string
                            }));
                          };
                          reader.readAsDataURL(file);
                          
                          // TODO: Implement avatar upload
                          console.log('Uploading avatar:', file);
                        }
                      }}
                    />
                  </label>
                  {profile.verified && (
                    <div className="absolute -bottom-3 -right-3 group">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-lg relative">
                        <Crown className="h-5 w-5 text-blue-600"/>
                        <div className="absolute bottom-full mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 transform -translate-x-1/2 left-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                          Perfil verificado com cadastro completo e rede social conectada
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{profile.name}</h1>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {profile.verified ? 'Influenciador Verificado' : 'Influenciador'}
                    </span>
                  </div>
                  <div className="mt-1">
                    {editingBio ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={profile.bio.headline}
                          onChange={(e) => setProfile(prev => ({
                            ...prev,
                            bio: { ...prev.bio, headline: e.target.value }
                          }))}
                          className="flex-1 text-lg sm:text-xl text-gray-600 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Descreva sua especialidade em uma frase"
                        />
                        <button
                          onClick={handleBioSave}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => {
                            setEditingBio(false);
                            setProfile(prev => ({
                              ...prev,
                              bio: { ...prev.bio, headline: bioHeadline }
                            }));
                          }}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="group relative">
                        <p className="text-lg sm:text-xl text-gray-600">{profile.bio.headline}</p>
                        <button
                          onClick={() => {
                            setBioHeadline(profile.bio.headline);
                            setEditingBio(true);
                          }}
                          className="absolute -right-8 top-1/2 -translate-y-1/2 p-1 rounded-lg text-gray-400 opacity-0 group-hover:opacity-100 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
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
                  onClick={handleHireClick}
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
            onClick={handleHireClick}
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