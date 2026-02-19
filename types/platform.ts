/**
 * Types for Growth Lab Main Platform Integration
 * These types align with the main Growth Lab platform structure
 */

// Main Platform User Account
export interface GrowthLabUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Profile Types (different profiles under one account)
export type ProfileType = 
  | 'job_management' 
  | 'job_seeker' 
  | 'sports' 
  | 'cofounder' 
  | 'investor' 
  | 'startup_owner'
  | 'mentor'
  | 'other';

export interface UserProfile {
  id: string;
  userId: string; // Reference to main Growth Lab user
  profileType: ProfileType;
  displayName: string;
  bio?: string;
  avatar?: string;
  isActive: boolean;
  isDefault: boolean;
  metadata?: Record<string, unknown>; // Profile-specific data
  createdAt: string;
  updatedAt: string;
}

// Job Management Profile (specific to jobs portal)
export interface JobManagementProfile extends UserProfile {
  profileType: 'job_management' | 'job_seeker';
  companyId?: string; // If employer
  jobSeekerData?: {
    resumeUrl?: string;
    portfolioUrl?: string;
    skills: string[];
    experienceLevel: string;
    preferredLocations: string[];
    salaryExpectations?: {
      min: number;
      max: number;
      currency: string;
    };
  };
  employerData?: {
    companyId: string;
    companyName: string;
    role: string; // e.g., 'HR Manager', 'Recruiter', 'Founder'
    permissions: string[]; // e.g., ['post_jobs', 'view_applications', 'manage_team']
  };
}

// Startup Directory Integration
export interface Startup {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description: string;
  industry: string;
  foundedYear?: number;
  headquarters: string;
  website: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  size: string; // e.g., '1-10', '11-50', '51-200'
  fundingStage?: string;
  totalFunding?: number;
  lastFundingDate?: string;
  investors?: string[];
  status: 'active' | 'inactive' | 'archived';
  // Accomplishments
  accomplishments: StartupAccomplishment[];
  // Team members
  teamMembers: TeamMember[];
  // Milestones
  milestones: Milestone[];
  // Jobs (synced from jobs portal)
  jobs: StartupJob[];
  // Metadata
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface StartupAccomplishment {
  id: string;
  startupId: string;
  title: string;
  description: string;
  category: 'award' | 'partnership' | 'product_launch' | 'funding' | 'milestone' | 'other';
  date: string;
  imageUrl?: string;
  linkUrl?: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  startupId: string;
  userId?: string; // If linked to Growth Lab user
  name: string;
  role: string;
  title: string;
  bio?: string;
  avatar?: string;
  linkedinUrl?: string;
  isFounder: boolean;
  joinedDate?: string;
  createdAt: string;
}

export interface Milestone {
  id: string;
  startupId: string;
  title: string;
  description: string;
  date: string;
  category: 'funding' | 'product' | 'partnership' | 'growth' | 'team' | 'other';
  imageUrl?: string;
  createdAt: string;
}

// Job synced to Startup Directory
export interface StartupJob {
  id: string; // Job ID from jobs portal
  startupId: string;
  title: string;
  jobType: string;
  location: string;
  remoteWork: 'On-site' | 'Remote' | 'Hybrid';
  experienceLevel: string;
  status: 'Published' | 'Draft' | 'Closed';
  applicationsCount?: number;
  viewsCount?: number;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface PlatformApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Authentication
export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface AuthUser {
  user: GrowthLabUser;
  profiles: UserProfile[];
  activeProfile?: UserProfile;
  token: AuthToken;
}

// ============================================
// Build Teams Section Types
// ============================================

// Team/Project Card
export interface TeamCard {
  id: string;
  name: string;
  slug: string;
  description: string;
  projectGoals: string;
  industry: string;
  stage: 'idea' | 'mvp' | 'early' | 'growth';
  founderId: string; // Growth Lab user ID
  founderName: string;
  founderAvatar?: string;
  
  // Team Members
  members: TeamMember[];
  openPositions: OpenPosition[];
  
  // Project Details
  requiredSkills: string[];
  preferredExperience: string[];
  commitmentLevel: 'part-time' | 'full-time' | 'flexible';
  equityOffered?: string;
  
  // Collaboration
  projectSpaceId?: string;
  chatEnabled: boolean;
  
  // Visibility & Status
  status: 'recruiting' | 'active' | 'on-hold' | 'completed';
  visibility: 'public' | 'private';
  featured: boolean;
  
  // Engagement Metrics
  viewsCount: number;
  applicationsCount: number;
  likesCount: number;
  
  // Hackathon/Competition
  hackathonId?: string;
  spotlightEligible: boolean;
  
  // Metadata
  tags: string[];
  location: string;
  remoteWork: 'on-site' | 'remote' | 'hybrid';
  createdAt: string;
  updatedAt: string;
  
  // Enhanced Features
  savedBy?: string[]; // User IDs who saved this team
  likedBy?: string[]; // User IDs who liked this team
  sharedCount?: number;
  trendingScore?: number; // Calculated based on views, likes, applications
  
  // Jobs Integration
  companyId?: string; // Link to company/startup in jobs portal
  postedJobs?: string[]; // Job IDs posted by this team
}

// Open Position
export interface OpenPosition {
  id: string;
  teamCardId: string;
  title: string;
  role: string; // e.g., 'CTO', 'CMO', 'Developer', 'Designer'
  description: string;
  requiredSkills: string[];
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  commitment: 'part-time' | 'full-time' | 'flexible';
  equityOffered?: string;
  status: 'open' | 'filled' | 'closed';
  applications: TeamApplication[];
  createdAt: string;
}

// Team Application
export interface TeamApplication {
  id: string;
  teamCardId: string;
  positionId?: string; // If applying for specific position
  applicantId: string;
  applicantName: string;
  applicantAvatar?: string;
  message: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  createdAt: string;
}

// Matchmaking Score
export interface MatchScore {
  teamCardId: string;
  userId: string;
  score: number; // 0-100
  reasons: string[]; // Why they match
  skillMatch: number;
  interestMatch: number;
  experienceMatch: number;
}

// Project Space (Collaboration)
export interface ProjectSpace {
  id: string;
  teamCardId: string;
  name: string;
  description: string;
  
  // Chat
  chatMessages: ChatMessage[];
  
  // Tasks
  tasks: ProjectTask[];
  
  // Files
  files: ProjectFile[];
  
  // Milestones
  milestones: Milestone[];
  
  createdAt: string;
  updatedAt: string;
}

// Chat Message
export interface ChatMessage {
  id: string;
  projectSpaceId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  attachments?: string[];
  createdAt: string;
}

// Project Task
export interface ProjectTask {
  id: string;
  projectSpaceId: string;
  title: string;
  description?: string;
  assignedTo?: string; // User ID
  assignedToName?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Project File
export interface ProjectFile {
  id: string;
  projectSpaceId: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedByName: string;
  createdAt: string;
}

// ============================================
// Hackathons & Competitions
// ============================================

export interface Hackathon {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  theme: string;
  organizer: string;
  organizerLogo?: string;
  
  // Dates
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  judgingDate?: string;
  
  // Prizes
  prizes: Prize[];
  totalPrizePool?: string;
  
  // Requirements
  teamSize: {
    min: number;
    max: number;
  };
  requiredSkills?: string[];
  preferredIndustries?: string[];
  
  // Status
  status: 'upcoming' | 'open' | 'in-progress' | 'judging' | 'completed';
  visibility: 'public' | 'private' | 'invite-only';
  
  // Participants
  registeredTeams: string[]; // Team Card IDs
  maxParticipants?: number;
  currentParticipants: number;
  
  // Judging
  judges?: Judge[];
  criteria?: JudgingCriteria[];
  
  // Spotlight
  spotlightEligible: boolean;
  featuredWinners?: string[]; // Team Card IDs
  
  // Metadata
  tags: string[];
  location: string;
  remoteParticipation: boolean;
  imageUrl?: string;
  bannerUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Prize {
  id: string;
  hackathonId: string;
  rank: number; // 1 = First, 2 = Second, etc.
  title: string; // e.g., "Grand Prize", "Best Innovation"
  amount?: string;
  description?: string;
  sponsor?: string;
}

export interface Judge {
  id: string;
  hackathonId: string;
  name: string;
  title: string;
  company?: string;
  avatar?: string;
  bio?: string;
  linkedinUrl?: string;
}

export interface JudgingCriteria {
  id: string;
  hackathonId: string;
  category: string;
  weight: number; // Percentage
  description: string;
}

export interface HackathonRegistration {
  id: string;
  hackathonId: string;
  teamCardId: string;
  teamName: string;
  registeredBy: string; // User ID
  registeredByName: string;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  submissionUrl?: string;
  pitchDeckUrl?: string;
  demoUrl?: string;
  registeredAt: string;
  updatedAt: string;
}

// ============================================
// AI Advisor
// ============================================

export interface AIAdvisorSession {
  id: string;
  userId: string;
  teamCardId?: string; // If related to a team
  type: 'idea-validation' | 'business-guidance' | 'market-analysis' | 'general';
  status: 'active' | 'completed' | 'archived';
  messages: AIAdvisorMessage[];
  createdAt: string;
  updatedAt: string;
  creditsUsed: number;
}

export interface AIAdvisorMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  analysisData?: AnalysisData; // For structured responses
  createdAt: string;
}

export interface AnalysisData {
  ideaScore?: number; // 0-100
  strengths?: string[];
  weaknesses?: string[];
  marketSize?: string;
  competition?: string[];
  recommendations?: string[];
  riskFactors?: string[];
  nextSteps?: string[];
}

export interface AIAdvisorPlan {
  id: string;
  name: string;
  price: number;
  credits: number; // Number of sessions/queries
  features: string[];
  popular?: boolean;
}

export interface MentorConnection {
  id: string;
  mentorId: string; // Reference to Network section mentor
  mentorName: string;
  mentorTitle: string;
  mentorAvatar?: string;
  teamCardId?: string;
  userId: string;
  connectionType: 'mentorship' | 'advisory' | 'consultation';
  status: 'pending' | 'active' | 'completed';
  createdAt: string;
}

