import React, { useState, useRef } from 'react';
import { Send, Paperclip, Image as ImageIcon, File, Download, Smile, Plus, Camera, Video, Link as LinkIcon } from 'lucide-react';
import type { Campaign } from '../../../types';

// Add mobile-first styles
const styles = `
/* Base styles */
:root {
  --min-touch-target: clamp(2.75rem, 8vw, 3rem); /* 44-48px */
  --container-padding: clamp(1rem, 5vw, 2rem);
  --font-size-base: clamp(0.875rem, 4vw, 1rem);
  --font-size-lg: clamp(1.125rem, 5vw, 1.25rem);
  --font-size-xl: clamp(1.5rem, 6vw, 1.875rem);
  --spacing-base: clamp(1rem, 4vw, 1.5rem);
  --border-radius: clamp(0.75rem, 3vw, 1rem);
}

/* Mobile-first media queries */
@media (max-width: 480px) {
  .messages-container {
    height: calc(100vh - var(--min-touch-target));
    margin-top: var(--min-touch-target);
  }
  
  .messages-list {
    padding: var(--container-padding);
  }
  
  .message-input-container {
    padding: var(--container-padding);
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    border-top: 1px solid rgba(229, 231, 235, 0.5);
    backdrop-filter: blur(8px);
  }
  
  .message-bubble {
    max-width: 85%;
    padding: var(--spacing-base);
  }
  
  .message-actions {
    flex-direction: column;
    gap: var(--spacing-base);
  }
  
  .attachment-preview {
    width: 100%;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .messages-container {
    height: calc(100vh - 4rem);
  }
  
  .message-bubble {
    max-width: 75%;
  }
  
  .attachment-preview {
    max-width: 300px;
  }
}

@media (min-width: 769px) {
  .messages-container {
    height: calc(100vh - 5rem);
  }
  
  .message-bubble {
    max-width: 65%;
  }
  
  .attachment-preview {
    max-width: 400px;
  }
}
`;


interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: Date;
  avatar: string;
  isNew?: boolean;
  attachments?: Array<{
    name: string;
    size: string;
    type: string;
  }>;
}

interface CampaignMessagesProps {
  campaign: Campaign & { messages?: Message[] };
}

React.useEffect(() => {
  // Add styles to document
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);

  // Trigger mount animation
  setMounted(true);

  return () => {
    document.head.removeChild(styleSheet);
  };
}, []);

export function CampaignMessages({ campaign }: CampaignMessagesProps) {
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() || attachments.length > 0) {
      // TODO: Implement message sending
      console.log('Sending message:', { newMessage, attachments });
      setNewMessage('');
      setAttachments([]);
      scrollToBottom();
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  return (
    <div className="flex flex-col messages-container bg-gradient-to-b from-gray-50/50 to-white rounded-lg border border-gray-200/80">
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto messages-list space-y-6">
        <div className="space-y-4">
          {campaign.messages?.map((message) => (
            <div
              key={message.id}
              className={`flex w-full ${
                message.sender === 'Você' ? 'justify-end' : 'justify-start'
              } group`}
            >
              <div className={`flex message-bubble ${
                message.sender === 'Você' ? 'flex-row-reverse' : ''
              }`}>
                {message.sender !== 'Você' && (
                  <img
                    src={message.avatar}
                    alt={message.sender}
                    className="h-8 w-8 rounded-full flex-shrink-0 ring-2 ring-white hidden sm:block"
                  />
                )}
                <div className={`mx-2 ${
                  message.sender === 'Você'
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                    : 'bg-white'
                } rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 message-content`}>
                  {message.sender !== 'Você' && (
                    <p className="text-xs font-medium text-gray-500 mb-1">{message.sender}</p>
                  )}
                  <p className="text-sm">{message.content}</p>
                  {message.attachments?.map((attachment, index) => (
                    <div
                      key={index}
                      className="mt-3 flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 group cursor-pointer attachment-preview"
                    >
                      {attachment.type === 'pdf' ? (
                        <File className="h-5 w-5 mr-3 text-blue-500" />
                      ) : (
                        <ImageIcon className="h-5 w-5 mr-3 text-blue-500" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {attachment.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {attachment.size}
                        </p>
                      </div>
                      <button className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200/80 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <Download className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  <div className="mt-2 flex items-center justify-end space-x-2">
                    <span className="text-xs text-gray-400">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {message.isNew && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Novo
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 px-6 py-4 bg-white rounded-b-lg message-input-container">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
          <div className="flex space-x-2 message-actions">
            <button
              type="button"
              onClick={handleFileUpload}
              className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-all duration-200 min-h-[var(--min-touch-target)] min-w-[var(--min-touch-target)]"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-all duration-200 min-h-[var(--min-touch-target)] min-w-[var(--min-touch-target)]"
            >
              <Camera className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-all duration-200 min-h-[var(--min-touch-target)] min-w-[var(--min-touch-target)]"
            >
              <Video className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-all duration-200 min-h-[var(--min-touch-target)] min-w-[var(--min-touch-target)]"
            >
              <LinkIcon className="h-5 w-5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              onChange={handleFileChange}
            />
          </div>
          <div className="flex-1">
            <textarea
              rows={1}
              placeholder="Digite sua mensagem..."
              className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm resize-none px-4 py-3 placeholder-gray-400 transition-all duration-200 hover:border-gray-300 min-h-[var(--min-touch-target)]"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-all duration-200 min-h-[var(--min-touch-target)] min-w-[var(--min-touch-target)]"
            >
              <Smile className="h-5 w-5" />
            </button>
            <button
              type="submit"
              disabled={!newMessage.trim() && attachments.length === 0}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] min-h-[var(--min-touch-target)]"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
        {attachments.length > 0 && (
          <div className="mt-4 flex items-center space-x-2">
            <span className="text-xs font-medium text-gray-500">Anexos:</span>
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
                <span className="truncate max-w-[150px]">{file.name}</span>
                <button
                  onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}