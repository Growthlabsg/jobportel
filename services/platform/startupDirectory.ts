/**
 * Startup Directory Integration Service
 * Handles syncing jobs with the Startup Directory in main Growth Lab platform
 */

import { apiClient } from '../api/client';
import { Startup, StartupJob, PlatformApiResponse, PaginatedResponse } from '@/types/platform';
import { Job, CreateJobData } from '@/types/job';
import { getAuthToken } from './auth';

const MAIN_PLATFORM_BASE_URL = process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL || 'http://localhost:3001';
const STARTUP_DIRECTORY_ENDPOINT = `${MAIN_PLATFORM_BASE_URL}/api/startup-directory`;

/**
 * Get startup by ID from main platform
 */
export async function getStartup(startupId: string): Promise<Startup | null> {
  try {
    const token = getAuthToken();
    if (!token) {
      // Return null silently if not authenticated
      return null;
    }

    const response = await fetch(`${STARTUP_DIRECTORY_ENDPOINT}/startups/${startupId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return null;
      }
      throw new Error('Failed to fetch startup');
    }

    const data: PlatformApiResponse<Startup> = await response.json();
    return data.data;
  } catch (error) {
    // Only log actual errors, not authentication issues
    if (error instanceof Error && !error.message.includes('Not authenticated')) {
      console.error('Error fetching startup:', error);
    }
    return null;
  }
}

/**
 * Get all startups (for job posting - to select which startup the job belongs to)
 */
export async function getStartups(
  page: number = 1,
  limit: number = 50,
  search?: string
): Promise<PaginatedResponse<Startup>> {
  try {
    const token = getAuthToken();
    if (!token) {
      // Return empty result silently if not authenticated
      return {
        items: [],
        total: 0,
        page: 1,
        limit: 50,
        totalPages: 0,
      };
    }

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });

    const response = await fetch(`${STARTUP_DIRECTORY_ENDPOINT}/startups?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return {
          items: [],
          total: 0,
          page: 1,
          limit: 50,
          totalPages: 0,
        };
      }
      throw new Error('Failed to fetch startups');
    }

    const data: PlatformApiResponse<PaginatedResponse<Startup>> = await response.json();
    return data.data;
  } catch (error) {
    // Only log actual errors, not authentication issues
    if (error instanceof Error && !error.message.includes('Not authenticated')) {
      console.error('Error fetching startups:', error);
    }
    return {
      items: [],
      total: 0,
      page: 1,
      limit: 50,
      totalPages: 0,
    };
  }
}

/**
 * Get startups where current user has permission to post jobs
 */
export async function getMyStartups(): Promise<Startup[]> {
  try {
    const token = getAuthToken();
    if (!token) {
      // Return empty array silently if not authenticated (user may not be logged in)
      return [];
    }

    const response = await fetch(`${STARTUP_DIRECTORY_ENDPOINT}/startups/my`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // If unauthorized, return empty array (user may not have permission)
      if (response.status === 401 || response.status === 403) {
        return [];
      }
      throw new Error('Failed to fetch my startups');
    }

    const data: PlatformApiResponse<Startup[]> = await response.json();
    return data.data;
  } catch (error) {
    // Only log actual errors, not authentication issues
    if (error instanceof Error && !error.message.includes('Not authenticated')) {
      console.error('Error fetching my startups:', error);
    }
    return [];
  }
}

/**
 * Sync job to startup directory
 * When a job is created/updated in jobs portal, it should appear in startup directory
 */
export async function syncJobToStartupDirectory(
  job: Job | CreateJobData,
  startupId: string
): Promise<StartupJob | null> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    // Convert job to startup job format
    const startupJob: Partial<StartupJob> = {
      id: 'id' in job ? job.id : undefined,
      startupId,
      title: job.title,
      jobType: job.jobType,
      location: typeof job.location === 'string' ? job.location : (job.location as any)?.name || '',
      remoteWork: job.remoteWork,
      experienceLevel: job.experienceLevel,
      status: (() => {
        const jobStatus = 'id' in job ? (job.status || 'Published') : 'Published';
        // Map status to valid StartupJob status
        if (jobStatus === 'Paused' || jobStatus === 'Archived') return 'Draft';
        return jobStatus as 'Published' | 'Draft' | 'Closed';
      })(),
      applicationsCount: 'applicationsCount' in job ? job.applicationsCount : 0,
      viewsCount: 'viewsCount' in job ? job.viewsCount : 0,
    };

    const endpoint = 'id' in job && job.id
      ? `${STARTUP_DIRECTORY_ENDPOINT}/startups/${startupId}/jobs/${job.id}`
      : `${STARTUP_DIRECTORY_ENDPOINT}/startups/${startupId}/jobs`;

    const method = 'id' in job && job.id ? 'PUT' : 'POST';

    const response = await fetch(endpoint, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(startupJob),
    });

    if (!response.ok) {
      throw new Error('Failed to sync job to startup directory');
    }

    const data: PlatformApiResponse<StartupJob> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error syncing job to startup directory:', error);
    return null;
  }
}

/**
 * Remove job from startup directory (when job is deleted or closed)
 */
export async function removeJobFromStartupDirectory(
  jobId: string,
  startupId: string
): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(
      `${STARTUP_DIRECTORY_ENDPOINT}/startups/${startupId}/jobs/${jobId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to remove job from startup directory');
    }

    return true;
  } catch (error) {
    console.error('Error removing job from startup directory:', error);
    return false;
  }
}

/**
 * Get jobs for a specific startup from startup directory
 */
export async function getStartupJobs(startupId: string): Promise<StartupJob[]> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(
      `${STARTUP_DIRECTORY_ENDPOINT}/startups/${startupId}/jobs`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch startup jobs');
    }

    const data: PlatformApiResponse<StartupJob[]> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching startup jobs:', error);
    return [];
  }
}

/**
 * Update job status in startup directory
 */
export async function updateStartupJobStatus(
  jobId: string,
  startupId: string,
  status: 'Published' | 'Draft' | 'Closed'
): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(
      `${STARTUP_DIRECTORY_ENDPOINT}/startups/${startupId}/jobs/${jobId}/status`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update job status');
    }

    return true;
  } catch (error) {
    console.error('Error updating job status:', error);
    return false;
  }
}

