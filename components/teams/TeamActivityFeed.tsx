'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TeamCard as TeamCardType } from '@/types/platform';
import { UserPlus, Eye, Heart, Briefcase, MessageSquare, Calendar } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

interface ActivityItem {
  id: string;
  type: 'view' | 'like' | 'application' | 'member_joined' | 'position_opened' | 'comment';
  description: string;
  timestamp: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

interface TeamActivityFeedProps {
  team: TeamCardType;
}

export function TeamActivityFeed({ team }: TeamActivityFeedProps) {
  // Generate activity feed from team data
  const activities: ActivityItem[] = [];

  // Recent views (simulated)
  if (team.viewsCount > 0) {
    activities.push({
      id: 'activity-views',
      type: 'view',
      description: `${team.viewsCount} people viewed this team`,
      timestamp: team.updatedAt,
    });
  }

  // Recent likes
  if (team.likedBy && team.likedBy.length > 0) {
    activities.push({
      id: 'activity-likes',
      type: 'like',
      description: `${team.likedBy.length} people liked this team`,
      timestamp: team.updatedAt,
    });
  }

  // Recent applications
  const recentApplications = team.openPositions
    .flatMap((pos) => pos.applications)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  recentApplications.forEach((app) => {
    activities.push({
      id: `activity-app-${app.id}`,
      type: 'application',
      description: `${app.applicantName} applied for a position`,
      timestamp: app.createdAt,
      user: {
        name: app.applicantName,
        avatar: app.applicantAvatar,
      },
    });
  });

  // Recent member joins
  const recentMembers = team.members
    .filter((m) => m.joinedDate)
    .sort((a, b) => {
      const dateA = a.joinedDate ? new Date(a.joinedDate).getTime() : 0;
      const dateB = b.joinedDate ? new Date(b.joinedDate).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 3);

  recentMembers.forEach((member) => {
    activities.push({
      id: `activity-member-${member.id}`,
      type: 'member_joined',
      description: `${member.name} joined the team as ${member.title}`,
      timestamp: member.joinedDate || member.createdAt,
      user: {
        name: member.name,
        avatar: member.avatar,
      },
    });
  });

  // Sort by timestamp
  activities.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'view':
        return Eye;
      case 'like':
        return Heart;
      case 'application':
        return Briefcase;
      case 'member_joined':
        return UserPlus;
      case 'position_opened':
        return Briefcase;
      case 'comment':
        return MessageSquare;
      default:
        return Calendar;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'view':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20';
      case 'like':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
      case 'application':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      case 'member_joined':
        return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  if (activities.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.slice(0, 10).map((activity) => {
            const Icon = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${getActivityColor(activity.type)} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {formatRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

