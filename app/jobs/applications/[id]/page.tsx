'use client';

import { useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { ApplicationPipeline } from '@/components/employer/ApplicationPipeline';
import { ApplicationTimeline } from '@/components/employer/ApplicationTimeline';
import { ApplicationNotes } from '@/components/employer/ApplicationNotes';
import { CandidateRating } from '@/components/employer/CandidateRating';
import { Application, ApplicationStatus } from '@/types/application';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Download, Mail, Calendar } from 'lucide-react';
import Link from 'next/link';

// Mock data - will be replaced with API calls
const mockApplication: Application = {
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
  status: 'Shortlisted',
  matchScore: 95,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockApplications: Application[] = [
  mockApplication,
  {
    ...mockApplication,
    id: '2',
    applicant: {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+65 9234 5678',
    },
    status: 'Interviewing',
    matchScore: 88,
  },
  {
    ...mockApplication,
    id: '3',
    applicant: {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
    },
    status: 'Submitted',
    matchScore: 75,
  },
];

interface Note {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt?: string;
}

function ApplicationDetailContent() {
  const params = useParams();
  const applicationId = Array.isArray(params.id) ? params.id[0] : (params.id as string);
  
  const [application] = useState<Application>(
    mockApplications.find((app) => app.id === applicationId) || mockApplication
  );
  const [applications] = useState<Application[]>(mockApplications);
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      content: 'Strong technical background. Good fit for the role.',
      author: 'Sarah Johnson',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      content: 'Follow up on availability next week.',
      author: 'Sarah Johnson',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);
  const [rating, setRating] = useState(0);

  const handleStatusChange = (appId: string, status: ApplicationStatus) => {
    console.log('Update status:', appId, status);
    // Update application status
  };

  const handleView = (app: Application) => {
    console.log('View application:', app.id);
    // Navigate to application detail
  };

  const handleAddNote = (content: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      content,
      author: 'Current User', // This would come from auth context
      createdAt: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
  };

  const handleUpdateNote = (noteId: string, content: string) => {
    setNotes(
      notes.map((note) =>
        note.id === noteId ? { ...note, content, updatedAt: new Date().toISOString() } : note
      )
    );
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId));
  };

  const handleRate = (newRating: number) => {
    setRating(newRating);
    console.log('Rate candidate:', application.id, newRating);
    // Save rating to API
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/jobs/applications">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {application.applicant.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Application for {application.job.title} at {application.job.company.name}
        </p>
      </div>

      <Tabs defaultValue="pipeline" className="w-full">
        <TabsList>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="mt-6">
          <ApplicationPipeline
            applications={applications}
            onStatusChange={handleStatusChange}
            onView={handleView}
          />
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ApplicationTimeline application={application} />
            </div>
            <div className="space-y-6">
              <CandidateRating
                application={application}
                currentRating={rating}
                onRate={handleRate}
              />
              <ApplicationNotes
                application={application}
                notes={notes}
                onAddNote={handleAddNote}
                onUpdateNote={handleUpdateNote}
                onDeleteNote={handleDeleteNote}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Application Details</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Contact Information</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email: {application.applicant.email}</p>
                    {application.applicant.phone && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">Phone: {application.applicant.phone}</p>
                    )}
                  </div>
                  {application.coverLetter && (
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Cover Letter</h3>
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        {application.coverLetter}
                      </p>
                    </div>
                  )}
                  {application.expectedSalary && (
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Expected Salary</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{application.expectedSalary}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <CandidateRating
                application={application}
                currentRating={rating}
                onRate={handleRate}
              />
              <ApplicationNotes
                application={application}
                notes={notes}
                onAddNote={handleAddNote}
                onUpdateNote={handleUpdateNote}
                onDeleteNote={handleDeleteNote}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Chat Button - Context aware for this application */}
    </div>
  );
}

export default function ApplicationDetailPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <ApplicationDetailContent />
    </Suspense>
  );
}

