'use client';

import type { JobSeekerAnalytics as JobSeekerAnalyticsType } from '@/types/analytics';
import { StatsCard } from './StatsCard';
import { SimpleChart } from './SimpleChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Users, TrendingUp, Clock, CheckCircle, Briefcase } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface JobSeekerAnalyticsProps {
  data: JobSeekerAnalyticsType;
}

export const JobSeekerAnalytics = ({ data }: JobSeekerAnalyticsProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Analytics</h2>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Applications"
          value={data.applications.total.toLocaleString()}
          icon={<Briefcase className="h-5 w-5" />}
          variant="primary"
        />
        <StatsCard
          title="Interviews"
          value={data.applications.interviews.toLocaleString()}
          icon={<Users className="h-5 w-5" />}
          variant="success"
        />
        <StatsCard
          title="Offers"
          value={data.applications.offers.toLocaleString()}
          icon={<CheckCircle className="h-5 w-5" />}
          variant="warning"
        />
        <StatsCard
          title="Conversion Rate"
          value={`${data.applications.conversionRate.toFixed(1)}%`}
          icon={<TrendingUp className="h-5 w-5" />}
          variant="default"
        />
      </div>

      {/* Application Status Breakdown */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Application Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.applications.byStatus.map((status, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{status.status}</span>
                  <span className="text-gray-600 dark:text-gray-400">{status.count} applications</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(status.count / data.applications.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Searched Skills */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Your Top Searched Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.jobSearch.topSearchedSkills.map((skill, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="font-medium text-gray-900 dark:text-gray-100">{skill.skill}</span>
                <Badge variant="default">{skill.count} searches</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

