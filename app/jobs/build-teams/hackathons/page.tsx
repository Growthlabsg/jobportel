'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { HackathonCard } from '@/components/teams/Hackathons/HackathonCard';
import { mockHackathons } from '@/lib/teams/mock-hackathons';
import { getHackathonsFromLuma } from '@/lib/teams/luma-events-integration';
import { Hackathon } from '@/types/platform';
import { Trophy, Search, Filter, Calendar, TrendingUp, RefreshCw } from 'lucide-react';
import { useMemo } from 'react';

export default function HackathonsPage() {
  const [hackathons, setHackathons] = useState<Hackathon[]>(mockHackathons);
  const [lumaHackathons, setLumaHackathons] = useState<Hackathon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Fetch hackathons from luma-clone
  useEffect(() => {
    async function loadHackathons() {
      setIsLoading(true);
      try {
        const lumaHacks = await getHackathonsFromLuma();
        setLumaHackathons(lumaHacks);
        // Combine luma hackathons with mock data (luma takes priority)
        setHackathons([...lumaHacks, ...mockHackathons]);
      } catch (error) {
        console.error('Failed to load hackathons from luma-clone:', error);
        // Fallback to mock data only
        setHackathons(mockHackathons);
      } finally {
        setIsLoading(false);
      }
    }
    loadHackathons();
  }, []);

  const filteredHackathons = useMemo(() => {
    return hackathons.filter((hackathon) => {
      const matchesSearch =
        searchQuery === '' ||
        hackathon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hackathon.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hackathon.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hackathon.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = selectedStatus === 'all' || hackathon.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [hackathons, searchQuery, selectedStatus]);

  const upcomingHackathons = hackathons.filter((h) => h.status === 'upcoming' || h.status === 'open');
  const activeHackathons = hackathons.filter((h) => h.status === 'in-progress' || h.status === 'judging');
  const completedHackathons = hackathons.filter((h) => h.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary-dark to-primary py-16 text-white pt-20 lg:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Trophy className="w-12 h-12" />
              <h1 className="text-4xl md:text-5xl font-bold">Hackathons & Competitions</h1>
            </div>
            <p className="text-xl text-primary-light mb-8">
              Compete, innovate, and get featured in the Startup Spotlight. Join hackathons to showcase
              your team&apos;s potential and connect with investors and mentors.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{upcomingHackathons.length} Upcoming</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>{activeHackathons.length} Active</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                <span>{completedHackathons.length} Completed</span>
              </div>
              {lumaHackathons.length > 0 && (
                <div className="flex items-center gap-2 text-primary/80">
                  <Badge variant="info" size="sm">
                    {lumaHackathons.length} from Events Platform
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search hackathons by name, theme, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="open">Registration Open</option>
                <option value="in-progress">In Progress</option>
                <option value="judging">Judging</option>
                <option value="completed">Completed</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    const lumaHacks = await getHackathonsFromLuma();
                    setLumaHackathons(lumaHacks);
                    setHackathons([...lumaHacks, ...mockHackathons]);
                  } catch (error) {
                    console.error('Failed to refresh hackathons:', error);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Hackathons Grid */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                All Hackathons
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Loading hackathons...
                  </span>
                ) : (
                  <>
                    {filteredHackathons.length} {filteredHackathons.length === 1 ? 'hackathon' : 'hackathons'} found
                    {lumaHackathons.length > 0 && (
                      <span className="ml-2 text-primary">
                        ({lumaHackathons.length} from Events Platform)
                      </span>
                    )}
                  </>
                )}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredHackathons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHackathons.map((hackathon, index) => (
                <div
                  key={hackathon.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <HackathonCard hackathon={hackathon} />
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
              <Trophy className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No hackathons found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                No hackathons match your current search and filter criteria.
              </p>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}

