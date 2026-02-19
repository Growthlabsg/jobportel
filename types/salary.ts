export interface SalaryData {
  role: string;
  location: string;
  experience: string;
  currency: string;
  percentiles: {
    p10: number;
    p25: number;
    p50: number; // median
    p75: number;
    p90: number;
  };
  average: number;
  min: number;
    max: number;
  sampleSize: number;
  lastUpdated: string;
}

export interface SalaryInsight {
  role: string;
  location: string;
  yourSalary?: number;
  marketAverage: number;
  marketMedian: number;
  percentile?: number;
  recommendation: 'Below Market' | 'At Market' | 'Above Market';
  negotiationTips: string[];
  comparableRoles: {
    role: string;
    averageSalary: number;
  }[];
}

export interface SalaryComparison {
  role: string;
  locations: {
    location: string;
    average: number;
    median: number;
    currency: string;
  }[];
  experienceLevels: {
    level: string;
    average: number;
    median: number;
  }[];
}

