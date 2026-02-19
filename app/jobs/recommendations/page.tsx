'use client';

import { useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { JobCard } from '@/components/jobs/JobCard';
import { Job } from '@/types/job';
import { formatCurrency } from '@/lib/utils';
import { 
  Sparkles, 
  TrendingUp, 
  Star,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Filter,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

// Mock recommended jobs based on user profile
const mockRecommendedJobs: Job[] = [
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
    matchScore: 98,
    applicationsCount: 15,
    viewsCount: 320,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Lead Frontend Engineer',
    company: {
      id: '2',
      name: 'DesignHub',
      logo: undefined,
    },
    location: 'Singapore',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    salary: {
      min: 9000,
      max: 13000,
      currency: 'USD',
    },
    description: 'Lead our frontend engineering team...',
    requirements: ['6+ years experience', 'Expert in React'],
    skills: ['React', 'TypeScript', 'Next.js', 'GraphQL'],
    benefits: ['Health Insurance', 'Stock Options'],
    remoteWork: 'Hybrid',
    visaSponsorship: true,
    featured: true,
    urgency: 'High',
    status: 'Published',
    matchScore: 95,
    applicationsCount: 10,
    viewsCount: 280,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Full Stack Developer',
    company: {
      id: '3',
      name: 'StartupX',
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
    description: 'Join our growing team...',
    requirements: ['3+ years experience'],
    skills: ['React', 'Node.js', 'MongoDB'],
    benefits: ['Health Insurance', 'Flexible Work'],
    remoteWork: 'Remote',
    visaSponsorship: false,
    featured: false,
    urgency: 'Medium',
    status: 'Published',
    matchScore: 92,
    applicationsCount: 20,
    viewsCount: 450,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function RecommendationsContent() {
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>(mockRecommendedJobs);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      alert('Recommendations refreshed!');
    }, 1000);
  };

  const handleApply = (jobId: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = `/jobs/find-startup-jobs?job=${jobId}&action=apply`;
    }
  };

  const handleView = (job: Job) => {
    if (typeof window !== 'undefined') {
      window.location.href = `/jobs/find-startup-jobs?job=${job.id}`;
    }
  };

  const handleSave = (jobId: string) => {
    if (typeof window !== 'undefined') {
      try {
        const savedJobsStr = localStorage.getItem('savedJobs');
        let savedJobs: string[] = [];
        
        if (savedJobsStr && savedJobsStr.trim() !== '') {
          try {
            const parsed = JSON.parse(savedJobsStr);
            if (Array.isArray(parsed)) {
              savedJobs = parsed;
            }
          } catch (parseError) {
            console.error('Error parsing savedJobs:', parseError);
            localStorage.removeItem('savedJobs');
          }
        }
        
        if (!savedJobs.includes(jobId)) {
          savedJobs.push(jobId);
          localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
          alert('Job saved!');
        } else {
          alert('Job already saved!');
        }
      } catch (error) {
        console.error('Error accessing localStorage:', error);
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Job Recommendations</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Personalized job recommendations based on your profile and search history
            </p>
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Recommendation Info */}
        <Card className="border-primary/20 bg-primary/5 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  AI-Powered Recommendations
                </h2>
                <p className="text-gray-700 mb-4">
                  These jobs are matched to your profile based on your skills, experience level, 
                  location preferences, and past search behavior. The match score indicates how 
                  well each job aligns with your profile.
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-gray-700 dark:text-gray-300">Based on your skills: React, Node.js, TypeScript</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-gray-700 dark:text-gray-300">Location: Singapore</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700 dark:text-gray-300">Experience: Senior level</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Recommendations</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{recommendedJobs.length}</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">High Match (90%+)</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {recommendedJobs.filter((j) => (j.matchScore || 0) >= 90).length}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-green-100">
                <Star className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg. Match Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {Math.round(
                    recommendedJobs.reduce((sum, j) => sum + (j.matchScore || 0), 0) /
                      recommendedJobs.length
                  )}%
                </p>
              </div>
              <div className="p-2 rounded-lg bg-blue-100">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Remote Options</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {recommendedJobs.filter((j) => j.remoteWork === 'Remote' || j.remoteWork === 'Hybrid').length}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-purple-100">
                <MapPin className="h-5 w-5 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Jobs */}
        {recommendedJobs.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Recommended for You
              </h2>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="match">Sort by Match Score</option>
                  <option value="salary">Sort by Salary</option>
                  <option value="recent">Sort by Recent</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recommendedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  view="grid"
                  onApply={handleApply}
                  onView={() => handleView(job)}
                  onSave={handleSave}
                  onShare={handleShare}
                />
              ))}
            </div>
          </div>
        ) : (
          <Card className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">No Recommendations Yet</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Complete your profile and start searching for jobs to get personalized recommendations.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/jobs/resume-builder">
                  <Button>Complete Profile</Button>
                </Link>
                <Link href="/jobs/find-startup-jobs">
                  <Button variant="outline">Browse Jobs</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips Section */}
        <Card className="border-gray-200 mt-8">
          <CardHeader>
            <CardTitle>Improve Your Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Update Your Skills</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Add more skills to your profile to get better matches
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Set Location Preferences</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Specify your preferred work locations
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Browse More Jobs</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    The more you search, the better our recommendations get
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function RecommendationsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading recommendations...</p>
        </div>
      </div>
    }>
      <RecommendationsContent />
    </Suspense>
  );
}

