'use client';

export function FreelancerCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm text-center animate-pulse">
      <div className="p-6">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto mb-4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto mb-4"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      </div>
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm animate-pulse">
      <div className="p-6">
        <div className="space-y-3 mb-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
        <div className="flex gap-2 mb-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      </div>
    </div>
  );
}

export function FreelancerGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <FreelancerCardSkeleton key={i} />
      ))}
    </>
  );
}

export function ProjectGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </>
  );
}

