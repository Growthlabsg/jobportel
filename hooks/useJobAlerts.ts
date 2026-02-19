/**
 * React Hooks for Job Alerts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getJobAlerts,
  createJobAlert,
  updateJobAlert,
  deleteJobAlert,
  toggleJobAlert,
} from '@/services/platform/jobAlerts';
import { JobAlert, CreateJobAlertData } from '@/services/platform/jobAlerts';

/**
 * Get job alerts
 */
export function useJobAlerts() {
  return useQuery({
    queryKey: ['job-alerts'],
    queryFn: getJobAlerts,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: typeof window !== 'undefined',
  });
}

/**
 * Create job alert mutation
 */
export function useCreateJobAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJobAlertData) => createJobAlert(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-alerts'] });
    },
  });
}

/**
 * Update job alert mutation
 */
export function useUpdateJobAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ alertId, updates }: { alertId: string; updates: Partial<CreateJobAlertData> }) =>
      updateJobAlert(alertId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-alerts'] });
    },
  });
}

/**
 * Delete job alert mutation
 */
export function useDeleteJobAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alertId: string) => deleteJobAlert(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-alerts'] });
    },
  });
}

/**
 * Toggle job alert mutation
 */
export function useToggleJobAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ alertId, active }: { alertId: string; active: boolean }) =>
      toggleJobAlert(alertId, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-alerts'] });
    },
  });
}

