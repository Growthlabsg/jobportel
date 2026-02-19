'use client';

import { useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Job } from '@/types/job';
import { formatCurrency } from '@/lib/utils';
import { 
  CheckSquare, 
  Square,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  X,
  Send,
  FileText,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

// Mock jobs for bulk application
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Full Stack Developer',
    company: {
      id: '1',
      name: 'TechNova Solutions',
      logo: undefined,
    },
    location: 'Singapore',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    salary: {
      min: 8000,
      max: 12000,
      currency: 'USD',
    },
    description: 'We\'re looking for an experienced full stack developer...',
    requirements: ['5+ years experience', 'Strong in React and Node.js'],
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
    benefits: ['Health Insurance', 'Stock Options', 'Learning Budget'],
    remoteWork: 'Remote',
    visaSponsorship: true,
    featured: true,
    urgency: 'High',
    status: 'Published',
    matchScore: 95,
    applicationsCount: 15,
    viewsCount: 320,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Product Manager',
    company: {
      id: '2',
      name: 'GreenTech Solutions',
      logo: undefined,
    },
    location: 'Singapore',
    jobType: 'Full-time',
    experienceLevel: 'Mid',
    salary: {
      min: 7000,
      max: 10000,
      currency: 'USD',
    },
    description: 'Drive product strategy...',
    requirements: ['3+ years product management'],
    skills: ['Product Strategy', 'Agile', 'Analytics'],
    benefits: ['Health Insurance', 'Stock Options'],
    remoteWork: 'Hybrid',
    visaSponsorship: false,
    featured: false,
    urgency: 'Medium',
    status: 'Published',
    matchScore: 85,
    applicationsCount: 8,
    viewsCount: 156,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Frontend Developer',
    company: {
      id: '3',
      name: 'DesignHub',
      logo: undefined,
    },
    location: 'Singapore',
    jobType: 'Full-time',
    experienceLevel: 'Mid',
    salary: {
      min: 6000,
      max: 9000,
      currency: 'USD',
    },
    description: 'Join our frontend team...',
    requirements: ['3+ years React experience'],
    skills: ['React', 'TypeScript', 'Next.js'],
    benefits: ['Health Insurance', 'Flexible Work'],
    remoteWork: 'Remote',
    visaSponsorship: true,
    featured: false,
    urgency: 'Low',
    status: 'Published',
    matchScore: 88,
    applicationsCount: 12,
    viewsCount: 200,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function BulkApplyContent() {
  const [jobs] = useState<Job[]>(mockJobs);
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleJob = (jobId: string) => {
    const newSelected = new Set(selectedJobs);
    if (newSelected.has(jobId)) {
      newSelected.delete(jobId);
    } else {
      newSelected.add(jobId);
    }
    setSelectedJobs(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedJobs.size === jobs.length) {
      setSelectedJobs(new Set());
    } else {
      setSelectedJobs(new Set(jobs.map((j) => j.id)));
    }
  };

  const handleBulkApply = () => {
    if (selectedJobs.size === 0) {
      alert('Please select at least one job to apply.');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmApply = async () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowConfirmModal(false);
      alert(`Successfully applied to ${selectedJobs.size} job${selectedJobs.size > 1 ? 's' : ''}!`);
      setSelectedJobs(new Set());
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Bulk Apply</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Apply to multiple jobs at once with a single click
          </p>
        </div>

        {/* Info Card */}
        <Card className="border-blue-200 bg-blue-50 mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">How Bulk Apply Works</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Select multiple jobs you want to apply to</li>
                  <li>• Your saved resume and profile will be used for all applications</li>
                  <li>• You can customize cover letters for each job after applying</li>
                  <li>• Track all applications from your &quot;My Applications&quot; page</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selection Summary */}
        {selectedJobs.size > 0 && (
          <Card className="border-primary/20 bg-primary/5 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckSquare className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {selectedJobs.size} job{selectedJobs.size > 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedJobs(new Set())}>
                    Clear Selection
                  </Button>
                  <Button size="sm" onClick={handleBulkApply}>
                    <Send className="h-4 w-4 mr-2" />
                    Apply to Selected
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Jobs List */}
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Available Jobs</CardTitle>
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                {selectedJobs.size === jobs.length ? (
                  <>
                    <Square className="h-4 w-4 mr-2" />
                    Deselect All
                  </>
                ) : (
                  <>
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Select All
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {jobs.map((job) => {
                const isSelected = selectedJobs.has(job.id);
                return (
                  <div
                    key={job.id}
                    className={`p-6 hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => handleToggleJob(job.id)}
                        className="mt-1 flex-shrink-0"
                      >
                        {isSelected ? (
                          <CheckSquare className="h-5 w-5 text-primary" />
                        ) : (
                          <Square className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">{job.title}</h3>
                            <p className="text-sm font-semibold text-gray-600 mb-2">
                              {job.company.name}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{job.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{job.jobType}</span>
                              </div>
                              {job.salary && (
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  <span>
                                    {formatCurrency(job.salary.min, job.salary.currency)} - {formatCurrency(job.salary.max, job.salary.currency)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            {job.matchScore && (
                              <Badge variant="primary">
                                {job.matchScore}% Match
                              </Badge>
                            )}
                            {job.visaSponsorship && (
                              <Badge variant="success">Visa</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          {job.skills.slice(0, 4).map((skill, idx) => (
                            <Badge key={idx} variant="default" size="sm">
                              {skill}
                            </Badge>
                          ))}
                          {job.skills.length > 4 && (
                            <Badge variant="default" size="sm">
                              +{job.skills.length - 4} more
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2 mb-3">{job.description}</p>
                        <div className="flex items-center gap-2">
                          <Link href={`/jobs/find-startup-jobs?job=${job.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                          {isSelected && (
                            <Badge variant="success" size="sm">
                              Selected
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {jobs.length === 0 && (
          <Card className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-12 text-center">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No jobs available for bulk application.</p>
              <Link href="/jobs/find-startup-jobs">
                <Button>Browse Jobs</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Bulk Application"
        size="lg"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  You are about to apply to {selectedJobs.size} job{selectedJobs.size > 1 ? 's' : ''}:
                </p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {jobs
                    .filter((j) => selectedJobs.has(j.id))
                    .map((job) => (
                      <li key={job.id} className="flex items-center gap-2">
                        <span>•</span>
                        <span>
                          {job.title} at {job.company.name}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Your saved resume and profile will be used for all applications. You can customize
                  cover letters for each job after submitting.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmApply} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Applying...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Confirm & Apply
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function BulkApplyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <BulkApplyContent />
    </Suspense>
  );
}

