import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import { cn } from '@/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substring(7)}`;

  return (
    <div className={cn('input-group', fullWidth && 'w-full', className)}>
      {label && (
        <label 
          htmlFor={inputId}
          className="input-label block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      
      <div className="input-wrapper relative">
        {leftIcon && (
          <div className="input-icon-left absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'input-field w-full',
            leftIcon && 'pl-12',
            rightIcon && 'pr-10',
            error && 'border-error focus:border-error',
            !error && 'border-muted focus:border-primary'
          )}
          {...props}
        />
        
        {rightIcon && (
          <div className="input-icon-right absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="input-error text-sm text-error mt-1">
          {error}
        </p>
      )}
    </div>
  );
});
