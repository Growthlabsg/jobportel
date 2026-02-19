import type {
  JobType,
  ExperienceLevel,
  Location,
  Currency,
} from '@/lib/constants';
import type { JobStatus } from '@/lib/constants';

export type { JobStatus };

export interface Job {
  id: string;
  title: string;
  company: {
    id: string;
    name: string;
    logo?: string;
    size?: string;
    fundingStage?: string;
    industry?: string;
  };
  teamCardId?: string; // Link to Build Teams section if job is posted by a team
  location: Location;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  salary?: {
    min: number;
    max: number;
    currency: Currency;
  };
  description: string;
  requirements: string[];
  skills: string[];
  benefits: string[];
  remoteWork: 'On-site' | 'Remote' | 'Hybrid';
  visaSponsorship?: boolean;
  featured: boolean;
  urgency: 'High' | 'Medium' | 'Low';
  status: JobStatus;
  jobCategory?: string;
  subCategory?: string;
  matchScore?: number;
  applicationsCount?: number;
  viewsCount?: number;
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  startDate?: string;
}

export interface JobFilters {
  search?: string;
  location?: Location[];
  jobType?: JobType[];
  experienceLevel?: ExperienceLevel[];
  salaryMin?: number;
  salaryMax?: number;
  remoteWork?: ('On-site' | 'Remote' | 'Hybrid')[];
  industry?: string[];
  companySize?: string[];
  fundingStage?: string[];
  skills?: string[];
  benefits?: string[];
  visaSponsorship?: boolean;
  featured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'recent' | 'salary' | 'company' | 'match';
  // Team/Startup filtering
  teamCardId?: string; // Filter jobs by team
  companyId?: string; // Filter jobs by company
  hasTeamCard?: boolean; // Filter for jobs that have teamCardId
}

export interface CreateJobData {
  title: string;
  companyId: string;
  department?: string;
  reportingStructure?: string;
  teamSize?: number;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  location: Location;
  remoteWork: 'On-site' | 'Remote' | 'Hybrid';
  workSchedule?: string;
  salary?: {
    min: number;
    max: number;
    currency: Currency;
  };
  equity?: string;
  stockOptions?: string;
  bonus?: string;
  description: string;
  requirements: string[];
  skills: string[];
  education?: string[];
  certifications?: string[];
  languages?: string[];
  benefits: string[];
  companyValues?: string;
  workEnvironment?: string;
  teamCulture?: string;
  growthOpportunities?: string;
  workAuthorization?: boolean;
  backgroundCheck?: boolean;
  drugTest?: boolean;
  securityClearance?: boolean;
  travelRequired?: boolean;
  visaSponsorship?: boolean;
  jobCategory?: string;
  subCategory?: string;
  applicationMethod: 'Platform' | 'External';
  applicationUrl?: string;
  applicationEmail?: string;
  interviewProcess?: string;
  timeline?: string;
  featured: boolean;
  urgency: 'High' | 'Medium' | 'Low';
  deadline?: string;
  startDate?: string;
}

export interface UpdateJobData extends Partial<CreateJobData> {
  id: string;
}

