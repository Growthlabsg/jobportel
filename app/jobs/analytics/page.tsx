'use client';

import { useState, Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { EmployerAnalytics } from '@/components/analytics/EmployerAnalytics';
import { JobSeekerAnalytics } from '@/components/analytics/JobSeekerAnalytics';
import {
  EmployerAnalytics as EmployerAnalyticsType,
  JobSeekerAnalytics as JobSeekerAnalyticsType,
  TimeRange,
} from '@/types/analytics';

// Mock data for development
const mockEmployerAnalytics: EmployerAnalyticsType = {
  companyId: '1',
  period: '30d',
  jobs: {
    total: 12,
    active: 8,
    paused: 2,
    closed: 2,
    totalViews: 12450,
    averageViewsPerJob: 1037.5,
    totalApplications: 342,
    averageApplicationsPerJob: 28.5,
    topPerformingJobs: [
      {
        jobId: '3',
        title: 'Senior Full Stack Developer',
        views: 3200,
        applications: 67,
        conversionRate: 2.09,
      },
    ],
  },
  applications: {
    total: 342,
    byStatus: [
      { status: 'Submitted', count: 342, percentage: 100 },
      { status: 'Reviewed', count: 156, percentage: 45.6 },
      { status: 'Shortlisted', count: 45, percentage: 13.2 },
      { status: 'Interviewing', count: 23, percentage: 6.7 },
      { status: 'Offered', count: 8, percentage: 2.3 },
    ],
    bySource: [
      { source: 'Platform', count: 280, percentage: 81.9 },
      { source: 'External', count: 62, percentage: 18.1 },
    ],
    averageTimeToReview: 24,
    averageTimeToHire: 14,
    conversionFunnel: [
      { stage: 'Applications', count: 342, conversionRate: 100 },
      { stage: 'Reviewed', count: 156, conversionRate: 45.6 },
      { stage: 'Shortlisted', count: 45, conversionRate: 13.2 },
      { stage: 'Interviewing', count: 23, conversionRate: 6.7 },
      { stage: 'Offered', count: 8, conversionRate: 2.3 },
    ],
  },
  candidates: {
    totalUnique: 298,
    averageMatchScore: 78,
    topSkills: [
      { skill: 'React', count: 145 },
      { skill: 'Node.js', count: 98 },
      { skill: 'TypeScript', count: 87 },
    ],
    demographics: {
      location: [
        { location: 'Singapore', count: 156 },
        { location: 'Remote', count: 98 },
        { location: 'London', count: 44 },
      ],
      experience: [
        { level: 'Senior', count: 89 },
        { level: 'Mid', count: 134 },
        { level: 'Junior', count: 75 },
      ],
    },
  },
  hiring: {
    positionsFilled: 8,
    averageTimeToFill: 14,
    costPerHire: 2500,
    offerAcceptanceRate: 87.5,
    retentionRate: 92,
  },
  engagement: {
    jobPostViews: 12450,
    companyProfileViews: 3456,
    applicationStarts: 456,
    applicationCompletions: 342,
    completionRate: 75,
  },
};

const mockJobSeekerAnalytics: JobSeekerAnalyticsType = {
  userId: 'user1',
  period: '30d',
  applications: {
    total: 24,
    submitted: 24,
    inReview: 8,
    interviews: 5,
    offers: 2,
    rejected: 6,
    conversionRate: 8.3,
    averageResponseTime: 48,
    byStatus: [
      { status: 'Submitted', count: 24 },
      { status: 'In Review', count: 8 },
      { status: 'Interviewing', count: 5 },
      { status: 'Offered', count: 2 },
      { status: 'Rejected', count: 6 },
    ],
    byMonth: [
      { month: 'Jan', count: 8 },
      { month: 'Feb', count: 10 },
      { month: 'Mar', count: 6 },
    ],
  },
  jobSearch: {
    jobsViewed: 156,
    jobsSaved: 23,
    jobsApplied: 24,
    searchQueries: 45,
    averageMatchScore: 78,
    topSearchedSkills: [
      { skill: 'React', count: 12 },
      { skill: 'TypeScript', count: 10 },
      { skill: 'Node.js', count: 8 },
    ],
    topSearchedCompanies: [
      { company: 'TechNova', count: 5 },
      { company: 'StartupX', count: 4 },
    ],
  },
  profile: {
    profileViews: 45,
    profileCompleteness: 85,
    skillsVerified: 8,
    portfolioViews: 23,
    recommendationsReceived: 3,
  },
  engagement: {
    timeSpent: 1240,
    activeDays: 18,
    mostActiveDay: 'Monday',
    mostActiveHour: 14,
  },
};

function AnalyticsContent() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="employer" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="employer">Employer Analytics</TabsTrigger>
            <TabsTrigger value="jobseeker">Job Seeker Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="employer">
            <EmployerAnalytics data={mockEmployerAnalytics} />
          </TabsContent>

          <TabsContent value="jobseeker">
            <JobSeekerAnalytics data={mockJobSeekerAnalytics} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
          </div>
        </div>
      }
    >
      <AnalyticsContent />
    </Suspense>
  );
}
