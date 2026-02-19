'use client';

import { useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Job } from '@/types/job';
import { formatCurrency } from '@/lib/utils';
import { 
  X, 
  Plus, 
  Building, 
  MapPin, 
  Clock, 
  DollarSign, 
  Briefcase,
  CheckCircle,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';

// Mock jobs for comparison
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Full Stack Developer',
    company: {
      id: '1',
      name: 'TechNova Solutions',
      logo: undefined,
      size: '50-100',
      fundingStage: 'Series B',
      industry: 'Technology',
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
    title: 'Product Marketing Manager',
    company: {
      id: '2',
      name: 'GreenTech Solutions',
      logo: undefined,
      size: '20-50',
      fundingStage: 'Series A',
      industry: 'Green Technology',
    },
    location: 'London',
    jobType: 'Full-time',
    experienceLevel: 'Mid',
    salary: {
      min: 6000,
      max: 9000,
      currency: 'GBP',
    },
    description: 'Drive product marketing strategy...',
    requirements: ['MBA preferred', '3+ years B2B marketing'],
    skills: ['Product Marketing', 'B2B Marketing', 'Analytics'],
    benefits: ['Health Insurance', 'Flexible Work'],
    remoteWork: 'Hybrid',
    visaSponsorship: false,
    featured: true,
    urgency: 'Medium',
    status: 'Published',
    matchScore: 82,
    applicationsCount: 8,
    viewsCount: 156,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'AI Research Engineer',
    company: {
      id: '3',
      name: 'AI Innovations',
      logo: undefined,
      size: '100-200',
      fundingStage: 'Series C',
      industry: 'Artificial Intelligence',
    },
    location: 'Singapore',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    salary: {
      min: 10000,
      max: 15000,
      currency: 'USD',
    },
    description: 'Join our AI research team...',
    requirements: ['PhD in Computer Science', '5+ years ML experience'],
    skills: ['Machine Learning', 'Deep Learning', 'TensorFlow', 'Python'],
    benefits: ['Health Insurance', 'Stock Options', 'Research Budget'],
    remoteWork: 'On-site',
    visaSponsorship: true,
    featured: true,
    urgency: 'High',
    status: 'Published',
    matchScore: 88,
    applicationsCount: 12,
    viewsCount: 245,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function CompareJobsContent() {
  const [selectedJobs, setSelectedJobs] = useState<Job[]>([]);
  const [availableJobs] = useState<Job[]>(mockJobs);

  const handleAddJob = (job: Job) => {
    if (selectedJobs.length >= 3) {
      alert('You can compare up to 3 jobs at a time.');
      return;
    }
    if (selectedJobs.find((j) => j.id === job.id)) {
      alert('This job is already in the comparison.');
      return;
    }
    setSelectedJobs([...selectedJobs, job]);
  };

  const handleRemoveJob = (jobId: string) => {
    setSelectedJobs(selectedJobs.filter((job) => job.id !== jobId));
  };

  const handleClearAll = () => {
    if (confirm('Clear all jobs from comparison?')) {
      setSelectedJobs([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Compare Jobs</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Compare up to 3 jobs side-by-side to make the best decision
          </p>
        </div>

        {selectedJobs.length === 0 ? (
          <Card className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">No Jobs Selected</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Add jobs from the list below to start comparing. You can compare up to 3 jobs at a time.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {availableJobs.map((job) => (
                  <Card key={job.id} className="border-gray-200 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{job.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{job.company.name}</p>
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{job.location}</span>
                      </div>
                      {job.salary && (
                        <div className="flex items-center gap-2 mb-4">
                          <DollarSign className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {formatCurrency(job.salary.min, job.salary.currency)} - {formatCurrency(job.salary.max, job.salary.currency)}
                          </span>
                        </div>
                      )}
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => handleAddJob(job)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Compare
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Selected Jobs Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Comparing {selectedJobs.length} {selectedJobs.length === 1 ? 'Job' : 'Jobs'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {3 - selectedJobs.length} more {3 - selectedJobs.length === 1 ? 'job' : 'jobs'} can be added
                </p>
              </div>
              <div className="flex items-center gap-3">
                {selectedJobs.length < 3 && (
                  <Link href="/jobs/find-startup-jobs">
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add More Jobs
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" onClick={handleClearAll}>
                  Clear All
                </Button>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <Card className="border-gray-200 dark:border-gray-700">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="p-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 bg-gray-50 sticky left-0 z-10">
                            Criteria
                          </th>
                          {selectedJobs.map((job) => (
                            <th key={job.id} className="p-4 text-left min-w-[280px]">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                                    {job.title}
                                  </h3>
                                  <p className="text-sm text-gray-600 mb-2">{job.company.name}</p>
                                  {job.matchScore && (
                                    <Badge variant="primary" className="mb-2">
                                      {job.matchScore}% Match
                                    </Badge>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveJob(job.id)}
                                  className="ml-2"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {/* Salary */}
                        <tr className="border-b border-gray-100">
                          <td className="p-4 font-semibold text-gray-900 dark:text-gray-100 bg-gray-50 sticky left-0 z-10">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              Salary
                            </div>
                          </td>
                          {selectedJobs.map((job) => (
                            <td key={job.id} className="p-4">
                              {job.salary ? (
                                <div className="text-sm">
                                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                                    {formatCurrency(job.salary.min, job.salary.currency)} - {formatCurrency(job.salary.max, job.salary.currency)}
                                  </span>
                                  <span className="text-gray-500 ml-2">/month</span>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400 dark:text-gray-500">Not specified</span>
                              )}
                            </td>
                          ))}
                        </tr>

                        {/* Location */}
                        <tr className="border-b border-gray-100">
                          <td className="p-4 font-semibold text-gray-900 dark:text-gray-100 bg-gray-50 sticky left-0 z-10">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              Location
                            </div>
                          </td>
                          {selectedJobs.map((job) => (
                            <td key={job.id} className="p-4">
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-900 dark:text-gray-100">{job.location}</span>
                                <Badge variant="default" size="sm">
                                  {job.remoteWork}
                                </Badge>
                              </div>
                            </td>
                          ))}
                        </tr>

                        {/* Job Type */}
                        <tr className="border-b border-gray-100">
                          <td className="p-4 font-semibold text-gray-900 dark:text-gray-100 bg-gray-50 sticky left-0 z-10">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              Job Type
                            </div>
                          </td>
                          {selectedJobs.map((job) => (
                            <td key={job.id} className="p-4">
                              <span className="text-sm text-gray-900 dark:text-gray-100">{job.jobType}</span>
                            </td>
                          ))}
                        </tr>

                        {/* Experience Level */}
                        <tr className="border-b border-gray-100">
                          <td className="p-4 font-semibold text-gray-900 dark:text-gray-100 bg-gray-50 sticky left-0 z-10">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              Experience Level
                            </div>
                          </td>
                          {selectedJobs.map((job) => (
                            <td key={job.id} className="p-4">
                              <Badge variant="default" size="sm">
                                {job.experienceLevel}
                              </Badge>
                            </td>
                          ))}
                        </tr>

                        {/* Company Size */}
                        <tr className="border-b border-gray-100">
                          <td className="p-4 font-semibold text-gray-900 dark:text-gray-100 bg-gray-50 sticky left-0 z-10">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              Company Size
                            </div>
                          </td>
                          {selectedJobs.map((job) => (
                            <td key={job.id} className="p-4">
                              <span className="text-sm text-gray-900 dark:text-gray-100">
                                {job.company.size || 'Not specified'}
                              </span>
                            </td>
                          ))}
                        </tr>

                        {/* Funding Stage */}
                        <tr className="border-b border-gray-100">
                          <td className="p-4 font-semibold text-gray-900 dark:text-gray-100 bg-gray-50 sticky left-0 z-10">
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              Funding Stage
                            </div>
                          </td>
                          {selectedJobs.map((job) => (
                            <td key={job.id} className="p-4">
                              <span className="text-sm text-gray-900 dark:text-gray-100">
                                {job.company.fundingStage || 'Not specified'}
                              </span>
                            </td>
                          ))}
                        </tr>

                        {/* Visa Sponsorship */}
                        <tr className="border-b border-gray-100">
                          <td className="p-4 font-semibold text-gray-900 dark:text-gray-100 bg-gray-50 sticky left-0 z-10">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              Visa Sponsorship
                            </div>
                          </td>
                          {selectedJobs.map((job) => (
                            <td key={job.id} className="p-4">
                              {job.visaSponsorship ? (
                                <Badge variant="success" size="sm">Yes</Badge>
                              ) : (
                                <Badge variant="default" size="sm">No</Badge>
                              )}
                            </td>
                          ))}
                        </tr>

                        {/* Skills */}
                        <tr className="border-b border-gray-100">
                          <td className="p-4 font-semibold text-gray-900 dark:text-gray-100 bg-gray-50 sticky left-0 z-10">
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              Key Skills
                            </div>
                          </td>
                          {selectedJobs.map((job) => (
                            <td key={job.id} className="p-4">
                              <div className="flex flex-wrap gap-2">
                                {job.skills.slice(0, 5).map((skill, idx) => (
                                  <Badge key={idx} variant="default" size="sm">
                                    {skill}
                                  </Badge>
                                ))}
                                {job.skills.length > 5 && (
                                  <Badge variant="default" size="sm">
                                    +{job.skills.length - 5} more
                                  </Badge>
                                )}
                              </div>
                            </td>
                          ))}
                        </tr>

                        {/* Benefits */}
                        <tr className="border-b border-gray-100">
                          <td className="p-4 font-semibold text-gray-900 dark:text-gray-100 bg-gray-50 sticky left-0 z-10">
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              Benefits
                            </div>
                          </td>
                          {selectedJobs.map((job) => (
                            <td key={job.id} className="p-4">
                              <ul className="text-sm text-gray-700 space-y-1">
                                {job.benefits.map((benefit, idx) => (
                                  <li key={idx} className="flex items-center gap-2">
                                    <CheckCircle className="h-3 w-3 text-green-600" />
                                    {benefit}
                                  </li>
                                ))}
                              </ul>
                            </td>
                          ))}
                        </tr>

                        {/* Actions */}
                        <tr>
                          <td className="p-4 font-semibold text-gray-900 dark:text-gray-100 bg-gray-50 sticky left-0 z-10">
                            Actions
                          </td>
                          {selectedJobs.map((job) => (
                            <td key={job.id} className="p-4">
                              <div className="flex flex-col gap-2">
                                <Link href={`/jobs/find-startup-jobs?job=${job.id}`}>
                                  <Button size="sm" className="w-full">
                                    View Details
                                  </Button>
                                </Link>
                                <Link href={`/jobs/find-startup-jobs?job=${job.id}&action=apply`}>
                                  <Button variant="outline" size="sm" className="w-full">
                                    Apply Now
                                  </Button>
                                </Link>
                              </div>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Add More Jobs Section */}
            {selectedJobs.length < 3 && (
              <Card className="border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle>Add More Jobs to Compare</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {availableJobs
                      .filter((job) => !selectedJobs.find((j) => j.id === job.id))
                      .slice(0, 3 - selectedJobs.length)
                      .map((job) => (
                        <Card key={job.id} className="border-gray-200 hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">{job.title}</h3>
                            <p className="text-xs text-gray-600 mb-3">{job.company.name}</p>
                            <Button
                              size="sm"
                              className="w-full"
                              onClick={() => handleAddJob(job)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Link href="/jobs/find-startup-jobs">
                      <Button variant="outline">
                        Browse All Jobs
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CompareJobsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <CompareJobsContent />
    </Suspense>
  );
}

