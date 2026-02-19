'use client';

import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  Calendar,
  Target,
  Award,
  AlertCircle,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface ApplicationStats {
  total: number;
  pending: number;
  inReview: number;
  interview: number;
  offer: number;
  rejected: number;
  responseRate: number;
  avgResponseTime: number;
  successRate: number;
}

interface ApplicationTrend {
  month: string;
  applications: number;
  responses: number;
  interviews: number;
  offers: number;
}

// Mock data
const mockStats: ApplicationStats = {
  total: 45,
  pending: 12,
  inReview: 8,
  interview: 6,
  offer: 2,
  rejected: 17,
  responseRate: 62,
  avgResponseTime: 5.2,
  successRate: 4.4,
};

const mockTrends: ApplicationTrend[] = [
  { month: 'Jan', applications: 8, responses: 5, interviews: 2, offers: 0 },
  { month: 'Feb', applications: 12, responses: 8, interviews: 4, offers: 1 },
  { month: 'Mar', applications: 15, responses: 10, interviews: 5, offers: 1 },
  { month: 'Apr', applications: 10, responses: 6, interviews: 3, offers: 0 },
];

function ApplicationAnalyticsContent() {
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '1y'>('3m');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const stats = mockStats;
  const trends = mockTrends;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'offer':
        return 'bg-green-100 text-green-800';
      case 'interview':
        return 'bg-blue-100 text-blue-800';
      case 'inReview':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-primary-600 to-primary-dark text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-semibold tracking-wide uppercase">Application Analytics</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
              Track Your Progress
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-3xl leading-relaxed">
              Monitor your application performance and optimize your job search strategy
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Time Range Selector */}
        <div className="flex items-center justify-end gap-2 mb-6">
          <span className="text-sm text-gray-600 dark:text-gray-400">Time Range:</span>
          <div className="flex gap-2 border border-gray-300 rounded-lg p-1 bg-white dark:bg-gray-800">
            {(['3m', '6m', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {range === '3m' ? '3 Months' : range === '6m' ? '6 Months' : '1 Year'}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Applications</p>
                <Send className="h-5 w-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600 font-semibold">+12%</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">vs last month</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Response Rate</p>
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.responseRate}%</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600 font-semibold">+5%</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">vs last month</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</p>
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.avgResponseTime}</p>
              <p className="text-sm text-gray-500 mt-2">days</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.successRate}%</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowDown className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-600 font-semibold">-2%</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Application Status Breakdown */}
          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'Pending', value: stats.pending, color: 'bg-gray-500' },
                  { label: 'In Review', value: stats.inReview, color: 'bg-yellow-500' },
                  { label: 'Interview', value: stats.interview, color: 'bg-blue-500' },
                  { label: 'Offer', value: stats.offer, color: 'bg-green-500' },
                  { label: 'Rejected', value: stats.rejected, color: 'bg-red-500' },
                ].map((status) => (
                  <div key={status.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{status.label}</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{status.value}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${status.color} h-2 rounded-full transition-all`}
                        style={{ width: `${(status.value / stats.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Trends */}
          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trends.map((trend) => (
                  <div key={trend.month} className="flex items-center gap-4">
                    <div className="w-12 text-center">
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{trend.month}</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600 dark:text-gray-400">Applications</span>
                          <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">{trend.applications}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-primary h-1.5 rounded-full"
                            style={{ width: `${(trend.applications / 20) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600 dark:text-gray-400">Interviews</span>
                          <span className="text-xs font-semibold text-blue-600">{trend.interviews}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-500 h-1.5 rounded-full"
                            style={{ width: `${(trend.interviews / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights and Recommendations */}
        <Card className="border-2 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Insights & Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Response Rate Improving</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Your response rate has increased by 5% this month. Keep tailoring your applications to job descriptions!
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Response Time</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Average response time is 5.2 days. Consider following up on applications older than 7 days.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <Target className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Focus Areas</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Your success rate is 4.4%. Consider applying to more jobs that match your skills and experience level.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';

export default function ApplicationAnalyticsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading analytics...</p>
          </div>
        </div>
      }
    >
      <ApplicationAnalyticsContent />
    </Suspense>
  );
}

