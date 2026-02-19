'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TeamCard as TeamCardType } from '@/types/platform';
import { Eye, Heart, Users, Briefcase, TrendingUp, Calendar } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

interface TeamAnalyticsProps {
  team: TeamCardType;
}

export function TeamAnalytics({ team }: TeamAnalyticsProps) {
  const openPositionsCount = team.openPositions.filter((p) => p.status === 'open').length;
  const totalApplications = team.openPositions.reduce(
    (sum, pos) => sum + pos.applications.length,
    0
  );
  const pendingApplications = team.openPositions.reduce(
    (sum, pos) => sum + pos.applications.filter((app) => app.status === 'pending').length,
    0
  );

  const stats = [
    {
      label: 'Total Views',
      value: team.viewsCount,
      icon: Eye,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      label: 'Likes',
      value: team.likedBy?.length || team.likesCount || 0,
      icon: Heart,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
    },
    {
      label: 'Members',
      value: team.members.length,
      icon: Users,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      label: 'Open Positions',
      value: openPositionsCount,
      icon: Briefcase,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      label: 'Total Applications',
      value: totalApplications,
      icon: TrendingUp,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
    {
      label: 'Pending Applications',
      value: pendingApplications,
      icon: Calendar,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Team Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-full ${stat.bgColor} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Created</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {formatRelativeTime(team.createdAt)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {formatRelativeTime(team.updatedAt)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

