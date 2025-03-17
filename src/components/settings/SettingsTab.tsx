import React from 'react';
import type { SettingsTabProps } from './types';

/**
 * Tab component for settings navigation
 * @param props - Settings tab properties
 */
export const SettingsTab = React.memo(function SettingsTab({ 
  id, 
  label, 
  icon: Icon, 
  isActive, 
  onClick 
}: SettingsTabProps) {
  return (
    <button
      onClick={onClick}
      className={`${
        isActive
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
    >
      <Icon className="h-5 w-5 mr-2" />
      {label}
    </button>
  );
});