'use client';

import { useState, useEffect } from 'react';
import { TeamCard } from '../TeamCard';
import { MatchScoreCard } from './MatchScoreCard';
import { TeamCard as TeamCardType } from '@/types/platform';
import { MatchScore } from '@/types/platform';
import { getTopMatches, defaultUserProfile, UserProfileForMatching } from '@/lib/teams/matchmaking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Sparkles } from 'lucide-react';

interface SuggestedTeamsProps {
  teams: TeamCardType[];
  userProfile?: UserProfileForMatching;
}

export function SuggestedTeams({ teams, userProfile = defaultUserProfile }: SuggestedTeamsProps) {
  const [matches, setMatches] = useState<Array<{ team: TeamCardType; match: MatchScore }>>([]);

  useEffect(() => {
    const topMatches = getTopMatches(userProfile, teams, 3);
    setMatches(topMatches);
  }, [teams, userProfile]);

  if (matches.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 dark:from-primary/10 dark:via-primary/20 dark:to-primary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Recommended for You
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Teams that match your skills and interests
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {matches.map(({ team, match }) => (
            <div key={team.id} className="space-y-4">
              <MatchScoreCard match={match} showDetails={true} />
              <TeamCard team={team} showMatchScore={true} matchScore={match.score} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

