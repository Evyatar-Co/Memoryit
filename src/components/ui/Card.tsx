import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={[
        'bg-surface shadow-card rounded-lg p-6 border border-border-main',
        onClick ? 'cursor-pointer hover:shadow-strong transition-shadow duration-200' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
