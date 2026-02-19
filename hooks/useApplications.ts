/**
 * React Hooks for Applications
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Application, ApplicationStatus, CreateApplicationData } from '@/types/application';
import {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplicationStatus,
  getMyApplications,
  getJobApplications,
  withdrawApplication,
} from '@/services/platform/applications';

/**
 * Get applications with filters
 */
export function useApplications(filters: {
  jobId?: string;
  status?: ApplicationStatus;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['applications', filters],
    queryFn: () => getApplications(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled: typeof window !== 'undefined',
  });
}

/**
 * Get application by ID
 */
export function useApplication(applicationId: string | null) {
  return useQuery({
    queryKey: ['application', applicationId],
    queryFn: () => applicationId ? getApplicationById(applicationId) : null,
    enabled: !!applicationId && typeof window !== 'undefined',
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Get user's applications (job seeker view)
 */
export function useMyApplications() {
  return useQuery({
    queryKey: ['my-applications'],
    queryFn: getMyApplications,
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled: typeof window !== 'undefined',
  });
}

/**
 * Get applications for a specific job (employer view)
 */
export function useJobApplications(jobId: string | null) {
  return useQuery({
    queryKey: ['job-applications', jobId],
    queryFn: () => jobId ? getJobApplications(jobId) : [],
    enabled: !!jobId && typeof window !== 'undefined',
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Create application mutation
 */
export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateApplicationData) => createApplication(data),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
    },
  });
}

/**
 * Update application status mutation
 */
export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicationId, status, notes }: { applicationId: string; status: ApplicationStatus; notes?: string }) =>
      updateApplicationStatus(applicationId, status, notes),
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application', variables.applicationId] });
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
    },
  });
}

/**
 * Withdraw application mutation
 */
export function useWithdrawApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationId: string) => withdrawApplication(applicationId),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
    },
  });
}

