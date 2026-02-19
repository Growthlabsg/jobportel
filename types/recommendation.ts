import { Job } from './job';

export interface JobRecommendation extends Job {
  recommendationScore: number;
  matchReasons: string[];
  whyMatch: {
    skills: number;
    experience: number;
    location: number;
    salary: number;
    culture: number;
  };
}

export interface RecommendationPreferences {
  preferredLocations?: string[];
  preferredJobTypes?: string[];
  preferredRemoteWork?: ('On-site' | 'Remote' | 'Hybrid')[];
  minSalary?: number;
  maxSalary?: number;
  preferredIndustries?: string[];
  preferredCompanySizes?: string[];
  skills?: string[];
  experienceLevel?: string;
  mustHaveSkills?: string[];
  niceToHaveSkills?: string[];
}

