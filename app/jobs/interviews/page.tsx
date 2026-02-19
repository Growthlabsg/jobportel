'use client';

import { useState, Suspense } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { InterviewForm } from '@/components/interviews/InterviewForm';
import { InterviewCard } from '@/components/interviews/InterviewCard';
import { InterviewCalendar } from '@/components/interviews/InterviewCalendar';
import { InterviewFeedbackForm } from '@/components/interviews/InterviewFeedbackForm';
import { Interview, CreateInterviewData, InterviewFeedback } from '@/types/interview';
import { Plus, Calendar, List, Filter } from 'lucide-react';

// Mock data for development
const mockInterviews: Interview[] = [
  {
    id: '1',
    applicationId: '1',
    jobId: '1',
    candidateId: '1',
    candidateName: 'John Doe',
    candidateEmail: 'john.doe@example.com',
    jobTitle: 'AI Research Engineer',
    companyName: 'TechNova Solutions',
    type: 'Video',
    status: 'Scheduled',
    scheduledAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    duration: 60,
    meetingLink: 'https://zoom.us/j/123456789',
    interviewerId: '1',
    interviewerName: 'Sarah Chen',
    interviewerEmail: 'sarah@technova.com',
    notes: 'Focus on ML experience and research background',
    reminders: [],
    companyId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    applicationId: '2',
    jobId: '1',
    candidateId: '2',
    candidateName: 'Jane Smith',
    candidateEmail: 'jane.smith@example.com',
    jobTitle: 'AI Research Engineer',
    companyName: 'TechNova Solutions',
    type: 'In-person',
    status: 'Scheduled',
    scheduledAt: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
    duration: 90,
    location: 'TechNova Office, 123 Innovation Drive, Singapore',
    interviewerId: '1',
    interviewerName: 'Sarah Chen',
    interviewerEmail: 'sarah@technova.com',
    reminders: [],
    companyId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    applicationId: '3',
    jobId: '2',
    candidateId: '3',
    candidateName: 'Mike Johnson',
    candidateEmail: 'mike.johnson@example.com',
    jobTitle: 'Product Marketing Manager',
    companyName: 'GreenTech Solutions',
    type: 'Phone',
    status: 'Completed',
    scheduledAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    duration: 45,
    interviewerId: '2',
    interviewerName: 'David Lee',
    interviewerEmail: 'david@greentech.com',
    feedback: {
      id: '1',
      interviewId: '3',
      overallRating: 4,
      technicalSkills: 4,
      communication: 5,
      problemSolving: 4,
      culturalFit: 4,
      strengths: ['Clear communication', 'Product knowledge'],
      areasForImprovement: ['Limited B2B experience'],
      recommendation: 'Yes',
      notes: 'Strong candidate with excellent communication skills. Schedule second round with team lead',
      submittedBy: '2',
      submittedAt: new Date().toISOString(),
    },
    reminders: [],
    companyId: '2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function InterviewsContent() {
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews);
  const [showForm, setShowForm] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackInterview, setFeedbackInterview] = useState<Interview | null>(null);

  const upcomingInterviews = interviews.filter(
    (i) => i.status === 'Scheduled' && new Date(i.scheduledAt) >= new Date()
  );
  const pastInterviews = interviews.filter(
    (i) => i.status === 'Completed' || new Date(i.scheduledAt) < new Date()
  );
  const todayInterviews = interviews.filter((i) => {
    const interviewDate = new Date(i.scheduledAt);
    const today = new Date();
    return (
      i.status === 'Scheduled' &&
      interviewDate.toDateString() === today.toDateString()
    );
  });

  const handleCreate = () => {
    setEditingInterview(null);
    setShowForm(true);
  };

  const handleEdit = (interview: Interview) => {
    setEditingInterview(interview);
    setShowForm(true);
  };

  const handleSubmit = (data: CreateInterviewData) => {
    if (editingInterview) {
      // Update existing interview
      setInterviews((prev) =>
        prev.map((interview) =>
          interview.id === editingInterview.id
            ? {
                ...interview,
                ...data,
                updatedAt: new Date().toISOString(),
              }
            : interview
        )
      );
    } else {
      // Create new interview
      const newInterview: Interview = {
        id: Date.now().toString(),
        applicationId: data.applicationId,
        jobId: '1', // Mock
        candidateId: '1', // Mock
        candidateName: 'New Candidate', // Mock
        candidateEmail: 'candidate@example.com', // Mock
        jobTitle: 'Software Engineer', // Mock
        companyName: 'Company Name', // Mock
        type: data.type,
        status: 'Scheduled',
        scheduledAt: data.scheduledAt,
        duration: data.duration,
        location: data.location,
        meetingLink: data.meetingLink,
        interviewerId: data.interviewerId,
        interviewerName: data.interviewerName,
        interviewerEmail: data.interviewerEmail,
        notes: data.notes,
        reminders: [],
        companyId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setInterviews((prev) => [...prev, newInterview]);
    }
    setShowForm(false);
    setEditingInterview(null);
  };

  const handleCancel = (interview: Interview) => {
    if (confirm('Are you sure you want to cancel this interview?')) {
      setInterviews((prev) =>
        prev.map((i) =>
          i.id === interview.id
            ? {
                ...i,
                status: 'Cancelled' as const,
                cancelledAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            : i
        )
      );
    }
  };

  const handleComplete = (interview: Interview) => {
    setFeedbackInterview(interview);
    setShowFeedbackForm(true);
  };

  const handleFeedbackSubmit = (feedback: InterviewFeedback) => {
    if (feedbackInterview) {
      setInterviews((prev) =>
        prev.map((i) =>
          i.id === feedbackInterview.id
            ? {
                ...i,
                status: 'Completed' as const,
                feedback,
                updatedAt: new Date().toISOString(),
              }
            : i
        )
      );
    }
    setShowFeedbackForm(false);
    setFeedbackInterview(null);
  };

  const handleView = (interview: Interview) => {
    setSelectedInterview(interview);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Interviews</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Schedule and manage candidate interviews
              </p>
            </div>
            <Button onClick={handleCreate} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Schedule Interview
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-gray-200 dark:border-gray-700">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Today</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{todayInterviews.length}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </div>
            </Card>
            <Card className="border-gray-200 dark:border-gray-700">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Upcoming</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{upcomingInterviews.length}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </div>
            </Card>
            <Card className="border-gray-200 dark:border-gray-700">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Completed</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{pastInterviews.length}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-green-100">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 mb-6">
            <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'calendar' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('calendar')}
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Calendar
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="flex items-center gap-2"
              >
                <List className="h-4 w-4" />
                List
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'calendar' ? (
          <InterviewCalendar
            interviews={interviews}
            onInterviewClick={handleView}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onComplete={handleComplete}
          />
        ) : (
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList>
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingInterviews.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past ({pastInterviews.length})
              </TabsTrigger>
              <TabsTrigger value="all">
                All ({interviews.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-6">
              <div className="space-y-4">
                {upcomingInterviews.length > 0 ? (
                  upcomingInterviews.map((interview) => (
                    <InterviewCard
                      key={interview.id}
                      interview={interview}
                      view="list"
                      onEdit={handleEdit}
                      onCancel={handleCancel}
                      onComplete={handleComplete}
                      onView={handleView}
                    />
                  ))
                ) : (
                  <Card className="border-gray-200 dark:border-gray-700">
                    <div className="p-12 text-center">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No upcoming interviews</h3>
                      <p className="text-gray-600 mb-6">
                        Schedule your first interview to get started
                      </p>
                      <Button onClick={handleCreate}>Schedule Interview</Button>
                    </div>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="past" className="mt-6">
              <div className="space-y-4">
                {pastInterviews.length > 0 ? (
                  pastInterviews.map((interview) => (
                    <InterviewCard
                      key={interview.id}
                      interview={interview}
                      view="list"
                      onView={handleView}
                    />
                  ))
                ) : (
                  <Card className="border-gray-200 dark:border-gray-700">
                    <div className="p-12 text-center">
                      <p className="text-gray-600 dark:text-gray-400">No past interviews</p>
                    </div>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="all" className="mt-6">
              <div className="space-y-4">
                {interviews.map((interview) => (
                  <InterviewCard
                    key={interview.id}
                    interview={interview}
                    view="list"
                    onEdit={handleEdit}
                    onCancel={handleCancel}
                    onComplete={handleComplete}
                    onView={handleView}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Interview Form Modal */}
      {showForm && (
        <Modal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingInterview(null);
          }}
          title={editingInterview ? 'Edit Interview' : 'Schedule Interview'}
          size="large"
        >
          <InterviewForm
            initialData={editingInterview || undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingInterview(null);
            }}
          />
        </Modal>
      )}

      {/* Feedback Form Modal */}
      {showFeedbackForm && feedbackInterview && (
        <Modal
          isOpen={showFeedbackForm}
          onClose={() => {
            setShowFeedbackForm(false);
            setFeedbackInterview(null);
          }}
          title={`Interview Feedback - ${feedbackInterview.candidateName}`}
          size="large"
        >
          <InterviewFeedbackForm
            initialData={feedbackInterview.feedback}
            onSubmit={handleFeedbackSubmit}
            onCancel={() => {
              setShowFeedbackForm(false);
              setFeedbackInterview(null);
            }}
          />
        </Modal>
      )}

      {/* Interview Detail Modal */}
      {selectedInterview && (
        <Modal
          isOpen={!!selectedInterview}
          onClose={() => setSelectedInterview(null)}
          title={`Interview - ${selectedInterview.candidateName}`}
          size="large"
        >
          <div className="space-y-6">
            <InterviewCard interview={selectedInterview} view="card" />
            {selectedInterview.feedback && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Feedback</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Overall Rating</p>
                    <p className="text-lg font-semibold">{selectedInterview.feedback.overallRating}/5</p>
                  </div>
                  {selectedInterview.feedback.recommendation && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Recommendation</p>
                      <p className="font-semibold">{selectedInterview.feedback.recommendation}</p>
                    </div>
                  )}
                  {selectedInterview.feedback.notes && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Comments</p>
                      <p className="text-gray-700 dark:text-gray-300">{selectedInterview.feedback.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Chat Button */}
    </div>
  );
}

export default function InterviewsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading interviews...</p>
          </div>
        </div>
      }
    >
      <InterviewsContent />
    </Suspense>
  );
}
