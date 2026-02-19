'use client';

import { useState } from 'react';
import { Bookmark, Share2, Eye, CheckCircle2, Star, Mail, Linkedin, Twitter, Facebook, Copy, CheckCircle, MapPin, DollarSign, Building, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Job } from '@/types/job';
import { formatCurrency } from '@/lib/utils';
import { useStartup } from '@/hooks/useStartups';
import Link from 'next/link';
import { trackJobView } from '@/services/platform/analytics';

interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
  onView?: (jobId: string) => void;
  onSave?: (jobId: string) => void;
  onShare?: (jobId: string) => void;
  view?: 'grid' | 'list';
}

export const JobCard = ({ job, onApply, onView, onSave, onShare, view = 'grid' }: JobCardProps) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Fetch startup details if companyId exists
  const startupId = job.company?.id;
  const { data: startup, isLoading: startupLoading } = useStartup(startupId || null);
  
  // Use startup data if available, otherwise fall back to job.company
  const companyData = startup ? {
    ...job.company,
    name: startup.name,
    logo: startup.logo || job.company?.logo,
    description: startup.description,
    industry: startup.industry,
    size: startup.size,
    fundingStage: startup.fundingStage,
    headquarters: startup.headquarters,
    website: startup.website,
  } : job.company;

  // Get company initials for logo
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleShareClick = () => {
    setShowShareModal(true);
  };

  const handleShareVia = (platform: string) => {
    const jobUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/jobs/find-startup-jobs?job=${job.id}`
      : '';
    const text = `Check out this job: ${job.title} at ${companyData?.name || job.company.name}`;

    switch (platform) {
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(jobUrl)}`;
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(jobUrl)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}`, '_blank');
        break;
      case 'copy':
        if (typeof window !== 'undefined') {
          navigator.clipboard.writeText(jobUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
        break;
      default:
        if (onShare) {
          onShare(job.id);
        }
    }
    setShowShareModal(false);
  };

  // Determine match score color
  const getMatchColor = (score?: number): 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary' => {
    if (!score) return 'info';
    if (score >= 90) return 'success';
    if (score >= 70) return 'info';
    return 'warning';
  };

  // Determine priority color
  const getPriorityColor = (urgency: string): 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary' => {
    if (urgency === 'High') return 'error';
    if (urgency === 'Medium') return 'warning';
    return 'default';
  };

  if (view === 'list') {
    return (
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-primary/30 transition-all duration-300 group cursor-pointer transform hover:-translate-y-0.5">
        <div className="flex items-start gap-6">
          {/* Company Logo - Enhanced with Startup Data */}
          <div className="flex-shrink-0">
            {companyData?.logo ? (
              <img
                src={companyData.logo}
                alt={companyData.name}
                className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-primary via-primary-600 to-primary-dark rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                {getInitials(companyData?.name || job.company.name)}
              </div>
            )}
          </div>

          {/* Job Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{job.title}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSave?.(job.id)}
                      className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                      aria-label="Save job"
                    >
                      <Bookmark className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={handleShareClick}
                      className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                      aria-label="Share job"
                    >
                      <Share2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{companyData?.name || job.company.name}</p>
                  {startup && (
                    <Link href={`/jobs/companies/${startup.id}`} onClick={(e) => e.stopPropagation()}>
                      <Badge variant="outline" size="sm" className="hover:bg-primary/5 hover:border-primary transition-colors">
                        <Building className="h-3 w-3 mr-1" />
                        View Company
                      </Badge>
                    </Link>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </span>
                  {startup?.fundingStage && (
                    <Badge variant="info" size="sm">{startup.fundingStage}</Badge>
                  )}
                  {startup?.size && (
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {startup.size}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Job Info Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="default" size="sm">
                {job.jobType}
              </Badge>
              <Badge variant="default" size="sm">
                {job.experienceLevel}
              </Badge>
              {job.salary && (
                <Badge variant="default" size="sm">
                  {formatCurrency(job.salary.min, job.salary.currency)} -{' '}
                  {formatCurrency(job.salary.max, job.salary.currency)}
                </Badge>
              )}
            </div>

            {/* Match Score and Priority Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {job.matchScore && (
                <Badge variant={getMatchColor(job.matchScore)} size="sm">
                  {job.matchScore}% Match
                </Badge>
              )}
              <Badge variant={getPriorityColor(job.urgency)} size="sm">
                {job.urgency} Priority
              </Badge>
              {job.visaSponsorship && (
                <Badge variant="success" size="sm" className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Visa Sponsorship
                </Badge>
              )}
              {job.featured && (
                <Badge variant="warning" size="sm" className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Featured
                </Badge>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{job.description}</p>

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {job.skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {job.skills.length > 3 && (
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium">
                    +{job.skills.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Action Buttons - Enhanced */}
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  onApply?.(job.id);
                }} 
                size="md"
                className="font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Apply Now
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={(e) => {
                  e.stopPropagation();
                  trackJobView(job.id);
                  onView?.(job.id);
                }}
                className="flex items-center gap-2 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <Eye className="h-4 w-4" />
                View
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View (default) - Enhanced with better UI/UX
  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-2xl hover:border-primary/30 transition-all duration-300 relative h-full flex flex-col group cursor-pointer transform hover:-translate-y-1">
      {/* Top Right Icons - Enhanced */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave?.(job.id);
          }}
          className="p-2.5 hover:bg-primary/10 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
          aria-label="Save job"
        >
          <Bookmark className="h-4 w-4 text-gray-500 hover:text-primary transition-colors" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleShareClick();
          }}
          className="p-2.5 hover:bg-primary/10 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
          aria-label="Share job"
        >
          <Share2 className="h-4 w-4 text-gray-500 hover:text-primary transition-colors" />
        </button>
      </div>

      <div className="flex gap-5 flex-1">
        {/* Company Logo - Enhanced with Startup Data */}
        <div className="flex-shrink-0">
          {companyData?.logo ? (
            <img
              src={companyData.logo}
              alt={companyData.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-gray-200 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300"
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-primary via-primary-600 to-primary-dark rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
              {getInitials(companyData?.name || job.company.name)}
            </div>
          )}
        </div>

        {/* Job Details - Enhanced typography and spacing */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Job Title and Company - Enhanced */}
          <div className="mb-4 pr-12">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight group-hover:text-primary transition-colors duration-200">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{companyData?.name || job.company.name}</p>
              {startup && (
                <Link href={`/jobs/companies/${startup.id}`} onClick={(e) => e.stopPropagation()}>
                  <Badge variant="outline" size="sm" className="hover:bg-primary/5 hover:border-primary transition-colors">
                    <Building className="h-3 w-3 mr-1" />
                    View
                  </Badge>
                </Link>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <span className="font-medium">{job.location}</span>
              </span>
              {startup?.fundingStage && (
                <Badge variant="info" size="sm">{startup.fundingStage}</Badge>
              )}
              {startup?.size && (
                <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <Users className="h-3 w-3" />
                  {startup.size}
                </span>
              )}
            </div>
          </div>

          {/* Job Info Badges - Enhanced styling */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="default" size="sm" className="font-semibold bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 transition-colors">
              {job.jobType}
            </Badge>
            <Badge variant="default" size="sm" className="font-semibold bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 transition-colors">
              {job.experienceLevel}
            </Badge>
            {job.salary && (
              <Badge variant="default" size="sm" className="font-semibold bg-green-50 text-green-700 border-green-200 hover:bg-green-100 transition-colors">
                <DollarSign className="w-3 h-3 mr-1" />
                {formatCurrency(job.salary.min, job.salary.currency)} -{' '}
                {formatCurrency(job.salary.max, job.salary.currency)}
              </Badge>
            )}
          </div>

          {/* Match Score and Priority Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {job.matchScore && (
              <Badge variant={getMatchColor(job.matchScore)} size="sm" className="font-medium">
                {job.matchScore}% Match
              </Badge>
            )}
            <Badge variant={getPriorityColor(job.urgency)} size="sm" className="font-medium">
              {job.urgency} Priority
            </Badge>
            {job.visaSponsorship && (
              <Badge variant="success" size="sm" className="flex items-center gap-1 font-medium">
                <CheckCircle2 className="h-3 w-3" />
                Visa Sponsorship
              </Badge>
            )}
            {job.featured && (
              <Badge variant="warning" size="sm" className="flex items-center gap-1 font-medium">
                <Star className="h-3 w-3" />
                Featured
              </Badge>
            )}
          </div>

          {/* Description - Enhanced */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed flex-1">{job.description}</p>

          {/* Skills - Enhanced with better colors */}
          {job.skills && job.skills.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {job.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-primary/10 text-primary text-xs rounded-lg font-semibold border border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 3 && (
                <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-lg font-semibold border border-gray-200 dark:border-gray-700">
                  +{job.skills.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Action Buttons - Enhanced with better styling */}
          <div className="flex items-center gap-3 mt-auto pt-3 border-t border-gray-100">
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                onApply?.(job.id);
              }} 
              size="md" 
              className="flex-1 font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Apply Now
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={(e) => {
                e.stopPropagation();
                trackJobView(job.id);
                onView?.(job.id);
              }}
              className="flex items-center gap-2 px-4 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <Eye className="h-4 w-4" />
              View
            </Button>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Job"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{job.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{companyData?.name || job.company.name}</p>
            {startup?.industry && (
              <p className="text-xs text-gray-500 mt-1">{startup.industry}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => handleShareVia('email')}
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Email
            </Button>
            <Button
              variant="outline"
              onClick={() => handleShareVia('linkedin')}
              className="flex items-center gap-2"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </Button>
            <Button
              variant="outline"
              onClick={() => handleShareVia('twitter')}
              className="flex items-center gap-2"
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </Button>
            <Button
              variant="outline"
              onClick={() => handleShareVia('facebook')}
              className="flex items-center gap-2"
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </Button>
          </div>
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Input
                value={typeof window !== 'undefined' ? `${window.location.origin}/jobs/find-startup-jobs?job=${job.id}` : ''}
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => handleShareVia('copy')}
                className="flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
