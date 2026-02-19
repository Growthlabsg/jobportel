import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api/client';
import { Job, JobFilters } from '@/types/job';
import { getJobs as getJobsFromPlatform } from '@/services/platform/jobs';

interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
}

export const useJobs = (filters: JobFilters, enabled: boolean = true) => {
  // Create a stable query key that doesn't include functions or circular refs
  // Ensure all values are serializable (no undefined, convert arrays to strings)
  const safeFilters = {
    sortBy: filters?.sortBy || 'recent',
    page: filters?.page || 1,
    limit: filters?.limit || 20,
    location: Array.isArray(filters?.location) ? filters.location.join(',') : (filters?.location || ''),
    jobType: Array.isArray(filters?.jobType) ? filters.jobType.join(',') : (filters?.jobType || ''),
    experienceLevel: Array.isArray(filters?.experienceLevel) ? filters.experienceLevel.join(',') : (filters?.experienceLevel || ''),
  };
  
  const queryKey = [
    'jobs',
    safeFilters.sortBy,
    safeFilters.page,
    safeFilters.limit,
    safeFilters.location,
    safeFilters.jobType,
    safeFilters.experienceLevel,
  ];
  
      return useQuery<JobsResponse>({
        queryKey,
        queryFn: async () => {
            // Check if we're on client side inside the queryFn
            if (typeof window === 'undefined') {
              return {
                jobs: [],
                total: 0,
                page: safeFilters.page,
                limit: safeFilters.limit,
              };
            }

            // Try to fetch from main platform first
            try {
              const platformResponse = await getJobsFromPlatform(filters);
              return {
                jobs: platformResponse.items,
                total: platformResponse.total,
                page: platformResponse.page,
                limit: platformResponse.limit,
              };
            } catch (error) {
              console.warn('Failed to fetch from platform, using mock data:', error);
            }

            // Fallback to mock data for development
      const mockJobs: Job[] = [
        {
          id: '1',
          title: 'AI Research Engineer',
          company: {
            id: '1',
            name: 'TechNova Solutions',
          },
          location: 'Singapore',
          jobType: 'Full-time',
          experienceLevel: 'Senior',
          salary: {
            min: 10000,
            max: 15000,
            currency: 'USD',
          },
          description: 'Join our AI research team to develop cutting-edge machine learning algorithms for enterprise workflow automation.',
          requirements: ['PhD in Computer Science', '5+ years ML experience'],
          skills: ['Machine Learning', 'Deep Learning', 'TensorFlow', 'Python', 'PyTorch'],
          benefits: ['Health Insurance', 'Stock Options'],
          remoteWork: 'Remote',
          visaSponsorship: true,
          featured: true,
          urgency: 'High',
          status: 'Published',
          matchScore: 95,
          applicationsCount: 12,
          viewsCount: 245,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Product Marketing Manager',
          company: {
            id: '2',
            name: 'GreenTech Solutions',
          },
          location: 'London',
          jobType: 'Full-time',
          experienceLevel: 'Mid',
          salary: {
            min: 6000,
            max: 9000,
            currency: 'GBP',
          },
          description: 'Drive product marketing strategy for our sustainable technology solutions targeting enterprise clients.',
          requirements: ['MBA preferred', '3+ years B2B marketing'],
          skills: ['Product Marketing', 'B2B Marketing', 'Analytics', 'Strategy', 'Content'],
          benefits: ['Health Insurance', 'Flexible Work'],
          remoteWork: 'Hybrid',
          visaSponsorship: false,
          featured: true,
          urgency: 'Medium',
          status: 'Published',
          matchScore: 82,
          applicationsCount: 8,
          viewsCount: 156,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'Senior Full Stack Developer',
          company: {
            id: '3',
            name: 'Tech Startup Inc.',
          },
          location: 'Singapore',
          jobType: 'Full-time',
          experienceLevel: 'Senior',
          salary: {
            min: 8000,
            max: 12000,
            currency: 'USD',
          },
          description: 'We\'re looking for an experienced full stack developer to join our growing team and help build innovative products.',
          requirements: ['5+ years experience', 'Strong in React and Node.js'],
          skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
          benefits: ['Health Insurance', 'Stock Options', 'Learning Budget'],
          remoteWork: 'Remote',
          visaSponsorship: true,
          featured: false,
          urgency: 'Low',
          status: 'Published',
          matchScore: 88,
          applicationsCount: 15,
          viewsCount: 320,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

        // Return mock data immediately (no delay for now to ensure it loads)
        // Ensure all data is serializable
        return {
          jobs: mockJobs.map(job => ({
            ...job,
            createdAt: typeof job.createdAt === 'string' ? job.createdAt : new Date().toISOString(),
            updatedAt: typeof job.updatedAt === 'string' ? job.updatedAt : new Date().toISOString(),
          })),
          total: mockJobs.length,
          page: safeFilters.page,
          limit: safeFilters.limit,
        };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnMount: true, // Ensure data loads on mount
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 1000,
    enabled: enabled && typeof window !== 'undefined', // Only enable on client when enabled prop is true
    // Prevent SSR serialization issues
    structuralSharing: false,
    // Ensure query runs immediately when enabled
    gcTime: 1000 * 60 * 5, // 5 minutes (formerly cacheTime)
    // Force immediate execution
    refetchOnReconnect: true,
  });
};
