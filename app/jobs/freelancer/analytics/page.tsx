'use client';

import { useState } from 'react';
import { useMyFreelancerProfile, useMyProposals, useProjects } from '@/hooks/useFreelancer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  TrendingUp, 
  DollarSign, 
  Briefcase,
  FileText,
  Clock,
  Target,
  BarChart3,
  PieChart,
  ArrowUp,
  ArrowDown,
  Calendar,
  ArrowLeft,
  Home,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function FreelancerAnalyticsPage() {
  const router = useRouter();
  const { data: myProfile } = useMyFreelancerProfile();
  const { data: proposals } = useMyProposals();
  const { data: projectsData } = useProjects({ limit: 100 });

  const allProjects = projectsData?.items || [];
  const myProposals = proposals || [];

  // Calculate analytics
  const analytics = {
    totalEarnings: myProfile?.totalEarnings || 0,
    activeProjects: allProjects.filter((p: any) => p.status === 'in-progress').length,
    completedProjects: allProjects.filter((p: any) => p.status === 'completed').length,
    totalProposals: myProposals?.length || 0,
    acceptedProposals: myProposals?.filter((p: any) => p.status === 'accepted').length || 0,
    acceptanceRate: (myProposals?.length || 0) > 0 
      ? ((myProposals?.filter((p: any) => p.status === 'accepted').length || 0) / (myProposals?.length || 1) * 100).toFixed(1)
      : '0',
    averageRating: myProfile?.rating || 0,
    totalReviews: myProfile?.totalReviews || 0,
    completionRate: myProfile?.completionRate || 0,
    responseTime: myProfile?.responseTime || 'N/A',
  };

  const monthlyStats = [
    { month: 'Jan', proposals: 12, accepted: 8, earnings: 4500 },
    { month: 'Feb', proposals: 15, accepted: 10, earnings: 6200 },
    { month: 'Mar', proposals: 18, accepted: 12, earnings: 7800 },
    { month: 'Apr', proposals: 14, accepted: 9, earnings: 5500 },
    { month: 'May', proposals: 20, accepted: 14, earnings: 9200 },
    { month: 'Jun', proposals: 22, accepted: 16, earnings: 10800 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Link href="/jobs/freelancer">
              <Button variant="ghost">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Analytics & Insights</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Track your performance and growth as a freelancer
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</p>
                <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                ${analytics.totalEarnings.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-600 dark:text-green-400">
                <ArrowUp className="w-4 h-4" />
                <span>+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Acceptance Rate</p>
                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {analytics.acceptanceRate}%
              </p>
              <div className="flex items-center gap-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span>{analytics.acceptedProposals} of {analytics.totalProposals} proposals</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Projects</p>
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {analytics.activeProjects}
              </p>
              <div className="flex items-center gap-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span>{analytics.completedProjects} completed</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
                <TrendingUp className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {analytics.averageRating.toFixed(1)} ⭐
              </p>
              <div className="flex items-center gap-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span>{analytics.totalReviews} reviews</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Performance Chart */}
          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyStats.map((stat) => (
                  <div key={stat.month} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{stat.month}</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        ${stat.earnings.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${(stat.earnings / 12000) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{stat.proposals} proposals</span>
                      <span>{stat.accepted} accepted</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skills & Performance */}
          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Completion Rate</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{analytics.completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all"
                      style={{ width: `${analytics.completionRate}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Response Time</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{analytics.responseTime}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Average time to respond to proposals
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Top Skills</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {myProfile?.skills?.slice(0, 5).map((skill) => (
                      <Badge key={skill} variant="primary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link href="/jobs/freelancer/profile">
                    <Button variant="outline" className="w-full">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Update Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Link href="/jobs/freelancer/dashboard">
            <Card className="border-2 border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-xl transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Dashboard</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">View your dashboard</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/jobs/freelancer/proposals">
            <Card className="border-2 border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-xl transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">My Proposals</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Track your proposals</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/jobs/freelancer/projects">
            <Card className="border-2 border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-xl transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-600 dark:text-green-400" />
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Browse Projects</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Find new opportunities</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}

