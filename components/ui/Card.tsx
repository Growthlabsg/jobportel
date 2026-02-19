import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

export const Card = ({ children, className, hover = false, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-sm',
        'dark:border-gray-700 dark:bg-gray-800',
        hover && 'transition-all duration-300 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 dark:hover:border-primary/50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardHeader = ({ children, className, ...props }: CardHeaderProps) => {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
};

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export const CardTitle = ({ children, className, ...props }: CardTitleProps) => {
  return (
    <h3 className={cn('text-lg font-semibold text-gray-900 dark:text-gray-100', className)} {...props}>
      {children}
    </h3>
  );
};

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export const CardDescription = ({ children, className, ...props }: CardDescriptionProps) => {
  return (
    <p className={cn('text-sm text-gray-600 dark:text-gray-400', className)} {...props}>
      {children}
    </p>
  );
};

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardContent = ({ children, className, ...props }: CardContentProps) => {
  return (
    <div className={cn('text-gray-600 dark:text-gray-300', className)} {...props}>
      {children}
    </div>
  );
};

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardFooter = ({ children, className, ...props }: CardFooterProps) => {
  return (
    <div className={cn('mt-4 flex items-center gap-2', className)} {...props}>
      {children}
    </div>
  );
};
