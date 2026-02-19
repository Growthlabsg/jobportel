'use client';

import { ReactNode, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}

interface SelectTriggerProps {
  children: ReactNode;
  className?: string;
}

interface SelectContentProps {
  children: ReactNode;
  className?: string;
}

interface SelectItemProps {
  value: string;
  children: ReactNode;
  className?: string;
}

interface SelectValueProps {
  placeholder?: string;
}

export const Select = ({ value, onValueChange, children, className }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Extract items from children
  const items: { value: string; label: ReactNode }[] = [];
  let trigger: ReactNode = null;
  let placeholder = 'Select...';
  
  const processChildren = (children: ReactNode) => {
    if (Array.isArray(children)) {
      children.forEach((child: any) => {
        if (child?.type?.name === 'SelectTrigger') {
          trigger = child;
        } else if (child?.type?.name === 'SelectContent') {
          if (Array.isArray(child.props?.children)) {
            child.props.children.forEach((item: any) => {
              if (item?.type?.name === 'SelectItem') {
                items.push({ value: item.props.value, label: item.props.children });
              }
            });
          }
        }
      });
    }
  };
  
  processChildren(children);
  
  const selectedItem = items.find(item => item.value === value);
  const selectedLabel = selectedItem?.label || placeholder;
  
  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
        )}
      >
        <span>{selectedLabel}</span>
        <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
            <div className="max-h-60 overflow-auto p-1">
              {items.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    onValueChange(item.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full rounded-md px-3 py-2 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700',
                    value === item.value && 'bg-primary/10 dark:bg-primary/20 text-primary'
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const SelectTrigger = ({ children, className }: SelectTriggerProps) => {
  return <div className={className}>{children}</div>;
};

export const SelectContent = ({ children, className }: SelectContentProps) => {
  return <div className={className}>{children}</div>;
};

export const SelectItem = ({ value, children, className }: SelectItemProps) => {
  return <div data-value={value} className={className}>{children}</div>;
};

export const SelectValue = ({ placeholder }: SelectValueProps) => {
  return <span>{placeholder}</span>;
};

