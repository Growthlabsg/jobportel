export interface Company {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  description: string;
  industry: string;
  size: string;
  fundingStage?: string;
  founded?: number;
  headquarters?: string;
  employees?: number;
  revenue?: string;
  benefits: string[];
  values: string[];
  culture?: string;
  techStack?: string[];
  locations: string[];
  remoteFriendly: boolean;
  visaSponsorship: boolean;
  rating?: {
    overall: number;
    culture: number;
    compensation: number;
    workLifeBalance: number;
    careerGrowth: number;
    management: number;
    totalReviews: number;
  };
  featured: boolean;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyReview {
  id: string;
  companyId: string;
  userId: string;
  userName: string;
  userRole?: string;
  userAvatar?: string;
  rating: {
    overall: number;
    culture: number;
    compensation: number;
    workLifeBalance: number;
    careerGrowth: number;
    management: number;
  };
  title: string;
  pros: string[];
  cons: string[];
  advice?: string;
  recommendation: 'Yes' | 'No' | 'Neutral';
  employmentStatus: 'Current' | 'Former';
  employmentDuration?: string;
  createdAt: string;
  helpful: number;
  verified: boolean;
}

export interface CompanyFilters {
  industry?: string[];
  size?: string[];
  fundingStage?: string[];
  remoteFriendly?: boolean;
  visaSponsorship?: boolean;
  minRating?: number;
  search?: string;
  page?: number;
  limit?: number;
}

