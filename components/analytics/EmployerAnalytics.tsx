'use client';

import { useState } from 'react';
import type { EmployerAnalytics as EmployerAnalyticsType, TimeRange } from '@/types/analytics';
import { StatsCard } from './StatsCard';
import { SimpleChart } from './SimpleChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Eye,
  Users,
  TrendingUp,
  Clock,
  Briefcase,
  Calendar,
  Download,
  Filter,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface EmployerAnalyticsProps {
  data: EmployerAnalyticsType;
  onTimeRangeChange?: (range: TimeRange) => void;
}

export const EmployerAnalytics = ({ data, onTimeRangeChange }: EmployerAnalyticsProps) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    onTimeRangeChange?.(range);
  };

  const timeRangeOptions: { value: TimeRange; label: string }[] = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' },
    { value: 'all', label: 'All time' },
  ];

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analytics Dashboard</h2>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <div className="flex gap-2">
            {timeRangeOptions.map((option) => (
              <Button
                key={option.value}
                variant={timeRange === option.value ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleTimeRangeChange(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="ml-2">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Views"
          value={data.jobs.totalViews.toLocaleString()}
          icon={<Eye className="h-5 w-5" />}
          variant="primary"
        />
        <StatsCard
          title="Total Applications"
          value={data.applications.total.toLocaleString()}
          icon={<Users className="h-5 w-5" />}
          variant="success"
        />
        <StatsCard
          title="Conversion Rate"
          value={`${((data.applications.total / data.jobs.totalViews) * 100).toFixed(1)}%`}
          icon={<TrendingUp className="h-5 w-5" />}
          variant="warning"
        />
        <StatsCard
          title="Avg. Time to Hire"
          value={`${data.hiring.averageTimeToFill} days`}
          icon={<Clock className="h-5 w-5" />}
          variant="default"
        />
      </div>

      {/* Top Performing Jobs */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Top Performing Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Job Title</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Views</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Applications
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Conversion
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.jobs.topPerformingJobs.map((job) => (
                  <tr key={job.jobId} className="border-b border-gray-100 hover:bg-gray-50 dark:bg-gray-800">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{job.title}</p>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 text-gray-900 dark:text-gray-100">
                      {job.views.toLocaleString()}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-900 dark:text-gray-100">
                      {job.applications.toLocaleString()}
                    </td>
                    <td className="text-right py-3 px-4">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {job.conversionRate.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Application Funnel */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Application Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.applications.conversionFunnel.map((stage, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{stage.stage}</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {stage.count} ({stage.conversionRate.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${stage.conversionRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

