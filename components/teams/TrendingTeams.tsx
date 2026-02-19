'use client';

import { TeamCard } from './TeamCard';
import { TeamCard as TeamCardType } from '@/types/platform';
import { sortByTrending } from '@/lib/teams/team-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { TrendingUp, Flame } from 'lucide-react';

interface TrendingTeamsProps {
  teams: TeamCardType[];
  limit?: number;
}

export function TrendingTeams({ teams, limit = 6 }: TrendingTeamsProps) {
  const trendingTeams = sortByTrending(teams).slice(0, limit);

  if (trendingTeams.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-900/20 dark:via-red-900/20 dark:to-pink-900/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Trending Teams
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Teams gaining momentum and attracting attention
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingTeams.map((team, index) => (
            <div
              key={team.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative">
                <TeamCard team={team} />
                {index === 0 && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                      <TrendingUp className="w-3 h-3" />
                      #1 Trending
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

