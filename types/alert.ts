export type AlertFrequency = 'Daily' | 'Weekly' | 'Monthly';

export interface JobAlert {
  id: string;
  userId: string;
  name: string;
  keywords: string[];
  locations: string[];
  jobTypes: string[];
  experienceLevels?: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  remoteWork?: ('Remote' | 'Hybrid' | 'On-site')[];
  industries?: string[];
  skills?: string[];
  frequency: AlertFrequency;
  enabled: boolean;
  lastSent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAlertData {
  name: string;
  keywords: string[];
  locations: string[];
  jobTypes: string[];
  experienceLevels?: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  remoteWork?: ('Remote' | 'Hybrid' | 'On-site')[];
  industries?: string[];
  skills?: string[];
  frequency: AlertFrequency;
}

export interface AlertMatch {
  alertId: string;
  jobId: string;
  matchedAt: string;
  notified: boolean;
}

