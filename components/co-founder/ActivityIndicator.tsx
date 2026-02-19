'use client';

import { CoFounderProfile } from '@/types/cofounder';
import { Badge } from '@/components/ui/Badge';
import { Clock } from 'lucide-react';

interface ActivityIndicatorProps {
  profile: CoFounderProfile;
  showBadge?: boolean;
}

export function ActivityIndicator({ profile, showBadge = true }: ActivityIndicatorProps) {
  const now = new Date();
  const lastActive = new Date(profile.lastActive);
  const diffMs = now.getTime() - lastActive.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  const getActivityStatus = () => {
    if (diffMins < 5) {
      return { label: 'Online now', color: 'bg-green-500', text: 'text-green-700 dark:text-green-300' };
    }
    if (diffMins < 60) {
      return { label: `${diffMins}m ago`, color: 'bg-green-400', text: 'text-green-600 dark:text-green-400' };
    }
    if (diffHours < 24) {
      return { label: `${diffHours}h ago`, color: 'bg-yellow-400', text: 'text-yellow-600 dark:text-yellow-400' };
    }
    if (diffDays < 7) {
      return { label: `${diffDays}d ago`, color: 'bg-orange-400', text: 'text-orange-600 dark:text-orange-400' };
    }
    return { label: 'Inactive', color: 'bg-gray-400', text: 'text-gray-600 dark:text-gray-400' };
  };

  const status = getActivityStatus();

  if (!showBadge) {
    return (
      <span className={`text-xs ${status.text} flex items-center gap-1`}>
        <Clock className="w-3 h-3" />
        {status.label}
      </span>
    );
  }

  return (
    <Badge
      variant="outline"
      size="sm"
      className={`${status.text} border-current flex items-center gap-1`}
    >
      <span className={`w-2 h-2 rounded-full ${status.color} animate-pulse`} />
      {status.label}
    </Badge>
  );
}

