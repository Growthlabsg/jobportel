'use client';

import { useState } from 'react';
import { useMyProposals, useProject } from '@/hooks/useFreelancer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { 
  FileText, 
  DollarSign, 
  Clock, 
  CheckCircle2,
  XCircle,
  Hourglass,
  Calendar,
  User,
  Briefcase,
  ArrowRight,
  Eye,
  MessageSquare,
  TrendingUp,
  ArrowLeft,
  Home,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatRelativeTime } from '@/lib/utils';

export default function ProposalsPage() {
  const router = useRouter();
  const { data: proposals, isLoading } = useMyProposals();

  const proposalStats = {
    all: proposals?.length || 0,
    pending: proposals?.filter(p => p.status === 'pending').length || 0,
    accepted: proposals?.filter(p => p.status === 'accepted').length || 0,
    rejected: proposals?.filter(p => p.status === 'rejected').length || 0,
  };

  const getStatusBadge = (status: string) => {
    // Return base variant, we'll add custom classes
    return 'outline';
  };

  const getStatusBadgeClass = (status: string) => {
    const classes = {
      'pending': 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300',
      'accepted': 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300',
      'rejected': 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300',
      'withdrawn': '',
    } as const;
    return classes[status as keyof typeof classes] || '';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading proposals...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">My Proposals</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Track and manage all your submitted proposals
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Proposals</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{proposalStats.all}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
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
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Rejected</p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">{proposalStats.rejected}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
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
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All ({proposalStats.all})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({proposalStats.pending})</TabsTrigger>
                <TabsTrigger value="accepted">Accepted ({proposalStats.accepted})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({proposalStats.rejected})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {proposals && proposals.length > 0 ? (
                  proposals.map((proposal) => (
                    <ProposalCard key={proposal.id} proposal={proposal} getStatusBadge={getStatusBadge} getStatusBadgeClass={getStatusBadgeClass} />
                  ))
                ) : (
                  <EmptyState />
                )}
              </TabsContent>

              <TabsContent value="pending" className="space-y-4">
                {proposals && proposals.filter(p => p.status === 'pending').length > 0 ? (
                  proposals.filter(p => p.status === 'pending').map((proposal) => (
                    <ProposalCard key={proposal.id} proposal={proposal} getStatusBadge={getStatusBadge} getStatusBadgeClass={getStatusBadgeClass} />
                  ))
                ) : (
                  <EmptyState />
                )}
              </TabsContent>

              <TabsContent value="accepted" className="space-y-4">
                {proposals && proposals.filter(p => p.status === 'accepted').length > 0 ? (
                  proposals.filter(p => p.status === 'accepted').map((proposal) => (
                    <ProposalCard key={proposal.id} proposal={proposal} getStatusBadge={getStatusBadge} getStatusBadgeClass={getStatusBadgeClass} />
                  ))
                ) : (
                  <EmptyState />
                )}
              </TabsContent>

              <TabsContent value="rejected" className="space-y-4">
                {proposals && proposals.filter(p => p.status === 'rejected').length > 0 ? (
                  proposals.filter(p => p.status === 'rejected').map((proposal) => (
                    <ProposalCard key={proposal.id} proposal={proposal} getStatusBadge={getStatusBadge} getStatusBadgeClass={getStatusBadgeClass} />
                  ))
                ) : (
                  <EmptyState />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProposalCard({ proposal, getStatusBadge, getStatusBadgeClass }: { proposal: any; getStatusBadge: (status: string) => string; getStatusBadgeClass: (status: string) => string }) {
  const { data: project } = useProject(proposal.projectId);

  return (
    <Card className="border-2 border-gray-200 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/50 hover:shadow-lg transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Link href={`/jobs/freelancer/projects/${proposal.projectId}`}>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-primary transition-colors">
                  {project?.title || `Project #${proposal.projectId.slice(0, 8)}`}
                </h3>
              </Link>
              <Badge variant={getStatusBadge(proposal.status) as any} className={getStatusBadgeClass(proposal.status)}>
                {proposal.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              {proposal.coverLetter}
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
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
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Submitted {formatRelativeTime(proposal.createdAt)}
          </div>
          <div className="flex gap-2">
            <Link href={`/jobs/freelancer/projects/${proposal.projectId}`}>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View Project
              </Button>
            </Link>
            {proposal.status === 'accepted' && (
              <Button variant="primary" size="sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Start Work
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12 text-gray-600 dark:text-gray-400">
      <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
      <p className="mb-4">No proposals submitted yet</p>
      <Link href="/jobs/freelancer/projects">
        <Button>
          <Briefcase className="w-4 h-4 mr-2" />
          Browse Projects
        </Button>
      </Link>
    </div>
  );
}

