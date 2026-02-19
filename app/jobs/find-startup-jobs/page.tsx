'use client';

import React, { useState, Suspense, useEffect } from 'react';
import { JobFilters } from '@/components/jobs/JobFilters';
import { JobCard } from '@/components/jobs/JobCard';
import { JobDetailsModal } from '@/components/jobs/JobDetailsModal';
import { ApplicationForm } from '@/components/jobs/ApplicationForm';
import { JobStatsCards } from '@/components/jobs/JobStatsCards';
import { ViewToggle } from '@/components/jobs/ViewToggle';
import { JobFilters as JobFiltersType, Job } from '@/types/job';
import { useJobs } from '@/hooks/useJobs';
import { ChevronDown, Filter, Plus, Search, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { JobRecommendations } from '@/components/job-seeker/JobRecommendations';
import { JobComparison } from '@/components/job-seeker/JobComparison';
import { getStartups } from '@/services/platform/startupDirectory';

function FindStartupJobsContent() {
  const [filters, setFilters] = useState<JobFiltersType>({
    sortBy: 'recent',
    page: 1,
    limit: 20,
  });
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Only run query after component mounts to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only call useJobs after component mounts to avoid SSR issues
  // Always pass consistent filters, but control when query is enabled
  const { data, isLoading, error, isError } = useJobs(
    filters,
    isMounted // Enable query only after mount
  );
  
  // Search startups if search query exists
  const [startupResults, setStartupResults] = useState<any[]>([]);
  useEffect(() => {
    const searchStartups = async () => {
      if (filters.search && filters.search.length > 2 && isMounted) {
        try {
          const startups = await getStartups(1, 50, filters.search);
          setStartupResults(startups.items || []);
        } catch (error) {
          console.error('Error searching startups:', error);
          setStartupResults([]);
        }
      } else {
        setStartupResults([]);
      }
    };
    
    searchStartups();
  }, [filters.search, isMounted]);

  // Calculate stats - show 0 initially to match server render, then update after mount
  // Use data directly if available, otherwise show 0
  const totalJobs = isMounted && !isLoading && data ? data.total : 0;
  const featuredJobs = isMounted && !isLoading && data ? data.jobs?.filter((j) => j.featured).length || 0 : 0;
  const remoteJobs = isMounted && !isLoading && data ? data.jobs?.filter((j) => j.remoteWork === 'Remote').length || 0 : 0;
  const visaJobs = isMounted && !isLoading && data ? data.jobs?.filter((j) => j.visaSponsorship).length || 0 : 0;

  const handleFilterChange = (newFilters: JobFiltersType) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleSortChange = (sortBy: string) => {
    setFilters((prev) => ({ ...prev, sortBy: sortBy as any }));
  };

  const handleView = (job: Job) => {
    setSelectedJob(job);
    setIsDetailsModalOpen(true);
  };

  const handleApply = (jobId: string) => {
    const job = data?.jobs.find((j) => j.id === jobId);
    if (job) {
      setSelectedJob(job);
      setIsDetailsModalOpen(false);
      setIsApplicationFormOpen(true);
    }
  };

  const handleApplicationSubmit = async (applicationData: any) => {
    // Here you would call the API to submit the application
    // await apiClient.post(`/jobs/${selectedJob?.id}/apply`, applicationData);
    alert('Application submitted successfully!');
  };

  const handleSave = async (jobId: string) => {
    try {
      const { saveJob, unsaveJob, isJobSaved } = await import('@/services/platform/savedJobs');
      const isSaved = await isJobSaved(jobId);
      
      if (isSaved) {
        const success = await unsaveJob(jobId);
        if (success) {
          alert('Job removed from favorites!');
        } else {
          alert('Failed to remove job. Please try again.');
        }
      } else {
        const success = await saveJob(jobId);
        if (success) {
          alert('Job saved to your favorites!');
        } else {
          alert('Failed to save job. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error saving job:', error);
      alert('Unable to save job. Please try again.');
    }
  };

  const handleShare = (jobId: string) => {
    if (typeof window !== 'undefined') {
      const jobUrl = `${window.location.origin}/jobs/find-startup-jobs?job=${jobId}`;
      if (navigator.share) {
        navigator.share({
          title: 'Check out this job',
          text: 'Check out this job opportunity!',
          url: jobUrl,
        }).catch((error) => {
          console.error('Error sharing:', error);
          // Fallback to clipboard
          navigator.clipboard.writeText(jobUrl);
          alert('Job link copied to clipboard!');
        });
      } else {
        navigator.clipboard.writeText(jobUrl);
        alert('Job link copied to clipboard!');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F5F9] via-white to-[#F1F5F9] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Clean Header Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200/60 pt-20 lg:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-6 py-8 sm:py-12 max-w-7xl">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-4 sm:mb-6">
              <Search className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary">Job Search</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1E293B] dark:text-white mb-3 sm:mb-4 gradient-text px-2">
              Find Your Dream Job
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[#64748B] dark:text-gray-400 max-w-2xl mx-auto px-4">
              Discover exciting opportunities at innovative startups and scale-ups worldwide. We welcome applications from any region.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-6 py-8 sm:py-12 max-w-7xl">
        {/* Enhanced Stats Cards */}
        <div className="mb-10">
          <JobStatsCards
            totalJobs={totalJobs}
            featuredJobs={featuredJobs}
            remoteJobs={remoteJobs}
            visaSponsorship={visaJobs}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Enhanced Filters Sidebar */}
          <aside
            className={`${
              showFilters ? 'block' : 'hidden'
            } lg:block w-full lg:w-80 flex-shrink-0`}
          >
            <Card className="sticky top-6 border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800 shadow-sm">
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <SlidersHorizontal className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#1E293B] dark:text-white">Filters</h2>
                  </div>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                    aria-label="Close filters"
                  >
                    <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                <JobFilters filters={filters} onFilterChange={handleFilterChange} />
              </div>
            </Card>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {/* Clean Controls Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm p-4 md:p-5 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Left Side - Filters Toggle & Sort */}
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden flex items-center gap-2"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4" />
                    {showFilters ? 'Hide' : 'Show'} Filters
                  </Button>
                  
                  <div className="relative flex-1 sm:flex-initial">
                    <label className="text-sm font-medium text-[#64748B] dark:text-gray-400 mr-2">Sort by:</label>
                    <select
                      value={filters.sortBy || 'recent'}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="salary_high_to_low">Salary (High to Low)</option>
                      <option value="company_az">Company (A-Z)</option>
                      <option value="match_score">Match Score</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Right Side - Results Count, View Toggle, Post Job */}
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                  <div className="text-sm font-medium text-[#64748B] dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-4 py-2 rounded-lg">
                    {!isMounted || isLoading ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : (
                      <>
                        <span className="text-primary font-bold text-lg">{data?.total || 0}</span>
                        <span className="ml-2">jobs found</span>
                      </>
                    )}
                  </div>
                  <ViewToggle view={viewMode} onViewChange={setViewMode} />
                  <Link href="/jobs/hire-talents?action=new">
                    <Button size="sm" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Post a Job
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Clean Loading State */}
            {(!isMounted || isLoading) && (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="border border-gray-200/60 dark:border-gray-700/60 animate-pulse">
                    <div className="p-5 sm:p-6">
                      <div className="flex gap-4">
                        <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-xl flex-shrink-0"></div>
                        <div className="flex-1 space-y-3">
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                          <div className="flex gap-2">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Clean Error State */}
            {isMounted && isError && (
              <Card className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                <div className="p-8 text-center">
                  <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="h-7 w-7 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-red-900 mb-2">Failed to Load Jobs</h3>
                  <p className="text-red-700 mb-4">We encountered an error while loading jobs. Please try again.</p>
                  {error instanceof Error && (
                    <p className="text-sm text-red-600 mt-2 font-mono bg-red-100 px-3 py-2 rounded inline-block">
                      {error.message}
                    </p>
                  )}
                  <Button
                    onClick={() => window.location.reload()}
                    className="mt-6"
                    variant="outline"
                  >
                    Reload Page
                  </Button>
                </div>
              </Card>
            )}

            {/* Startup Search Results */}
            {isMounted && startupResults.length > 0 && (
              <Card className="mb-8 border-2 border-primary/20">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <Search className="h-5 w-5 text-primary" />
                    Matching Startups ({startupResults.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {startupResults.slice(0, 6).map((startup) => (
                      <Link
                        key={startup.id}
                        href={`/jobs/companies/${startup.id}`}
                        className="p-4 border border-gray-200 rounded-lg hover:border-primary/30 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          {startup.logo && (
                            <img
                              src={startup.logo}
                              alt={startup.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{startup.name}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{startup.industry}</p>
                          </div>
                        </div>
                        {startup.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">{startup.description}</p>
                        )}
                      </Link>
                    ))}
                  </div>
                  {startupResults.length > 6 && (
                    <div className="mt-4 text-center">
                      <Link href={`/jobs/companies?search=${encodeURIComponent(filters.search || '')}`}>
                        <Button variant="outline">View All {startupResults.length} Startups</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* AI Recommendations Section */}
            {isMounted && !isLoading && !isError && data?.jobs && data.jobs.length > 0 && (
              <div className="mb-8">
                <JobRecommendations limit={3} />
              </div>
            )}

            {/* Enhanced Job Listings */}
            {isMounted && !isLoading && !isError && data?.jobs && data.jobs.length > 0 && (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 lg:grid-cols-2 gap-6'
                    : 'space-y-5'
                }
              >
                {data.jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    view={viewMode}
                    onApply={handleApply}
                    onView={() => handleView(job)}
                    onSave={handleSave}
                    onShare={handleShare}
                  />
                ))}
              </div>
            )}

            {/* Job Comparison Tool */}
            {isMounted && !isLoading && !isError && data?.jobs && data.jobs.length > 0 && (
              <div className="mt-8">
                <JobComparison jobs={data.jobs} maxCompare={3} />
              </div>
            )}

            {/* Enhanced Empty State */}
            {isMounted && !isLoading && !isError && data && (!data.jobs || data.jobs.length === 0) && (
              <Card className="border-2 border-gray-200 shadow-xl">
                <div className="p-12 md:p-16 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Search className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">No Jobs Found</h3>
                  <p className="text-lg text-gray-600 mb-2 max-w-md mx-auto font-medium">
                    We couldn&apos;t find any jobs matching your criteria.
                  </p>
                  <p className="text-sm text-gray-500 mb-8">
                    Try adjusting your filters or search terms to see more results.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => {
                        setFilters({
                          sortBy: 'recent',
                          page: 1,
                          limit: 20,
                        });
                      }}
                      variant="outline"
                      className="font-semibold"
                    >
                      Clear All Filters
                    </Button>
                    <Link href="/jobs">
                      <Button className="font-semibold">
                        Browse All Jobs
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            )}

            {/* Pagination - Future Enhancement */}
            {isMounted && !isLoading && !isError && data?.jobs && data.jobs.length > 0 && data.total > data.jobs.length && (
              <div className="mt-10 flex justify-center">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <div className="px-4 py-2 bg-primary/10 text-primary font-semibold rounded-lg">
                    Page 1
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Next
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          onApply={handleApply}
        />
      )}

      {/* Application Form Modal */}
      {selectedJob && (
        <ApplicationForm
          job={selectedJob}
          isOpen={isApplicationFormOpen}
          onClose={() => setIsApplicationFormOpen(false)}
          onSubmit={handleApplicationSubmit}
        />
      )}

      {/* Chat Button */}
    </div>
  );
}

// Force dynamic rendering to avoid SSR serialization issues with React Query
export const dynamic = 'force-dynamic';

export default function FindStartupJobsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading jobs...</p>
          </div>
        </div>
      }
    >
      <FindStartupJobsContent />
    </Suspense>
  );
}
