'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { TeamCard } from '@/components/teams/TeamCard';
import { TeamCard as TeamCardType } from '@/types/platform';
import { mockTeamCards } from '@/lib/teams/mock-data';
import {
  Users,
  Plus,
  Settings,
  TrendingUp,
  Bookmark,
  Heart,
  Eye,
  Briefcase,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

export default function MyTeamsPage() {
  const [activeTab, setActiveTab] = useState('my-teams');
  const userId = 'current-user'; // In real app, get from auth

  // Filter teams based on user's relationship
  const myTeams = mockTeamCards.filter((team) =>
    team.members.some((m) => m.userId === userId) || team.founderId === userId
  );

  const savedTeams = mockTeamCards.filter(
    (team) => team.savedBy?.includes(userId) || false
  );

  const likedTeams = mockTeamCards.filter(
    (team) => team.likedBy?.includes(userId) || false
  );

  const applications = mockTeamCards
    .flatMap((team) =>
      team.openPositions.flatMap((position) =>
        position.applications
          .filter((app) => app.applicantId === userId)
          .map((app) => ({ team, position, application: app }))
      )
    )
    .sort(
      (a, b) =>
        new Date(b.application.createdAt).getTime() -
        new Date(a.application.createdAt).getTime()
    );

  // Calculate stats
  const stats = {
    totalTeams: myTeams.length,
    totalApplications: applications.length,
    pendingApplications: applications.filter((a) => a.application.status === 'pending').length,
    acceptedApplications: applications.filter((a) => a.application.status === 'accepted').length,
    totalViews: myTeams.reduce((sum, team) => sum + team.viewsCount, 0),
    totalLikes: myTeams.reduce((sum, team) => sum + (team.likedBy?.length || team.likesCount), 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              My Teams
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your teams, applications, and saved teams
            </p>
          </div>
          <Link href="/jobs/build-teams/create">
            <Button variant="primary" size="md">
              <Plus className="w-4 h-4 mr-2" />
              Create New Team
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">My Teams</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stats.totalTeams}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Applications</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stats.totalApplications}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {stats.pendingApplications} pending
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stats.totalViews}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Likes</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stats.totalLikes}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="my-teams" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              My Teams ({myTeams.length})
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Applications ({applications.length})
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              Saved ({savedTeams.length})
            </TabsTrigger>
            <TabsTrigger value="liked" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Liked ({likedTeams.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-teams">
            {myTeams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myTeams.map((team) => (
                  <div key={team.id} className="relative">
                    <TeamCard team={team} />
                    <Link
                      href={`/jobs/build-teams/${team.slug}/edit`}
                      className="absolute top-4 right-4 z-20"
                    >
                      <Button variant="ghost" size="sm" className="bg-white/90 dark:bg-gray-800/90">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Users className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No Teams Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Create your first team to start building your project.
                </p>
                <Link href="/jobs/build-teams/create">
                  <Button variant="primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Team
                  </Button>
                </Link>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="applications">
            {applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map(({ team, position, application }) => (
                  <Card key={application.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Link href={`/jobs/build-teams/${team.slug}`}>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-primary">
                                {team.name}
                              </h3>
                            </Link>
                            <Badge
                              variant={
                                application.status === 'accepted'
                                  ? 'success'
                                  : application.status === 'rejected'
                                    ? 'error'
                                    : application.status === 'reviewed'
                                      ? 'info'
                                      : 'outline'
                              }
                              size="sm"
                            >
                              {application.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Position: {position.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">
                            Applied {formatRelativeTime(application.createdAt)}
                          </p>
                        </div>
                        <Link href={`/jobs/build-teams/${team.slug}`}>
                          <Button variant="outline" size="sm">
                            View Team
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Briefcase className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No Applications Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start applying to teams that match your skills and interests.
                </p>
                <Link href="/jobs/build-teams">
                  <Button variant="primary">Browse Teams</Button>
                </Link>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="saved">
            {savedTeams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedTeams.map((team) => (
                  <TeamCard key={team.id} team={team} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Bookmark className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No Saved Teams
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Save teams you&apos;re interested in to view them later.
                </p>
                <Link href="/jobs/build-teams">
                  <Button variant="primary">Browse Teams</Button>
                </Link>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="liked">
            {likedTeams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {likedTeams.map((team) => (
                  <TeamCard key={team.id} team={team} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Heart className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No Liked Teams
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Like teams you find interesting to show your support.
                </p>
                <Link href="/jobs/build-teams">
                  <Button variant="primary">Browse Teams</Button>
                </Link>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

