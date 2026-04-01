import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
}

const sizeMap = {
  sm: 'w-10 h-10 text-lg',
  md: 'w-12 h-12 text-xl',
  lg: 'w-16 h-16 text-2xl',
};

const variantMap = {
  primary: 'bg-primary text-white hover:bg-green-800',
  secondary: 'bg-secondary text-white hover:bg-blue-800',
  ghost: 'bg-white border-2 border-border-main text-text-main hover:bg-bg',
};

export function IconButton({
  children,
  size = 'md',
  variant = 'ghost',
  className = '',
  ...props
}: IconButtonProps) {
  return (
    <button
      className={[
        'rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 shadow-card outline-none focus:ring-4 focus:ring-offset-1 focus:ring-primary',
        sizeMap[size],
        variantMap[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
