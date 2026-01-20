import React from 'react';

interface NotificationBadgeProps {
  count: number;
  className?: string;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count, className = '' }) => {
  if (count === 0) return null;

  return (
    <div className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${className}`}>
      {count > 99 ? '99+' : count}
    </div>
  );
};
