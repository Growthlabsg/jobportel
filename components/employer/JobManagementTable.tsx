'use client';

import { useState } from 'react';
import { Job, JobStatus } from '@/types/job';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { Eye, Edit, Trash2, Copy, MoreVertical, Search } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface JobManagementTableProps {
  jobs: Job[];
  onView: (jobId: string) => void;
  onEdit: (jobId: string) => void;
  onDelete: (jobId: string) => void;
  onDuplicate: (jobId: string) => void;
  onStatusChange: (jobId: string, status: JobStatus) => void;
}

const getStatusColor = (status: JobStatus) => {
  switch (status) {
    case 'Published':
      return 'success';
    case 'Draft':
      return 'default';
    case 'Paused':
      return 'warning';
    case 'Closed':
      return 'error';
    case 'Archived':
      return 'default';
    default:
      return 'default';
  }
};

export const JobManagementTable = ({
  jobs,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onStatusChange,
}: JobManagementTableProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all');

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelectJob = (jobId: string) => {
    setSelectedJobs((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const selectAll = () => {
    if (selectedJobs.length === filteredJobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(filteredJobs.map((job) => job.id));
    }
  };

  const handleBulkAction = (action: 'pause' | 'close' | 'delete') => {
    selectedJobs.forEach((jobId) => {
      switch (action) {
        case 'pause':
          onStatusChange(jobId, 'Paused');
          break;
        case 'close':
          onStatusChange(jobId, 'Closed');
          break;
        case 'delete':
          onDelete(jobId);
          break;
      }
    });
    setSelectedJobs([]);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as JobStatus | 'all')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Status</option>
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
          <option value="Paused">Paused</option>
          <option value="Closed">Closed</option>
          <option value="Archived">Archived</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedJobs.length > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-primary">
            {selectedJobs.length} job{selectedJobs.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('pause')}
            >
              Pause
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('close')}
            >
              Close
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('delete')}
            >
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedJobs.length === filteredJobs.length && filteredJobs.length > 0}
                    onChange={selectAll}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Applications
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 dark:bg-gray-800">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedJobs.includes(job.id)}
                      onChange={() => toggleSelectJob(job.id)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{job.title}</div>
                      {job.salary && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formatCurrency(job.salary.min, job.salary.currency)} -{' '}
                          {formatCurrency(job.salary.max, job.salary.currency)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">{job.company.name}</td>
                  <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{job.location}</td>
                  <td className="px-4 py-4">
                    <select
                      value={job.status}
                      onChange={(e) => onStatusChange(job.id, e.target.value as JobStatus)}
                      className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                      <option value="Paused">Paused</option>
                      <option value="Closed">Closed</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                    {job.applicationsCount || 0}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{job.viewsCount || 0}</td>
                  <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(job.createdAt)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onView(job.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="View"
                      >
                        <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button
                        onClick={() => onEdit(job.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button
                        onClick={() => onDuplicate(job.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Duplicate"
                      >
                        <Copy className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button
                        onClick={() => onDelete(job.id)}
                        className="p-1 hover:bg-gray-100 rounded text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No jobs found</p>
          </div>
        )}
      </div>
    </div>
  );
};

