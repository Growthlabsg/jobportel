/**
 * React Hooks for Notifications
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
} from '@/services/platform/notifications';
import { Notification } from '@/services/platform/notifications';

/**
 * Get notifications
 */
export function useNotifications(filters?: {
  read?: boolean;
  type?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['notifications', filters],
    queryFn: () => getNotifications(filters),
    staleTime: 1000 * 30, // 30 seconds
    enabled: typeof window !== 'undefined',
    refetchInterval: 60000, // Refetch every minute for real-time updates
  });
}

/**
 * Get unread notification count
 */
export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ['unread-notification-count'],
    queryFn: getUnreadNotificationCount,
    staleTime: 1000 * 30, // 30 seconds
    enabled: typeof window !== 'undefined',
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

/**
 * Create notification mutation
 */
export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notification: {
      type: Notification['type'];
      title: string;
      message: string;
      link?: string;
      metadata?: Record<string, any>;
    }) => createNotification(notification),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notification-count'] });
    },
  });
}

/**
 * Mark notification as read mutation
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notification-count'] });
    },
  });
}

/**
 * Mark all notifications as read mutation
 */
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notification-count'] });
    },
  });
}

