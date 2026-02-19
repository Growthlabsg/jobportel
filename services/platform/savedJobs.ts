/**
 * Saved Jobs API Service - Integrated with Main Growth Lab Platform
 * Handles saved jobs/bookmarks syncing with main platform
 */

import { PlatformApiResponse, PaginatedResponse } from '@/types/platform';
import { getAuthToken, getActiveJobProfile } from './auth';
import { Job } from '@/types/job';

const MAIN_PLATFORM_BASE_URL = process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL || 'http://localhost:3001';
const SAVED_JOBS_ENDPOINT = `${MAIN_PLATFORM_BASE_URL}/api/saved-jobs`;

export interface SavedJob {
  id: string;
  jobId: string;
  job: Job;
  savedAt: string;
  notes?: string;
}

/**
 * Get saved jobs
 */
export async function getSavedJobs(filters?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<SavedJob>> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const profile = await getActiveJobProfile();
    if (!profile) {
      throw new Error('No active profile found');
    }

    const params = new URLSearchParams();
    params.append('page', (filters?.page || 1).toString());
    params.append('limit', (filters?.limit || 20).toString());
    params.append('profileId', profile.id);

    const response = await fetch(`${SAVED_JOBS_ENDPOINT}?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch saved jobs');
    }

    const data: PlatformApiResponse<PaginatedResponse<SavedJob>> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
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
 * Save a job
 */
export async function saveJob(jobId: string, notes?: string): Promise<SavedJob | null> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const profile = await getActiveJobProfile();
    if (!profile) {
      throw new Error('No active profile found');
    }

    const response = await fetch(SAVED_JOBS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobId,
        notes,
        profileId: profile.id,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save job');
    }

    const data: PlatformApiResponse<SavedJob> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error saving job:', error);
    return null;
  }
}

/**
 * Unsave a job
 */
export async function unsaveJob(jobId: string): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const profile = await getActiveJobProfile();
    if (!profile) {
      throw new Error('No active profile found');
    }

    const response = await fetch(`${SAVED_JOBS_ENDPOINT}/${jobId}?profileId=${profile.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to unsave job');
    }

    return true;
  } catch (error) {
    console.error('Error unsaving job:', error);
    return false;
  }
}

/**
 * Check if a job is saved
 */
export async function isJobSaved(jobId: string): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) {
      return false;
    }

    const profile = await getActiveJobProfile();
    if (!profile) {
      return false;
    }

    const response = await fetch(`${SAVED_JOBS_ENDPOINT}/check/${jobId}?profileId=${profile.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return false;
    }

    const data: PlatformApiResponse<{ saved: boolean }> = await response.json();
    return data.data.saved;
  } catch (error) {
    console.error('Error checking if job is saved:', error);
    return false;
  }
}

/**
 * Update saved job notes
 */
export async function updateSavedJobNotes(savedJobId: string, notes: string): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${SAVED_JOBS_ENDPOINT}/${savedJobId}/notes`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ notes }),
    });

    if (!response.ok) {
      throw new Error('Failed to update saved job notes');
    }

    return true;
  } catch (error) {
    console.error('Error updating saved job notes:', error);
    return false;
  }
}

