/**
 * React Hooks for Analytics
 */

import { useQuery } from '@tanstack/react-query';
import { OPTIMIZED_QUERY_DEFAULTS } from '@/lib/api-optimization';
import {
  getJobSeekerAnalytics,
  getEmployerAnalytics,
} from '@/services/platform/analytics';
import { JobSeekerAnalytics, EmployerAnalytics, TimeRange } from '@/types/analytics';

/**
 * Get job seeker analytics
 */
export function useJobSeekerAnalytics(period: TimeRange = '30d', options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['job-seeker-analytics', period],
    queryFn: () => getJobSeekerAnalytics(period),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: options?.enabled !== undefined ? options.enabled : typeof window !== 'undefined',
  });
}

/**
 * Get employer analytics
 */
export function useEmployerAnalytics(companyId: string | null, period: TimeRange = '30d', options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['employer-analytics', companyId, period],
    queryFn: () => companyId ? getEmployerAnalytics(companyId, period) : null,
    enabled: options?.enabled !== undefined ? options.enabled : (!!companyId && typeof window !== 'undefined'),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

