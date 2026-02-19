/**
 * Job Alerts API Service - Integrated with Main Growth Lab Platform
 * Handles job alerts syncing with main platform
 */

import { PlatformApiResponse, PaginatedResponse } from '@/types/platform';
import { getAuthToken, getActiveJobProfile } from './auth';
import { JobFilters } from '@/types/job';

const MAIN_PLATFORM_BASE_URL = process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL || 'http://localhost:3001';
const JOB_ALERTS_ENDPOINT = `${MAIN_PLATFORM_BASE_URL}/api/job-alerts`;

export interface JobAlert {
  id: string;
  name: string;
  filters: JobFilters;
  frequency: 'daily' | 'weekly' | 'instant';
  active: boolean;
  lastSent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobAlertData {
  name: string;
  filters: JobFilters;
  frequency: 'daily' | 'weekly' | 'instant';
}

/**
 * Get job alerts
 */
export async function getJobAlerts(): Promise<JobAlert[]> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const profile = await getActiveJobProfile();
    if (!profile) {
      throw new Error('No active profile found');
    }

    const response = await fetch(`${JOB_ALERTS_ENDPOINT}?profileId=${profile.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch job alerts');
    }

    const data: PlatformApiResponse<JobAlert[]> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching job alerts:', error);
    return [];
  }
}

/**
 * Create job alert
 */
export async function createJobAlert(alertData: CreateJobAlertData): Promise<JobAlert | null> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const profile = await getActiveJobProfile();
    if (!profile) {
      throw new Error('No active profile found');
    }

    const response = await fetch(JOB_ALERTS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...alertData,
        profileId: profile.id,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create job alert');
    }

    const data: PlatformApiResponse<JobAlert> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error creating job alert:', error);
    return null;
  }
}

/**
 * Update job alert
 */
export async function updateJobAlert(
  alertId: string,
  updates: Partial<CreateJobAlertData>
): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${JOB_ALERTS_ENDPOINT}/${alertId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update job alert');
    }

    return true;
  } catch (error) {
    console.error('Error updating job alert:', error);
    return false;
  }
}

/**
 * Delete job alert
 */
export async function deleteJobAlert(alertId: string): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${JOB_ALERTS_ENDPOINT}/${alertId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete job alert');
    }

    return true;
  } catch (error) {
    console.error('Error deleting job alert:', error);
    return false;
  }
}

/**
 * Toggle job alert active status
 */
export async function toggleJobAlert(alertId: string, active: boolean): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${JOB_ALERTS_ENDPOINT}/${alertId}/toggle`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ active }),
    });

    if (!response.ok) {
      throw new Error('Failed to toggle job alert');
    }

    return true;
  } catch (error) {
    console.error('Error toggling job alert:', error);
    return false;
  }
}

