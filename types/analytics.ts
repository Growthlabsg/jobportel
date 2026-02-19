export type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all';

export interface TrendData {
  date: string;
  value: number;
}

export interface JobSeekerAnalytics {
  userId: string;
  period: '7d' | '30d' | '90d' | '1y' | 'all';
  applications: {
    total: number;
    submitted: number;
    inReview: number;
    interviews: number;
    offers: number;
    rejected: number;
    conversionRate: number;
    averageResponseTime: number; // in hours
    byStatus: {
      status: string;
      count: number;
    }[];
    byMonth: {
      month: string;
      count: number;
    }[];
  };
  jobSearch: {
    jobsViewed: number;
    jobsSaved: number;
    jobsApplied: number;
    searchQueries: number;
    averageMatchScore: number;
    topSearchedSkills: {
      skill: string;
      count: number;
    }[];
    topSearchedCompanies: {
      company: string;
      count: number;
    }[];
  };
  profile: {
    profileViews: number;
    profileCompleteness: number;
    skillsVerified: number;
    portfolioViews: number;
    recommendationsReceived: number;
  };
  engagement: {
    timeSpent: number; // in minutes
    activeDays: number;
    mostActiveDay: string;
    mostActiveHour: number;
  };
}

export interface EmployerAnalytics {
  companyId: string;
  period: '7d' | '30d' | '90d' | '1y' | 'all';
  jobs: {
    total: number;
    active: number;
    paused: number;
    closed: number;
    totalViews: number;
    averageViewsPerJob: number;
    totalApplications: number;
    averageApplicationsPerJob: number;
    topPerformingJobs: {
      jobId: string;
      title: string;
      views: number;
      applications: number;
      conversionRate: number;
    }[];
  };
  applications: {
    total: number;
    byStatus: {
      status: string;
      count: number;
      percentage: number;
    }[];
    bySource: {
      source: string;
      count: number;
      percentage: number;
    }[];
    averageTimeToReview: number; // in hours
    averageTimeToHire: number; // in days
    conversionFunnel: {
      stage: string;
      count: number;
      conversionRate: number;
    }[];
  };
  candidates: {
    totalUnique: number;
    averageMatchScore: number;
    topSkills: {
      skill: string;
      count: number;
    }[];
    demographics: {
      location: {
        location: string;
        count: number;
      }[];
      experience: {
        level: string;
        count: number;
      }[];
    };
  };
  hiring: {
    positionsFilled: number;
    averageTimeToFill: number; // in days
    costPerHire: number;
    offerAcceptanceRate: number;
    retentionRate: number;
  };
  engagement: {
    jobPostViews: number;
    companyProfileViews: number;
    applicationStarts: number;
    applicationCompletions: number;
    completionRate: number;
  };
}
