'use client';

import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { JobCard } from '@/components/jobs/JobCard';
import { Job } from '@/types/job';
import { useJobs } from '@/hooks/useJobs';
import { 
  Bookmark, 
  Trash2, 
  Share2, 
  Filter,
  Search,
  X,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Eye,
  CheckCircle2,
  Edit,
  Tag,
  FileText,
  Plus,
  Star,
} from 'lucide-react';
import { Textarea } from '@/components/ui/Textarea';
import Link from 'next/link';
import { useSavedJobs, useUnsaveJob, useUpdateSavedJobNotes } from '@/hooks/useSavedJobs';

interface SavedJobMetadata {
  id: string;
  notes?: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  appliedDate?: string;
  applicationStatus?: 'applied' | 'interview' | 'offer' | 'rejected';
  reminderDate?: string;
}

function SavedJobsContent() {
  const [isMounted, setIsMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'applied' | 'not-applied' | 'high-priority'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [editingJob, setEditingJob] = useState<string | null>(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  
  // Use platform API for saved jobs
  const { data: savedJobsData, isLoading, error } = useSavedJobs({ page: 1, limit: 100 });
  const unsaveMutation = useUnsaveJob();
  const updateNotesMutation = useUpdateSavedJobNotes();
  
  const savedJobs = savedJobsData?.items || [];
  const savedJobIds = savedJobs.map(sj => sj.jobId);
  
  // Convert saved jobs to metadata format for compatibility
  const jobMetadata: Record<string, SavedJobMetadata> = savedJobs.reduce((acc, savedJob) => {
    acc[savedJob.jobId] = {
      id: savedJob.id,
      notes: savedJob.notes,
      tags: [],
      priority: 'medium',
    };
    return acc;
  }, {} as Record<string, SavedJobMetadata>);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const saveJobMetadata = async (jobId: string, metadata: SavedJobMetadata) => {
    const savedJob = savedJobs.find(sj => sj.jobId === jobId);
    if (savedJob && metadata.notes !== undefined) {
      try {
        await updateNotesMutation.mutateAsync({ savedJobId: savedJob.id, notes: metadata.notes });
      } catch (error) {
        console.error('Error saving job metadata:', error);
      }
    }
  };

  const getAllTags = () => {
    const tags = new Set<string>();
    Object.values(jobMetadata).forEach(meta => {
      meta.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  };

  // Get jobs from saved jobs data (already includes job details)
  const savedJobList = savedJobs.map(sj => sj.job);

  // Filter saved jobs
  const filteredJobs = savedJobList.filter(job => {
    const matchesSearch = !searchQuery || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const meta = jobMetadata[job.id];
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'applied' && meta?.applicationStatus) ||
      (filterStatus === 'not-applied' && !meta?.applicationStatus) ||
      (filterStatus === 'high-priority' && meta?.priority === 'high');
    
    const matchesTag = selectedTag === 'all' || (meta?.tags.includes(selectedTag));
    
    return matchesSearch && matchesStatus && matchesTag;
  });

  const handleRemove = async (jobId: string) => {
    if (confirm('Are you sure you want to remove this saved job?')) {
      try {
        await unsaveMutation.mutateAsync(jobId);
      } catch (error) {
        alert('Failed to remove saved job. Please try again.');
      }
    }
  };

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to remove all saved jobs?')) {
      try {
        // Remove all saved jobs one by one
        await Promise.all(savedJobs.map(sj => unsaveMutation.mutateAsync(sj.jobId)));
      } catch (error) {
        alert('Failed to remove all saved jobs. Please try again.');
      }
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
        }).catch(() => {
          navigator.clipboard.writeText(jobUrl);
          alert('Job link copied to clipboard!');
        });
      } else {
        navigator.clipboard.writeText(jobUrl);
        alert('Job link copied to clipboard!');
      }
    }
  };

  const handleApply = (jobId: string) => {
    window.location.href = `/jobs/find-startup-jobs?job=${jobId}&action=apply`;
  };

  const handleView = (job: Job) => {
    window.location.href = `/jobs/find-startup-jobs?job=${job.id}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F5F9] via-white to-[#F1F5F9] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Clean Header Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200/60 pt-20 lg:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-6 py-8 sm:py-12 max-w-7xl">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-4 sm:mb-6">
              <Bookmark className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary">Saved Jobs</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1E293B] dark:text-white mb-3 sm:mb-4 gradient-text px-2">
              My Saved Jobs
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[#64748B] dark:text-gray-400 max-w-2xl mx-auto px-4">
              Manage your favorite job opportunities and track your applications
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-6 py-8 sm:py-12 max-w-7xl">
        {/* Clean Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-[#64748B] dark:text-gray-400 mb-2 uppercase tracking-wide">Total Saved</p>
                  <p className="text-3xl font-bold text-[#1E293B] dark:text-white">{savedJobs.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg">
                  <Bookmark className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-[#64748B] dark:text-gray-400 mb-2 uppercase tracking-wide">Available</p>
                  <p className="text-3xl font-bold text-[#1E293B] dark:text-white">{filteredJobs.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-success to-success-light text-white shadow-lg">
                  <Briefcase className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-[#64748B] dark:text-gray-400 mb-2 uppercase tracking-wide">Applied</p>
                  <p className="text-3xl font-bold text-[#1E293B] dark:text-white">0</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-info to-info-light text-white shadow-lg">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-[#64748B] dark:text-gray-400 mb-2 uppercase tracking-wide">Expired</p>
                  <p className="text-3xl font-bold text-[#1E293B] dark:text-white">0</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-destructive to-destructive-light text-white shadow-lg">
                  <X className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clean Filters and Search */}
        <Card className="border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800 mb-6">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search saved jobs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All Jobs</option>
                  <option value="applied">Applied</option>
                  <option value="not-applied">Not Applied</option>
                  <option value="high-priority">High Priority</option>
                </select>
                {getAllTags().length > 0 && (
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-gray-900 dark:text-gray-100"
                  >
                    <option value="all">All Tags</option>
                    {getAllTags().map((tag) => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                )}
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1 bg-white dark:bg-gray-800">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    title="Grid View"
                  >
                    <Briefcase className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    title="List View"
                  >
                    <Filter className="h-4 w-4" />
                  </button>
                </div>
                {savedJobs.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={handleClearAll}
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Saved Jobs List */}
        {!isMounted ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <Card className="border-2 border-gray-200 text-center py-12">
            <CardContent>
              <Bookmark className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {savedJobs.length === 0 ? 'No Saved Jobs Yet' : 'No Jobs Match Your Filters'}
              </h3>
              <p className="text-gray-600 mb-6">
                {savedJobs.length === 0
                  ? 'Start saving jobs you\'re interested in to view them here'
                  : 'Try adjusting your search or filter criteria'}
              </p>
              {savedJobs.length === 0 && (
                <Link href="/jobs/find-startup-jobs">
                  <Button size="lg">
                    <Search className="h-5 w-5 mr-2" />
                    Browse Jobs
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 lg:grid-cols-2 gap-5'
                : 'space-y-4'
            }
          >
            {filteredJobs.map((job) => (
              <Card
                key={job.id}
                className="border-2 border-gray-200 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group relative"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
                          {job.title}
                        </h3>
                        {job.featured && (
                          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-gray-600 mb-3">{job.company.name}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          <span className="font-medium">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="h-4 w-4" />
                          <span className="font-medium">{job.jobType}</span>
                        </div>
                        {job.salary && (
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="h-4 w-4" />
                            <span className="font-medium">
                              {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()} {job.salary.currency}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.slice(0, 3).map((skill, idx) => (
                          <Badge key={idx} variant="default" className="bg-primary/10 text-primary border-primary/20">
                            {skill}
                          </Badge>
                        ))}
                        {job.skills.length > 3 && (
                          <Badge variant="default" className="bg-gray-100 text-gray-600 dark:text-gray-400">
                            +{job.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                      {/* Metadata Display */}
                      {jobMetadata[job.id] && (
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {jobMetadata[job.id].priority && (
                            <Badge
                              variant="default"
                              className={
                                jobMetadata[job.id].priority === 'high'
                                  ? 'bg-red-100 text-red-800'
                                  : jobMetadata[job.id].priority === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }
                            >
                              {jobMetadata[job.id].priority} priority
                            </Badge>
                          )}
                          {jobMetadata[job.id].tags.map((tag) => (
                            <Badge key={tag} variant="default" className="bg-blue-100 text-blue-800">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                          {jobMetadata[job.id].applicationStatus && (
                            <Badge
                              variant="default"
                              className={
                                jobMetadata[job.id].applicationStatus === 'offer'
                                  ? 'bg-green-100 text-green-800'
                                  : jobMetadata[job.id].applicationStatus === 'interview'
                                  ? 'bg-blue-100 text-blue-800'
                                  : jobMetadata[job.id].applicationStatus === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }
                            >
                              {jobMetadata[job.id].applicationStatus}
                            </Badge>
                          )}
                        </div>
                      )}
                      {jobMetadata[job.id]?.notes && (
                        <p className="text-sm text-gray-600 italic mb-2 line-clamp-2">
                          {jobMetadata[job.id].notes}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingJob(job.id);
                          setShowNotesModal(true);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                        title="Edit notes & tags"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleRemove(job.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-lg text-red-600"
                        title="Remove from saved"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(job)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare(job.id)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApply(job.id)}
                      className="flex-1 bg-primary hover:bg-primary-dark"
                    >
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Notes & Tags Modal */}
        {showNotesModal && editingJob && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="border-2 border-gray-200 max-w-2xl w-full">
              <CardHeader>
                <CardTitle>Edit Job Details</CardTitle>
              </CardHeader>
              <CardContent>
                <JobMetadataForm
                  jobId={editingJob}
                  metadata={jobMetadata[editingJob] || { id: editingJob, tags: [], priority: 'medium' }}
                  onSave={(metadata) => {
                    saveJobMetadata(editingJob, metadata);
                    setShowNotesModal(false);
                    setEditingJob(null);
                  }}
                  onCancel={() => {
                    setShowNotesModal(false);
                    setEditingJob(null);
                  }}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function JobMetadataForm({
  jobId,
  metadata,
  onSave,
  onCancel,
}: {
  jobId: string;
  metadata: SavedJobMetadata;
  onSave: (metadata: SavedJobMetadata) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<SavedJobMetadata>(metadata);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
        <select
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
          className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Application Status</label>
        <select
          value={formData.applicationStatus || ''}
          onChange={(e) => setFormData({ ...formData, applicationStatus: e.target.value as any || undefined })}
          className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        >
          <option value="">Not Applied</option>
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            placeholder="Add tag"
            className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          <Button type="button" onClick={handleAddTag} variant="outline">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag) => (
            <Badge key={tag} variant="default" className="bg-blue-100 text-blue-800">
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-2 hover:text-red-600"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
        <textarea
          value={formData.notes || ''}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Add notes about this job..."
          rows={4}
          className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>
      <div className="flex gap-3 pt-4">
        <Button onClick={() => onSave(formData)} className="flex-1">
          Save
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';

export default function SavedJobsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading saved jobs...</p>
          </div>
        </div>
      }
    >
      <SavedJobsContent />
    </Suspense>
  );
}

