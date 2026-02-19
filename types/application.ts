import type { ApplicationStatus } from '@/lib/constants';

export type { ApplicationStatus };

export interface Application {
  id: string;
  jobId: string;
  job: {
    id: string;
    title: string;
    company: {
      id: string;
      name: string;
      logo?: string;
    };
  };
  applicant: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    resume?: string;
    portfolio?: string;
    linkedin?: string;
    github?: string;
  };
  coverLetter?: string;
  resume?: string;
  portfolio?: string;
  linkedin?: string;
  github?: string;
  expectedSalary?: number;
  availabilityDate?: string;
  noticePeriod?: string;
  additionalInfo?: string;
  status: ApplicationStatus;
  matchScore?: number;
  notes?: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationData {
  jobId: string;
  coverLetter?: string;
  resume?: File | string;
  portfolio?: string;
  linkedin?: string;
  github?: string;
  expectedSalary?: number;
  availabilityDate?: string;
  noticePeriod?: string;
  additionalInfo?: string;
}

