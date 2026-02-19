'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Briefcase, FileText, TrendingUp, Clock, Search, BookOpen, Eye, CheckCircle, X } from 'lucide-react';
import Link from 'next/link';
import { JobSeekerAnalytics } from '@/types/analytics';

interface JobSeekerDashboardProps {
  analytics?: JobSeekerAnalytics;
  isLoading?: boolean;
}

export const JobSeekerDashboard = ({ analytics, isLoading }: JobSeekerDashboardProps) => {
  // Default/mock stats
  const stats = analytics ? {
    totalApplications: analytics.applications.total,
    inReview: analytics.applications.inReview,
    interviews: analytics.applications.interviews,
    offers: analytics.applications.offers,
    rejected: analytics.applications.rejected,
    conversionRate: analytics.applications.conversionRate,
    jobsViewed: analytics.jobSearch.jobsViewed,
    jobsSaved: analytics.jobSearch.jobsSaved,
    jobsApplied: analytics.jobSearch.jobsApplied,
    profileViews: analytics.profile.profileViews,
    profileCompleteness: analytics.profile.profileCompleteness,
  } : {
    totalApplications: 0,
    inReview: 0,
    interviews: 0,
    offers: 0,
    rejected: 0,
    conversionRate: 0,
    jobsViewed: 0,
    jobsSaved: 0,
    jobsApplied: 0,
    profileViews: 0,
    profileCompleteness: 0,
  };

  const statCards = [
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: FileText,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'In Review',
      value: stats.inReview,
      icon: Clock,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
    {
      title: 'Interviews',
      value: stats.interviews,
      icon: Briefcase,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      title: 'Offers',
      value: stats.offers,
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      title: 'Jobs Viewed',
      value: stats.jobsViewed,
      icon: Eye,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      title: 'Jobs Saved',
      value: stats.jobsSaved,
      icon: BookOpen,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    },
  ];

  const quickActions = [
    {
      title: 'Find Jobs',
      description: 'Browse available positions',
      icon: Search,
      href: '/jobs/find-startup-jobs',
      variant: 'primary' as const,
    },
    {
      title: 'My Applications',
      description: 'Track your applications',
      icon: FileText,
      href: '/jobs/my-applications',
      variant: 'outline' as const,
    },
    {
      title: 'Saved Jobs',
      description: 'View your saved positions',
      icon: BookOpen,
      href: '/jobs/saved-jobs',
      variant: 'outline' as const,
    },
    {
      title: 'Resume Builder',
      description: 'Update your resume',
      icon: FileText,
      href: '/jobs/resume-builder',
      variant: 'outline' as const,
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Job Seeker Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track your job search progress and applications</p>
        </div>
        <Link href="/jobs/find-startup-jobs">
          <Button size="lg">
            <Search className="h-5 w-5 mr-2" />
            Find Jobs
          </Button>
        </Link>
      </div>

      {/* Profile Completeness */}
      {stats.profileCompleteness < 100 && (
        <Card className="border-2 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Complete Your Profile</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Your profile is {stats.profileCompleteness}% complete. Complete it to increase your chances!
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all"
                    style={{ width: `${stats.profileCompleteness}%` }}
                  ></div>
                </div>
              </div>
              <Link href="/jobs/settings">
                <Button variant="outline">Complete Profile</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} hover>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Application Status Breakdown */}
      {analytics && analytics.applications.byStatus.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Application Status</h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {analytics.applications.byStatus.map((status, index) => {
                  const statusColors: Record<string, { bg: string; text: string }> = {
                    'Submitted': { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300' },
                    'In Review': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
                    'Interviewing': { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' },
                    'Offered': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' },
                    'Rejected': { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300' },
                  };
                  const colors = statusColors[status.status] || { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-700 dark:text-gray-300' };
                  
                  return (
                    <div key={index} className="text-center">
                      <div className={`inline-block px-4 py-2 rounded-lg ${colors.bg} ${colors.text} mb-2`}>
                        <p className="text-2xl font-bold">{status.count}</p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{status.status}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} href={action.href}>
                <Card hover className="cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{action.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity / Insights */}
      <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Application Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {stats.conversionRate.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Average Response Time</span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {analytics?.applications.averageResponseTime 
                      ? `${(analytics.applications.averageResponseTime / 24).toFixed(1)} days`
                      : 'N/A'}
                  </span>
                </div>
                {stats.offers > 0 && (
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      🎉 You have {stats.offers} job offer{stats.offers > 1 ? 's' : ''}!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Job Search Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Jobs Applied</span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{stats.jobsApplied}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Profile Views</span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{stats.profileViews}</span>
                </div>
                {analytics?.jobSearch.topSearchedSkills && analytics.jobSearch.topSearchedSkills.length > 0 && (
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Top Searched Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {analytics.jobSearch.topSearchedSkills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                          {skill.skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

