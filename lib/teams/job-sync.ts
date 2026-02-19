import { Job } from '@/types/job';
import { TeamCard } from '@/types/platform';
import { updateJob } from '@/services/platform/jobs';

/**
 * Sync job updates to team
 * When a job is updated, update the team's postedJobs array
 */
export async function syncJobToTeam(job: Job, teamCardId: string): Promise<boolean> {
  try {
    // In production, this would:
    // 1. Update the team's postedJobs array via API
    // 2. Update job count on team card
    // 3. Trigger team cache invalidation
    
    // For now, just log the sync
    console.log(`Syncing job ${job.id} to team ${teamCardId}`);
    return true;
  } catch (error) {
    console.error('Error syncing job to team:', error);
    return false;
  }
}

/**
 * Sync team updates to jobs
 * When a team is updated, update all linked jobs
 */
export async function syncTeamToJobs(team: TeamCard): Promise<boolean> {
  try {
    if (!team.postedJobs || team.postedJobs.length === 0) {
      return true;
    }

    // Update each job with latest team info
    for (const jobId of team.postedJobs) {
      try {
        await updateJob(jobId, {
          // Update job company info to match team
          // In production, this would update company name, logo, etc.
        });
      } catch (error) {
        console.error(`Error updating job ${jobId}:`, error);
      }
    }

    return true;
  } catch (error) {
    console.error('Error syncing team to jobs:', error);
    return false;
  }
}

/**
 * Remove job from team when job is deleted
 */
export async function removeJobFromTeam(jobId: string, teamCardId: string): Promise<boolean> {
  try {
    // In production, this would:
    // 1. Remove jobId from team's postedJobs array
    // 2. Update job count on team card
    // 3. Trigger team cache invalidation
    
    console.log(`Removing job ${jobId} from team ${teamCardId}`);
    return true;
  } catch (error) {
    console.error('Error removing job from team:', error);
    return false;
  }
}

