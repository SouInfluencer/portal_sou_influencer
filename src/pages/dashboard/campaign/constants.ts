import { ImageIcon, MessageSquare, Video } from 'lucide-react';
import type { ContentTypeOption } from './types';

export const contentTypes: ContentTypeOption[] = [
  {
    id: 'Feed',
    label: 'Post no Feed',
    icon: ImageIcon,
    description: 'Publicação permanente no feed do perfil',
    platforms: ['Instagram', 'TikTok']
  },
  {
    id: 'Story',
    label: 'Stories',
    icon: MessageSquare,
    description: 'Conteúdo temporário de 24h',
    platforms: ['Instagram']
  },
  {
    id: 'Reels',
    label: 'Reels',
    icon: Video,
    description: 'Vídeo curto vertical',
    platforms: ['Instagram']
  },
  {
    id: 'Shorts',
    label: 'Shorts',
    icon: Video,
    description: 'Vídeo curto vertical',
    platforms: ['YouTube']
  },
  {
    id: 'Video',
    label: 'Vídeo',
    icon: Video,
    description: 'Vídeo longo formato tradicional',
    platforms: ['YouTube', 'TikTok']
  },
  {
    id: 'Live',
    label: 'Live',
    icon: Video,
    description: 'Transmissão ao vivo',
    platforms: ['Instagram', 'YouTube', 'TikTok']
  }
];