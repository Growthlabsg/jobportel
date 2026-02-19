import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md font-medium',
        {
          // Variants
          'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200': variant === 'default',
          'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300': variant === 'success',
          'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300': variant === 'warning',
          'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300': variant === 'error',
          'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300': variant === 'info',
          'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300': variant === 'primary',
          'border border-gray-300 dark:border-gray-600 bg-transparent text-gray-700 dark:text-gray-300': variant === 'outline',
          // Sizes
          'px-2.5 py-1 text-xs font-medium': size === 'sm',
          'px-3 py-1.5 text-sm font-medium': size === 'md',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
