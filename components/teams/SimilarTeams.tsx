'use client';

import { TeamCard } from './TeamCard';
import { TeamCard as TeamCardType } from '@/types/platform';
import { getSimilarTeams } from '@/lib/teams/team-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Users } from 'lucide-react';

interface SimilarTeamsProps {
  team: TeamCardType;
  allTeams: TeamCardType[];
  limit?: number;
}

export function SimilarTeams({ team, allTeams, limit = 3 }: SimilarTeamsProps) {
  const similarTeams = getSimilarTeams(team, allTeams, limit);

  if (similarTeams.length === 0) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Similar Teams
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {similarTeams.map((similarTeam) => (
            <TeamCard key={similarTeam.id} team={similarTeam} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

