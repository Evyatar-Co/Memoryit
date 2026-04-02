import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  as?: 'div' | 'article' | 'section';
}

export function Card({ children, className = '', onClick, as: Tag = 'div' }: CardProps) {
  return (
    <Tag
      className={[
        'bg-surface shadow-card rounded-lg border border-border-main',
        // Generous padding for elderly — nothing cramped
        'p-5 sm:p-7',
        onClick
          ? 'cursor-pointer hover:shadow-strong hover:border-primary transition-all duration-200 active:scale-[0.99]'
          : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
    >
      {children}
    </Tag>
  );
}
