'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Something went wrong!</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{error.message || 'An unexpected error occurred'}</p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}

