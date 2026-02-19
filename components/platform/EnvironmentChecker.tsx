/**
 * Environment Checker Component
 * Validates environment variables and shows error if misconfigured
 */

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { AlertTriangle } from 'lucide-react';
import { validateEnvironmentVariables } from '@/lib/env-validation';

export function EnvironmentChecker({ children }: { children: React.ReactNode }) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const validation = validateEnvironmentVariables();
    setIsValid(validation.valid);
    setErrors(validation.errors);
  }, []);

  // Always render children on server and initial client render to prevent hydration mismatch
  // Only show error after component mounts
  // Render children directly without wrapper to prevent hydration issues
  if (!isMounted) {
    return <>{children}</>;
  }

  // Show error only in development or if critical
  if (isValid === false && errors.length > 0) {
    // Only show in development mode (check via window or always show in dev)
    const isDevelopment = typeof window !== 'undefined' 
      ? window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      : true; // Assume dev on server-side
    if (isDevelopment) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <Card className="max-w-2xl w-full border-yellow-300 dark:border-yellow-700 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                <AlertTriangle className="h-5 w-5" />
                Environment Configuration Error
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                The Jobs Portal requires proper environment configuration to connect to the main Growth Lab platform.
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Missing or Invalid Configuration:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="font-semibold text-blue-800 dark:text-blue-300 mb-2">How to Fix:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <li>Create a <code className="bg-blue-100 dark:bg-blue-900/30 px-1 rounded">.env.local</code> file in the project root</li>
                  <li>Add: <code className="bg-blue-100 dark:bg-blue-900/30 px-1 rounded">NEXT_PUBLIC_MAIN_PLATFORM_URL=http://localhost:3001</code></li>
                  <li>Replace with your actual main platform URL</li>
                  <li>Restart the development server</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  return <>{children}</>;
}

