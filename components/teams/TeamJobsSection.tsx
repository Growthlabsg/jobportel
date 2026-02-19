'use client';

import { useState, useEffect } from 'react';
import { TeamJobs } from './TeamJobs';
import { Job } from '@/types/job';
import { TeamCard as TeamCardType } from '@/types/platform';
import { getJobsForTeam, getJobsForTeamSync } from '@/lib/teams/jobs-integration';
import { Card, CardContent } from '@/components/ui/Card';
import { Briefcase, Loader2 } from 'lucide-react';

interface TeamJobsSectionProps {
  team: TeamCardType;
}

export function TeamJobsSection({ team }: TeamJobsSectionProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      setIsLoading(true);
      try {
        // Try async API call first
        const teamJobs = await getJobsForTeam(team.id);
        setJobs(teamJobs);
      } catch (error) {
        console.error('Failed to load jobs from API, using sync fallback:', error);
        // Fallback to sync version
        const teamJobs = getJobsForTeamSync(team.id);
        setJobs(teamJobs);
      } finally {
        setIsLoading(false);
      }
    }
    loadJobs();
  }, [team.id]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading jobs...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (jobs.length === 0) {
    return null;
  }

  return <TeamJobs jobs={jobs} teamName={team.name} />;
}

