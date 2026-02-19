/**
 * Component shown when main platform is unavailable
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface PlatformUnavailableProps {
  onRetry?: () => void;
  message?: string;
}

export const PlatformUnavailable = ({ onRetry, message }: PlatformUnavailableProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-600">
            <AlertTriangle className="h-5 w-5" />
            Platform Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            {message || 'We\'re having trouble connecting to the main platform. Please try again in a few moments.'}
          </p>

          <div className="flex gap-3">
            {onRetry && (
              <Button
                onClick={onRetry}
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}
            <Link href="/jobs" className="flex-1">
              <Button variant="outline" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> If this problem persists, please check your internet connection or contact support.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

