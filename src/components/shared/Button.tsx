import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'btn';
  const variantClasses = `btn-${variant}`;
  const sizeClasses = size !== 'md' ? `btn-${size}` : '';
  
  return (
    <button
      className={cn(
        baseClasses,
        variantClasses,
        sizeClasses,
        loading && 'loading',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <div className="spinner" />}
      {!loading && leftIcon && <span className="button-icon">{leftIcon}</span>}
      <span>{children}</span>
      {!loading && rightIcon && <span className="button-icon">{rightIcon}</span>}
    </button>
  );
}