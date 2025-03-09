import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import type { EventMenuProps } from '../types';

export function EventMenu({ event, onEdit, onDelete, onClose }: EventMenuProps) {
  return (
    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
      <div className="py-1">
        <button
          onClick={() => {
            onEdit(event.id);
            onClose();
          }}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <Edit2 className="h-4 w-4 mr-2" />
          Editar
        </button>
        <button
          onClick={() => {
            onDelete(event.id);
            onClose();
          }}
          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir
        </button>
      </div>
    </div>
  );
}