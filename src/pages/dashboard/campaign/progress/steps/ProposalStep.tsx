import React from 'react';
import { CheckCircle, ThumbsUp, ThumbsDown, AlertTriangle, Calendar, DollarSign, Hash, TrendingUp, Users, Globe2, Target, Clock, Shield, Star, Award, Heart, MessageSquare, Share2, Image as ImageIcon, Video, Download, Copy, AtSign } from 'lucide-react';
import type { Campaign } from '../../../../../types';

interface ProposalStepProps {
  campaign: Campaign;
  onNext?: () => void;
  onComplete?: () => void;
}

export function ProposalStep({ campaign, onNext, onComplete }: ProposalStepProps) {
  const [showRejectConfirm, setShowRejectConfirm] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);
  const [copied, setCopied] = React.useState<{
    caption: boolean;
    hashtags: boolean;
    mentions: boolean;
  }>({
    caption: false,
    hashtags: false,
    mentions: false
  });
  const [formData, setFormData] = React.useState({
    termsAccepted: false,
    notes: ''
  });

  const handleDownloadImage = async () => {
    try {
      setDownloading(true);
      const response = await fetch('https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=800&fit=crop');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'campaign-image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopy = async (type: keyof typeof copied, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(prev => ({ ...prev, [type]: true }));
    setTimeout(() => {
      setCopied(prev => ({ ...prev, [type]: false }));
    }, 2000);
  };

  const handleAccept = () => {
    if (!formData.termsAccepted) {
      alert('Por favor, aceite os termos da campanha antes de prosseguir.');
      return;
    }
    onComplete?.();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Detalhes da Proposta</h2>
        <p className="mt-1 text-sm text-gray-500">Revise os detalhes da campanha antes de aceitar</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Campaign Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Campaign Objective */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 flex items-center justify-center">
                {campaign.contentType === 'Video' ? (
                  <Video className="h-6 w-6 text-indigo-600" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-indigo-600" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Tipo de Conteúdo</h3>
                <div className="flex items-center mt-1 space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {campaign.platform}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {campaign.contentType}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-indigo-50/50 to-white rounded-xl border border-indigo-100/50 p-4">
                <h4 className="font-medium text-gray-900 mb-2">Requisitos do Formato</h4>
                <ul className="space-y-2">
                  {campaign.platform === 'Instagram' && campaign.contentType === 'Feed' && (
                    <>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600">Formato quadrado (1:1) ou retrato (4:5)</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600">Resolução mínima de 1080x1080 pixels</span>
                      </li>
                    </>
                  )}
                  {campaign.platform === 'Instagram' && campaign.contentType === 'Story' && (
                    <>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600">Formato vertical (9:16)</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600">Resolução recomendada de 1080x1920 pixels</span>
                      </li>
                    </>
                  )}
                  {campaign.platform === 'Instagram' && campaign.contentType === 'Reels' && (
                    <>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600">Formato vertical (9:16)</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600">Duração entre 15-60 segundos</span>
                      </li>
                    </>
                  )}
                  {campaign.platform === 'YouTube' && campaign.contentType === 'Shorts' && (
                    <>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600">Formato vertical (9:16)</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600">Duração máxima de 60 segundos</span>
                      </li>
                    </>
                  )}
                  {campaign.platform === 'YouTube' && campaign.contentType === 'Video' && (
                    <>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600">Formato horizontal (16:9)</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600">Resolução mínima de 1920x1080 pixels</span>
                      </li>
                    </>
                  )}
                  {campaign.platform === 'TikTok' && (
                    <>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600">Formato vertical (9:16)</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600">Duração entre 15-60 segundos</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-green-50/50 to-white rounded-xl border border-green-100/50 p-4">
                <h4 className="font-medium text-gray-900 mb-2">Pontos a Destacar</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Destacar os recursos inovadores do produto</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Demonstrar a experiência do usuário na prática</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Enfatizar a qualidade e durabilidade do produto</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50/50 to-white rounded-xl border border-blue-100/50 p-4">
                <h4 className="font-medium text-gray-900 mb-2">Público-Alvo</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Users className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-600">Tech Enthusiasts, 25-45 anos</span>
                  </li>
                  <li className="flex items-center">
                    <Globe2 className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-600">Brasil - Principais capitais</span>
                  </li>
                  <li className="flex items-center">
                    <Target className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-600">Interessados em tecnologia e inovação</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Content Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-6">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Material da Postagem</h3>
                  <p className="text-sm text-gray-500">Conteúdo pronto para publicação</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Preview do Material */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <h4 className="font-medium text-gray-900">Material para Postagem</h4>
                  </div>
                  <div className="p-4">
                    <div className="aspect-square w-full bg-gray-50 rounded-lg overflow-hidden mb-4">
                      <img
                        src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=800&fit=crop"
                        alt="Material da campanha"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleDownloadImage}
                        disabled={downloading}
                        className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          downloading
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {downloading ? 'Baixando...' : 'Baixar Imagem'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Legenda e Hashtags */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Legenda e Hashtags</h4>
                      <button
                        onClick={() => handleCopy('caption', campaign.description)}
                        className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                          copied.caption
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Copy className="h-4 w-4 mr-1.5" />
                        {copied.caption ? 'Copiado!' : 'Copiar'}
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-100">
                      <p className="text-sm text-gray-600 whitespace-pre-line mb-3">
                        {campaign.description}
                      </p>
                      <p className="text-sm text-indigo-600">
                        #TechReview #Tecnologia #Inovacao #Review #Unboxing #Tech #Gadgets #TechBrasil
                      </p>
                    </div>
                  </div>
                </div>

                {/* Marcações */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Marcações</h4>
                      <button
                        onClick={() => handleCopy('mentions', '@techcorp @techbrasil')}
                        className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                          copied.mentions
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Copy className="h-4 w-4 mr-1.5" />
                        {copied.mentions ? 'Copiado!' : 'Copiar'}
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center space-x-2">
                      <AtSign className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-indigo-600">@techcorp @techbrasil</span>
                    </div>
                  </div>
                </div>

                {campaign.platform === 'Instagram' && (
                  <div className="rounded-lg bg-yellow-50 p-4 border border-yellow-100">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Requisitos do Instagram</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Formato quadrado (1:1) ou retrato (4:5)</li>
                            <li>Resolução mínima de 1080x1080 pixels</li>
                            <li>Tamanho máximo de 8MB</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Campaign Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Detalhes da Campanha</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Valor</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  R$ {campaign.budget.toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-600">Prazo</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {campaign.deadline.toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                <div className="flex items-center">
                  <Hash className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="text-sm text-gray-600">Plataforma</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {campaign.platform}
                </span>
              </div>
            </div>
          </div>

          {/* Terms Acceptance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-6">
            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                Li e aceito os termos da campanha
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleAccept}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <ThumbsUp className="h-5 w-5 mr-2" />
              Aceitar Proposta
            </button>
            <button
              onClick={() => setShowRejectConfirm(true)}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200"
            >
              <ThumbsDown className="h-5 w-5 mr-2 text-red-500" />
              Recusar Proposta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}