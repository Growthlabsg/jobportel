'use client';

import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Application, ApplicationStatus } from '@/types/application';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { 
  Briefcase, 
  Clock, 
  CheckCircle, 
  XCircle, 
  FileText,
  Calendar,
  Building,
  MapPin,
  DollarSign,
  Eye,
  MessageSquare,
  Code,
  UserCheck,
  Users,
} from 'lucide-react';
import { UnifiedChat } from '@/components/shared/UnifiedChat';
import Link from 'next/link';
import { useMyApplications } from '@/hooks/useApplications';
import { useWithdrawApplication } from '@/hooks/useApplications';
import { useMyProposals } from '@/hooks/useFreelancer';
import { useCofounder } from '@/contexts/CofounderContext';

// Mock data fallback for development
const mockApplications: Application[] = [
  {
    id: '1',
    jobId: '1',
    job: {
      id: '1',
      title: 'Senior Full Stack Developer',
      company: {
        id: '1',
        name: 'TechNova Solutions',
        logo: undefined,
      },
    },
    applicant: {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+65 9123 4567',
      resume: 'resume1.pdf',
    },
    coverLetter: 'I am very interested in this position...',
    status: 'Submitted',
    matchScore: 95,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: '2',
    jobId: '2',
    job: {
      id: '2',
      title: 'Product Marketing Manager',
      company: {
        id: '2',
        name: 'GreenTech Solutions',
        logo: undefined,
      },
    },
    applicant: {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+65 9123 4567',
      resume: 'resume1.pdf',
    },
    coverLetter: 'Passionate about sustainable tech...',
    status: 'Interviewing',
    matchScore: 88,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: '3',
    jobId: '3',
    job: {
      id: '3',
      title: 'AI Research Engineer',
      company: {
        id: '3',
        name: 'AI Innovations',
        logo: undefined,
      },
    },
    applicant: {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+65 9123 4567',
      resume: 'resume1.pdf',
    },
    coverLetter: 'Excited about AI research...',
    status: 'Shortlisted',
    matchScore: 92,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: '4',
    jobId: '4',
    job: {
      id: '4',
      title: 'UX Designer',
      company: {
        id: '4',
        name: 'DesignHub',
        logo: undefined,
      },
    },
    applicant: {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+65 9123 4567',
      resume: 'resume1.pdf',
    },
    coverLetter: 'Love designing user experiences...',
    status: 'Rejected',
    matchScore: 75,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
  {
    id: '5',
    jobId: '5',
    job: {
      id: '5',
      title: 'Data Scientist',
      company: {
        id: '5',
        name: 'DataGenius',
        logo: undefined,
      },
    },
    applicant: {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+65 9123 4567',
      resume: 'resume1.pdf',
    },
    coverLetter: 'Passionate about data science...',
    status: 'Offered',
    matchScore: 90,
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

const getStatusIcon = (status: ApplicationStatus) => {
  switch (status) {
    case 'Submitted':
      return <FileText className="h-5 w-5" />;
    case 'Reviewed':
      return <Eye className="h-5 w-5" />;
    case 'Shortlisted':
      return <CheckCircle className="h-5 w-5" />;
    case 'Interviewing':
      return <MessageSquare className="h-5 w-5" />;
    case 'Offered':
      return <CheckCircle className="h-5 w-5" />;
    case 'Rejected':
      return <XCircle className="h-5 w-5" />;
    default:
      return <Clock className="h-5 w-5" />;
  }
};

const getStatusColor = (status: ApplicationStatus) => {
  switch (status) {
    case 'Submitted':
    case 'Reviewed':
      return 'default';
    case 'Shortlisted':
    case 'Interviewing':
      return 'primary';
    case 'Offered':
      return 'success';
    case 'Rejected':
      return 'error';
    default:
      return 'default';
  }
};

// Unified application type for display
type UnifiedApplication = {
  id: string;
  type: 'job' | 'freelancer' | 'cofounder' | 'team';
  title: string;
  company?: string;
  status: string;
  matchScore?: number;
  createdAt: string;
  updatedAt: string;
  link?: string;
  icon: React.ReactNode;
  data: any;
};

function MyApplicationsContent() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedChat, setSelectedChat] = useState<{
    conversationId: string | null;
    chatType: 'job-application' | 'freelancer-proposal' | 'cofounder-connection' | 'team-application' | 'direct';
    participantName: string;
    participantAvatar?: string;
    contextData?: any;
  } | null>(null);
  const { data: applications = [], isLoading, error } = useMyApplications();
  const { data: proposals = [], isLoading: proposalsLoading } = useMyProposals();
  const { connectionRequests, currentProfile } = useCofounder();
  const withdrawMutation = useWithdrawApplication();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use platform API data, fallback to mock data if API fails (development only)
  // Only use mock data after mount to prevent hydration mismatch
  const displayApplications = isMounted 
    ? (applications.length > 0 ? applications : (error ? [] : mockApplications))
    : [];

  // Transform all application types into unified format
  const unifiedApplications: UnifiedApplication[] = [
    // Job applications
    ...displayApplications.map((app): UnifiedApplication => ({
      id: app.id,
      type: 'job',
      title: app.job.title,
      company: app.job.company.name,
      status: app.status,
      matchScore: app.matchScore,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
      link: `/jobs/find-startup-jobs?job=${app.jobId}`,
      icon: <Briefcase className="h-5 w-5" />,
      data: app,
    })),
    // Freelancer proposals
    ...proposals.map((proposal: any): UnifiedApplication => ({
      id: proposal.id,
      type: 'freelancer',
      title: `Proposal for Project`,
      company: proposal.projectId ? `Project #${proposal.projectId.slice(0, 8)}` : 'Freelancer Project',
      status: proposal.status === 'accepted' ? 'Accepted' : proposal.status === 'rejected' ? 'Rejected' : 'Pending',
      createdAt: proposal.createdAt,
      updatedAt: proposal.updatedAt,
      link: proposal.projectId ? `/jobs/freelancer/projects/${proposal.projectId}` : undefined,
      icon: <Code className="h-5 w-5" />,
      data: proposal,
    })),
    // Co-founder connection requests (sent by current user)
    ...(currentProfile ? connectionRequests
      .filter((req) => req.fromProfileId === currentProfile.id)
      .map((req): UnifiedApplication => ({
        id: req.id,
        type: 'cofounder',
        title: 'Co-Founder Connection Request',
        company: 'Co-Founder Matching',
        status: req.status === 'accepted' ? 'Accepted' : req.status === 'rejected' ? 'Rejected' : 'Pending',
        createdAt: req.createdAt.toISOString(),
        updatedAt: req.createdAt.toISOString(),
        link: `/jobs/find-cofounder`,
        icon: <UserCheck className="h-5 w-5" />,
        data: req,
      })) : []),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const submitted = unifiedApplications.filter((app) => 
    app.status === 'Submitted' || app.status === 'Reviewed' || app.status === 'Pending'
  );
  const active = unifiedApplications.filter((app) => 
    app.status === 'Shortlisted' || app.status === 'Interviewing' || app.status === 'Accepted'
  );
  const offers = unifiedApplications.filter((app) => app.status === 'Offered');
  const rejected = unifiedApplications.filter((app) => app.status === 'Rejected');

  const handleViewApplication = (app: UnifiedApplication) => {
    if (app.link && typeof window !== 'undefined') {
      window.location.href = app.link;
    }
  };

  const handleWithdraw = async (applicationId: string, type: string) => {
    if (confirm('Are you sure you want to withdraw this application?')) {
      if (type === 'job') {
        try {
          await withdrawMutation.mutateAsync(applicationId);
          // Success handled by query invalidation
        } catch (error) {
          alert('Failed to withdraw application. Please try again.');
        }
      } else {
        alert('Withdrawal functionality for this type is coming soon.');
      }
    }
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, { label: string; color: string }> = {
      job: { label: 'Job', color: 'primary' },
      freelancer: { label: 'Freelancer', color: 'info' },
      cofounder: { label: 'Co-Founder', color: 'success' },
      team: { label: 'Team', color: 'warning' },
    };
    return variants[type] || { label: type, color: 'default' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F5F9] via-white to-[#F1F5F9] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pb-20">
      {/* Clean Header Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200/60 pt-20 lg:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-6 py-8 sm:py-12 max-w-7xl">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-4 sm:mb-6">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary">My Applications</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1E293B] dark:text-white mb-3 sm:mb-4 gradient-text px-2">
              My Applications
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[#64748B] dark:text-gray-400 max-w-2xl mx-auto px-4">
              Track and manage all your job applications in one place
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-6 py-8 sm:py-12 max-w-7xl">
        {/* Clean Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-[#64748B] dark:text-gray-400 mb-2 uppercase tracking-wide">Total</p>
                  <p className="text-3xl font-bold text-[#1E293B] dark:text-white transition-transform duration-300 group-hover:scale-105">{unifiedApplications.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg">
                  <Briefcase className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-[#64748B] dark:text-gray-400 mb-2 uppercase tracking-wide">Active</p>
                  <p className="text-3xl font-bold text-[#1E293B] dark:text-white">{active.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-info to-info-light text-white shadow-lg">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-[#64748B] dark:text-gray-400 mb-2 uppercase tracking-wide">Offers</p>
                  <p className="text-3xl font-bold text-[#1E293B] dark:text-white">{offers.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-success to-success-light text-white shadow-lg">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-[#64748B] dark:text-gray-400 mb-2 uppercase tracking-wide">Response Rate</p>
                  <p className="text-3xl font-bold text-[#1E293B] dark:text-white">
                    {displayApplications.length > 0 ? Math.round(((active.length + offers.length) / displayApplications.length) * 100) : 0}%
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple to-purple-light text-white shadow-lg">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6 bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-lg">
            <TabsTrigger value="all" className="px-4 py-2 rounded-md text-sm font-medium">
              All Applications ({unifiedApplications.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="px-4 py-2 rounded-md text-sm font-medium">
              Active ({active.length})
            </TabsTrigger>
            <TabsTrigger value="offers" className="px-4 py-2 rounded-md text-sm font-medium">
              Offers ({offers.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="px-4 py-2 rounded-md text-sm font-medium">
              Rejected ({rejected.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {!isMounted || isLoading || proposalsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading applications...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">Failed to load applications. Please try again.</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            ) : unifiedApplications.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No applications yet</p>
                <div className="flex gap-4 justify-center">
                  <Link href="/jobs/find-startup-jobs">
                    <Button>Browse Jobs</Button>
                  </Link>
                  <Link href="/jobs/freelancer/projects">
                    <Button variant="outline">Browse Projects</Button>
                  </Link>
                </div>
              </div>
            ) : (
              unifiedApplications.map((application) => {
                const typeBadge = getTypeBadge(application.type);
                return (
                <Card key={application.id} className="group relative overflow-hidden border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-500 ease-out card-hover">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-lg flex-shrink-0">
                            {application.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg sm:text-xl font-bold text-[#1E293B] dark:text-white group-hover:text-primary transition-colors duration-300">
                                {application.title}
                              </h3>
                              <Badge variant={typeBadge.color as any} className="text-xs">
                                {typeBadge.label}
                              </Badge>
                            </div>
                            {application.company && (
                              <p className="text-sm sm:text-base font-semibold text-[#64748B] dark:text-gray-400 mb-3">
                                {application.company}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#64748B] dark:text-gray-400">
                              {application.matchScore && (
                                <div className="flex items-center gap-1.5 bg-primary/10 dark:bg-primary/20 px-3 py-1.5 rounded-lg">
                                  <span className="font-semibold text-primary">
                                    {application.matchScore}% Match
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <Badge variant={getStatusColor(application.status as ApplicationStatus) as any} className="flex items-center gap-1.5 text-xs">
                            {getStatusIcon(application.status as ApplicationStatus)}
                            {application.status}
                          </Badge>
                          <span className="text-xs sm:text-sm text-[#64748B] dark:text-gray-400">
                            Applied {formatRelativeTime(application.createdAt)}
                          </span>
                          {application.updatedAt !== application.createdAt && (
                            <span className="text-xs sm:text-sm text-[#64748B] dark:text-gray-400">
                              • Updated {formatRelativeTime(application.updatedAt)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedChat({
                              conversationId: application.type === 'job' 
                                ? `job-app-${application.data.jobId}-${application.id}`
                                : application.type === 'freelancer'
                                ? `proposal-${application.data.projectId || application.id}`
                                : application.type === 'cofounder'
                                ? null
                                : null,
                              chatType: application.type === 'job' 
                                ? 'job-application'
                                : application.type === 'freelancer'
                                ? 'freelancer-proposal'
                                : application.type === 'cofounder'
                                ? 'cofounder-connection'
                                : 'direct',
                              participantName: application.company || 'Recipient',
                              contextData: {
                                jobId: application.type === 'job' ? application.data.jobId : undefined,
                                applicationId: application.type === 'job' ? application.id : undefined,
                                projectId: application.type === 'freelancer' ? application.data.projectId : undefined,
                                proposalId: application.type === 'freelancer' ? application.id : undefined,
                                cofounderProfileId: application.type === 'cofounder' ? application.data.toProfileId : undefined,
                              },
                            });
                          }}
                          className="flex items-center gap-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Message
                        </Button>
                        {application.link && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewApplication(application)}
                          >
                            View Details
                          </Button>
                        )}
                        {application.status !== 'Rejected' && application.status !== 'Offered' && application.status !== 'Accepted' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleWithdraw(application.id, application.type)}
                          >
                            Withdraw
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {active.length > 0 ? (
              active.map((application) => {
                const typeBadge = getTypeBadge(application.type);
                return (
                <Card key={application.id} className="border-gray-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {application.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                {application.title}
                              </h3>
                              <Badge variant={typeBadge.color as any} className="text-xs">
                                {typeBadge.label}
                              </Badge>
                            </div>
                            {application.company && (
                              <p className="text-sm font-semibold text-gray-600 mb-2">
                                {application.company}
                              </p>
                            )}
                            {application.matchScore && (
                              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold text-primary">
                                  {application.matchScore}% Match
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                          <Badge variant={getStatusColor(application.status as ApplicationStatus) as any} className="flex items-center gap-1.5">
                            {getStatusIcon(application.status as ApplicationStatus)}
                            {application.status}
                          </Badge>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Applied {formatRelativeTime(application.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        {application.link && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewApplication(application)}
                          >
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                );
              })
            ) : (
              <Card className="border-gray-200 dark:border-gray-700">
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500 mb-4">No active applications at the moment.</p>
                  <Link href="/jobs/find-startup-jobs">
                    <Button>Browse Jobs</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="offers" className="space-y-4">
            {offers.length > 0 ? (
              offers.map((application) => {
                const typeBadge = getTypeBadge(application.type);
                return (
                <Card key={application.id} className="border-green-200 bg-green-50 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {application.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                {application.title}
                              </h3>
                              <Badge variant={typeBadge.color as any} className="text-xs">
                                {typeBadge.label}
                              </Badge>
                            </div>
                            {application.company && (
                              <p className="text-sm font-semibold text-gray-600 mb-2">
                                {application.company}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                          <Badge variant="success" className="flex items-center gap-1.5">
                            <CheckCircle className="h-4 w-4" />
                            Offer Received
                          </Badge>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Updated {formatRelativeTime(application.updatedAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        {application.link && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Accept Offer
                          </Button>
                        )}
                        {application.link && (
                          <Button variant="outline" size="sm" onClick={() => handleViewApplication(application)}>
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                );
              })
            ) : (
              <Card className="border-gray-200 dark:border-gray-700">
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500 mb-4">No offers received yet.</p>
                  <Link href="/jobs/find-startup-jobs">
                    <Button>Continue Applying</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            {rejected.length > 0 ? (
              rejected.map((application) => {
                const typeBadge = getTypeBadge(application.type);
                return (
                <Card key={application.id} className="border-gray-200 opacity-75 hover:opacity-100 transition-opacity">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center text-gray-600 font-semibold flex-shrink-0">
                            {application.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                {application.title}
                              </h3>
                              <Badge variant={typeBadge.color as any} className="text-xs">
                                {typeBadge.label}
                              </Badge>
                            </div>
                            {application.company && (
                              <p className="text-sm font-semibold text-gray-600 mb-2">
                                {application.company}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                          <Badge variant="error" className="flex items-center gap-1.5">
                            <XCircle className="h-4 w-4" />
                            {application.status}
                          </Badge>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Applied {formatRelativeTime(application.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        {application.link && (
                          <Button variant="outline" size="sm" onClick={() => handleViewApplication(application)}>
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                );
              })
            ) : (
              <Card className="border-gray-200 dark:border-gray-700">
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500 mb-4">No rejected applications.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Chat Modal */}
      {selectedChat && (
        <UnifiedChat
          conversationId={selectedChat.conversationId}
          chatType={selectedChat.chatType}
          participantName={selectedChat.participantName}
          participantAvatar={selectedChat.participantAvatar}
          isOpen={!!selectedChat}
          onClose={() => setSelectedChat(null)}
          contextData={selectedChat.contextData}
        />
      )}
    </div>
  );
}

export default function MyApplicationsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading applications...</p>
        </div>
      </div>
    }>
      <MyApplicationsContent />
    </Suspense>
  );
}

