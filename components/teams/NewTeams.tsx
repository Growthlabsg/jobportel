'use client';

import { TeamCard } from './TeamCard';
import { TeamCard as TeamCardType } from '@/types/platform';
import { sortByNewest } from '@/lib/teams/team-utils';
import { Sparkles } from 'lucide-react';

interface NewTeamsProps {
  teams: TeamCardType[];
  limit?: number;
}

export function NewTeams({ teams, limit = 6 }: NewTeamsProps) {
  const newTeams = sortByNewest(teams).slice(0, limit);

  if (newTeams.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              New Teams
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Recently created teams looking for collaborators
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newTeams.map((team, index) => (
            <div
              key={team.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <TeamCard team={team} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

