'use client';

import { useState } from 'react';
import { Application, ApplicationStatus } from '@/types/application';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { Eye, Download, Mail, Calendar, Search, Filter } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface ApplicationsTableProps {
  applications: Application[];
  onView: (applicationId: string) => void;
  onStatusChange: (applicationId: string, status: ApplicationStatus) => void;
  onDownloadResume: (applicationId: string) => void;
  onSendMessage: (applicationId: string) => void;
  onScheduleInterview: (applicationId: string) => void;
}

const getStatusColor = (status: ApplicationStatus) => {
  switch (status) {
    case 'Hired':
      return 'success';
    case 'Shortlisted':
    case 'Interviewing':
      return 'info';
    case 'Offered':
      return 'primary';
    case 'Rejected':
      return 'error';
    default:
      return 'default';
  }
};

export const ApplicationsTable = ({
  applications,
  onView,
  onStatusChange,
  onDownloadResume,
  onSendMessage,
  onScheduleInterview,
}: ApplicationsTableProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicant.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleView = (application: Application) => {
    // Navigate to detail page instead of modal
    window.location.href = `/jobs/applications/${application.id}`;
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | 'all')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Match Score
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredApplications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50 dark:bg-gray-800">
                  <td className="px-4 py-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{application.applicant.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{application.applicant.email}</div>
                      {application.applicant.phone && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">{application.applicant.phone}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{application.job.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{application.job.company.name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(application.createdAt)}
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={application.status}
                      onChange={(e) =>
                        onStatusChange(application.id, e.target.value as ApplicationStatus)
                      }
                      className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Interviewing">Interviewing</option>
                      <option value="Offered">Offered</option>
                      <option value="Hired">Hired</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-4 py-4">
                    {application.matchScore ? (
                      <Badge variant="info" size="sm">
                        {application.matchScore}%
                      </Badge>
                    ) : (
                      <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(application)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="View"
                      >
                        <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      {application.applicant.resume && (
                        <button
                          onClick={() => onDownloadResume(application.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Download Resume"
                        >
                          <Download className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      )}
                      <button
                        onClick={() => onSendMessage(application.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Send Message"
                      >
                        <Mail className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button
                        onClick={() => onScheduleInterview(application.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Schedule Interview"
                      >
                        <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No applications found</p>
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <Modal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          title={`Application from ${selectedApplication.applicant.name}`}
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email: {selectedApplication.applicant.email}</p>
              {selectedApplication.applicant.phone && (
                <p className="text-sm text-gray-600 dark:text-gray-400">Phone: {selectedApplication.applicant.phone}</p>
              )}
              {selectedApplication.linkedin && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  LinkedIn: <a href={selectedApplication.linkedin} className="text-primary hover:underline">{selectedApplication.linkedin}</a>
                </p>
              )}
              {selectedApplication.github && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  GitHub: <a href={selectedApplication.github} className="text-primary hover:underline">{selectedApplication.github}</a>
                </p>
              )}
            </div>
            {selectedApplication.coverLetter && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Cover Letter</h3>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {selectedApplication.coverLetter}
                </p>
              </div>
            )}
            {selectedApplication.expectedSalary && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Expected Salary</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedApplication.expectedSalary}</p>
              </div>
            )}
            {selectedApplication.availabilityDate && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Availability Date</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(selectedApplication.availabilityDate)}
                </p>
              </div>
            )}
            {selectedApplication.noticePeriod && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Notice Period</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedApplication.noticePeriod}</p>
              </div>
            )}
            {selectedApplication.additionalInfo && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Additional Information</h3>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {selectedApplication.additionalInfo}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

