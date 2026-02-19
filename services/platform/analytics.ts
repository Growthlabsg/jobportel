/**
 * Analytics API Service - Integrated with Main Growth Lab Platform
 * Handles analytics and metrics syncing with main platform
 */

import { PlatformApiResponse } from '@/types/platform';
import { getAuthToken, getActiveJobProfile } from './auth';
import { JobSeekerAnalytics, EmployerAnalytics, TimeRange } from '@/types/analytics';

const MAIN_PLATFORM_BASE_URL = process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL || 'http://localhost:3001';
const ANALYTICS_ENDPOINT = `${MAIN_PLATFORM_BASE_URL}/api/analytics`;

/**
 * Track job view
 */
export async function trackJobView(jobId: string): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) {
      return false; // Silent fail for unauthenticated views
    }

    const profile = await getActiveJobProfile();
    if (!profile) {
      return false;
    }

    const response = await fetch(`${ANALYTICS_ENDPOINT}/job-views`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobId,
        profileId: profile.id,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error tracking job view:', error);
    return false;
  }
}

/**
 * Track application start
 */
export async function trackApplicationStart(jobId: string): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) {
      return false;
    }

    const profile = await getActiveJobProfile();
    if (!profile) {
      return false;
    }

    const response = await fetch(`${ANALYTICS_ENDPOINT}/application-starts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobId,
        profileId: profile.id,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error tracking application start:', error);
    return false;
  }
}

/**
 * Track application completion
 */
export async function trackApplicationCompletion(jobId: string, applicationId: string): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) {
      return false;
    }

    const profile = await getActiveJobProfile();
    if (!profile) {
      return false;
    }

    const response = await fetch(`${ANALYTICS_ENDPOINT}/application-completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobId,
        applicationId,
        profileId: profile.id,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error tracking application completion:', error);
    return false;
  }
}

/**
 * Get job seeker analytics
 */
export async function getJobSeekerAnalytics(period: TimeRange = '30d'): Promise<JobSeekerAnalytics | null> {
  try {
    const token = getAuthToken();
    if (!token) {
      // Not authenticated - return null silently
      return null;
    }

    const profile = await getActiveJobProfile();
    if (!profile) {
      return null;
    }

    const response = await fetch(`${ANALYTICS_ENDPOINT}/job-seeker?profileId=${profile.id}&period=${period}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // If unauthorized, return null instead of throwing
      if (response.status === 401 || response.status === 403) {
        return null;
      }
      throw new Error('Failed to fetch job seeker analytics');
    }

    const data: PlatformApiResponse<JobSeekerAnalytics> = await response.json();
    return data.data;
  } catch (error) {
    // Only log non-authentication errors
    if (error instanceof Error && error.message !== 'Not authenticated' && error.message !== 'No active profile found') {
      console.error('Error fetching job seeker analytics:', error);
    }
    return null;
  }
}

/**
 * Get employer analytics
 */
export async function getEmployerAnalytics(
  companyId: string,
  period: TimeRange = '30d'
): Promise<EmployerAnalytics | null> {
  try {
    const token = getAuthToken();
    if (!token) {
      // Not authenticated - return null silently
      return null;
    }

    const response = await fetch(`${ANALYTICS_ENDPOINT}/employer?companyId=${companyId}&period=${period}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // If unauthorized, return null instead of throwing
      if (response.status === 401 || response.status === 403) {
        return null;
      }
      throw new Error('Failed to fetch employer analytics');
    }

    const data: PlatformApiResponse<EmployerAnalytics> = await response.json();
    return data.data;
  } catch (error) {
    // Only log non-authentication errors
    if (error instanceof Error && error.message !== 'Not authenticated') {
      console.error('Error fetching employer analytics:', error);
    }
    return null;
  }
}

/**
 * Sync job metrics (views, applications count)
 */
export async function syncJobMetrics(jobId: string, metrics: {
  views?: number;
  applications?: number;
}): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) {
      return false;
    }

    const response = await fetch(`${ANALYTICS_ENDPOINT}/jobs/${jobId}/metrics`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metrics),
    });

    return response.ok;
  } catch (error) {
    console.error('Error syncing job metrics:', error);
    return false;
  }
}

