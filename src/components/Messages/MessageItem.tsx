import React, { useState } from 'react';
import { Check, Clock, File, Image as ImageIcon } from 'lucide-react';
import type { Message } from './types';

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
  onDelete?: (messageId: string) => Promise<void>;
  onEdit?: (messageId: string, newContent: string) => Promise<void>;
  onReact?: (messageId: string, emoji: string) => Promise<void>;
  renderActions?: (message: Message) => React.ReactNode;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
}

export function MessageItem({
  message,
  isCurrentUser,
  onDelete,
  onEdit,
  onReact,
  renderActions,
  isFirstInGroup,
  isLastInGroup
}: MessageItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);

  const handleEdit = async () => {
    if (onEdit && editedContent !== message.content) {
      await onEdit(message.id, editedContent);
      setIsEditing(false);
    }
  };

  const getStatusIcon = () => {
    switch (message.status) {
      case 'sent':
        return <Check className="h-4 w-4 text-gray-400" />;
      case 'delivered':
        return (
          <div className="flex">
            <Check className="h-4 w-4 text-gray-400" />
            <Check className="h-4 w-4 -ml-2 text-gray-400" />
          </div>
        );
      case 'read':
        return (
          <div className="flex">
            <Check className="h-4 w-4 text-blue-500" />
            <Check className="h-4 w-4 -ml-2 text-blue-500" />
          </div>
        );
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div
      className={`group relative ${
        isCurrentUser ? 'flex flex-row-reverse' : 'flex'
      }`}
    >
      <div
        className={`max-w-lg ${
          isCurrentUser
            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
            : 'bg-white text-gray-900'
        } rounded-xl px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 ${
          isFirstInGroup ? 'rounded-t-xl' : ''
        } ${isLastInGroup ? 'rounded-b-xl' : ''}`}
      >
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>

            {message.attachments?.map((attachment) => (
              <div
                key={attachment.id}
                className="mt-2 flex items-center p-2 rounded bg-black/5 hover:bg-black/10 transition-colors duration-200 group cursor-pointer"
              >
                {attachment.type === 'document' ? (
                  <File className="h-5 w-5 mr-2 text-blue-500" />
                ) : (
                  <ImageIcon className="h-5 w-5 mr-2 text-blue-500" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {attachment.name}
                  </p>
                  {attachment.size && (
                    <p className="text-xs text-gray-500">{attachment.size}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="mt-1 flex items-center justify-end space-x-2 text-xs">
              <span className={`${isCurrentUser ? 'text-white/70' : 'text-gray-400'}`}>
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
              {isCurrentUser && getStatusIcon()}
            </div>
          </>
        )}
      </div>

      {renderActions && !isEditing && (
        <div className={`absolute top-0 ${isCurrentUser ? 'left-0' : 'right-0'} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
          {renderActions(message)}
        </div>
      )}
    </div>
  );
}