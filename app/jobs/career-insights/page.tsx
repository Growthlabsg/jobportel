'use client';

import { CareerInsights } from '@/components/job-seeker/CareerInsights';

export default function CareerInsightsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Career Insights</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Track your job search progress and performance analytics
          </p>
        </div>
        <CareerInsights />
      </div>
    </div>
  );
}
