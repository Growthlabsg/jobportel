'use client';

import { useState, Suspense } from 'react';
import { ApplicationPipeline } from '@/components/employer/ApplicationPipeline';
import { ApplicationTimeline } from '@/components/employer/ApplicationTimeline';
import { ApplicationNotes } from '@/components/employer/ApplicationNotes';
import { CandidateRating } from '@/components/employer/CandidateRating';
import { Application, ApplicationStatus } from '@/types/application';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import {
  Search,
  Filter,
  Download,
  Mail,
  Calendar,
  FileText,
  User,
  Briefcase,
  TrendingUp,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { formatDate, formatRelativeTime } from '@/lib/utils';

// Mock data for development
const mockApplications: Application[] = [
  {
    id: '1',
    jobId: '1',
    job: {
      id: '1',
      title: 'AI Research Engineer',
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
    coverLetter: 'I am very interested in this position and believe my experience in machine learning makes me a strong candidate...',
    status: 'Interviewing',
    matchScore: 95,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: '2',
    jobId: '1',
    job: {
      id: '1',
      title: 'AI Research Engineer',
      company: {
        id: '1',
        name: 'TechNova Solutions',
        logo: undefined,
      },
    },
    applicant: {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+65 9234 5678',
      resume: 'resume2.pdf',
    },
    coverLetter: 'I have extensive experience in AI research and would love to contribute to your team...',
    status: 'Shortlisted',
    matchScore: 88,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: '3',
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
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      phone: '+65 9345 6789',
      resume: 'resume3.pdf',
    },
    coverLetter: 'My background in product marketing aligns perfectly with this role...',
    status: 'Offered',
    matchScore: 92,
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: '4',
    jobId: '3',
    job: {
      id: '3',
      title: 'Senior Full Stack Developer',
      company: {
        id: '3',
        name: 'Tech Startup Inc.',
        logo: undefined,
      },
    },
    applicant: {
      id: '4',
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      phone: '+65 9456 7890',
      resume: 'resume4.pdf',
    },
    coverLetter: 'I am excited about the opportunity to work on innovative products...',
    status: 'Reviewed',
    matchScore: 85,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: '5',
    jobId: '3',
    job: {
      id: '3',
      title: 'Senior Full Stack Developer',
      company: {
        id: '3',
        name: 'Tech Startup Inc.',
        logo: undefined,
      },
    },
    applicant: {
      id: '5',
      name: 'David Lee',
      email: 'david.lee@example.com',
      phone: '+65 9567 8901',
      resume: 'resume5.pdf',
    },
    coverLetter: 'With my experience in React and Node.js, I believe I can contribute significantly...',
    status: 'Rejected',
    matchScore: 72,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

function ApplicationTrackingContent() {
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'pipeline' | 'list' | 'timeline'>('pipeline');

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      !searchQuery ||
      app.applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job.company.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Group applications by status
  const applicationsByStatus = {
    Applied: filteredApplications.filter((app) => app.status === 'Submitted'),
    Reviewed: filteredApplications.filter((app) => app.status === 'Reviewed'),
    Shortlisted: filteredApplications.filter((app) => app.status === 'Shortlisted'),
    'Interview Scheduled': filteredApplications.filter((app) => app.status === 'Interviewing'),
    'Offer Extended': filteredApplications.filter((app) => app.status === 'Offered'),
    Hired: filteredApplications.filter((app) => app.status === 'Hired'),
    Rejected: filteredApplications.filter((app) => app.status === 'Rejected'),
  };

  const handleStatusChange = (applicationId: string, newStatus: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? { ...app, status: newStatus, updatedAt: new Date().toISOString() }
          : app
      )
    );
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'Submitted':
        return 'default';
      case 'Reviewed':
        return 'info';
      case 'Shortlisted':
        return 'success';
      case 'Interviewing':
        return 'warning';
      case 'Offered':
        return 'success';
      case 'Hired':
        return 'success';
      case 'Rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const stats = {
    total: applications.length,
    active: applications.filter((app) => !['Rejected', 'Hired'].includes(app.status as string)).length,
    interviewing: applications.filter((app) => app.status === 'Interviewing').length,
    offered: applications.filter((app) => app.status === 'Offered').length,
    averageMatchScore: Math.round(
      applications.reduce((sum, app) => sum + (app.matchScore || 0), 0) / applications.length
    ),
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 py-8 pt-20 lg:pt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Application Tracking</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Track and manage all candidate applications in one place
              </p>
            </div>
            <Link href="/jobs/applications">
              <Button variant="outline" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                View All Applications
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <Card className="border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.active}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-100">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Interviewing</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.interviewing}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-yellow-100">
                    <Calendar className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Offered</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.offered}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-green-100">
                    <User className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Avg. Match</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.averageMatchScore}%</p>
                  </div>
                  <div className="p-2 rounded-lg bg-purple-100">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <Input
                type="text"
                placeholder="Search by candidate name, job title, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | 'all')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              >
                <option value="all">All Status</option>
                <option value="Submitted">Submitted</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offered">Offered</option>
                <option value="Hired">Hired</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant={viewMode === 'pipeline' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('pipeline')}
            >
              Pipeline
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
            <Button
              variant={viewMode === 'timeline' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('timeline')}
            >
              Timeline
            </Button>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'pipeline' ? (
          <ApplicationPipeline
            applications={filteredApplications}
            onStatusChange={handleStatusChange}
            onView={(app) => setSelectedApplication(app)}
          />
        ) : viewMode === 'list' ? (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <Card
                key={application.id}
                className="border-gray-200 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedApplication(application)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white font-semibold">
                          {application.applicant.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                            .substring(0, 2)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                            {application.applicant.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{application.applicant.email}</p>
                        </div>
                        <Badge variant={getStatusColor(application.status) as any} size="md">
                          {application.status}
                        </Badge>
                      </div>
                      <div className="ml-16 space-y-2">
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {application.job.title}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {application.job.company.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Applied {formatRelativeTime(application.createdAt)}
                          </span>
                          {application.matchScore && (
                            <Badge variant="info" size="sm">
                              {application.matchScore}% Match
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Link href={`/jobs/applications/${application.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredApplications.length === 0 && (
              <Card className="border-gray-200 dark:border-gray-700">
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No applications found</h3>
                  <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters.</p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredApplications.map((application) => (
              <Card key={application.id} className="border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white font-semibold">
                        {application.applicant.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .substring(0, 2)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{application.applicant.name}</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{application.job.title}</p>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(application.status) as any} size="md">
                      {application.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ApplicationTimeline
                    application={application}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

          {/* Application Detail Modal */}
          {selectedApplication && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={() => setSelectedApplication(null)}
            >
              <div 
                className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {selectedApplication.applicant.name} - {selectedApplication.job.title}
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedApplication(null)}
                  >
                    Close
                  </Button>
                </div>
              <div className="p-6">
                <Tabs defaultValue="pipeline" className="w-full">
                  <TabsList>
                    <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                    <TabsTrigger value="rating">Rating</TabsTrigger>
                  </TabsList>

                  <TabsContent value="pipeline" className="mt-4">
                    <ApplicationPipeline
                      applications={[selectedApplication]}
                      onStatusChange={(appId, status) => {
                        handleStatusChange(appId, status);
                        setSelectedApplication({
                          ...selectedApplication,
                          status,
                          updatedAt: new Date().toISOString(),
                        });
                      }}
                      onView={() => {}}
                    />
                  </TabsContent>

                  <TabsContent value="timeline" className="mt-4">
                    <ApplicationTimeline
                      application={selectedApplication}
                    />
                  </TabsContent>

                  <TabsContent value="notes" className="mt-4">
                    <ApplicationNotes
                      application={selectedApplication}
                      notes={[]}
                      onAddNote={(note) => {
                        console.log('Add note:', note);
                      }}
                      onUpdateNote={(noteId, content) => {
                        console.log('Update note:', noteId, content);
                      }}
                      onDeleteNote={(noteId) => {
                        console.log('Delete note:', noteId);
                      }}
                    />
                  </TabsContent>

                  <TabsContent value="rating" className="mt-4">
                    <CandidateRating
                      application={selectedApplication}
                      currentRating={selectedApplication.rating || 0}
                      onRate={(rating) => {
                        console.log('Rate candidate:', rating);
                        setSelectedApplication({
                          ...selectedApplication,
                          rating,
                        });
                      }}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ApplicationTrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading application tracking...</p>
          </div>
        </div>
      }
    >
      <ApplicationTrackingContent />
    </Suspense>
  );
}

