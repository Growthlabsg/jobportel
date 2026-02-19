'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TeamCard as TeamCardType } from '@/types/platform';
import { Users, ArrowRight, MapPin, TrendingUp } from 'lucide-react';
import { mockTeamCards } from '@/lib/teams/mock-data';
import { getJobsForTeamSync } from '@/lib/teams/jobs-integration';

interface TeamCardLinkProps {
  teamCardId?: string;
  companyName?: string;
}

export function TeamCardLink({ teamCardId, companyName }: TeamCardLinkProps) {
  if (!teamCardId) return null;

  const team = mockTeamCards.find((t) => t.id === teamCardId);
  if (!team) return null;

  const teamJobs = getJobsForTeamSync(teamCardId);
  const openPositionsCount = team.openPositions.filter((p) => p.status === 'open').length;

  return (
    <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {team.name}
              </h3>
              {team.featured && (
                <Badge variant="primary" size="sm">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
              {team.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span className="capitalize">{team.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{team.members.length} members</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {team.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <div className="font-semibold text-gray-900 dark:text-gray-100">
              {openPositionsCount + teamJobs.length} open positions
            </div>
            <div className="text-xs">
              {openPositionsCount} team roles • {teamJobs.length} job listings
            </div>
          </div>
          <Link href={`/jobs/build-teams/${team.slug}`}>
            <Button variant="primary" size="sm">
              View Team
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

