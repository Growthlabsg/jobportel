'use client';

import { useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Job } from '@/types/job';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Check, MapPin, Briefcase, DollarSign, Calendar, Users } from 'lucide-react';
import { trackJobView } from '@/services/platform/analytics';
import { TeamCardLink } from './TeamCardLink';

interface JobDetailsModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (jobId: string) => void;
}

export const JobDetailsModal = ({ job, isOpen, onClose, onApply }: JobDetailsModalProps) => {
  // Track job view when modal opens
  useEffect(() => {
    if (isOpen && job?.id) {
      trackJobView(job.id);
    }
  }, [isOpen, job?.id]);

  if (!job) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="w-20 h-20 bg-primary rounded-lg flex items-center justify-center text-white font-semibold text-2xl flex-shrink-0">
            {getInitials(job.company.name)}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{job.title}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">{job.company.name}</p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default" size="sm">
                {job.jobType}
              </Badge>
              <Badge variant="default" size="sm">
                {job.experienceLevel}
              </Badge>
              {job.matchScore && (
                <Badge variant="success" size="sm">
                  {job.matchScore}% Match
                </Badge>
              )}
              {job.visaSponsorship && (
                <Badge variant="success" size="sm" className="flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Visa Sponsorship
                </Badge>
              )}
              {job.featured && (
                <Badge variant="warning" size="sm">
                  ⭐ Featured
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Job Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{job.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-gray-400 dark:text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Type</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{job.remoteWork}</p>
            </div>
          </div>
          {job.salary && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gray-400 dark:text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Salary</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatCurrency(job.salary.min, job.salary.currency)} -{' '}
                  {formatCurrency(job.salary.max, job.salary.currency)}
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Posted</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {formatDate(job.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Job Description</h3>
          <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{job.description}</p>
        </div>

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Requirements</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <Badge key={index} variant="default" size="sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Benefits */}
        {job.benefits && job.benefits.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Benefits & Perks</h3>
            <div className="flex flex-wrap gap-2">
              {job.benefits.map((benefit, index) => (
                <Badge key={index} variant="info" size="sm">
                  {benefit}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Company Info */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">About {job.company.name}</h3>
          {job.company.industry && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              <span className="font-medium">Industry:</span> {job.company.industry}
            </p>
          )}
          {job.company.size && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              <span className="font-medium">Company Size:</span> {job.company.size}
            </p>
          )}
          {job.company.fundingStage && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">Funding Stage:</span> {job.company.fundingStage}
            </p>
          )}
        </div>

        {/* Team Card Link (if job is posted by a team) */}
        {job.teamCardId && (
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              This Job is Posted by a Team
            </h3>
            <TeamCardLink teamCardId={job.teamCardId} companyName={job.company.name} />
          </div>
        )}

        {/* Global Applications Note */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>🌍 Global Applications Welcome:</strong> We accept applications from candidates worldwide, regardless of location.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button onClick={() => onApply(job.id)} size="lg" className="flex-1">
            Apply Now
          </Button>
          <Button variant="outline" onClick={onClose} size="lg">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

