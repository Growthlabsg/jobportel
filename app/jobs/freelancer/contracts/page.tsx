'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { 
  FileText, 
  DollarSign, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Shield,
  Calendar,
  User,
  Briefcase,
  TrendingUp,
  Pause,
  Play,
  Eye,
  MessageSquare,
  ArrowLeft,
  Home,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MilestoneTracker } from '@/components/freelancer/MilestoneTracker';
import { TimeTracker } from '@/components/freelancer/TimeTracker';

// Mock contracts data - replace with actual API call
const mockContracts = [
  {
    id: '1',
    projectId: 'proj-1',
    projectTitle: 'Build SaaS Landing Page',
    clientName: 'Tech Startup Inc.',
    type: 'fixed-price',
    totalBudget: 5000,
    status: 'active',
    paymentProtection: true,
    totalPaid: 2000,
    totalInEscrow: 3000,
    startDate: '2025-01-15',
    milestones: [
      {
        id: 'm1',
        title: 'Design Mockups',
        description: 'Create initial design mockups',
        amount: 2000,
        dueDate: '2025-02-01',
        status: 'paid',
        paymentStatus: 'released',
        paidAt: '2025-01-25',
      },
      {
        id: 'm2',
        title: 'Frontend Development',
        description: 'Build responsive frontend',
        amount: 2000,
        dueDate: '2025-02-15',
        status: 'in-progress',
        paymentStatus: 'in-escrow',
      },
      {
        id: 'm3',
        title: 'Backend Integration',
        description: 'Connect with backend APIs',
        amount: 1000,
        dueDate: '2025-03-01',
        status: 'pending',
        paymentStatus: 'pending',
      },
    ],
  },
];

export default function ContractsPage() {
  const router = useRouter();
  const [selectedContract, setSelectedContract] = useState<string | null>(null);
  const contracts = mockContracts;

  const getStatusBadge = (status: string) => {
    const variants = {
      'active': 'primary',
      'paused': 'warning',
      'completed': 'success',
      'cancelled': 'error',
      'disputed': 'error',
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Active Contracts</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Manage your active contracts and track progress
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contracts List */}
          <div className="lg:col-span-2 space-y-4">
            {contracts.length > 0 ? (
              contracts.map((contract) => (
                <Card
                  key={contract.id}
                  className={`border-2 border-gray-200 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/50 hover:shadow-xl transition-all cursor-pointer ${
                    selectedContract === contract.id ? 'border-primary dark:border-primary' : ''
                  }`}
                  onClick={() => setSelectedContract(contract.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Link href={`/jobs/freelancer/projects/${contract.projectId}`}>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-primary transition-colors">
                              {contract.projectTitle}
                            </h3>
                          </Link>
                          <Badge variant={getStatusBadge(contract.status) as any}>
                            {contract.status}
                          </Badge>
                          {contract.paymentProtection && (
                            <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{contract.clientName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-semibold">${contract.totalBudget.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Started {new Date(contract.startDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Paid: </span>
                            <span className="font-semibold text-green-600 dark:text-green-400">
                              ${contract.totalPaid.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">In Escrow: </span>
                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                              ${contract.totalInEscrow.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Link href={`/jobs/freelancer/projects/${contract.projectId}`} className="flex-1">
                        <Button variant="outline" className="w-full" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Project
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-2 border-gray-200 dark:border-gray-700">
                <CardContent className="p-12 text-center">
                  <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Active Contracts</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    You don&apos;t have any active contracts yet. Start by submitting proposals to projects.
                  </p>
                  <Link href="/jobs/freelancer/projects">
                    <Button>
                      <Briefcase className="w-4 h-4 mr-2" />
                      Browse Projects
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Contract Details */}
          <div className="space-y-6">
            {selectedContract && contracts.find(c => c.id === selectedContract) && (
              <>
                {contracts.find(c => c.id === selectedContract)?.milestones && (
                  <MilestoneTracker
                    milestones={contracts.find(c => c.id === selectedContract)!.milestones as any}
                    canManage={true}
                    onMarkComplete={(id) => console.log('Mark complete:', id)}
                    onReleasePayment={(id) => console.log('Release payment:', id)}
                    onDispute={(id) => console.log('Dispute:', id)}
                  />
                )}
                {contracts.find(c => c.id === selectedContract)?.type === 'hourly' && (
                  <TimeTracker
                    contractId={selectedContract}
                    entries={[]}
                    isTracking={false}
                    onStartTracking={() => console.log('Start tracking')}
                    onStopTracking={() => console.log('Stop tracking')}
                    onPauseTracking={() => console.log('Pause tracking')}
                    onResumeTracking={() => console.log('Resume tracking')}
                    canApprove={false}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

