import React from 'react';
import { Plus } from 'lucide-react';
import type { HeaderProps } from '../types';

export function Header({ title, subtitle, onNewEvent }: HeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
}