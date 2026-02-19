'use client';

import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

export const ViewToggle = ({ view, onViewChange }: ViewToggleProps) => {
  return (
    <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1 bg-white dark:bg-gray-800">
      <button
        onClick={() => onViewChange('grid')}
        className={`p-2 rounded transition-colors ${
          view === 'grid'
            ? 'bg-primary text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        title="Grid View"
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`p-2 rounded transition-colors ${
          view === 'list'
            ? 'bg-primary text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        title="List View"
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  );
};

