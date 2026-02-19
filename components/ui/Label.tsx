'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LabelProps {
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}

export const Label = ({ children, htmlFor, className }: LabelProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn('text-sm font-medium text-gray-700', className)}
    >
      {children}
    </label>
  );
};

