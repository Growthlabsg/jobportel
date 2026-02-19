'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Job } from '@/types/job';
import { Briefcase, MapPin, Clock, DollarSign, ExternalLink } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

// Helper function to format currency
function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

interface TeamJobsProps {
  jobs: Job[];
  teamName: string;
}

export function TeamJobs({ jobs, teamName }: TeamJobsProps) {
  if (jobs.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />
          Open Positions ({jobs.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary/30 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <Link href={`/jobs/find-startup-jobs/${job.id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-primary transition-colors mb-2">
                      {job.title}
                    </h3>
                  </Link>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <Badge variant="outline" size="sm">
                      {job.jobType}
                    </Badge>
                    <Badge variant="info" size="sm">
                      {job.experienceLevel}
                    </Badge>
                    <Badge variant="outline" size="sm" className="capitalize">
                      {job.remoteWork}
                    </Badge>
                  </div>
                  {job.salary && (
                    <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300 mb-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold">
                        {formatCurrency(job.salary.min, job.salary.currency)} -{' '}
                        {formatCurrency(job.salary.max, job.salary.currency)}
                      </span>
                    </div>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.skills.slice(0, 4).map((skill) => (
                      <Badge key={skill} variant="outline" size="sm">
                        {skill}
                      </Badge>
                    ))}
                    {job.skills.length > 4 && (
                      <Badge variant="outline" size="sm">
                        +{job.skills.length - 4} more
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatRelativeTime(job.createdAt)}</span>
                    </div>
                    {job.applicationsCount !== undefined && (
                      <span>{job.applicationsCount} applications</span>
                    )}
                    {job.viewsCount !== undefined && <span>{job.viewsCount} views</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                <Link href={`/jobs/find-startup-jobs/${job.id}`} className="flex-1">
                  <Button variant="primary" size="sm" className="w-full">
                    View Job Details
                  </Button>
                </Link>
                {job.featured && (
                  <Badge variant="primary" size="sm">
                    Featured
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Link href={`/jobs/find-startup-jobs?company=${teamName}`}>
            <Button variant="outline" size="sm" className="w-full">
              View All Jobs from {teamName}
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

