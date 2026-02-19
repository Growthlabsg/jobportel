'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TeamCard } from './TeamCard';
import { TeamCard as TeamCardType } from '@/types/platform';
import { mockTeamCards } from '@/lib/teams/mock-data';
import { mockHackathons } from '@/lib/teams/mock-hackathons';
import { TrendingUp, Trophy, Award, Sparkles } from 'lucide-react';

export function StartupSpotlight() {
  // Get teams that are spotlight eligible or have won hackathons
  const spotlightTeams = mockTeamCards.filter(
    (team) => team.spotlightEligible || team.featured
  );

  // Get recent hackathon winners
  const recentWinners = mockHackathons
    .filter((h) => h.status === 'completed' && h.featuredWinners && h.featuredWinners.length > 0)
    .flatMap((h) => {
      const winners = mockTeamCards.filter((team) => h.featuredWinners?.includes(team.id));
      return winners.map((team) => ({ team, hackathon: h }));
    })
    .slice(0, 3);

  if (spotlightTeams.length === 0 && recentWinners.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 dark:from-primary/20 dark:via-primary/10 dark:to-primary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Startup Spotlight
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Featured teams and hackathon winners gaining exposure to investors and mentors
            </p>
          </div>
        </div>

        {/* Recent Winners */}
        {recentWinners.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Recent Hackathon Winners
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentWinners.map(({ team, hackathon }) => (
                <Card key={team.id} className="relative border-2 border-primary/30">
                  <div className="absolute top-4 right-4 z-10">
                    <Badge variant="success" size="sm" className="shadow-md">
                      <Award className="w-3 h-3 mr-1" />
                      Winner
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <Badge variant="info" size="sm" className="mb-2">
                        {hackathon.name}
                      </Badge>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {team.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {team.description}
                      </p>
                    </div>
                    <Link href={`/jobs/build-teams/${team.slug}`}>
                      <Button variant="primary" size="sm" className="w-full">
                        View Team
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Featured Teams */}
        {spotlightTeams.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Featured Teams
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {spotlightTeams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <Card className="p-8 bg-gradient-to-r from-primary/10 to-primary-dark/10 border-primary/20">
            <CardContent>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                Want to be featured in the Spotlight?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Participate in hackathons, build innovative solutions, and get noticed by investors
                and mentors.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link href="/jobs/build-teams/hackathons">
                  <Button variant="primary" size="lg">
                    <Trophy className="w-4 h-4 mr-2" />
                    Browse Hackathons
                  </Button>
                </Link>
                <Link href="/jobs/build-teams/create">
                  <Button variant="outline" size="lg">
                    Create Your Team
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

