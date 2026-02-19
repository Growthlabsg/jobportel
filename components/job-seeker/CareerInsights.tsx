'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Calendar,
  Briefcase,
  DollarSign,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { JobSeekerAnalytics } from '@/types/analytics';

interface CareerInsightsProps {
  analytics?: JobSeekerAnalytics;
}

export function CareerInsights({ analytics }: CareerInsightsProps) {
  // Mock analytics data
  const mockAnalytics: JobSeekerAnalytics = {
    userId: 'user1',
    period: '30d',
    applications: {
      total: 24,
      submitted: 24,
      inReview: 8,
      interviews: 5,
      offers: 2,
      rejected: 6,
      conversionRate: 8.3,
      averageResponseTime: 48,
      byStatus: [
        { status: 'Submitted', count: 24 },
        { status: 'In Review', count: 8 },
        { status: 'Interviewing', count: 5 },
        { status: 'Offered', count: 2 },
        { status: 'Rejected', count: 6 },
      ],
      byMonth: [
        { month: 'Jan', count: 8 },
        { month: 'Feb', count: 10 },
        { month: 'Mar', count: 6 },
      ],
    },
    jobSearch: {
      jobsViewed: 156,
      jobsSaved: 23,
      jobsApplied: 24,
      searchQueries: 45,
      averageMatchScore: 78,
      topSearchedSkills: [
        { skill: 'React', count: 12 },
        { skill: 'TypeScript', count: 10 },
        { skill: 'Node.js', count: 8 },
      ],
      topSearchedCompanies: [
        { company: 'TechNova', count: 5 },
        { company: 'StartupX', count: 4 },
      ],
    },
    profile: {
      profileViews: 45,
      profileCompleteness: 85,
      skillsVerified: 8,
      portfolioViews: 23,
      recommendationsReceived: 3,
    },
    engagement: {
      timeSpent: 1240,
      activeDays: 18,
      mostActiveDay: 'Monday',
      mostActiveHour: 14,
    },
  };

  const displayAnalytics = analytics || mockAnalytics;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Career Insights</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Track your job search progress and performance</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              <Badge className="bg-blue-200 text-blue-800">+12%</Badge>
            </div>
            <div className="text-2xl font-bold text-blue-900">{displayAnalytics.applications.total}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Total Applications</div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <Badge className="bg-green-200 text-green-800">+5%</Badge>
            </div>
            <div className="text-2xl font-bold text-green-900">{displayAnalytics.applications.interviews}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Interviews</div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <Target className="h-5 w-5 text-purple-600" />
              <Badge className="bg-purple-200 text-purple-800">+8%</Badge>
            </div>
            <div className="text-2xl font-bold text-purple-900">{displayAnalytics.applications.offers}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Job Offers</div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <Badge className="bg-orange-200 text-orange-800">{displayAnalytics.applications.conversionRate}%</Badge>
            </div>
            <div className="text-2xl font-bold text-orange-900">{displayAnalytics.jobSearch.averageMatchScore}%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Avg Match Score</div>
          </Card>
        </div>

        {/* Application Funnel */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Application Funnel</h4>
          <div className="space-y-3">
            {displayAnalytics.applications.byStatus.map((status, idx) => {
              const percentage = (status.count / displayAnalytics.applications.total) * 100;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{status.status}</span>
                    <span className="text-gray-600 dark:text-gray-400">{status.count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Profile Performance */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Profile Performance</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Profile Views</span>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{displayAnalytics.profile.profileViews}</div>
              <div className="text-xs text-gray-500 mt-1">+15% from last month</div>
            </Card>

            <Card className="p-4 border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Profile Completeness</span>
                <Target className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{displayAnalytics.profile.profileCompleteness}%</div>
              <div className="text-xs text-gray-500 mt-1">Complete your profile for better matches</div>
            </Card>

            <Card className="p-4 border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Skills Verified</span>
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{displayAnalytics.profile.skillsVerified}</div>
              <div className="text-xs text-gray-500 mt-1">Get more verified for credibility</div>
            </Card>
          </div>
        </div>

        {/* Top Searches */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Your Top Searches</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 border-gray-200 dark:border-gray-700">
              <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Top Skills</h5>
              <div className="space-y-2">
                {displayAnalytics.jobSearch.topSearchedSkills.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <Badge variant="default">{item.skill}</Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.count} searches</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 border-gray-200 dark:border-gray-700">
              <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Top Companies</h5>
              <div className="space-y-2">
                {displayAnalytics.jobSearch.topSearchedCompanies.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.company}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.count} views</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Engagement Stats */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Engagement</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 border-gray-200 text-center">
              <Clock className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{Math.round(displayAnalytics.engagement.timeSpent / 60)}h</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Time Spent</div>
            </Card>
            <Card className="p-4 border-gray-200 text-center">
              <Calendar className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{displayAnalytics.engagement.activeDays}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Active Days</div>
            </Card>
            <Card className="p-4 border-gray-200 text-center">
              <Target className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{displayAnalytics.engagement.mostActiveDay}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Most Active Day</div>
            </Card>
            <Card className="p-4 border-gray-200 text-center">
              <TrendingUp className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{displayAnalytics.engagement.mostActiveHour}:00</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Peak Hour</div>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}

