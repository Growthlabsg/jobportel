export type ProjectType = 'fixed-price' | 'hourly' | 'contest';
export type ProjectStatus = 'draft' | 'open' | 'in-progress' | 'completed' | 'cancelled';
export type ProposalStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';
export type PaymentStatus = 'pending' | 'in-escrow' | 'released' | 'refunded';
export type ExperienceLevel = 'entry' | 'intermediate' | 'expert';
export type DisputeStatus = 'none' | 'open' | 'in-review' | 'resolved' | 'closed';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type MembershipTier = 'basic' | 'plus' | 'business' | 'enterprise';
export type ContestStatus = 'open' | 'voting' | 'closed' | 'awarded';

export interface FreelancerProfile {
  id: string;
  userId: string;
  profileId: string;
  title: string;
  description: string;
  hourlyRate?: number;
  availability: 'full-time' | 'part-time' | 'as-needed';
  experienceLevel: ExperienceLevel;
  skills: string[];
  portfolio: PortfolioItem[];
  education: Education[];
  certifications: Certification[];
  languages: Language[];
  location?: string;
  timezone?: string;
  verified: boolean;
  verificationStatus: VerificationStatus;
  identityVerified: boolean;
  rating: number;
  totalReviews: number;
  totalEarnings: number;
  totalJobs: number;
  completionRate: number;
  jobSuccessScore: number; // 0-100, similar to Upwork's JSS
  responseTime?: string; // e.g., "within 1 hour"
  avatar?: string;
  coverImage?: string;
  connects: number; // Credits for submitting proposals
  membershipTier: MembershipTier;
  xp: number; // Experience points for gamification (Freelancer.com feature)
  level: number; // Level based on XP
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  url?: string;
  skills: string[];
  completedAt: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Language {
  language: string;
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
}

export interface Project {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  clientRating?: number;
  clientTotalJobs?: number;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  skills: string[];
  type: ProjectType;
  budget?: number; // For fixed-price projects
  hourlyRate?: {
    min?: number;
    max?: number;
  }; // For hourly projects
  estimatedHours?: number; // For hourly projects
  status: ProjectStatus;
  visibility: 'public' | 'private';
  proposalsCount: number;
  hiredFreelancers: number;
  location?: string;
  remote: boolean;
  attachments: string[];
  milestones?: Milestone[];
  paymentProtection: boolean; // Escrow enabled
  requiresVerification: boolean; // Only verified freelancers can apply
  connectsRequired: number; // Number of connects needed to submit proposal
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  featured: boolean;
  // Contest-specific fields (Freelancer.com feature)
  contestStatus?: ContestStatus;
  contestPrize?: number; // Total prize pool for contests
  contestWinners?: number; // Number of winners to select
  contestEntries?: ContestEntry[];
  contestEndDate?: string;
}

export interface ContestEntry {
  id: string;
  contestId: string;
  freelancerId: string;
  freelancer: {
    id: string;
    name: string;
    avatar?: string;
    title: string;
  };
  submission: {
    title: string;
    description: string;
    files: string[];
    images: string[];
  };
  status: 'submitted' | 'shortlisted' | 'winner' | 'loser';
  rating?: number;
  createdAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'paid' | 'disputed';
  paymentStatus: PaymentStatus;
  completedAt?: string;
  paidAt?: string;
  disputeId?: string;
}

export interface Proposal {
  id: string;
  projectId: string;
  freelancerId: string;
  freelancer: {
    id: string;
    name: string;
    avatar?: string;
    title: string;
    rating: number;
    totalReviews: number;
    jobSuccessScore?: number;
    verified: boolean;
  };
  coverLetter: string;
  proposedRate?: number; // For hourly projects
  proposedBudget?: number; // For fixed-price projects
  estimatedHours?: number; // For hourly projects
  estimatedCompletionDate: string;
  attachments: string[];
  status: ProposalStatus;
  connectsUsed: number; // Number of connects spent
  createdAt: string;
  updatedAt: string;
}

export interface Contract {
  id: string;
  projectId: string;
  clientId: string;
  freelancerId: string;
  freelancer: {
    id: string;
    name: string;
    avatar?: string;
  };
  type: ProjectType;
  rate?: number; // For hourly
  totalBudget?: number; // For fixed-price
  hourlyRate?: number; // For hourly projects
  estimatedHours?: number; // For hourly projects
  milestones?: Milestone[];
  status: 'active' | 'paused' | 'completed' | 'cancelled' | 'disputed';
  startDate: string;
  endDate?: string;
  totalPaid: number;
  totalInEscrow: number;
  paymentProtection: boolean;
  disputeStatus: DisputeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  contractId: string;
  projectId: string;
  reviewerId: string;
  reviewerType: 'client' | 'freelancer';
  revieweeId: string;
  rating: number; // 1-5
  comment?: string;
  categories: {
    communication?: number;
    quality?: number;
    timeliness?: number;
    professionalism?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Dispute {
  id: string;
  contractId: string;
  projectId: string;
  milestoneId?: string;
  initiatorId: string;
  initiatorType: 'client' | 'freelancer';
  reason: string;
  description: string;
  status: DisputeStatus;
  resolution?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeEntry {
  id: string;
  contractId: string;
  freelancerId: string;
  date: string;
  hours: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  screenshots?: string[];
  approvedAt?: string;
  approvedBy?: string;
  createdAt: string;
}

export interface ProjectFilters {
  search?: string;
  category?: string;
  subcategory?: string;
  skills?: string[];
  type?: ProjectType;
  budgetMin?: number;
  budgetMax?: number;
  hourlyRateMin?: number;
  hourlyRateMax?: number;
  experienceLevel?: ExperienceLevel;
  location?: string;
  remote?: boolean;
  status?: ProjectStatus;
  paymentProtection?: boolean;
  verifiedOnly?: boolean;
  sortBy?: 'newest' | 'oldest' | 'budget-high' | 'budget-low' | 'proposals';
  page?: number;
  limit?: number;
}

export interface FreelancerFilters {
  search?: string;
  skills?: string[];
  experienceLevel?: ExperienceLevel;
  hourlyRateMin?: number;
  hourlyRateMax?: number;
  location?: string;
  availability?: FreelancerProfile['availability'];
  verified?: boolean;
  identityVerified?: boolean;
  jobSuccessScoreMin?: number;
  ratingMin?: number;
  sortBy?: 'newest' | 'rating' | 'hourly-rate-low' | 'hourly-rate-high' | 'total-jobs' | 'job-success-score';
  page?: number;
  limit?: number;
}

export interface CreateProjectData {
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  skills: string[];
  type: ProjectType;
  budget?: number;
  hourlyRate?: {
    min?: number;
    max?: number;
  };
  estimatedHours?: number;
  location?: string;
  remote: boolean;
  attachments?: string[];
  milestones?: Omit<Milestone, 'id' | 'status' | 'completedAt' | 'paymentStatus' | 'disputeId'>[];
  paymentProtection?: boolean;
  requiresVerification?: boolean;
  connectsRequired?: number;
  expiresAt?: string;
  // Contest fields
  contestPrize?: number;
  contestWinners?: number;
  contestEndDate?: string;
}

export interface CreateProposalData {
  projectId: string;
  coverLetter: string;
  proposedRate?: number;
  proposedBudget?: number;
  estimatedHours?: number;
  estimatedCompletionDate: string;
  attachments?: string[];
}

export interface CreateFreelancerProfileData {
  title: string;
  description: string;
  hourlyRate?: number;
  availability: FreelancerProfile['availability'];
  experienceLevel: ExperienceLevel;
  skills: string[];
  location?: string;
  timezone?: string;
  languages?: Language[];
}

export interface CreateReviewData {
  contractId: string;
  rating: number;
  comment?: string;
  categories?: {
    communication?: number;
    quality?: number;
    timeliness?: number;
    professionalism?: number;
  };
}

export interface CreateDisputeData {
  contractId: string;
  milestoneId?: string;
  reason: string;
  description: string;
}
