'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { EmployerDashboard } from '@/components/employer/EmployerDashboard';
import { JobSeekerDashboard } from '@/components/job-seeker/JobSeekerDashboard';
import { useJobSeekerAnalytics } from '@/hooks/useAnalytics';
import { useEmployerAnalytics } from '@/hooks/useAnalytics';
import { useMyFreelancerProfile, useMyProposals, useProjects, useMyProjects } from '@/hooks/useFreelancer';
import { getActiveJobProfile } from '@/services/platform/auth';
import { ConnectsDisplay } from '@/components/freelancer/ConnectsDisplay';
import { JobSuccessScoreBadge } from '@/components/freelancer/PaymentProtectionBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmployerAnalytics } from '@/components/analytics/EmployerAnalytics';
import { JobSeekerAnalytics as JobSeekerAnalyticsComponent } from '@/components/analytics/JobSeekerAnalytics';
import { useMyApplications } from '@/hooks/useApplications';
import { useCofounder } from '@/contexts/CofounderContext';
import { 
  Briefcase, 
  DollarSign, 
  Clock, 
  CheckCircle2,
  Hourglass,
  User,
  FileText,
  ArrowRight,
  Plus,
  TrendingUp,
  Users,
  Eye,
  BarChart3,
  Code,
  UserCheck,
} from 'lucide-react';
import Link from 'next/link';
import { ProjectStatus } from '@/types/freelancer';

type DashboardTab = 'job-seeker' | 'employer' | 'freelancer' | 'client' | 'analytics';

function DashboardContent() {
  const searchParams = useSearchParams();
  const [userRole, setUserRole] = useState<'job-seeker' | 'employer' | 'freelancer' | 'client' | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['job-seeker', 'employer', 'freelancer', 'client', 'analytics'].includes(tabParam)) {
      return tabParam as DashboardTab;
    }
    return 'job-seeker';
  });
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y' | 'all'>('30d');
  const [isMounted, setIsMounted] = useState(false);

  // Freelancer data - only fetch after mounting to prevent prefetch errors
  const { data: myFreelancerProfile, isLoading: freelancerProfileLoading } = useMyFreelancerProfile();
  const { data: myProposals, isLoading: proposalsLoading } = useMyProposals();
  const { data: activeProjectsData } = useProjects({ status: 'in-progress', limit: 5 });
  const { data: myProjectsData, isLoading: myProjectsLoading } = useMyProjects();
  const { data: allProjectsData } = useProjects({ limit: 100 });

  // All applications data
  const { data: jobApplications = [] } = useMyApplications();
  const { connectionRequests, currentProfile } = useCofounder();

  // Job seeker and employer analytics
  const { data: jobSeekerAnalytics, isLoading: jobSeekerLoading } = useJobSeekerAnalytics(period, { enabled: isMounted });
  const { data: employerAnalytics, isLoading: employerLoading } = useEmployerAnalytics(companyId, period, { enabled: isMounted });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const loadUserRole = async () => {
      try {
        // Only call getActiveJobProfile on client side
        if (typeof window === 'undefined') return;
        
        const profile = await getActiveJobProfile();
        // Check if user has freelancer profile
        if (myFreelancerProfile) {
          // Check if user has posted projects (client role)
          if (myProjectsData && myProjectsData.length > 0) {
            setUserRole('client');
            setActiveTab('client');
          } else {
            setUserRole('freelancer');
            setActiveTab('freelancer');
          }
        } else {
          // Default to job-seeker for now
          setUserRole('job-seeker');
          setActiveTab('job-seeker');
        }
      } catch (error) {
        // Silently handle errors - don't log fetch errors during prefetch
        if (error instanceof Error && !error.message.includes('Failed to fetch')) {
          console.error('Error loading user role:', error);
        }
        setUserRole('job-seeker');
        setActiveTab('job-seeker');
      }
    };
    
    loadUserRole();
  }, [isMounted, myFreelancerProfile, myProjectsData]);

  // Mock stats fallback
  const mockStats = {
    totalJobs: 12,
    activeJobs: 8,
    totalApplications: 156,
    pendingApplications: 23,
    interviewsScheduled: 5,
    averageTimeToHire: 14,
  };

  // Freelancer stats
  const activeProjects = activeProjectsData?.items || [];
  const proposals = myProposals || [];
  const myProjects = myProjectsData || [];
  const allProjects = allProjectsData?.items || [];

  const proposalStats = {
    pending: proposals.filter((p: any) => p.status === 'pending').length,
    accepted: proposals.filter((p: any) => p.status === 'accepted').length,
    rejected: proposals.filter((p: any) => p.status === 'rejected').length,
    total: proposals.length,
  };

  const clientStats = {
    total: myProjects.length,
    open: myProjects.filter((p: any) => p.status === 'open').length,
    inProgress: myProjects.filter((p: any) => p.status === 'in-progress').length,
    completed: myProjects.filter((p: any) => p.status === 'completed').length,
    totalProposals: myProjects.reduce((sum: number, p: any) => sum + (p.proposalsCount || 0), 0),
    totalBudget: myProjects.reduce((sum: number, p: any) => {
      if (p.type === 'fixed-price' && p.budget) return sum + p.budget;
      return sum;
    }, 0),
  };

  const getStatusBadge = (status: ProjectStatus) => {
    const variants = {
      'open': 'primary',
      'in-progress': 'warning',
      'completed': 'success',
      'cancelled': 'error',
      'draft': 'outline',
    } as const;
    return variants[status] || 'outline';
  };

  // Prevent hydration mismatch
  if (!isMounted || userRole === null) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Calculate unified application stats
  const cofounderConnections = currentProfile 
    ? connectionRequests.filter((req) => req.fromProfileId === currentProfile.id)
    : [];
  
  const freelancerProposals = myProposals || [];
  const allApplicationsCount = jobApplications.length + freelancerProposals.length + cofounderConnections.length;
  const activeApplicationsCount = 
    jobApplications.filter((app: any) => ['Shortlisted', 'Interviewing'].includes(app.status)).length +
    freelancerProposals.filter((p: any) => p.status === 'accepted').length +
    cofounderConnections.filter((req) => req.status === 'accepted').length;
  const pendingApplicationsCount = 
    jobApplications.filter((app: any) => ['Submitted', 'Reviewed'].includes(app.status)).length +
    freelancerProposals.filter((p: any) => p.status === 'pending').length +
    cofounderConnections.filter((req) => req.status === 'pending').length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your jobs, applications, and projects all in one place</p>
      </div>

      {/* Unified Applications Overview */}
      <Card className="border-2 border-gray-200 dark:border-gray-700 mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Applications Overview</CardTitle>
            <Link href="/jobs/my-applications">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Applications</p>
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{allApplicationsCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Across all platforms
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Job Applications</p>
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{jobApplications.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Startup jobs
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Freelancer Proposals</p>
                <Code className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{freelancerProposals.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Project proposals
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Co-Founder Connections</p>
                <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{cofounderConnections.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Connection requests
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{pendingApplicationsCount}</p>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{activeApplicationsCount}</p>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Response Rate</p>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {allApplicationsCount > 0 ? Math.round((activeApplicationsCount / allApplicationsCount) * 100) : 0}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs key={activeTab} defaultValue={activeTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="job-seeker" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Job Seeker
          </TabsTrigger>
          <TabsTrigger value="employer" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Employer
          </TabsTrigger>
          <TabsTrigger value="freelancer" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Freelancer
          </TabsTrigger>
          <TabsTrigger value="client" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Client
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Job Seeker Dashboard */}
        <TabsContent value="job-seeker">
          <JobSeekerDashboard 
            analytics={jobSeekerAnalytics || undefined}
            isLoading={jobSeekerLoading}
          />
        </TabsContent>

        {/* Employer Dashboard */}
        <TabsContent value="employer">
        <EmployerDashboard 
          stats={employerAnalytics ? {
            totalJobs: employerAnalytics.jobs.total,
            activeJobs: employerAnalytics.jobs.active,
            totalApplications: employerAnalytics.applications.total,
            pendingApplications: employerAnalytics.applications.byStatus.find(s => s.status === 'Submitted')?.count || 0,
            interviewsScheduled: employerAnalytics.applications.byStatus.find(s => s.status === 'Interviewing')?.count || 0,
            averageTimeToHire: employerAnalytics.hiring.averageTimeToFill,
          } : mockStats}
          analytics={employerAnalytics}
          isLoading={employerLoading}
        />
        </TabsContent>

        {/* Freelancer Dashboard */}
        <TabsContent value="freelancer">
          {freelancerProfileLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
            </div>
          ) : !myFreelancerProfile ? (
            <div className="text-center py-12 max-w-md mx-auto">
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
          ) : (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Freelancer Dashboard</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Welcome back, {myFreelancerProfile.title}!
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {myFreelancerProfile.jobSuccessScore && (
                    <JobSuccessScoreBadge score={myFreelancerProfile.jobSuccessScore} />
                  )}
                  <ConnectsDisplay connects={myFreelancerProfile.connects || 0} variant="default" />
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                          <Button variant="outline">Browse Projects</Button>
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
                        {proposals.slice(0, 5).map((proposal: any) => (
                          <div key={proposal.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <Link href={`/jobs/freelancer/projects/${proposal.projectId}`}>
                                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 hover:text-primary transition-colors">
                                    Project #{proposal.projectId?.slice(0, 8) || 'N/A'}
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
                          <Button variant="outline">Browse Projects</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="border-2 border-gray-200 dark:border-gray-700">
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
          )}
        </TabsContent>

        {/* Client Dashboard */}
        <TabsContent value="client">
          {myProjectsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Client Dashboard</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your projects and find the perfect freelancers
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-2 border-gray-200 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Projects</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{clientStats.total}</p>
                      </div>
                      <Briefcase className="w-8 h-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-gray-200 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Open Projects</p>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{clientStats.open}</p>
                      </div>
                      <Eye className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-gray-200 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Proposals</p>
                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{clientStats.totalProposals}</p>
                      </div>
                      <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-gray-200 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Budget</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                          ${clientStats.totalBudget.toLocaleString()}
                        </p>
                      </div>
                      <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="border-2 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/jobs/freelancer/post-project">
                      <Button className="w-full justify-start">
                        <Plus className="w-5 h-5 mr-2" />
                        Post a Project
                      </Button>
                    </Link>
                    <Link href="/jobs/freelancer/find">
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="w-5 h-5 mr-2" />
                        Find Freelancers
                      </Button>
                    </Link>
                    <Link href="/jobs/freelancer/projects">
                      <Button variant="outline" className="w-full justify-start">
                        <Briefcase className="w-5 h-5 mr-2" />
                        Browse All Projects
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* My Projects */}
              <Card className="border-2 border-gray-200 dark:border-gray-700">
                <CardHeader className="flex items-center justify-between">
                  <CardTitle>My Projects</CardTitle>
                  <Link href="/jobs/freelancer/projects">
                    <Button variant="ghost" size="sm">
                      View All
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {myProjects.length > 0 ? (
                    <div className="space-y-4">
                      {myProjects.slice(0, 5).map((project: any) => (
                        <div key={project.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <Link href={`/jobs/freelancer/projects/${project.id}`}>
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100 hover:text-primary transition-colors">
                                {project.title}
                              </h3>
                            </Link>
                            <Badge variant={getStatusBadge(project.status) as any}>
                              {project.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>{project.proposalsCount || 0} proposals</span>
                            {project.type === 'fixed-price' && project.budget && (
                              <span>${project.budget.toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                      <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                      <p className="mb-4">No projects posted yet</p>
                      <Link href="/jobs/freelancer/post-project">
                        <Button>Post Your First Project</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Analytics Dashboard */}
        <TabsContent value="analytics">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Analytics & Insights</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Track your performance across all platforms
              </p>
            </div>

            <Tabs defaultValue="job-seeker" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="job-seeker">Job Seeker Analytics</TabsTrigger>
                <TabsTrigger value="employer">Employer Analytics</TabsTrigger>
                <TabsTrigger value="freelancer">Freelancer Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="job-seeker">
                {jobSeekerAnalytics ? (
                  <JobSeekerAnalyticsComponent data={jobSeekerAnalytics} />
                ) : (
                  <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                    No analytics data available
                  </div>
                )}
              </TabsContent>

              <TabsContent value="employer">
                {employerAnalytics ? (
                  <EmployerAnalytics data={employerAnalytics} />
                ) : (
                  <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                    No analytics data available
                  </div>
                )}
              </TabsContent>

              <TabsContent value="freelancer">
                <div className="text-center py-12">
                  <Link href="/jobs/freelancer/analytics">
                    <Button>
                      View Detailed Freelancer Analytics
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Force dynamic rendering to prevent prefetch issues
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
