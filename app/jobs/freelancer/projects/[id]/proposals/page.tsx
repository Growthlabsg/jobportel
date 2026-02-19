'use client';

import { useParams } from 'next/navigation';
import { useProject, useProjectProposals } from '@/hooks/useFreelancer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  FileText, 
  DollarSign, 
  Clock, 
  CheckCircle2,
  XCircle,
  Hourglass,
  Calendar,
  User,
  ArrowLeft,
  MessageSquare,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import { formatRelativeTime } from '@/lib/utils';

export default function ProjectProposalsPage() {
  const params = useParams();
  const projectId = typeof params.id === 'string' ? params.id : null;

  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: proposals, isLoading: proposalsLoading } = useProjectProposals(projectId);

  const getStatusBadge = (status: string) => {
    const variants = {
      'pending': 'warning',
      'accepted': 'success',
      'rejected': 'error',
      'withdrawn': 'outline',
    } as const;
    return variants[status as keyof typeof variants] || 'outline';
  };

  if (projectLoading || proposalsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading proposals...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Project Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The project you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/jobs/freelancer/projects">
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  const proposalStats = {
    total: proposals?.length || 0,
    pending: proposals?.filter(p => p.status === 'pending').length || 0,
    accepted: proposals?.filter(p => p.status === 'accepted').length || 0,
    rejected: proposals?.filter(p => p.status === 'rejected').length || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/jobs/freelancer/projects/${projectId}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Project
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Proposals for {project.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Review and manage proposals from freelancers
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{proposalStats.total}</p>
                </div>
                <FileText className="w-8 h-8 text-primary" />
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
                <Hourglass className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
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
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Rejected</p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">{proposalStats.rejected}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Proposals List */}
        <Card className="border-2 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>All Proposals</CardTitle>
          </CardHeader>
          <CardContent>
            {proposals && proposals.length > 0 ? (
              <div className="space-y-4">
                {proposals.map((proposal) => (
                  <Card key={proposal.id} className="border border-gray-200 dark:border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold">
                            {proposal.freelancer?.name?.charAt(0) || 'F'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-900 dark:text-gray-100">
                                {proposal.freelancer?.name || 'Freelancer'}
                              </h3>
                              {proposal.freelancer?.rating && (
                                <div className="flex items-center gap-1 text-sm">
                                  <span className="text-yellow-500">⭐</span>
                                  <span className="font-semibold">{proposal.freelancer.rating.toFixed(1)}</span>
                                  <span className="text-gray-500">({proposal.freelancer.totalReviews || 0})</span>
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {proposal.freelancer?.title || 'Freelancer'}
                            </p>
                          </div>
                        </div>
                        <Badge variant={getStatusBadge(proposal.status) as any}>
                          {proposal.status}
                        </Badge>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                        {proposal.coverLetter}
                      </p>
                      <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {proposal.proposedBudget && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-semibold">${proposal.proposedBudget.toLocaleString()}</span>
                            <span className="text-xs">Fixed Price</span>
                          </div>
                        )}
                        {proposal.proposedRate && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span className="font-semibold">${proposal.proposedRate}/hr</span>
                          </div>
                        )}
                        {proposal.estimatedHours && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{proposal.estimatedHours} hours</span>
                          </div>
                        )}
                        {proposal.estimatedCompletionDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(proposal.estimatedCompletionDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Submitted {formatRelativeTime(proposal.createdAt)}
                        </div>
                        <div className="flex gap-2">
                          {proposal.freelancer?.id && (
                            <Link href={`/jobs/freelancer/freelancers/${proposal.freelancer.id}`}>
                              <Button variant="outline" size="sm">
                                <User className="w-4 h-4 mr-2" />
                                View Profile
                              </Button>
                            </Link>
                          )}
                          <Button size="sm">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Contact
                          </Button>
                          {proposal.status === 'pending' && (
                            <>
                              <Button className="bg-green-600 hover:bg-green-700 text-white" size="sm">
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Accept
                              </Button>
                              <Button className="bg-red-600 hover:bg-red-700 text-white" size="sm">
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p className="mb-4">No proposals received yet</p>
                <p className="text-sm">Share your project to attract freelancers</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

