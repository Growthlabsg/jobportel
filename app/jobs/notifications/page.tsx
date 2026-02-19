'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
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
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

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
      return 'bg-blue-100 text-blue-700';
    case 'job':
      return 'bg-green-100 text-green-700';
    case 'interview':
      return 'bg-purple-100 text-purple-700';
    case 'message':
      return 'bg-yellow-100 text-yellow-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export default function NotificationsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { data: notificationsData, isLoading } = useNotifications({
    limit: 50,
    page: 1,
  });
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const notifications = notificationsData?.items || [];
  const unreadNotifications = notifications.filter((n) => !n.read);

  const handleNotificationClick = async (notification: Notification) => {
    try {
      if (!notification.read) {
        await markAsReadMutation.mutateAsync(notification.id);
      }
      if (notification.link) {
        window.location.href = notification.link;
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
      if (notification.link) {
        window.location.href = notification.link;
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

  if (!isMounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Notifications</h1>
            <p className="text-gray-600 mt-1">Stay updated with your job applications and opportunities</p>
          </div>
          {unreadNotifications.length > 0 && (
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              type="button"
            >
              <Check className="h-4 w-4 mr-2" />
              Mark All as Read
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading notifications...</p>
          </CardContent>
        </Card>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No notifications</h3>
            <p className="text-gray-600 dark:text-gray-400">You&apos;re all caught up!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`cursor-pointer hover:shadow-md transition-all ${
                !notification.read ? 'border-l-4 border-l-primary bg-blue-50/30' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-lg flex-shrink-0 ${getNotificationColor(
                      notification.type
                    )}`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3
                        className={`text-lg font-semibold ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}
                      >
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <Badge variant="default" className="bg-primary text-white">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{notification.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatRelativeTime(notification.createdAt)}
                      </span>
                      {notification.link && (
                        <ExternalLink className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export const dynamic = 'force-dynamic';

