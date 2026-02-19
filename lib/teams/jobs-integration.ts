import { Job } from '@/types/job';
import { TeamCard } from '@/types/platform';
import { getJobs as getJobsFromPlatform } from '@/services/platform/jobs';

// Mock jobs data - fallback for development
const mockJobs: Job[] = [
  {
    id: 'job1',
    title: 'Senior Full-Stack Developer',
    company: {
      id: 'company1',
      name: 'EcoTrack',
      logo: 'https://via.placeholder.com/100',
      industry: 'Climate Tech',
    },
    teamCardId: '1', // Link to EcoTrack team
    location: 'Singapore',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    salary: {
      min: 8000,
      max: 12000,
      currency: 'USD',
    },
    description: 'Join our team building the next-generation carbon tracking platform.',
    requirements: ['5+ years experience', 'React/Node.js', 'TypeScript'],
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    benefits: ['Health insurance', 'Flexible work', 'Equity'],
    remoteWork: 'Hybrid',
    featured: true,
    urgency: 'High',
    status: 'Published',
    applicationsCount: 12,
    viewsCount: 245,
    createdAt: '2024-11-15T00:00:00Z',
    updatedAt: '2024-11-20T00:00:00Z',
  },
  {
    id: 'job2',
    title: 'UI/UX Designer',
    company: {
      id: 'company1',
      name: 'EcoTrack',
      industry: 'Climate Tech',
    },
    teamCardId: '1',
    location: 'Singapore',
    jobType: 'Part-time',
    experienceLevel: 'Mid',
    description: 'Design beautiful and intuitive interfaces for our sustainability platform.',
    requirements: ['3+ years experience', 'Figma', 'User research'],
    skills: ['Figma', 'User Research', 'Prototyping'],
    benefits: ['Flexible hours', 'Remote work'],
    remoteWork: 'Remote',
    featured: false,
    urgency: 'Medium',
    status: 'Published',
    applicationsCount: 8,
    viewsCount: 156,
    createdAt: '2024-11-10T00:00:00Z',
    updatedAt: '2024-11-18T00:00:00Z',
  },
  {
    id: 'job3',
    title: 'AI/ML Engineer',
    company: {
      id: 'company2',
      name: 'LearnFlow',
      industry: 'EdTech',
    },
    teamCardId: '2',
    location: 'Remote',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    salary: {
      min: 9000,
      max: 14000,
      currency: 'USD',
    },
    description: 'Build AI-powered learning algorithms that personalize education.',
    requirements: ['5+ years ML experience', 'Python', 'TensorFlow'],
    skills: ['Python', 'TensorFlow', 'Machine Learning', 'NLP'],
    benefits: ['Equity', 'Learning budget', 'Remote work'],
    remoteWork: 'Remote',
    featured: true,
    urgency: 'High',
    status: 'Published',
    applicationsCount: 25,
    viewsCount: 389,
    createdAt: '2024-11-12T00:00:00Z',
    updatedAt: '2024-11-19T00:00:00Z',
  },
];

/**
 * Get jobs posted by a specific team
 * Fetches from jobs API and filters by teamCardId
 */
export async function getJobsForTeam(teamCardId: string): Promise<Job[]> {
  try {
    // Try to fetch from jobs API
    if (typeof window !== 'undefined') {
      const response = await getJobsFromPlatform({
        teamCardId, // Filter by team
        limit: 100,
      });
      
      if (response && response.items) {
        return response.items.filter((job) => job.teamCardId === teamCardId);
      }
    }
    
    // Fallback to mock data
    return mockJobs.filter((job) => job.teamCardId === teamCardId && job.status === 'Published');
  } catch (error) {
    console.error('Error fetching jobs for team:', error);
    // Fallback to mock data
    return mockJobs.filter((job) => job.teamCardId === teamCardId && job.status === 'Published');
  }
}

/**
 * Get jobs posted by a specific team (synchronous version for client components)
 */
export function getJobsForTeamSync(teamCardId: string): Job[] {
  return mockJobs.filter((job) => job.teamCardId === teamCardId && job.status === 'Published');
}

/**
 * Get team card for a job (if job is posted by a team)
 */
export function getTeamForJob(job: Job): TeamCard | null {
  if (!job.teamCardId) return null;
  
  // In production, fetch from API
  // For now, return null and let the component handle fetching
  return null;
}

/**
 * Get all jobs posted by teams
 * Fetches from jobs API and filters for jobs with teamCardId
 */
export async function getAllTeamJobs(): Promise<Job[]> {
  try {
    // Try to fetch from jobs API
    if (typeof window !== 'undefined') {
      const response = await getJobsFromPlatform({
        hasTeamCard: true, // Filter for jobs with teamCardId
        limit: 100,
      });
      
      if (response && response.items) {
        return response.items.filter((job) => job.teamCardId);
      }
    }
    
    // Fallback to mock data
    return mockJobs.filter((job) => job.teamCardId && job.status === 'Published');
  } catch (error) {
    console.error('Error fetching team jobs:', error);
    // Fallback to mock data
    return mockJobs.filter((job) => job.teamCardId && job.status === 'Published');
  }
}

