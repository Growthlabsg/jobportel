'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Scale, 
  X, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Minus,
  DollarSign,
  MapPin,
  Clock,
  Building,
  TrendingUp,
} from 'lucide-react';
import { Job } from '@/types/job';

interface JobComparisonProps {
  jobs?: Job[];
  maxCompare?: number;
}

export function JobComparison({ jobs = [], maxCompare = 3 }: JobComparisonProps) {
  const [selectedJobs, setSelectedJobs] = useState<Job[]>(jobs.slice(0, maxCompare));

  const addJob = (job: Job) => {
    if (selectedJobs.length < maxCompare && !selectedJobs.find(j => j.id === job.id)) {
      setSelectedJobs([...selectedJobs, job]);
    }
  };

  const removeJob = (jobId: string) => {
    setSelectedJobs(selectedJobs.filter(j => j.id !== jobId));
  };

  const comparisonFields = [
    { label: 'Company', key: 'company' as const, icon: Building },
    { label: 'Title', key: 'title' as const, icon: TrendingUp },
    { label: 'Location', key: 'location' as const, icon: MapPin },
    { label: 'Type', key: 'jobType' as const, icon: Clock },
    { label: 'Experience', key: 'experienceLevel' as const, icon: TrendingUp },
    { label: 'Salary', key: 'salary' as const, icon: DollarSign },
    { label: 'Remote Work', key: 'remoteWork' as const, icon: MapPin },
    { label: 'Visa Sponsorship', key: 'visaSponsorship' as const, icon: CheckCircle2 },
    { label: 'Benefits', key: 'benefits' as const, icon: CheckCircle2 },
    { label: 'Skills Required', key: 'skills' as const, icon: TrendingUp },
  ];

  const renderFieldValue = (job: Job, field: typeof comparisonFields[number]['key']) => {
    switch (field) {
      case 'company':
        return job.company.name;
      case 'title':
        return job.title;
      case 'location':
        return job.location;
      case 'jobType':
        return job.jobType;
      case 'experienceLevel':
        return job.experienceLevel;
      case 'salary':
        return job.salary 
          ? `${job.salary.currency} ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}`
          : 'Not specified';
      case 'remoteWork':
        return job.remoteWork;
      case 'visaSponsorship':
        return job.visaSponsorship ? (
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        ) : (
          <XCircle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        );
      case 'benefits':
        return (
          <div className="flex flex-wrap gap-1">
            {job.benefits.slice(0, 3).map((benefit, idx) => (
                      <Badge key={idx} variant="default" className="text-xs">
                        {benefit}
                      </Badge>
            ))}
            {job.benefits.length > 3 && (
                      <Badge variant="default" className="text-xs">
                        +{job.benefits.length - 3} more
                      </Badge>
            )}
          </div>
        );
      case 'skills':
        return (
          <div className="flex flex-wrap gap-1">
            {job.skills.slice(0, 4).map((skill, idx) => (
                      <Badge key={idx} variant="default" className="text-xs">
                        {skill}
                      </Badge>
            ))}
            {job.skills.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{job.skills.length - 4} more
              </Badge>
            )}
          </div>
        );
      default:
        return '-';
    }
  };

  if (selectedJobs.length === 0) {
    return (
      <Card className="p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
        <Scale className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Jobs Selected</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Select up to {maxCompare} jobs to compare side-by-side
        </p>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Jobs to Compare
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl">
            <Scale className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Job Comparison</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Compare {selectedJobs.length} of {maxCompare} jobs
            </p>
          </div>
        </div>
        {selectedJobs.length < maxCompare && (
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Job
          </Button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200 dark:border-gray-700">
              <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Criteria</th>
              {selectedJobs.map((job) => (
                <th key={job.id} className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300 min-w-[200px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-900 dark:text-gray-100">{job.title}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{job.company.name}</div>
                    </div>
                    <button
                      onClick={() => removeJob(job.id)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonFields.map((field, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 dark:bg-gray-800">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <field.icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">{field.label}</span>
                  </div>
                </td>
                {selectedJobs.map((job) => (
                  <td key={job.id} className="p-3">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {renderFieldValue(job, field.key)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Select up to {maxCompare} jobs to compare
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setSelectedJobs([])}>
            Clear All
          </Button>
          <Button size="sm">
            Save Comparison
          </Button>
        </div>
      </div>
    </Card>
  );
}

