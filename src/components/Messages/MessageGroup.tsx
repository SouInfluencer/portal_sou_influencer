import React from 'react';
import type { Message } from './types';
import { MessageItem } from './MessageItem';

interface MessageGroupProps {
  messages: Message[];
  isCurrentUser: boolean;
  onDelete?: (messageId: string) => Promise<void>;
  onEdit?: (messageId: string, newContent: string) => Promise<void>;
  onReact?: (messageId: string, emoji: string) => Promise<void>;
  renderActions?: (message: Message) => React.ReactNode;
}

export function MessageGroup({
  messages,
  isCurrentUser,
  onDelete,
  onEdit,
  onReact,
  renderActions
}: MessageGroupProps) {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[70%] ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
        {!isCurrentUser && messages[0].sender.avatar && (
          <img
            src={messages[0].sender.avatar}
            alt={messages[0].sender.name}
            className="h-8 w-8 rounded-full flex-shrink-0 ring-2 ring-white"
          />
        )}
        <div className={`space-y-1 ${isCurrentUser ? 'mr-2' : 'ml-2'}`}>
          {!isCurrentUser && (
            <p className="text-xs font-medium text-gray-500 mb-1">{messages[0].sender.name}</p>
          )}
          {messages.map((message, index) => (
            <MessageItem
              key={message.id}
              message={message}
              isCurrentUser={isCurrentUser}
              onDelete={onDelete}
              onEdit={onEdit}
              onReact={onReact}
              renderActions={renderActions}
              isFirstInGroup={index === 0}
              isLastInGroup={index === messages.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}