import { Job } from '@/types/job';
import { TeamCard } from '@/types/platform';

/**
 * Fetch jobs from the jobs API for a specific team
 * In production, this would call the actual jobs API
 */
export async function fetchJobsForTeam(teamCardId: string): Promise<Job[]> {
  try {
    // In production, call: GET /api/jobs?teamCardId={teamCardId}
    // For now, use mock data
    const response = await fetch(`/api/jobs?teamCardId=${teamCardId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (response.ok) {
      const data = await response.json();
      return data.jobs || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching jobs for team:', error);
    return [];
  }
}

/**
 * Fetch team card for a job
 */
export async function fetchTeamForJob(job: Job): Promise<TeamCard | null> {
  if (!job.teamCardId) return null;

  try {
    // In production, call: GET /api/teams/{teamCardId}
    // For now, return null and let component handle with mock data
    return null;
  } catch (error) {
    console.error('Error fetching team for job:', error);
    return null;
  }
}

/**
 * Link a job to a team (when job is created/updated)
 */
export async function linkJobToTeam(jobId: string, teamCardId: string): Promise<boolean> {
  try {
    // In production, call: PATCH /api/jobs/{jobId} with { teamCardId }
    const response = await fetch(`/api/jobs/${jobId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ teamCardId }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error linking job to team:', error);
    return false;
  }
}

