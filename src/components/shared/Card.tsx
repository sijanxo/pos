import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Card({
  variant = 'default',
  padding = 'md',
  children,
  className,
  ...props
}: CardProps) {
  const baseClasses = 'card';
  const variantClasses = variant === 'elevated' ? 'card-elevated' : '';
  
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses,
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children?: ReactNode;
}

export function CardHeader({
  title,
  subtitle,
  action,
  children,
  className,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        'card-header flex-between border-b border-muted pb-3 mb-4',
        className
      )}
      {...props}
    >
      <div className="card-header-content">
        {title && (
          <h3 className="card-title text-lg font-semibold text-text">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="card-subtitle text-sm text-muted mt-1">
            {subtitle}
          </p>
        )}
        {children}
      </div>
      {action && (
        <div className="card-header-action">
          {action}
        </div>
      )}
    </div>
  );
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardContent({
  children,
  className,
  ...props
}: CardContentProps) {
  return (
    <div
      className={cn('card-content', className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardFooter({
  children,
  className,
  ...props
}: CardFooterProps) {
  return (
    <div
      className={cn(
        'card-footer border-t border-muted pt-3 mt-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}