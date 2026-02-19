'use client';

import { useState } from 'react';
import { useMyProjects, useProjects } from '@/hooks/useFreelancer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { 
  Briefcase, 
  DollarSign, 
  Clock, 
  CheckCircle2,
  XCircle,
  Hourglass,
  TrendingUp,
  Users,
  FileText,
  ArrowRight,
  Plus,
  Eye,
  MessageSquare,
  Edit,
  Trash2,
  BarChart3,
  Shield,
  ArrowLeft,
  Home,
} from 'lucide-react';
import { PaymentProtectionBadge } from '@/components/freelancer/PaymentProtectionBadge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProjectStatus } from '@/types/freelancer';

export default function ClientDashboardPage() {
  const router = useRouter();
  const { data: myProjectsData, isLoading } = useMyProjects();
  const { data: allProjectsData } = useProjects({ limit: 100 });

  const myProjects = myProjectsData || [];
  const allProjects = allProjectsData?.items || [];

  // Calculate stats
  const stats = {
    total: myProjects.length,
    open: myProjects.filter(p => p.status === 'open').length,
    inProgress: myProjects.filter(p => p.status === 'in-progress').length,
    completed: myProjects.filter(p => p.status === 'completed').length,
    totalProposals: myProjects.reduce((sum, p) => sum + (p.proposalsCount || 0), 0),
    totalBudget: myProjects.reduce((sum, p) => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Client Dashboard</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Manage your projects and find the perfect freelancers
              </p>
            </div>
            <Link href="/jobs/freelancer/post-project">
              <Button size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Post New Project
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Projects</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
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
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Open Projects</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.open}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <Hourglass className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Proposals</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.totalProposals}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Budget</p>
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    ${stats.totalBudget.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Management */}
        <Card className="border-2 border-gray-200 dark:border-gray-700 mb-8">
          <CardHeader>
            <CardTitle>My Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                <TabsTrigger value="open">Open ({stats.open})</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress ({stats.inProgress})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {myProjects.length > 0 ? (
                  myProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} getStatusBadge={getStatusBadge} />
                  ))
                ) : (
                  <EmptyState type="all" />
                )}
              </TabsContent>

              <TabsContent value="open" className="space-y-4">
                {myProjects.filter(p => p.status === 'open').length > 0 ? (
                  myProjects.filter(p => p.status === 'open').map((project) => (
                    <ProjectCard key={project.id} project={project} getStatusBadge={getStatusBadge} />
                  ))
                ) : (
                  <EmptyState type="open" />
                )}
              </TabsContent>

              <TabsContent value="in-progress" className="space-y-4">
                {myProjects.filter(p => p.status === 'in-progress').length > 0 ? (
                  myProjects.filter(p => p.status === 'in-progress').map((project) => (
                    <ProjectCard key={project.id} project={project} getStatusBadge={getStatusBadge} />
                  ))
                ) : (
                  <EmptyState type="in-progress" />
                )}
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                {myProjects.filter(p => p.status === 'completed').length > 0 ? (
                  myProjects.filter(p => p.status === 'completed').map((project) => (
                    <ProjectCard key={project.id} project={project} getStatusBadge={getStatusBadge} />
                  ))
                ) : (
                  <EmptyState type="completed" />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/jobs/freelancer/post-project">
            <Card className="border-2 border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-xl transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Post New Project</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Create a new project and find freelancers</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/jobs/freelancer/find">
            <Card className="border-2 border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-xl transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Find Freelancers</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Browse talented freelancers</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/jobs/freelancer/projects">
            <Card className="border-2 border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-xl transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Browse Projects</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">See all available projects</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, getStatusBadge }: { project: any; getStatusBadge: (status: ProjectStatus) => string }) {
  return (
    <Card className="border-2 border-gray-200 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/50 hover:shadow-lg transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Link href={`/jobs/freelancer/projects/${project.id}`}>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-primary transition-colors">
                  {project.title}
                </h3>
              </Link>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusBadge(project.status) as any}>
                  {project.status.replace('-', ' ')}
                </Badge>
                {project.paymentProtection && (
                  <PaymentProtectionBadge enabled={project.paymentProtection} variant="compact" />
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {project.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              {project.type === 'fixed-price' && project.budget && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold">${project.budget.toLocaleString()}</span>
                </div>
              )}
              {project.type === 'hourly' && project.hourlyRate && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span className="font-semibold">
                    ${project.hourlyRate.min || 0}-${project.hourlyRate.max || 0}/hr
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                <span>{project.proposalsCount || 0} proposals</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{project.hiredFreelancers || 0} hired</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link href={`/jobs/freelancer/projects/${project.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </Link>
          <Link href={`/jobs/freelancer/projects/${project.id}/proposals`}>
            <Button variant="outline" className="flex-1">
              <MessageSquare className="w-4 h-4 mr-2" />
              Proposals ({project.proposalsCount || 0})
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ type }: { type: string }) {
  const messages = {
    all: 'No projects yet. Post your first project to get started!',
    open: 'No open projects at the moment.',
    'in-progress': 'No projects in progress.',
    completed: 'No completed projects yet.',
  };

  return (
    <div className="text-center py-12 text-gray-600 dark:text-gray-400">
      <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
      <p className="mb-4">{messages[type as keyof typeof messages]}</p>
      {type === 'all' && (
        <Link href="/jobs/freelancer/post-project">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Post Your First Project
          </Button>
        </Link>
      )}
    </div>
  );
}

