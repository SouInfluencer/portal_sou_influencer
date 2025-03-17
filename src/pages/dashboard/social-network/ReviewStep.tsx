import React from 'react';
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';
import { PostgrestError } from '@supabase/supabase-js';

interface ReviewStepProps {
  platform: string;
  username: string;
  selectedCategories: string[];
  postUrl: string;
  onNext: () => void;
  onBack: () => void;
}

interface ValidationData {
  image: string;
  caption: string;
  instructions: string;
}

export function ReviewStep({
  platform,
  username,
  selectedCategories,
  postUrl,
  onNext,
  onBack
}: ReviewStepProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const getValidationData = (): ValidationData => {
    return {
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop',
      caption: '#SouInfluencer #Verificação\n\nEste post confirma que sou eu mesmo(a) conectando minha conta à plataforma Sou Influencer.',
      instructions: 'Faça uma publicação com a imagem e legenda fornecidas para validar sua conta.'
    };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const validation = getValidationData();
    
    // Remove @ from username if present
    const cleanUsername = username.replace('@', '');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }
      
      // Check if network already exists
      const { data: existingNetwork } = await supabase
        .from('social_networks')
        .select('id')
        .eq('user_id', user.id)
        .eq('platform', platform.toLowerCase())
        .eq('username', cleanUsername)
        .maybeSingle();

      if (existingNetwork) {
        throw new Error('Esta rede social já está conectada à sua conta');
      }

      // Insert social network record
      const { data, error } = await supabase
        .from('social_networks')
        .insert({
          user_id: user.id,
          platform: platform.toLowerCase(),
          username: cleanUsername,
          post_url: postUrl,
          status: 'pending',
          validation_image: validation.image,
          validation_caption: validation.caption,
          validation_instructions: validation.instructions
        })
        .select()
        .single();

      if (error) {
        const pgError = error as PostgrestError;
        if (pgError.code === '23505') {
          throw new Error('Esta rede social já está conectada à sua conta');
        }
        throw new Error(
          pgError.message || 
          'Erro ao conectar rede social. Por favor, tente novamente.'
        );
      }

      // Insert categories
      if (selectedCategories.length > 0) {
        const { data: categories } = await supabase
          .from('categories')
          .select('id, name')
          .in('name', selectedCategories);

        if (categories && categories.length > 0) {
          const { error: categoriesError } = await supabase
            .from('social_network_categories')
            .insert(
              categories.map(category => ({
                social_network_id: data.id,
                category_id: category.id
              }))
            );
        }
      }

      toast.success('Rede social conectada com sucesso!');
      onNext();
    } catch (error) {
      console.error('Error saving social network:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao conectar rede social');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
          <CheckCircle className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Revisão da Conexão</h2>
        <p className="mt-2 text-gray-600">
          Verifique os detalhes antes de finalizar a conexão
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 space-y-6">
        {/* Connection Details */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Detalhes da Conexão</h3>
          <dl className="grid grid-cols-1 gap-4">
            <div className="bg-gray-50 px-4 py-3 rounded-lg">
              <dt className="text-sm font-medium text-gray-500">Plataforma</dt>
              <dd className="mt-1 text-sm text-gray-900">{platform}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-3 rounded-lg">
              <dt className="text-sm font-medium text-gray-500">Nome de Usuário</dt>
              <dd className="mt-1 text-sm text-gray-900">@{username}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-3 rounded-lg">
              <dt className="text-sm font-medium text-gray-500">Link da Publicação</dt>
              <dd className="mt-1 text-sm text-gray-900 break-all">{postUrl}</dd>
            </div>
          </dl>
          <div className="mt-4">
            <dt className="text-sm font-medium text-gray-500">Categorias</dt>
            <dd className="mt-2 flex flex-wrap gap-2">
              {selectedCategories.map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {category}
                </span>
              ))}
            </dd>
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
                <p>
                  Ao confirmar, você concorda em:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Manter sua conta conectada</li>
                  <li>Seguir as diretrizes da plataforma</li>
                  <li>Manter suas métricas atualizadas</li>
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
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Conectando...
              </>
            ) : (
              'Confirmar Conexão'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}