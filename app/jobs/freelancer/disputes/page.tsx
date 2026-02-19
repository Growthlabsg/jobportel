'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { 
  AlertCircle, 
  FileText, 
  Clock, 
  CheckCircle2,
  XCircle,
  Shield,
  User,
  Briefcase,
  MessageSquare,
  ArrowRight,
  Eye,
  ArrowLeft,
  Home,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dispute } from '@/types/freelancer';

// Mock disputes data
const mockDisputes: Dispute[] = [];

export default function DisputesPage() {
  const router = useRouter();
  const disputes = mockDisputes;

  const getStatusBadge = (status: string) => {
    const variants = {
      'open': 'warning',
      'in-review': 'info',
      'resolved': 'success',
      'closed': 'outline',
    } as const;
    return variants[status as keyof typeof variants] || 'outline';
  };

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Dispute Resolution</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Manage and resolve payment or work-related disputes
          </p>
        </div>

        {/* Info Card */}
        <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">How Dispute Resolution Works</h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>• Disputes can be opened for payment or work quality issues</li>
                  <li>• Our team reviews disputes within 24-48 hours</li>
                  <li>• Funds in escrow are protected until resolution</li>
                  <li>• Both parties can provide evidence and communicate</li>
                  <li>• Resolution is binding and fair to both parties</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Disputes</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="in-review">In Review</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {disputes.length > 0 ? (
              disputes.map((dispute) => (
                <DisputeCard key={dispute.id} dispute={dispute} getStatusBadge={getStatusBadge} />
              ))
            ) : (
              <EmptyState />
            )}
          </TabsContent>

          <TabsContent value="open" className="space-y-4">
            {disputes.filter(d => d.status === 'open').length > 0 ? (
              disputes.filter(d => d.status === 'open').map((dispute) => (
                <DisputeCard key={dispute.id} dispute={dispute} getStatusBadge={getStatusBadge} />
              ))
            ) : (
              <EmptyState />
            )}
          </TabsContent>

          <TabsContent value="in-review" className="space-y-4">
            {disputes.filter(d => d.status === 'in-review').length > 0 ? (
              disputes.filter(d => d.status === 'in-review').map((dispute) => (
                <DisputeCard key={dispute.id} dispute={dispute} getStatusBadge={getStatusBadge} />
              ))
            ) : (
              <EmptyState />
            )}
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            {disputes.filter(d => d.status === 'resolved').length > 0 ? (
              disputes.filter(d => d.status === 'resolved').map((dispute) => (
                <DisputeCard key={dispute.id} dispute={dispute} getStatusBadge={getStatusBadge} />
              ))
            ) : (
              <EmptyState />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function DisputeCard({ dispute, getStatusBadge }: { dispute: Dispute; getStatusBadge: (status: string) => string }) {
  return (
    <Card className="border-2 border-gray-200 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/50 hover:shadow-lg transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Dispute #{dispute.id.slice(0, 8)}
              </h3>
              <Badge variant={getStatusBadge(dispute.status) as any}>
                {dispute.status.replace('-', ' ')}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
              <div className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                <Link href={`/jobs/freelancer/projects/${dispute.projectId}`} className="hover:text-primary">
                  Project #{dispute.projectId.slice(0, 8)}
                </Link>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>Initiated by {dispute.initiatorType}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{new Date(dispute.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="mb-3">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Reason: {dispute.reason}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{dispute.description}</p>
            </div>
            {dispute.resolution && (
              <div className="p-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-semibold text-green-900 dark:text-green-100">Resolution</span>
                </div>
                <p className="text-sm text-green-800 dark:text-green-200">{dispute.resolution}</p>
                {dispute.resolvedAt && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Resolved on {new Date(dispute.resolvedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link href={`/jobs/freelancer/projects/${dispute.projectId}`} className="flex-1">
            <Button variant="outline" className="w-full" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View Project
            </Button>
          </Link>
          <Button variant="outline" size="sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            Respond
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="border-2 border-gray-200 dark:border-gray-700">
      <CardContent className="p-12 text-center">
        <Shield className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Disputes</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You don&apos;t have any disputes. If you encounter any issues with a contract, you can open a dispute from the contract page.
        </p>
        <Link href="/jobs/freelancer/contracts">
          <Button>
            <Briefcase className="w-4 h-4 mr-2" />
            View Contracts
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

