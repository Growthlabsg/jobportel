/**
 * Co-Founder Matching Platform Types
 */

export type ExperienceLevel = 'beginner' | 'intermediate' | 'expert';
export type Availability = 'full-time' | 'part-time' | 'weekends';
export type FundingStage = 'idea' | 'prototype' | 'mvp' | 'traction' | 'funding';
export type TeamSize = 'solo' | '2-3' | '4-5' | '6+';
export type CommitmentLevel = 'high' | 'medium' | 'low';
export type RiskTolerance = 'high' | 'medium' | 'low';
export type WorkStyle = 'collaborative' | 'independent' | 'leadership' | 'support';
export type CommunicationStyle = 'direct' | 'diplomatic' | 'analytical' | 'creative';
export type MatchQuality = 'excellent' | 'good' | 'fair' | 'poor';
export type IdeaStatus = 'committed' | 'exploring' | 'help-existing';
export type IdeaPreference = 'specific' | 'open' | 'no-preference';
export type TechnicalPreference = 'technical' | 'non-technical' | 'no-preference';
export type TimingPreference = 'match-only' | 'prefer-match' | 'no-preference';
export type LocationPreference = 'distance' | 'country' | 'region' | 'no-preference';
export type Importance = 'high' | 'medium' | 'low' | 'no-preference';

export interface CoFounderProfile {
  id: string;
  name: string;
  email: string;
  location: string;
  timezone?: string;
  languages: string[];
  experience: ExperienceLevel;
  availability: Availability;
  industry: string[];
  skills: string[];
  interests: string[];
  values: string[];
  goals: string[];
  fundingStage: FundingStage;
  teamSize: TeamSize;
  commitment: CommitmentLevel;
  riskTolerance: RiskTolerance;
  workStyle: WorkStyle;
  communication: CommunicationStyle;
  bio?: string;
  lookingFor?: string;
  achievements?: string[];
  education?: string;
  previousStartups: number;
  network: string[];
  linkedin?: string;
  github?: string;
  twitter?: string;
  portfolio?: string;
  videoIntroduction?: string;
  schedulingUrl?: string;
  instagram?: string;
  accomplishments?: string[];
  employmentHistory?: string[];
  technicalStatus: boolean;
  startupIdeaStatus?: IdeaStatus;
  companyName?: string;
  companyDescription?: string;
  progressDescription?: string;
  fundingRaised?: string;
  cofounderStatus: boolean;
  fullTimeTiming?: string;
  responsibilityAreas: string[];
  equityExpectations?: string;
  freeTimeDescription?: string;
  lifePathStory?: string;
  additionalInfo?: string;
  whatLookingFor?: string;
  ideaPreference?: IdeaPreference;
  ideaPreferenceImportance?: Importance;
  technicalPreference?: TechnicalPreference;
  technicalPreferenceImportance?: Importance;
  timingPreference?: TimingPreference;
  locationPreference?: LocationPreference;
  locationPreferenceImportance?: Importance;
  agePreference?: [number, number] | null;
  preferredResponsibilityAreas?: string[];
  interestMatchingPreference?: boolean;
  alertForNewMatches?: boolean;
  preferences: {
    ageRange: [number, number];
    experienceLevel: ExperienceLevel[];
    location: string[];
    availability: Availability[];
    skills: string[];
    values: string[];
  };
  compatibilityScores: Record<string, number>;
  lastActive: Date;
  isVerified: boolean;
  isPremium: boolean;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompatibilityBreakdown {
  skills: {
    complementary: string[];
    overlapping: string[];
    missing: string[];
  };
  values: {
    aligned: string[];
    conflicting: string[];
  };
  goals: {
    shared: string[];
    different: string[];
  };
  experience: {
    strengths: string[];
    gaps: string[];
  };
}

export interface CompatibilityMatch {
  profileId: string;
  score: number;
  factors: {
    skillsComplement: number;
    valuesAlignment: number;
    experienceMatch: number;
    locationMatch: number;
    availabilityMatch: number;
    commitmentMatch: number;
    industryMatch: number;
  };
}

export interface MatchResult {
  profile: CoFounderProfile;
  compatibilityScore: number;
  matchQuality: MatchQuality;
  breakdown: CompatibilityBreakdown;
  matchReasons: string[];
  detailedBreakdown: {
    skillFit: number;
    valueAlignment: number;
    goalAlignment: number;
    experienceFit: number;
    availabilityMatch: number;
    locationCompatibility: number;
    communicationStyle: number;
  };
}

export interface SavedProfile {
  profileId: string;
  savedAt: Date;
  notes?: string;
  tags?: string[];
  compatibilityScore?: number;
}

export interface ConnectionRequest {
  id: string;
  fromProfileId: string;
  toProfileId: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface Conversation {
  id: string;
  participants: string[];
  messages: Message[];
  lastMessageAt: Date;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  read: boolean;
}

export interface FilterOptions {
  minCompatibility?: number;
  location?: string[];
  experience?: ExperienceLevel[];
  availability?: Availability[];
  skills?: string[];
  values?: string[];
  industry?: string[];
  commitment?: CommitmentLevel[];
  languages?: string[];
  timezone?: string[];
  companyStage?: string[];
}

export type SortOption = 'best-matches' | 'recently-active' | 'nearby' | 'name-az';
export type ViewMode = 'card' | 'list';

export interface MatchingStats {
  totalMatches: number;
  excellentMatches: number;
  onlineNow: number;
  verifiedProfiles: number;
}
