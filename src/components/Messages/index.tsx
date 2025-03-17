import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Image as ImageIcon, File, X, Check, Clock } from 'lucide-react';
import type { Message, MessagesProps } from './types';
import { MessageGroup } from './MessageGroup';
import { MessageInput } from './MessageInput';

export function Messages({
  messages,
  currentUserId,
  onSendMessage,
  onDeleteMessage,
  onEditMessage,
  onReactToMessage,
  renderMessageActions,
  isTyping,
  error
}: MessagesProps) {
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !attachments.length) || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSendMessage(newMessage, attachments);
      setNewMessage('');
      setAttachments([]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Group messages by sender and date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.timestamp).toLocaleDateString();
    const lastGroup = groups[groups.length - 1];

    if (
      lastGroup &&
      lastGroup.senderId === message.sender.id &&
      lastGroup.date === date &&
      Date.parse(message.timestamp.toString()) - Date.parse(lastGroup.messages[lastGroup.messages.length - 1].timestamp.toString()) < 300000 // 5 minutes
    ) {
      lastGroup.messages.push(message);
    } else {
      groups.push({
        senderId: message.sender.id,
        date,
        messages: [message]
      });
    }

    return groups;
  }, [] as Array<{ senderId: string; date: string; messages: Message[] }>);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50/50 to-white rounded-lg border border-gray-200/80">
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {groupedMessages.map((group, index) => (
          <MessageGroup
            key={`${group.senderId}-${index}`}
            messages={group.messages}
            isCurrentUser={group.senderId === currentUserId}
            onDelete={onDeleteMessage}
            onEdit={onEditMessage}
            onReact={onReactToMessage}
            renderActions={renderMessageActions}
          />
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-500 text-sm">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
            </div>
            <span>Digitando...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        value={newMessage}
        onChange={setNewMessage}
        onSubmit={handleSendMessage}
        attachments={attachments}
        onAttachmentRemove={removeAttachment}
        onAttachmentSelect={handleFileSelect}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}