/**
 * Notifications API Service - Integrated with Main Growth Lab Platform
 * Handles notification syncing with main platform
 */

import { PlatformApiResponse, PaginatedResponse } from '@/types/platform';
import { getAuthToken, getActiveJobProfile } from './auth';

const MAIN_PLATFORM_BASE_URL = process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL || 'http://localhost:3001';
const NOTIFICATIONS_ENDPOINT = `${MAIN_PLATFORM_BASE_URL}/api/notifications`;

export interface Notification {
  id: string;
  type: 'application' | 'job' | 'interview' | 'message' | 'system';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

/**
 * Get user notifications
 */
export async function getNotifications(filters?: {
  read?: boolean;
  type?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Notification>> {
  try {
    const token = getAuthToken();
    if (!token) {
      // Not authenticated - return empty response silently
      return {
        items: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      };
    }

    const profile = await getActiveJobProfile();
    if (!profile) {
      return {
        items: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      };
    }

    const params = new URLSearchParams();
    if (filters?.read !== undefined) params.append('read', filters.read.toString());
    if (filters?.type) params.append('type', filters.type);
    params.append('page', (filters?.page || 1).toString());
    params.append('limit', (filters?.limit || 20).toString());
    params.append('profileId', profile.id);

    const response = await fetch(`${NOTIFICATIONS_ENDPOINT}?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // If unauthorized, return empty results instead of throwing
      if (response.status === 401 || response.status === 403) {
        return {
          items: [],
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 0,
        };
      }
      throw new Error('Failed to fetch notifications');
    }

    const data: PlatformApiResponse<PaginatedResponse<Notification>> = await response.json();
    return data.data;
  } catch (error) {
    // Only log non-authentication errors
    if (error instanceof Error && error.message !== 'Not authenticated' && error.message !== 'No active profile found') {
      console.error('Error fetching notifications:', error);
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
 * Create notification
 */
export async function createNotification(notification: {
  type: Notification['type'];
  title: string;
  message: string;
  link?: string;
  metadata?: Record<string, any>;
}): Promise<Notification | null> {
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

    const response = await fetch(NOTIFICATIONS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...notification,
        profileId: profile.id,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create notification');
    }

    const data: PlatformApiResponse<Notification> = await response.json();
    return data.data;
  } catch (error) {
    // Only log non-authentication errors
    if (error instanceof Error && error.message !== 'Not authenticated' && error.message !== 'No active profile found') {
      console.error('Error creating notification:', error);
    }
    return null;
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) {
      // Not authenticated - return false silently
      return false;
    }

    const response = await fetch(`${NOTIFICATIONS_ENDPOINT}/${notificationId}/read`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // If unauthorized, return false instead of throwing
      if (response.status === 401 || response.status === 403) {
        return false;
      }
      throw new Error('Failed to mark notification as read');
    }

    return true;
  } catch (error) {
    // Only log non-authentication errors
    if (error instanceof Error && error.message !== 'Not authenticated') {
      console.error('Error marking notification as read:', error);
    }
    return false;
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) {
      // Not authenticated - return false silently
      return false;
    }

    const profile = await getActiveJobProfile();
    if (!profile) {
      return false;
    }

    const response = await fetch(`${NOTIFICATIONS_ENDPOINT}/read-all?profileId=${profile.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // If unauthorized, return false instead of throwing
      if (response.status === 401 || response.status === 403) {
        return false;
      }
      throw new Error('Failed to mark all notifications as read');
    }

    return true;
  } catch (error) {
    // Only log non-authentication errors
    if (error instanceof Error && error.message !== 'Not authenticated' && error.message !== 'No active profile found') {
      console.error('Error marking all notifications as read:', error);
    }
    return false;
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadNotificationCount(): Promise<number> {
  try {
    const token = getAuthToken();
    if (!token) {
      return 0;
    }

    const profile = await getActiveJobProfile();
    if (!profile) {
      return 0;
    }

    const response = await fetch(`${NOTIFICATIONS_ENDPOINT}/unread-count?profileId=${profile.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch unread notification count');
    }

    const data: PlatformApiResponse<{ count: number }> = await response.json();
    return data.data.count;
  } catch (error) {
    console.error('Error fetching unread notification count:', error);
    return 0;
  }
}

