import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-primary text-white hover:bg-green-800 active:bg-green-900 shadow-card disabled:opacity-50',
  secondary:
    'bg-secondary text-white hover:bg-blue-800 active:bg-blue-900 shadow-card disabled:opacity-50',
  ghost:
    'bg-transparent text-primary border-2 border-primary hover:bg-primary-light active:bg-green-100 disabled:opacity-50',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-card disabled:opacity-50',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-base min-h-[44px] rounded-sm',
  md: 'px-6 py-3 text-lg min-h-[56px] rounded-md',
  lg: 'px-8 py-4 text-xl min-h-[72px] rounded-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'font-bold transition-all duration-150 cursor-pointer outline-none focus:ring-4 focus:ring-offset-2 focus:ring-primary select-none',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
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
