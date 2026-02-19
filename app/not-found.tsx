import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">404 - Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/jobs">
          <Button>Go to Jobs</Button>
        </Link>
      </div>
    </div>
  );
}

