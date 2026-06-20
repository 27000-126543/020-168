
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  ...props
}) => {
  const baseStyles = 'font-medium transition-all duration-200 rounded-2xl flex items-center justify-center min-h-[48px] active:scale-[0.97]';
  
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-light shadow-card hover:shadow-card-active',
    secondary: 'bg-white text-primary border-2 border-primary hover:bg-primary-50',
    ghost: 'text-slate-light hover:text-primary hover:bg-primary-50',
    danger: 'bg-coral text-white hover:bg-coral-light shadow-card',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm min-h-[40px]',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg min-h-[56px]',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
