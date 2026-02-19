/**
 * Notification Dropdown Component
 * Displays list of notifications
 */

'use client';

import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from '@/hooks/useNotifications';
import { Notification } from '@/services/platform/notifications';
import { formatRelativeTime } from '@/lib/utils';
import {
  Briefcase,
  MessageSquare,
  Calendar,
  Bell,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

interface NotificationDropdownProps {
  onClose: () => void;
}

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'application':
      return <Briefcase className="h-4 w-4" />;
    case 'job':
      return <Briefcase className="h-4 w-4" />;
    case 'interview':
      return <Calendar className="h-4 w-4" />;
    case 'message':
      return <MessageSquare className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'application':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
    case 'job':
      return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
    case 'interview':
      return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
    case 'message':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
  }
};

export const NotificationDropdown = ({ onClose }: NotificationDropdownProps) => {
  const { data: notificationsData, isLoading } = useNotifications({
    limit: 10,
    page: 1,
  });
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const notifications = notificationsData?.items || [];
  const unreadNotifications = notifications.filter((n) => !n.read);

  const handleNotificationClick = async (notification: Notification) => {
    try {
      if (!notification.read) {
        await markAsReadMutation.mutateAsync(notification.id);
      }
      if (notification.link) {
        window.location.href = notification.link;
      } else {
        onClose();
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
      // Still close dropdown even if there's an error
      if (notification.link) {
        window.location.href = notification.link;
      } else {
        onClose();
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return (
    <Card className="absolute right-0 top-full mt-2 w-96 max-h-[600px] overflow-hidden z-[100] shadow-2xl border-2 border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 dark:bg-gray-800">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
        <div className="flex items-center gap-2">
          {unreadNotifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleMarkAllAsRead();
              }}
              className="text-xs"
              type="button"
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }} 
            className="p-1"
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardContent className="p-0 max-h-[500px] overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">No notifications</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">You&apos;re all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNotificationClick(notification);
                }}
                className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg flex-shrink-0 ${getNotificationColor(
                      notification.type
                    )}`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p
                        className={`text-sm font-medium ${
                          !notification.read ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0 mt-1.5"></div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatRelativeTime(notification.createdAt)}
                      </span>
                      {notification.link && (
                        <ExternalLink className="h-3 w-3 text-gray-400 dark:text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <Link href="/jobs/notifications">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              View All Notifications
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
};

