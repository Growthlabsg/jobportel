/**
 * React Hooks for Permissions
 */

import { useQuery } from '@tanstack/react-query';
import { checkPermissions, canPostJobsForStartup, canManageJobApplications } from '@/services/platform/permissions';

/**
 * Check user permissions
 */
export function usePermissions() {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: checkPermissions,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: typeof window !== 'undefined',
  });
}

/**
 * Check if user can post jobs for a specific startup
 */
export function useCanPostJobsForStartup(startupId: string | null) {
  return useQuery({
    queryKey: ['can-post-jobs', startupId],
    queryFn: () => startupId ? canPostJobsForStartup(startupId) : false,
    enabled: !!startupId && typeof window !== 'undefined',
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Check if user can manage applications for a job
 */
export function useCanManageJobApplications(jobId: string | null) {
  return useQuery({
    queryKey: ['can-manage-applications', jobId],
    queryFn: () => jobId ? canManageJobApplications(jobId) : false,
    enabled: !!jobId && typeof window !== 'undefined',
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

