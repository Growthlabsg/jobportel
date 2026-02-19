/**
 * Permissions Service - Check user permissions for various actions
 */

import { getAuthToken, getActiveJobProfile } from './auth';

const MAIN_PLATFORM_BASE_URL = process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL || 'http://localhost:3001';
const PERMISSIONS_ENDPOINT = `${MAIN_PLATFORM_BASE_URL}/api/permissions`;

export interface PermissionCheck {
  canPostJobs: boolean;
  canManageApplications: boolean;
  canViewAnalytics: boolean;
  canManageTeam: boolean;
  allowedStartups: string[]; // Startup IDs user can post jobs for
}

/**
 * Check user permissions
 */
export async function checkPermissions(): Promise<PermissionCheck | null> {
  try {
    const token = getAuthToken();
    if (!token) {
      return null;
    }

    const profile = await getActiveJobProfile();
    if (!profile) {
      return null;
    }

    const response = await fetch(`${PERMISSIONS_ENDPOINT}/check?profileId=${profile.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to check permissions');
    }

    const data = await response.json();
    return data.data as PermissionCheck;
  } catch (error) {
    console.error('Error checking permissions:', error);
    return null;
  }
}

/**
 * Check if user can post jobs for a specific startup
 */
export async function canPostJobsForStartup(startupId: string): Promise<boolean> {
  try {
    const permissions = await checkPermissions();
    if (!permissions) {
      return false;
    }

    return permissions.allowedStartups.includes(startupId) || permissions.canPostJobs;
  } catch (error) {
    console.error('Error checking startup permissions:', error);
    return false;
  }
}

/**
 * Check if user can manage applications for a job
 */
export async function canManageJobApplications(jobId: string): Promise<boolean> {
  try {
    const permissions = await checkPermissions();
    if (!permissions) {
      return false;
    }

    return permissions.canManageApplications;
  } catch (error) {
    console.error('Error checking application permissions:', error);
    return false;
  }
}

