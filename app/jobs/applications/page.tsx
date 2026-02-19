'use client';

import { useState } from 'react';
import { ApplicationsTable } from '@/components/employer/ApplicationsTable';
import { Application, ApplicationStatus } from '@/types/application';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Briefcase, Users, Calendar, BarChart3, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useApplications, useUpdateApplicationStatus } from '@/hooks/useApplications';

// Mock data fallback for development
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
    coverLetter: 'I am very interested in this position...',
    status: 'Submitted',
    matchScore: 95,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
    status: 'Shortlisted',
    matchScore: 88,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function ApplicationsPage() {
  const [selectedJobId, setSelectedJobId] = useState<string | undefined>(undefined);
  
  // Fetch applications from platform API
  const { data: applicationsData, isLoading, error } = useApplications({
    jobId: selectedJobId,
    page: 1,
    limit: 100,
  });
  
  const updateStatusMutation = useUpdateApplicationStatus();
  
  // Use platform API data, fallback to mock data if API fails (development only)
  const applications = applicationsData?.items || (error ? [] : mockApplications);

  const handleView = (applicationId: string) => {
    window.location.href = `/jobs/applications/${applicationId}`;
  };

  const handleStatusChange = async (applicationId: string, status: ApplicationStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ applicationId, status });
      // Success handled by query invalidation
    } catch (error) {
      alert('Failed to update application status. Please try again.');
    }
  };

  const handleDownloadResume = (applicationId: string) => {
    console.log('Download resume:', applicationId);
    // Download resume
  };

  const handleSendMessage = (applicationId: string) => {
    console.log('Send message:', applicationId);
    // Open messaging interface
  };

  const handleScheduleInterview = (applicationId: string) => {
    console.log('Schedule interview:', applicationId);
    // Open interview scheduling
    window.location.href = `/jobs/interviews?applicationId=${applicationId}`;
  };

  const allApplications = applications;
  const shortlisted = applications.filter((app) => app.status === 'Shortlisted');
  const interviewing = applications.filter((app) => app.status === 'Interviewing');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Applications</h1>
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading applications...</p>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600">Failed to load applications. Please try again.</p>
          </div>
        )}
        <p className="text-gray-600 mt-1">Manage and review candidate applications</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">
            <Users className="h-4 w-4 mr-2" />
            All Applications ({allApplications.length})
          </TabsTrigger>
          <TabsTrigger value="shortlisted">
            <Briefcase className="h-4 w-4 mr-2" />
            Shortlisted ({shortlisted.length})
          </TabsTrigger>
          <TabsTrigger value="interviews">
            <Calendar className="h-4 w-4 mr-2" />
            Interviews ({interviewing.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <div className="mt-4 mb-6">
          <Link href="/jobs/applications/tracking">
            <Button variant="outline" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              View Application Tracking
            </Button>
          </Link>
        </div>

        <TabsContent value="all">
          <ApplicationsTable
            applications={allApplications}
            onView={handleView}
            onStatusChange={handleStatusChange}
            onDownloadResume={handleDownloadResume}
            onSendMessage={handleSendMessage}
            onScheduleInterview={handleScheduleInterview}
          />
        </TabsContent>

        <TabsContent value="shortlisted">
          <ApplicationsTable
            applications={shortlisted}
            onView={handleView}
            onStatusChange={handleStatusChange}
            onDownloadResume={handleDownloadResume}
            onSendMessage={handleSendMessage}
            onScheduleInterview={handleScheduleInterview}
          />
        </TabsContent>

        <TabsContent value="interviews">
          <ApplicationsTable
            applications={interviewing}
            onView={handleView}
            onStatusChange={handleStatusChange}
            onDownloadResume={handleDownloadResume}
            onSendMessage={handleSendMessage}
            onScheduleInterview={handleScheduleInterview}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Application Analytics</h2>
            <p className="text-gray-600 dark:text-gray-400">Analytics dashboard coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Chat Button */}
    </div>
  );
}
