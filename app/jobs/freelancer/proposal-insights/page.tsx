'use client';

import { useState } from 'react';
import { useMyProposals } from '@/hooks/useFreelancer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Home, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  DollarSign,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';
import { Proposal } from '@/types/freelancer';

export default function ProposalInsightsPage() {
  const router = useRouter();
  const { data: proposalsData, isLoading } = useMyProposals();
  
  const proposals = proposalsData || [];
  
  // Calculate insights
  const totalProposals = proposals.length;
  const acceptedProposals = proposals.filter((p: any) => p.status === 'accepted').length;
  const pendingProposals = proposals.filter((p: any) => p.status === 'pending').length;
  const rejectedProposals = proposals.filter((p: any) => p.status === 'rejected').length;
  const acceptanceRate = totalProposals > 0 ? (acceptedProposals / totalProposals) * 100 : 0;
  
  const totalConnectsUsed = proposals.reduce((sum: number, p: any) => sum + (p.connectsUsed || 0), 0);
  const averageResponseTime = '2.5 days'; // Mock data - would calculate from actual timestamps
  
  const recentProposals = proposals.slice(0, 5);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge variant="success">Accepted</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'rejected':
        return <Badge variant="error">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/jobs/freelancer')}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Proposal Insights</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Track your proposal performance and optimize your success rate
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Proposals</p>
                <Target className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalProposals}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Acceptance Rate</p>
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {acceptanceRate.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {acceptedProposals} accepted out of {totalProposals}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{pendingProposals}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Connects Used</p>
                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalConnectsUsed}</p>
            </CardContent>
          </Card>
        </div>

        {/* Status Breakdown */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">Accepted</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {acceptedProposals}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ({totalProposals > 0 ? ((acceptedProposals / totalProposals) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">Pending</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {pendingProposals}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ({totalProposals > 0 ? ((pendingProposals / totalProposals) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">Rejected</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {rejectedProposals}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ({totalProposals > 0 ? ((rejectedProposals / totalProposals) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Performance Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                    Improve Your Acceptance Rate
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Write personalized cover letters and match your skills to project requirements
                  </p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                    Optimize Connects Usage
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Focus on projects that match your expertise to maximize your success rate
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                    Response Time
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Average response time: {averageResponseTime}. Faster responses increase acceptance rates
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Proposals */}
        <Card className="border-2 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Recent Proposals</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">Loading...</div>
            ) : recentProposals.length === 0 ? (
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                No proposals yet. Start submitting proposals to see insights here.
              </div>
            ) : (
              <div className="space-y-4">
                {recentProposals.map((proposal: any) => (
                  <div
                    key={proposal.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {proposal.projectId || 'Project'}
                          </h3>
                          {getStatusBadge(proposal.status)}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                          {proposal.coverLetter}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                          <span>Submitted: {new Date(proposal.createdAt).toLocaleDateString()}</span>
                          {proposal.connectsUsed && (
                            <span>{proposal.connectsUsed} Connects</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

