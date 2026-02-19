/**
 * React Hooks for Freelancer Platform
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OPTIMIZED_QUERY_DEFAULTS } from '@/lib/api-optimization';
import {
  getFreelancerProfile,
  searchFreelancers,
  getProjects,
  getProjectById,
  createProject,
  submitProposal,
  getMyProjects,
  getMyProposals,
  getProjectProposals,
  saveFreelancerProfile,
} from '@/services/platform/freelancer';
import {
  FreelancerProfile,
  Project,
  Proposal,
  ProjectFilters,
  FreelancerFilters,
  CreateProjectData,
  CreateProposalData,
  CreateFreelancerProfileData,
} from '@/types/freelancer';

/**
 * Get freelancer profile
 */
export function useFreelancerProfile(freelancerId?: string) {
  return useQuery({
    queryKey: ['freelancer-profile', freelancerId],
    queryFn: () => getFreelancerProfile(freelancerId),
    enabled: typeof window !== 'undefined',
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Get my freelancer profile
 */
export function useMyFreelancerProfile() {
  return useQuery({
    queryKey: ['my-freelancer-profile'],
    queryFn: () => getFreelancerProfile(), // No ID means get current user's profile
    enabled: typeof window !== 'undefined',
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Search freelancers
 */
export function useSearchFreelancers(filters: FreelancerFilters) {
  return useQuery({
    queryKey: ['search-freelancers', filters],
    queryFn: () => searchFreelancers(filters),
    enabled: typeof window !== 'undefined',
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Get projects
 */
export function useProjects(filters: ProjectFilters) {
  return useQuery({
    queryKey: ['freelancer-projects', filters],
    queryFn: () => getProjects(filters),
    enabled: typeof window !== 'undefined',
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Get project by ID
 */
export function useProject(projectId: string | null) {
  return useQuery({
    queryKey: ['freelancer-project', projectId],
    queryFn: () => projectId ? getProjectById(projectId) : null,
    enabled: !!projectId && typeof window !== 'undefined',
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Get my projects (as client)
 */
export function useMyProjects() {
  return useQuery({
    queryKey: ['my-freelancer-projects'],
    queryFn: getMyProjects,
    enabled: typeof window !== 'undefined',
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Get my proposals (as freelancer)
 */
export function useMyProposals() {
  return useQuery({
    queryKey: ['my-freelancer-proposals'],
    queryFn: getMyProposals,
    enabled: typeof window !== 'undefined',
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Get proposals for a project (as client)
 */
export function useProjectProposals(projectId: string | null) {
  return useQuery({
    queryKey: ['project-proposals', projectId],
    queryFn: () => projectId ? getProjectProposals(projectId) : Promise.resolve([]),
    enabled: !!projectId && typeof window !== 'undefined',
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Create project mutation
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectData) => createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freelancer-projects'] });
      queryClient.invalidateQueries({ queryKey: ['my-freelancer-projects'] });
    },
  });
}

/**
 * Submit proposal mutation
 */
export function useSubmitProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProposalData) => submitProposal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-freelancer-proposals'] });
    },
  });
}

/**
 * Save freelancer profile mutation
 */
export function useSaveFreelancerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFreelancerProfileData) => saveFreelancerProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freelancer-profile'] });
    },
  });
}

