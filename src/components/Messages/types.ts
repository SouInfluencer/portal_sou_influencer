import { ReactNode } from 'react';

export interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'media' | 'system';
  attachments?: Array<{
    id: string;
    type: 'image' | 'video' | 'document';
    url: string;
    name?: string;
    size?: string;
    thumbnailUrl?: string;
  }>;
  metadata?: {
    replyTo?: string;
    edited?: boolean;
    reactions?: Array<{
      emoji: string;
      count: number;
      users: string[];
    }>;
  };
}

export interface MessagesProps {
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string, attachments?: File[]) => Promise<void>;
  onDeleteMessage?: (messageId: string) => Promise<void>;
  onEditMessage?: (messageId: string, newContent: string) => Promise<void>;
  onReactToMessage?: (messageId: string, emoji: string) => Promise<void>;
  renderMessageActions?: (message: Message) => ReactNode;
  isTyping?: boolean;
  error?: string;
}