import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-hover active:scale-[0.97] shadow-card disabled:opacity-40 disabled:cursor-not-allowed',
  secondary:
    'bg-secondary text-white hover:bg-blue-800 active:scale-[0.97] shadow-card disabled:opacity-40 disabled:cursor-not-allowed',
  ghost:
    'bg-transparent text-primary border-2 border-primary hover:bg-primary-light active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed',
  danger:
    'bg-red-700 text-white hover:bg-red-800 active:scale-[0.97] shadow-card disabled:opacity-40 disabled:cursor-not-allowed',
};

// Sizes ensure minimum 56px touch target (elderly requirement)
const sizeClasses: Record<Size, string> = {
  sm:  'px-5 py-3 text-lg min-h-[56px] rounded-md gap-2',
  md:  'px-7 py-4 text-xl min-h-[64px] rounded-md gap-2',
  lg:  'px-9 py-5 text-2xl min-h-[72px] rounded-lg gap-3',
  xl:  'px-10 py-6 text-3xl min-h-[84px] rounded-xl gap-3',
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
        'font-bold transition-all duration-150 cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2',
        'select-none leading-tight',
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
