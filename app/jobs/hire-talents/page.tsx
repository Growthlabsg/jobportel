'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { JobPostingForm } from '@/components/employer/JobPostingForm';
import { CreateJobData } from '@/types/job';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Briefcase } from 'lucide-react';
import Link from 'next/link';

function HireTalentsContent() {
  const searchParams = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [draftData, setDraftData] = useState<Partial<CreateJobData> | null>(null);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  useEffect(() => {
    const action = searchParams.get('action');
    const jobId = searchParams.get('id');
    
    if (action === 'new') {
      setShowForm(true);
      setEditingJobId(null);
    } else if (action === 'edit' && jobId) {
      setShowForm(true);
      setEditingJobId(jobId);
      // TODO: Load job data for editing
    }
    // Load draft from localStorage
    if (typeof window !== 'undefined') {
      try {
        const savedDraft = localStorage.getItem('jobPostingDraft');
        if (savedDraft && savedDraft.trim() !== '') {
          const parsed = JSON.parse(savedDraft);
          // Validate parsed data is an object
          if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            setDraftData(parsed);
          } else {
            localStorage.removeItem('jobPostingDraft');
          }
        }
      } catch (error) {
        console.error('Error loading draft from localStorage:', error);
        // Clear invalid data
        localStorage.removeItem('jobPostingDraft');
      }
    }
  }, [searchParams]);

  const handleSubmit = async (data: CreateJobData) => {
    console.log('Submitting job:', data);
    // Here you would call the API
    // await apiClient.post('/jobs', data);
    alert('Job posted successfully!');
    setShowForm(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jobPostingDraft');
    }
  };

  const handleSaveDraft = (data: Partial<CreateJobData>) => {
    if (typeof window !== 'undefined') {
      try {
        // Only save if data is valid and serializable
        const serialized = JSON.stringify(data);
        if (serialized && serialized !== '{}') {
          localStorage.setItem('jobPostingDraft', serialized);
          setDraftData(data);
          alert('Draft saved!');
        }
      } catch (error) {
        console.error('Error saving draft to localStorage:', error);
      }
    }
  };

  const handleLoadDraft = () => {
    if (draftData) {
      setShowForm(true);
    }
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F1F5F9] via-white to-[#F1F5F9] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-6 py-8 sm:py-12 max-w-7xl">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                ← Back to Dashboard
              </Button>
            </div>
            <JobPostingForm
              onSubmit={handleSubmit}
              initialData={draftData || undefined}
              onSaveDraft={handleSaveDraft}
              jobId={editingJobId || undefined}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F5F9] via-white to-[#F1F5F9] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Clean Header Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200/60 pt-20 lg:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-6 py-8 sm:py-12 max-w-7xl">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-secondary/10 to-secondary/5 border border-secondary/20 mb-4 sm:mb-6">
              <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 text-secondary" />
              <span className="text-xs sm:text-sm font-medium text-secondary">Hire Talent</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1E293B] dark:text-white mb-3 sm:mb-4 gradient-text px-2">
              Hire Top Talent
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[#64748B] dark:text-gray-400 max-w-2xl mx-auto px-4">
              Post jobs and find the best talent for your startup
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-6 py-8 sm:py-12 max-w-7xl">
        {draftData && (
          <Card className="mb-6 border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[#1E293B] dark:text-white mb-1">You have a saved draft</h3>
                  <p className="text-sm text-[#64748B] dark:text-gray-400">
                    Continue editing your job posting draft
                  </p>
                </div>
                <Button onClick={handleLoadDraft}>Continue Draft</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <Link href="/jobs/hire-talents?action=new">
            <Card className="h-full group relative overflow-hidden border-2 border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-500 ease-out card-hover">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="p-5 sm:p-6">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <span className="text-lg sm:text-xl">Post a Job</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 sm:p-6 pt-0">
                <p className="text-sm sm:text-base text-[#64748B] dark:text-gray-400 mb-4">
                  Create a comprehensive job posting to attract top talent. Our multi-step form guides
                  you through all the details.
                </p>
                <Button className="w-full">Start Posting</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/jobs/manage">
            <Card className="h-full group relative overflow-hidden border-2 border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-500 ease-out card-hover">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="p-5 sm:p-6">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <span className="text-lg sm:text-xl">Manage Jobs</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 sm:p-6 pt-0">
                <p className="text-sm sm:text-base text-[#64748B] dark:text-gray-400 mb-4">
                  View, edit, and manage all your job postings in one place. Track applications and
                  update job statuses.
                </p>
                <Button variant="outline" className="w-full">
                  Manage Jobs
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

    </div>
  );
}

export default function HireTalentsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <HireTalentsContent />
    </Suspense>
  );
}
