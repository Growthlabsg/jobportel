'use client';

import { useState, useEffect } from 'react';
import { JobManagementTable } from '@/components/employer/JobManagementTable';
import { Job, JobStatus } from '@/types/job';
import { useJobs } from '@/hooks/useJobs';
import { Button } from '@/components/ui/Button';
import { Plus, Settings } from 'lucide-react';
import Link from 'next/link';

export default function ManageJobsPage() {
  const [isMounted, setIsMounted] = useState(false);
  
  // Only run query after component mounts to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only call useJobs after component mounts to avoid SSR issues
  const { data, isLoading } = useJobs({}, isMounted);
  const [jobs, setJobs] = useState<Job[]>([]);

  // Update jobs when data changes
  useEffect(() => {
    if (data?.jobs) {
      setJobs(data.jobs);
    }
  }, [data?.jobs]);

  const handleView = (jobId: string) => {
    console.log('View job:', jobId);
    // Navigate to job details or open modal
  };

  const handleEdit = (jobId: string) => {
    // Navigate to edit page with job ID
    window.location.href = `/jobs/hire-talents?action=edit&id=${jobId}`;
  };

  const handleDelete = (jobId: string) => {
    if (confirm('Are you sure you want to delete this job?')) {
      setJobs((prev) => prev.filter((job) => job.id !== jobId));
      // Call API to delete
      console.log('Delete job:', jobId);
    }
  };

  const handleDuplicate = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      // Navigate to create page with job data
      console.log('Duplicate job:', jobId);
    }
  };

  const handleStatusChange = (jobId: string, status: JobStatus) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === jobId ? { ...job, status } : job))
    );
    // Call API to update status
    console.log('Update job status:', jobId, status);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F5F9] via-white to-[#F1F5F9] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Clean Header Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200/60 pt-20 lg:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-6 py-8 sm:py-12 max-w-7xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1E293B] dark:text-white mb-2">Manage Jobs</h1>
              <p className="text-sm sm:text-base text-[#64748B] dark:text-gray-400">View and manage all your job postings</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/jobs/settings">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </Link>
              <Link href="/jobs/hire-talents?action=new">
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Post New Job
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-6 py-8 sm:py-12 max-w-7xl">

        {!isMounted || isLoading ? (
          <div className="text-center py-12">
            <p className="text-[#64748B] dark:text-gray-400">Loading jobs...</p>
          </div>
        ) : (
          <JobManagementTable
            jobs={jobs}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>

    </div>
  );
}

// Force dynamic rendering to avoid SSR serialization issues
export const dynamic = 'force-dynamic';
