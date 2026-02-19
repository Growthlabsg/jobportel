/**
 * Freelancer Platform API Service
 * Integrated with Main Growth Lab Platform
 */

import { 
  FreelancerProfile, 
  Project, 
  Proposal, 
  Contract,
  ProjectFilters,
  FreelancerFilters,
  CreateProjectData,
  CreateProposalData,
  CreateFreelancerProfileData,
} from '@/types/freelancer';
import { PlatformApiResponse, PaginatedResponse } from '@/types/platform';
import { getAuthToken, getActiveJobProfile } from './auth';

const MAIN_PLATFORM_BASE_URL = process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL || 'http://localhost:3001';
const FREELANCER_ENDPOINT = `${MAIN_PLATFORM_BASE_URL}/api/freelancer`;
const PROJECTS_ENDPOINT = `${MAIN_PLATFORM_BASE_URL}/api/projects`;
const PROPOSALS_ENDPOINT = `${MAIN_PLATFORM_BASE_URL}/api/proposals`;

/**
 * Get freelancer profile
 */
export async function getFreelancerProfile(freelancerId?: string): Promise<FreelancerProfile | null> {
  try {
    const token = getAuthToken();
    if (!token) {
      return null;
    }

    const profile = await getActiveJobProfile();
    if (!profile) {
      return null;
    }

    const endpoint = freelancerId 
      ? `${FREELANCER_ENDPOINT}/profiles/${freelancerId}`
      : `${FREELANCER_ENDPOINT}/profiles/me`;

    const response = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403 || response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch freelancer profile');
    }

    const data: PlatformApiResponse<FreelancerProfile> = await response.json();
    return data.data;
  } catch (error) {
    if (error instanceof Error && error.message !== 'Not authenticated') {
      console.error('Error fetching freelancer profile:', error);
    }
    return null;
  }
}

/**
 * Create or update freelancer profile
 */
export async function saveFreelancerProfile(profileData: CreateFreelancerProfileData): Promise<FreelancerProfile | null> {
  try {
    const token = getAuthToken();
    if (!token) {
      return null;
    }

    const profile = await getActiveJobProfile();
    if (!profile) {
      return null;
    }

    const response = await fetch(`${FREELANCER_ENDPOINT}/profiles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...profileData,
        profileId: profile.id,
      }),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return null;
      }
      throw new Error('Failed to save freelancer profile');
    }

    const data: PlatformApiResponse<FreelancerProfile> = await response.json();
    return data.data;
  } catch (error) {
    if (error instanceof Error && error.message !== 'Not authenticated') {
      console.error('Error saving freelancer profile:', error);
    }
    return null;
  }
}

/**
 * Search freelancers
 */
export async function searchFreelancers(filters: FreelancerFilters): Promise<PaginatedResponse<FreelancerProfile>> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('growthlab_token') : null;

    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.skills) {
      filters.skills.forEach(skill => params.append('skills', skill));
    }
    if (filters.experienceLevel) params.append('experienceLevel', filters.experienceLevel);
    if (filters.hourlyRateMin) params.append('hourlyRateMin', filters.hourlyRateMin.toString());
    if (filters.hourlyRateMax) params.append('hourlyRateMax', filters.hourlyRateMax.toString());
    if (filters.location) params.append('location', filters.location);
    if (filters.availability) params.append('availability', filters.availability);
    if (filters.verified !== undefined) params.append('verified', String(filters.verified));
    if (filters.ratingMin) params.append('ratingMin', filters.ratingMin.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    params.append('page', (filters.page || 1).toString());
    params.append('limit', (filters.limit || 20).toString());

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${FREELANCER_ENDPOINT}/profiles/search?${params}`, {
      headers,
    }).catch((fetchError) => {
      // Handle network errors
      console.warn('Network error searching freelancers:', fetchError);
      return null;
    });

    if (!response) {
      return {
        items: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      };
    }

    if (!response.ok) {
      if (response.status === 401 || response.status === 403 || response.status === 404) {
        return {
          items: [],
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 0,
        };
      }
      throw new Error('Failed to search freelancers');
    }

    const data: PlatformApiResponse<PaginatedResponse<FreelancerProfile>> = await response.json();
    return data.data;
  } catch (error) {
    if (error instanceof Error && error.message !== 'Not authenticated' && error.message !== 'Failed to fetch') {
      console.error('Error searching freelancers:', error);
    }
    return {
      items: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    };
  }
}

/**
 * Get projects
 */
export async function getProjects(filters: ProjectFilters): Promise<PaginatedResponse<Project>> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('growthlab_token') : null;

    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.subcategory) params.append('subcategory', filters.subcategory);
    if (filters.skills) {
      filters.skills.forEach(skill => params.append('skills', skill));
    }
    if (filters.type) params.append('type', filters.type);
    if (filters.budgetMin) params.append('budgetMin', filters.budgetMin.toString());
    if (filters.budgetMax) params.append('budgetMax', filters.budgetMax.toString());
    if (filters.hourlyRateMin) params.append('hourlyRateMin', filters.hourlyRateMin.toString());
    if (filters.hourlyRateMax) params.append('hourlyRateMax', filters.hourlyRateMax.toString());
    if (filters.experienceLevel) params.append('experienceLevel', filters.experienceLevel);
    if (filters.location) params.append('location', filters.location);
    if (filters.remote !== undefined) params.append('remote', String(filters.remote));
    if (filters.status) params.append('status', filters.status);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    params.append('page', (filters.page || 1).toString());
    params.append('limit', (filters.limit || 20).toString());

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${PROJECTS_ENDPOINT}?${params}`, {
      headers,
    }).catch((fetchError) => {
      // Handle network errors (CORS, connection refused, etc.)
      console.warn('Network error fetching projects:', fetchError);
      return null;
    });

    if (!response) {
      // Network error - return empty results
      return {
        items: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      };
    }

    if (!response.ok) {
      // If unauthorized, return empty results instead of throwing
      if (response.status === 401 || response.status === 403 || response.status === 404) {
        return {
          items: [],
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 0,
        };
      }
      throw new Error('Failed to fetch projects');
    }

    const data: PlatformApiResponse<PaginatedResponse<Project>> = await response.json();
    return data.data;
  } catch (error) {
    // Only log non-authentication errors
    if (error instanceof Error && error.message !== 'Not authenticated' && error.message !== 'Failed to fetch') {
      console.error('Error fetching projects:', error);
    }
    return {
      items: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    };
  }
}

/**
 * Get project by ID
 */
export async function getProjectById(projectId: string): Promise<Project | null> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('growthlab_token') : null;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${PROJECTS_ENDPOINT}/${projectId}`, {
      headers,
    }).catch((fetchError) => {
      // Handle network errors
      console.warn('Network error fetching project:', fetchError);
      return null;
    });

    if (!response) {
      return null;
    }

    if (!response.ok) {
      if (response.status === 401 || response.status === 403 || response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch project');
    }

    const data: PlatformApiResponse<Project> = await response.json();
    return data.data;
  } catch (error) {
    if (error instanceof Error && error.message !== 'Not authenticated' && error.message !== 'Failed to fetch') {
      console.error('Error fetching project:', error);
    }
    return null;
  }
}

/**
 * Create project
 */
export async function createProject(projectData: CreateProjectData): Promise<Project | null> {
  try {
    const token = getAuthToken();
    if (!token) {
      return null;
    }

    const profile = await getActiveJobProfile();
    if (!profile) {
      return null;
    }

    const response = await fetch(`${PROJECTS_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...projectData,
        clientId: profile.id,
      }),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return null;
      }
      throw new Error('Failed to create project');
    }

    const data: PlatformApiResponse<Project> = await response.json();
    return data.data;
  } catch (error) {
    if (error instanceof Error && error.message !== 'Not authenticated') {
      console.error('Error creating project:', error);
    }
    return null;
  }
}

/**
 * Submit proposal
 */
export async function submitProposal(proposalData: CreateProposalData): Promise<Proposal | null> {
  try {
    const token = getAuthToken();
    if (!token) {
      return null;
    }

    const profile = await getActiveJobProfile();
    if (!profile) {
      return null;
    }

    const response = await fetch(`${PROPOSALS_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...proposalData,
        freelancerId: profile.id,
      }),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return null;
      }
      throw new Error('Failed to submit proposal');
    }

    const data: PlatformApiResponse<Proposal> = await response.json();
    return data.data;
  } catch (error) {
    if (error instanceof Error && error.message !== 'Not authenticated') {
      console.error('Error submitting proposal:', error);
    }
    return null;
  }
}

/**
 * Get my projects (as client)
 */
export async function getMyProjects(): Promise<Project[]> {
  try {
    const token = getAuthToken();
    if (!token) {
      return [];
    }

    const profile = await getActiveJobProfile();
    if (!profile) {
      return [];
    }

    const response = await fetch(`${PROJECTS_ENDPOINT}/my`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return [];
      }
      throw new Error('Failed to fetch my projects');
    }

    const data: PlatformApiResponse<Project[]> = await response.json();
    return data.data || [];
  } catch (error) {
    if (error instanceof Error && error.message !== 'Not authenticated') {
      console.error('Error fetching my projects:', error);
    }
    return [];
  }
}

/**
 * Get my proposals (as freelancer)
 */
export async function getMyProposals(): Promise<Proposal[]> {
  try {
    const token = getAuthToken();
    if (!token) {
      return [];
    }

    const profile = await getActiveJobProfile();
    if (!profile) {
      return [];
    }

    const response = await fetch(`${PROPOSALS_ENDPOINT}/my`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }).catch((fetchError) => {
      console.warn('Network error fetching my proposals:', fetchError);
      return null;
    });

    if (!response) {
      return [];
    }

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return [];
      }
      throw new Error('Failed to fetch my proposals');
    }

    const data: PlatformApiResponse<Proposal[]> = await response.json();
    return data.data || [];
  } catch (error) {
    if (error instanceof Error && error.message !== 'Not authenticated' && error.message !== 'Failed to fetch') {
      console.error('Error fetching my proposals:', error);
    }
    return [];
  }
}

/**
 * Get proposals for a project (as client)
 */
export async function getProjectProposals(projectId: string): Promise<Proposal[]> {
  try {
    const token = getAuthToken();
    if (!token) {
      return [];
    }

    const response = await fetch(`${PROPOSALS_ENDPOINT}/project/${projectId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }).catch((fetchError) => {
      console.warn('Network error fetching project proposals:', fetchError);
      return null;
    });

    if (!response) {
      return [];
    }

    if (!response.ok) {
      if (response.status === 401 || response.status === 403 || response.status === 404) {
        return [];
      }
      throw new Error('Failed to fetch project proposals');
    }

    const data: PlatformApiResponse<Proposal[]> = await response.json();
    return data.data || [];
  } catch (error) {
    if (error instanceof Error && error.message !== 'Not authenticated' && error.message !== 'Failed to fetch') {
      console.error('Error fetching project proposals:', error);
    }
    return [];
  }
}

