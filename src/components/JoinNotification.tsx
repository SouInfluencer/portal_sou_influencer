import { FC } from 'react';

export interface JoinNotificationProps {
  firstName: string;
}

export const JoinNotification: FC<JoinNotificationProps> = ({ firstName }) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-200 to-purple-200 flex items-center justify-center text-sm font-medium text-purple-600">
      {firstName.charAt(0).toUpperCase()}
    </div>
    <div className="flex flex-col">
      <span className="font-medium text-gray-900">{firstName}</span>
      <span className="text-sm text-gray-600">acabou de entrar para a comunidade</span>
    </div>
  </div>
);