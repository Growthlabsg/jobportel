/**
 * Profiles API Service - Integrated with Main Growth Lab Platform
 * Handles user profile data syncing
 */

import { PlatformApiResponse } from '@/types/platform';
import { getAuthToken, getActiveJobProfile } from './auth';

const MAIN_PLATFORM_BASE_URL = process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL || 'http://localhost:3001';
const PROFILES_ENDPOINT = `${MAIN_PLATFORM_BASE_URL}/api/profiles`;

export interface JobSeekerProfileData {
  resume?: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    startDate: string;
    endDate?: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    graduationDate: string;
  }[];
  certifications: {
    name: string;
    issuer: string;
    date: string;
  }[];
  portfolio?: {
    projects: {
      title: string;
      description: string;
      url?: string;
    }[];
  };
}

export interface EmployerProfileData {
  companyPermissions: string[]; // Startup IDs user can manage
  role: string;
  permissions: {
    canPostJobs: boolean;
    canManageApplications: boolean;
    canViewAnalytics: boolean;
    canManageTeam: boolean;
  };
}

/**
 * Get profile details
 */
export async function getProfile(profileId: string): Promise<any | null> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${PROFILES_ENDPOINT}/${profileId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    const data: PlatformApiResponse<any> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

/**
 * Update profile
 */
export async function updateProfile(profileId: string, updates: any): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${PROFILES_ENDPOINT}/${profileId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return true;
  } catch (error) {
    console.error('Error updating profile:', error);
    return false;
  }
}

/**
 * Get job seeker profile data
 */
export async function getJobSeekerProfileData(profileId: string): Promise<JobSeekerProfileData | null> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${PROFILES_ENDPOINT}/${profileId}/job-seeker-data`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch job seeker profile data');
    }

    const data: PlatformApiResponse<JobSeekerProfileData> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching job seeker profile data:', error);
    return null;
  }
}

/**
 * Update job seeker profile data
 */
export async function updateJobSeekerProfileData(
  profileId: string,
  data: Partial<JobSeekerProfileData>
): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${PROFILES_ENDPOINT}/${profileId}/job-seeker-data`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update job seeker profile data');
    }

    return true;
  } catch (error) {
    console.error('Error updating job seeker profile data:', error);
    return false;
  }
}

/**
 * Get employer profile data
 */
export async function getEmployerProfileData(profileId: string): Promise<EmployerProfileData | null> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${PROFILES_ENDPOINT}/${profileId}/employer-data`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch employer profile data');
    }

    const data: PlatformApiResponse<EmployerProfileData> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching employer profile data:', error);
    return null;
  }
}

/**
 * Update employer profile data
 */
export async function updateEmployerProfileData(
  profileId: string,
  data: Partial<EmployerProfileData>
): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${PROFILES_ENDPOINT}/${profileId}/employer-data`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update employer profile data');
    }

    return true;
  } catch (error) {
    console.error('Error updating employer profile data:', error);
    return false;
  }
}

