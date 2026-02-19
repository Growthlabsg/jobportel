import { InterviewType } from '@/lib/constants';

export interface Interview {
  id: string;
  applicationId: string;
  jobId: string;
  jobTitle: string;
  companyId: string;
  companyName: string;
  candidateId: string;
  candidateName?: string;
  candidateEmail?: string;
  interviewerId?: string;
  interviewerName?: string;
  interviewerEmail?: string;
  type: InterviewType;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';
  scheduledAt: string;
  duration: number; // in minutes
  location?: string;
  videoLink?: string;
  meetingLink?: string;
  notes?: string;
  feedback?: InterviewFeedback;
  reminders?: InterviewReminder[];
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewFeedback {
  id: string;
  interviewId: string;
  overallRating: number;
  technicalSkills: number;
  communication: number;
  problemSolving: number;
  culturalFit: number;
  strengths: string[];
  areasForImprovement: string[];
  recommendation: 'Strong Yes' | 'Yes' | 'Maybe' | 'No' | 'Strong No';
  notes: string;
  submittedBy: string;
  submittedAt: string;
}

export interface InterviewReminder {
  id: string;
  interviewId: string;
  type: 'Email' | 'SMS' | 'Push';
  scheduledFor: string;
  sent: boolean;
  sentAt?: string;
}

export interface InterviewSlot {
  id: string;
  interviewerId: string;
  startTime: string;
  endTime: string;
  duration: number;
  available: boolean;
  timezone: string;
}

export interface CreateInterviewData {
  applicationId: string;
  jobId: string;
  candidateId: string;
  interviewerId?: string;
  interviewerName?: string;
  interviewerEmail?: string;
  type: InterviewType;
  scheduledAt: string;
  duration: number;
  location?: string;
  videoLink?: string;
  meetingLink?: string;
  notes?: string;
}

export interface InterviewPreparation {
  id: string;
  interviewId: string;
  jobId: string;
  companyId: string;
  research: {
    companyInfo: string;
    jobDescription: string;
    keyRequirements: string[];
    companyValues: string[];
    recentNews: string[];
  };
  questions: {
    common: string[];
    technical: string[];
    behavioral: string[];
    companySpecific: string[];
  };
  answers: {
    question: string;
    answer: string;
    tips: string[];
  }[];
  practice: {
    mockInterviews: number;
    lastPracticeDate?: string;
  };
  checklist: {
    resume: boolean;
    portfolio: boolean;
    research: boolean;
    questions: boolean;
    attire: boolean;
    location: boolean;
    technology: boolean;
  };
}
