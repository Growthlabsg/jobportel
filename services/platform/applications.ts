/**
 * Applications API Service - Integrated with Main Growth Lab Platform
 * Handles job applications syncing with main platform
 */

import { Application, ApplicationStatus, CreateApplicationData } from '@/types/application';
import { PlatformApiResponse, PaginatedResponse } from '@/types/platform';
import { getAuthToken, getActiveJobProfile } from './auth';

const MAIN_PLATFORM_BASE_URL = process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL || 'http://localhost:3001';
const APPLICATIONS_ENDPOINT = `${MAIN_PLATFORM_BASE_URL}/api/applications`;

/**
 * Create a new job application
 */
export async function createApplication(applicationData: CreateApplicationData): Promise<Application | null> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const profile = await getActiveJobProfile();
    if (!profile) {
      throw new Error('No active profile found');
    }

    const response = await fetch(APPLICATIONS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...applicationData,
        profileId: profile.id,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create application');
    }

    const data: PlatformApiResponse<Application> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error creating application:', error);
    return null;
  }
}

/**
 * Get applications with filters
 */
export async function getApplications(filters: {
  jobId?: string;
  status?: ApplicationStatus;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Application>> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const params = new URLSearchParams();
    if (filters.jobId) params.append('jobId', filters.jobId);
    if (filters.status) params.append('status', filters.status);
    params.append('page', (filters.page || 1).toString());
    params.append('limit', (filters.limit || 20).toString());

    const response = await fetch(`${APPLICATIONS_ENDPOINT}?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch applications');
    }

    const data: PlatformApiResponse<PaginatedResponse<Application>> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching applications:', error);
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
 * Get application by ID
 */
export async function getApplicationById(applicationId: string): Promise<Application | null> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${APPLICATIONS_ENDPOINT}/${applicationId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch application');
    }

    const data: PlatformApiResponse<Application> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching application:', error);
    return null;
  }
}

/**
 * Update application status
 */
export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
  notes?: string
): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${APPLICATIONS_ENDPOINT}/${applicationId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, notes }),
    });

    if (!response.ok) {
      throw new Error('Failed to update application status');
    }

    return true;
  } catch (error) {
    console.error('Error updating application status:', error);
    return false;
  }
}

/**
 * Get user's applications (job seeker view)
 */
export async function getMyApplications(): Promise<Application[]> {
  try {
    const token = getAuthToken();
    if (!token) {
      // Not authenticated - return empty array silently
      return [];
    }

    const profile = await getActiveJobProfile();
    if (!profile) {
      return [];
    }

    const response = await fetch(`${APPLICATIONS_ENDPOINT}/my?profileId=${profile.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // If unauthorized, return empty array instead of throwing
      if (response.status === 401 || response.status === 403) {
        return [];
      }
      throw new Error('Failed to fetch my applications');
    }

    const data: PlatformApiResponse<Application[]> = await response.json();
    return data.data;
  } catch (error) {
    // Only log non-authentication errors
    if (error instanceof Error && error.message !== 'Not authenticated') {
      console.error('Error fetching my applications:', error);
    }
    return [];
  }
}

/**
 * Get applications for a specific job (employer view)
 */
export async function getJobApplications(jobId: string): Promise<Application[]> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${APPLICATIONS_ENDPOINT}?jobId=${jobId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch job applications');
    }

    const data: PlatformApiResponse<PaginatedResponse<Application>> = await response.json();
    return data.data.items;
  } catch (error) {
    console.error('Error fetching job applications:', error);
    return [];
  }
}

/**
 * Withdraw application
 */
export async function withdrawApplication(applicationId: string): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${APPLICATIONS_ENDPOINT}/${applicationId}/withdraw`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to withdraw application');
    }

    return true;
  } catch (error) {
    console.error('Error withdrawing application:', error);
    return false;
  }
}

