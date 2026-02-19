/**
 * Authentication Service for Growth Lab Main Platform Integration
 * Handles authentication with the main Growth Lab platform
 */

import { apiClient } from '../api/client';
import { AuthUser, AuthToken, GrowthLabUser, UserProfile } from '@/types/platform';

const MAIN_PLATFORM_BASE_URL = process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL || 'http://localhost:3001';
const AUTH_ENDPOINT = `${MAIN_PLATFORM_BASE_URL}/api/auth`;

/**
 * Get current authenticated user from main platform
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    if (typeof window === 'undefined') {
      return null;
    }

    const token = localStorage.getItem('growthlab_token');
    if (!token) {
      return null;
    }

    // Call main platform API to get current user and profiles
    const response = await fetch(`${AUTH_ENDPOINT}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }).catch((fetchError) => {
      // Network errors (CORS, connection refused, etc.) - return null silently
      // Don't log during prefetch
      return null;
    });

    if (!response || !response.ok) {
      if (response && response.status === 401) {
        // Token expired or invalid
        clearAuthData();
        return null;
      }
      // Don't throw - just return null for any fetch errors
      return null;
    }

    const data = await response.json();
    return data.data as AuthUser;
  } catch (error) {
    // Only log non-fetch errors
    if (error instanceof Error && !error.message.includes('Failed to fetch')) {
      console.error('Error fetching current user:', error);
    }
    return null;
  }
}

/**
 * Get active profile for jobs portal
 */
export async function getActiveJobProfile(): Promise<UserProfile | null> {
  // Prevent server-side execution
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const authUser = await getCurrentUser();
    if (!authUser) {
      return null;
    }

    // Find job-related profile (job_management or job_seeker)
    const jobProfile = authUser.profiles.find(
      (profile) => profile.profileType === 'job_management' || profile.profileType === 'job_seeker'
    );

    // If no job profile exists, use active profile or default profile
    const profile = jobProfile || authUser.activeProfile || authUser.profiles.find(p => p.isDefault) || null;
    
    // Add user email to profile metadata if available
    if (profile && authUser.user?.email) {
      profile.metadata = {
        ...profile.metadata,
        email: authUser.user.email,
      };
    }
    
    return profile;
  } catch (error) {
    console.error('Error fetching active job profile:', error);
    return null;
  }
}

/**
 * Switch to a different profile
 */
export async function switchProfile(profileId: string): Promise<boolean> {
  try {
    const token = localStorage.getItem('growthlab_token');
    if (!token) {
      return false;
    }

    const response = await fetch(`${AUTH_ENDPOINT}/profiles/${profileId}/activate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to switch profile');
    }

    // Update local storage
    const data = await response.json();
    if (data.data?.token) {
      localStorage.setItem('growthlab_token', data.data.token.accessToken);
    }

    return true;
  } catch (error) {
    console.error('Error switching profile:', error);
    return false;
  }
}

/**
 * Create a new profile for jobs portal
 */
export async function createJobProfile(
  profileType: 'job_management' | 'job_seeker',
  displayName: string,
  metadata?: Record<string, unknown>
): Promise<UserProfile | null> {
  try {
    const token = localStorage.getItem('growthlab_token');
    if (!token) {
      return null;
    }

    const response = await fetch(`${AUTH_ENDPOINT}/profiles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profileType,
        displayName,
        metadata,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create profile');
    }

    const data = await response.json();
    return data.data as UserProfile;
  } catch (error) {
    console.error('Error creating job profile:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return !!localStorage.getItem('growthlab_token');
}

/**
 * Get auth token
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('growthlab_token');
}

/**
 * Clear authentication data
 */
export function clearAuthData(): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem('growthlab_token');
  localStorage.removeItem('growthlab_refresh_token');
  localStorage.removeItem('growthlab_user');
  localStorage.removeItem('growthlab_active_profile');
}

/**
 * Redirect to main platform login
 */
export function redirectToMainPlatformLogin(): void {
  if (typeof window === 'undefined') {
    return;
  }
  const loginUrl = process.env.NEXT_PUBLIC_MAIN_PLATFORM_LOGIN_URL || `${MAIN_PLATFORM_BASE_URL}/login`;
  const returnUrl = encodeURIComponent(window.location.href);
  window.location.href = `${loginUrl}?returnUrl=${returnUrl}`;
}

/**
 * Refresh auth token
 */
export async function refreshAuthToken(): Promise<AuthToken | null> {
  try {
    const refreshToken = localStorage.getItem('growthlab_refresh_token');
    if (!refreshToken) {
      return null;
    }

    const response = await fetch(`${AUTH_ENDPOINT}/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      clearAuthData();
      return null;
    }

    const data = await response.json();
    const token = data.data as AuthToken;

    localStorage.setItem('growthlab_token', token.accessToken);
    localStorage.setItem('growthlab_refresh_token', token.refreshToken);

    return token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    clearAuthData();
    return null;
  }
}

