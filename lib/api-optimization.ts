/**
 * API Optimization Utilities
 * Provides utilities for optimizing API calls at scale
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';

// Optimized query defaults for high-scale scenarios
export const OPTIMIZED_QUERY_DEFAULTS = {
  // Stale time - data is considered fresh for this duration
  staleTime: 5 * 60 * 1000, // 5 minutes
  
  // Cache time - data stays in cache after component unmount
  cacheTime: 30 * 60 * 1000, // 30 minutes
  
  // Retry configuration
  retry: 2,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  
  // Refetch configuration
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  refetchOnMount: false, // Only refetch if data is stale
  
  // Network mode
  networkMode: 'online' as const,
} as const;

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  pageSize: 20,
  maxPageSize: 100,
  cursorBased: true, // Use cursor-based pagination for better performance
} as const;

/**
 * Optimized useQuery hook with defaults for high-scale scenarios
 */
export function useOptimizedQuery<TData = unknown, TError = Error>(
  options: Omit<UseQueryOptions<TData, TError>, 'staleTime' | 'cacheTime' | 'retry' | 'retryDelay'>
) {
  return useQuery<TData, TError>({
    ...OPTIMIZED_QUERY_DEFAULTS,
    ...options,
  });
}

/**
 * Request debouncing utility
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Request throttling utility
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Prefetch utility for critical data
 */
export function usePrefetch<TData = unknown>(
  queryKey: string[],
  queryFn: () => Promise<TData>
) {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.prefetchQuery({
      queryKey,
      queryFn,
      ...OPTIMIZED_QUERY_DEFAULTS,
    });
  };
}

/**
 * Optimistic update utility
 */
export function useOptimisticUpdate<TData = unknown>(
  queryKey: string[],
  updater: (old: TData | undefined) => TData
) {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.setQueryData<TData>(queryKey, updater);
  };
}

/**
 * Invalidate and refetch utility
 */
export function useInvalidateQuery(queryKey: string[]) {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey });
  };
}

/**
 * Cache warming utility - preload critical data
 */
export async function warmCache<TData>(
  queryClient: ReturnType<typeof useQueryClient>,
  queries: Array<{
    queryKey: string[];
    queryFn: () => Promise<TData>;
  }>
) {
  await Promise.all(
    queries.map(({ queryKey, queryFn }) =>
      queryClient.prefetchQuery({
        queryKey,
        queryFn,
        ...OPTIMIZED_QUERY_DEFAULTS,
      })
    )
  );
}

/**
 * Request prioritization
 */
export enum RequestPriority {
  LOW = 1,
  NORMAL = 2,
  HIGH = 3,
  CRITICAL = 4,
}

export function prioritizeRequest(
  priority: RequestPriority,
  requestFn: () => Promise<any>
): Promise<any> {
  // In a real implementation, this would use a priority queue
  // For now, we'll just execute immediately
  return requestFn();
}

