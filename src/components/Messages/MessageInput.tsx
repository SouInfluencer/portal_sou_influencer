import React, { useRef } from 'react';
import { Send, Paperclip, X } from 'lucide-react';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  attachments: File[];
  onAttachmentRemove: (index: number) => void;
  onAttachmentSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
}

export function MessageInput({
  value,
  onChange,
  onSubmit,
  attachments,
  onAttachmentRemove,
  onAttachmentSelect,
  isSubmitting
}: MessageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="border-t border-gray-200 px-4 py-3 bg-white">
      <form onSubmit={onSubmit} className="flex items-end space-x-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-all duration-200"
        >
          <Paperclip className="h-5 w-5" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          onChange={onAttachmentSelect}
        />

        <div className="flex-1">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Digite sua mensagem..."
            rows={1}
            className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm resize-none px-4 py-3 placeholder-gray-400 transition-all duration-200 hover:border-gray-300"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSubmit(e);
              }
            }}
          />
        </div>

        <button
          type="submit"
          disabled={(!value.trim() && !attachments.length) || isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>

      {attachments.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm"
            >
              <span className="truncate max-w-[150px]">{file.name}</span>
              <button
                onClick={() => onAttachmentRemove(index)}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}