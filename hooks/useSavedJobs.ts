/**
 * React Hooks for Saved Jobs
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSavedJobs,
  saveJob,
  unsaveJob,
  isJobSaved,
  updateSavedJobNotes,
} from '@/services/platform/savedJobs';
import { SavedJob } from '@/services/platform/savedJobs';

/**
 * Get saved jobs
 */
export function useSavedJobs(filters?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['saved-jobs', filters],
    queryFn: () => getSavedJobs(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled: typeof window !== 'undefined',
  });
}

/**
 * Check if a job is saved
 */
export function useIsJobSaved(jobId: string | null) {
  return useQuery({
    queryKey: ['is-job-saved', jobId],
    queryFn: () => jobId ? isJobSaved(jobId) : false,
    enabled: !!jobId && typeof window !== 'undefined',
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}

/**
 * Save job mutation
 */
export function useSaveJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, notes }: { jobId: string; notes?: string }) => saveJob(jobId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['is-job-saved'] });
    },
  });
}

/**
 * Unsave job mutation
 */
export function useUnsaveJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => unsaveJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['is-job-saved'] });
    },
  });
}

/**
 * Update saved job notes mutation
 */
export function useUpdateSavedJobNotes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ savedJobId, notes }: { savedJobId: string; notes: string }) =>
      updateSavedJobNotes(savedJobId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-jobs'] });
    },
  });
}

