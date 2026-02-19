/**
 * Jobs API Service - Integrated with Main Growth Lab Platform
 * All job operations sync with main platform and startup directory
 */

import { apiClient } from '../api/client';
import { Job, CreateJobData, JobFilters } from '@/types/job';
import { PlatformApiResponse, PaginatedResponse } from '@/types/platform';
import { syncJobToStartupDirectory, removeJobFromStartupDirectory, updateStartupJobStatus } from './startupDirectory';
import { getActiveJobProfile } from './auth';
import { syncJobToTeam, removeJobFromTeam } from '@/lib/teams/job-sync';

const MAIN_PLATFORM_BASE_URL = process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL || 'http://localhost:3001';
const JOBS_ENDPOINT = `${MAIN_PLATFORM_BASE_URL}/api/jobs`;

/**
 * Get all jobs (from main platform)
 * Public endpoint - works without authentication
 */
export async function getJobs(filters: JobFilters): Promise<PaginatedResponse<Job>> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('growthlab_token') : null;

    // Build query params
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.location) {
      const locations = Array.isArray(filters.location) ? filters.location : [filters.location];
      locations.forEach(loc => params.append('location', loc));
    }
    if (filters.jobType) {
      const types = Array.isArray(filters.jobType) ? filters.jobType : [filters.jobType];
      types.forEach(type => params.append('jobType', type));
    }
    if (filters.experienceLevel) {
      const levels = Array.isArray(filters.experienceLevel) ? filters.experienceLevel : [filters.experienceLevel];
      levels.forEach(level => params.append('experienceLevel', level));
    }
    if (filters.remoteWork) {
      const remoteWorkOptions = Array.isArray(filters.remoteWork) ? filters.remoteWork : [filters.remoteWork];
      remoteWorkOptions.forEach(option => params.append('remoteWork', option));
    }
    if (filters.salaryMin) params.append('salaryMin', filters.salaryMin.toString());
    if (filters.salaryMax) params.append('salaryMax', filters.salaryMax.toString());
    if (filters.visaSponsorship !== undefined) params.append('visaSponsorship', String(filters.visaSponsorship));
    if (filters.featured !== undefined) params.append('featured', String(filters.featured));
    if ('companyId' in filters && filters.companyId) params.append('companyId', String(filters.companyId));
    if (filters.teamCardId) params.append('teamCardId', filters.teamCardId);
    if (filters.hasTeamCard !== undefined) params.append('hasTeamCard', String(filters.hasTeamCard));
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    params.append('page', (filters.page || 1).toString());
    params.append('limit', (filters.limit || 20).toString());

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Add auth header only if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${JOBS_ENDPOINT}?${params}`, {
      headers,
    }).catch((fetchError) => {
      // Network errors (CORS, connection refused, etc.) - return null to be handled below
      return null;
    });

    if (!response || !response.ok) {
      // If unauthorized or network error, return empty results instead of throwing
      if (response && (response.status === 401 || response.status === 403)) {
        return {
          items: [],
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 0,
        };
      }
      // Network error or other failure - return empty results
      return {
        items: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      };
    }

    const data: PlatformApiResponse<PaginatedResponse<Job>> = await response.json();
    return data.data;
  } catch (error) {
    // Only log non-fetch errors (parsing errors, etc.)
    if (error instanceof Error && !error.message.includes('Failed to fetch')) {
      console.error('Error fetching jobs:', error);
    }
    return {
      items: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    };
  }
}

/**
 * Get job by ID
 */
export async function getJobById(jobId: string): Promise<Job | null> {
  try {
    const token = localStorage.getItem('growthlab_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${JOBS_ENDPOINT}/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch job');
    }

    const data: PlatformApiResponse<Job> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
}

/**
 * Create a new job
 * This will:
 * 1. Create job in main platform
 * 2. Sync to startup directory if startupId is provided
 * 3. Auto-link to team if teamCardId is provided
 */
export async function createJob(
  jobData: CreateJobData,
  options?: {
    startupId?: string;
    teamCardId?: string; // Auto-link to team in build-teams section
  }
): Promise<Job | null> {
  try {
    if (typeof window === 'undefined') {
      throw new Error('createJob can only be called on the client side');
    }
    const token = localStorage.getItem('growthlab_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    // Get active profile to determine company/startup
    const profile = await getActiveJobProfile();
    if (!profile) {
      throw new Error('No active job profile found');
    }

    // If startupId not provided, try to get from profile metadata
    const finalStartupId = options?.startupId || (profile.metadata as { companyId?: string })?.companyId;
    
    // Get teamCardId from options or try to find from companyId
    let finalTeamCardId = options?.teamCardId;
    if (!finalTeamCardId && finalStartupId) {
      // Try to find team card by companyId
      // In production, this would query the teams API
      finalTeamCardId = await findTeamCardByCompanyId(finalStartupId);
    }

    // Create job in main platform
    const response = await fetch(JOBS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...jobData,
        profileId: profile.id,
        startupId: finalStartupId,
        teamCardId: finalTeamCardId, // Include teamCardId in job creation
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create job');
    }

    const data: PlatformApiResponse<Job> = await response.json();
    const job = data.data;

    // Auto-link job to team if teamCardId exists
    if (finalTeamCardId && job.id) {
      try {
        await linkJobToTeam(job.id, finalTeamCardId, finalStartupId);
      } catch (linkError) {
        console.warn('Failed to auto-link job to team:', linkError);
        // Don't fail job creation if linking fails
      }
    }

    // Sync to startup directory if startupId exists
    if (finalStartupId) {
      await syncJobToStartupDirectory(job, finalStartupId);
    }

    // Sync to team if teamCardId exists
    if (finalTeamCardId) {
      await syncJobToTeam(job, finalTeamCardId);
    }

    return job;
  } catch (error) {
    console.error('Error creating job:', error);
    return null;
  }
}

/**
 * Find team card by company ID
 * In production, this would query the teams API
 */
async function findTeamCardByCompanyId(companyId: string): Promise<string | undefined> {
  try {
    // In production: GET /api/teams?companyId={companyId}
    // For now, return undefined (will be handled by manual linking)
    return undefined;
  } catch (error) {
    console.error('Error finding team card by company ID:', error);
    return undefined;
  }
}

/**
 * Link a job to a team
 */
async function linkJobToTeam(
  jobId: string,
  teamCardId: string,
  companyId?: string
): Promise<boolean> {
  try {
    if (typeof window === 'undefined') {
      return false;
    }
    const token = localStorage.getItem('growthlab_token');
    if (!token) {
      return false;
    }

    const response = await fetch(`/api/jobs/${jobId}/link-team`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        teamCardId,
        companyId,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error linking job to team:', error);
    return false;
  }
}

/**
 * Update an existing job
 */
export async function updateJob(jobId: string, jobData: Partial<CreateJobData>): Promise<Job | null> {
  try {
    const token = localStorage.getItem('growthlab_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${JOBS_ENDPOINT}/${jobId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    });

    if (!response.ok) {
      throw new Error('Failed to update job');
    }

    const data: PlatformApiResponse<Job> = await response.json();
    const job = data.data;

    // Sync update to startup directory if job has startupId
    // Note: You may need to store startupId in job metadata or fetch it
    const startupId = (job as any).startupId;
    if (startupId) {
      await syncJobToStartupDirectory(job, startupId);
    }

    return job;
  } catch (error) {
    console.error('Error updating job:', error);
    return null;
  }
}

/**
 * Delete a job
 */
export async function deleteJob(jobId: string, startupId?: string): Promise<boolean> {
  try {
    const token = localStorage.getItem('growthlab_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${JOBS_ENDPOINT}/${jobId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete job');
    }

    // Remove from startup directory if startupId provided
    if (startupId) {
      await removeJobFromStartupDirectory(jobId, startupId);
    }

    // Remove from team if job has teamCardId
    // Note: We'd need to fetch the job first to get teamCardId
    // For now, this is handled by the API route

    return true;
  } catch (error) {
    console.error('Error deleting job:', error);
    return false;
  }
}

/**
 * Update job status
 */
export async function updateJobStatus(
  jobId: string,
  status: 'Published' | 'Draft' | 'Closed',
  startupId?: string
): Promise<boolean> {
  try {
    const token = localStorage.getItem('growthlab_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${JOBS_ENDPOINT}/${jobId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update job status');
    }

    // Update status in startup directory if startupId provided
    if (startupId) {
      await updateStartupJobStatus(jobId, startupId, status);
    }

    return true;
  } catch (error) {
    console.error('Error updating job status:', error);
    return false;
  }
}

/**
 * Get jobs posted by current user
 */
export async function getMyJobs(): Promise<Job[]> {
  try {
    const token = localStorage.getItem('growthlab_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const profile = await getActiveJobProfile();
    if (!profile) {
      return [];
    }

    const response = await fetch(`${JOBS_ENDPOINT}/my?profileId=${profile.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch my jobs');
    }

    const data: PlatformApiResponse<Job[]> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching my jobs:', error);
    return [];
  }
}

