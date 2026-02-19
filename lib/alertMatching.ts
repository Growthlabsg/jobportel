import { JobAlert } from '@/types/alert';
import { Job } from '@/types/job';

/**
 * Check if a job matches an alert's criteria
 */
export function jobMatchesAlert(job: Job, alert: JobAlert): boolean {
  // Keywords match (check in title, description, skills)
  if (alert.keywords.length > 0) {
    const jobText = `${job.title} ${job.description} ${job.skills?.join(' ') || ''}`.toLowerCase();
    const hasKeywordMatch = alert.keywords.some((keyword) =>
      jobText.includes(keyword.toLowerCase())
    );
    if (!hasKeywordMatch) return false;
  }

  // Location match
  if (alert.locations.length > 0) {
    const jobLocation = job.location.toLowerCase();
    const hasLocationMatch = alert.locations.some((location) =>
      jobLocation.includes(location.toLowerCase())
    );
    if (!hasLocationMatch) return false;
  }

  // Job type match
  if (alert.jobTypes.length > 0) {
    if (!alert.jobTypes.includes(job.jobType)) return false;
  }

  // Experience level match
  if (alert.experienceLevels && alert.experienceLevels.length > 0) {
    if (!alert.experienceLevels.includes(job.experienceLevel)) return false;
  }

  // Remote work match
  if (alert.remoteWork && alert.remoteWork.length > 0) {
    if (!alert.remoteWork.includes(job.remoteWork)) return false;
  }

  // Salary range match
  if (alert.salaryMin !== undefined || alert.salaryMax !== undefined) {
    if (!job.salary) return false;
    if (alert.salaryCurrency && job.salary.currency !== alert.salaryCurrency) return false;
    if (alert.salaryMin !== undefined && job.salary.max < alert.salaryMin) return false;
    if (alert.salaryMax !== undefined && job.salary.min > alert.salaryMax) return false;
  }

  // Skills match
  if (alert.skills && alert.skills.length > 0 && job.skills) {
    const hasSkillMatch = alert.skills.some((skill) =>
      job.skills.some((jobSkill) =>
        jobSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );
    if (!hasSkillMatch) return false;
  }

  return true;
}

/**
 * Find all jobs that match an alert
 */
export function findMatchingJobs(jobs: Job[], alert: JobAlert): Job[] {
  return jobs.filter((job) => jobMatchesAlert(job, alert));
}

/**
 * Find all alerts that match a job
 */
export function findMatchingAlerts(alerts: JobAlert[], job: Job): JobAlert[] {
  return alerts.filter((alert) => alert.enabled && jobMatchesAlert(job, alert));
}

