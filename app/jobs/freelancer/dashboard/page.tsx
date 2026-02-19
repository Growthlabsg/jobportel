'use client';

import { useState } from 'react';
import { useMyFreelancerProfile, useMyProposals, useProjects } from '@/hooks/useFreelancer';
import { ConnectsDisplay } from '@/components/freelancer/ConnectsDisplay';
import { JobSuccessScoreBadge } from '@/components/freelancer/PaymentProtectionBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Briefcase, 
  DollarSign, 
  Clock, 
  CheckCircle2,
  XCircle,
  Hourglass,
  TrendingUp,
  User,
  FileText,
  ArrowRight,
  Plus,
  ArrowLeft,
  Home,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function FreelancerDashboardPage() {
  const router = useRouter();
  const { data: myProfile, isLoading: profileLoading } = useMyFreelancerProfile();
  const { data: myProposals, isLoading: proposalsLoading } = useMyProposals();
  const { data: myProjects } = useProjects({ 
    status: 'in-progress',
    limit: 5 
  });

  const activeProjects = myProjects?.items || [];
  const proposals = myProposals || [];

  const proposalStats = {
    pending: proposals.filter(p => p.status === 'pending').length,
    accepted: proposals.filter(p => p.status === 'accepted').length,
    rejected: proposals.filter(p => p.status === 'rejected').length,
    total: proposals.length,
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!myProfile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <User className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Freelancer Profile</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create your freelancer profile to start finding projects and submitting proposals.
          </p>
          <Link href="/jobs/freelancer/profile">
            <Button size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Create Profile
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Freelancer Dashboard</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Welcome back, {myProfile.title}!
              </p>
            </div>
            <div className="flex items-center gap-4">
              {myProfile.jobSuccessScore && (
                <JobSuccessScoreBadge score={myProfile.jobSuccessScore} />
              )}
              <ConnectsDisplay connects={myProfile.connects || 0} variant="default" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Projects</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{activeProjects.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Proposals</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{proposalStats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Accepted</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">{proposalStats.accepted}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{proposalStats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                  <Hourglass className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Active Projects */}
          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Active Projects</CardTitle>
              <Link href="/jobs/freelancer/projects">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {activeProjects.length > 0 ? (
                <div className="space-y-4">
                  {activeProjects.map((project: any) => (
                    <div key={project.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <Link href={`/jobs/freelancer/projects/${project.id}`}>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 hover:text-primary transition-colors">
                            {project.title}
                          </h3>
                        </Link>
                        <Badge variant={project.status === 'in-progress' ? 'primary' : 'outline'}>
                          {project.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        {project.type === 'fixed-price' && project.budget && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>${project.budget.toLocaleString()}</span>
                          </div>
                        )}
                        {project.type === 'hourly' && project.hourlyRate && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>${project.hourlyRate.min || 0}-${project.hourlyRate.max || 0}/hr</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                  <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <p className="mb-4">No active projects</p>
                  <Link href="/jobs/freelancer/projects">
                    <Button variant="outline">
                      Browse Projects
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Proposals */}
          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Recent Proposals</CardTitle>
              <Link href="/jobs/freelancer/proposals">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {proposals.length > 0 ? (
                <div className="space-y-4">
                  {proposals.slice(0, 5).map((proposal) => (
                    <div key={proposal.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <Link href={`/jobs/freelancer/projects/${proposal.projectId}`}>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 hover:text-primary transition-colors">
                              Project #{proposal.projectId.slice(0, 8)}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {proposal.coverLetter}
                          </p>
                        </div>
                        <Badge
                          variant={
                            proposal.status === 'accepted'
                              ? 'success'
                              : proposal.status === 'rejected'
                              ? 'error'
                              : proposal.status === 'pending'
                              ? 'warning'
                              : 'outline'
                          }
                        >
                          {proposal.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-3">
                        {proposal.proposedBudget && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>${proposal.proposedBudget.toLocaleString()}</span>
                          </div>
                        )}
                        {proposal.proposedRate && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>${proposal.proposedRate}/hr</span>
                          </div>
                        )}
                        <span className="text-xs">
                          {new Date(proposal.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <p className="mb-4">No proposals submitted yet</p>
                  <Link href="/jobs/freelancer/projects">
                    <Button variant="outline">
                      Browse Projects
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 border-2 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/jobs/freelancer/projects">
                <Button variant="outline" className="w-full justify-start">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Browse Projects
                </Button>
              </Link>
              <Link href="/jobs/freelancer/profile">
                <Button variant="outline" className="w-full justify-start">
                  <User className="w-5 h-5 mr-2" />
                  Edit Profile
                </Button>
              </Link>
              <Link href="/jobs/freelancer/proposals">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-5 h-5 mr-2" />
                  My Proposals
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

