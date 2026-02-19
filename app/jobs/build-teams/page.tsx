'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TeamCardGrid } from '@/components/teams/TeamCardGrid';
import { TeamCard } from '@/components/teams/TeamCard';
import { SuggestedTeams } from '@/components/teams/Matchmaking/SuggestedTeams';
import { StartupSpotlight } from '@/components/teams/StartupSpotlight';
import { TrendingTeams } from '@/components/teams/TrendingTeams';
import { NewTeams } from '@/components/teams/NewTeams';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { mockTeamCards } from '@/lib/teams/mock-data';
import { Plus, Users, TrendingUp, Zap, Target, Trophy, Bot, Sparkles, Briefcase } from 'lucide-react';

export default function BuildTeamsPage() {
  const [teams] = useState(mockTeamCards || []);

  // Featured teams
  const featuredTeams = (teams || []).filter((team) => team && team.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F5F9] via-white to-[#F1F5F9] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Clean Header Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200/60 pt-20 lg:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-6 py-8 sm:py-12 max-w-7xl">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-4 sm:mb-6">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary">Build Teams</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1E293B] dark:text-white mb-3 sm:mb-4 gradient-text px-2">
              Build Teams
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[#64748B] dark:text-gray-400 max-w-2xl mx-auto px-4 mb-8">
              Connect with like-minded entrepreneurs, form micro-teams, and collaborate on innovative projects. Find your co-founders and build something amazing together.
            </p>
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link href="/jobs/build-teams/create">
                <Button size="lg" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Team
                </Button>
              </Link>
              <Link href="/jobs/build-teams/hackathons">
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Browse Hackathons
                </Button>
              </Link>
              <Link href="/jobs/build-teams/ai-advisor">
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  <Sparkles className="w-3 h-3" />
                  AI Advisor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Stats Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-6 py-8 sm:py-12 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center group relative overflow-hidden border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800 transition-all duration-500 ease-out card-hover">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-5">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg mx-auto mb-4 w-fit transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Users className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-[#1E293B] dark:text-white mb-1 transition-transform duration-300 group-hover:scale-105">{(teams || []).length}+</div>
              <div className="text-xs font-medium text-[#64748B] dark:text-gray-400 uppercase tracking-wide">Active Teams</div>
            </CardContent>
          </Card>
          <Card className="text-center group relative overflow-hidden border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800 transition-all duration-500 ease-out card-hover">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-5">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg mx-auto mb-4 w-fit transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Briefcase className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-[#1E293B] dark:text-white mb-1 transition-transform duration-300 group-hover:scale-105">
                {(teams || []).reduce((sum, team) => sum + (team?.openPositions || []).filter((p) => p.status === 'open').length, 0)}+
              </div>
              <div className="text-xs font-medium text-[#64748B] dark:text-gray-400 uppercase tracking-wide">Open Positions</div>
            </CardContent>
          </Card>
          <Card className="text-center group relative overflow-hidden border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800 transition-all duration-500 ease-out card-hover">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-5">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg mx-auto mb-4 w-fit transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Users className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-[#1E293B] dark:text-white mb-1 transition-transform duration-300 group-hover:scale-105">
                {(teams || []).reduce((sum, team) => sum + (team?.members || []).length, 0)}+
              </div>
              <div className="text-xs font-medium text-[#64748B] dark:text-gray-400 uppercase tracking-wide">Team Members</div>
            </CardContent>
          </Card>
          <Card className="text-center group relative overflow-hidden border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800 transition-all duration-500 ease-out card-hover">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-5">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg mx-auto mb-4 w-fit transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-[#1E293B] dark:text-white mb-1 transition-transform duration-300 group-hover:scale-105">
                {(teams || []).reduce((sum, team) => sum + (team?.applicationsCount || 0), 0)}+
              </div>
              <div className="text-xs font-medium text-[#64748B] dark:text-gray-400 uppercase tracking-wide">Applications</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Suggested Teams (AI Matchmaking) */}
      <SuggestedTeams teams={teams} />

      {/* Trending Teams */}
      <TrendingTeams teams={teams} />

      {/* New Teams */}
      <NewTeams teams={teams} />

      {/* Featured Teams */}
      {featuredTeams.length > 0 && (
        <section className="bg-white dark:bg-gray-900 py-8 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-6 max-w-7xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1E293B] dark:text-white mb-2 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  Featured Teams
                </h2>
                <p className="text-sm sm:text-base text-[#64748B] dark:text-gray-400">
                  High-potential teams looking for talented collaborators
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTeams.map((team, index) => (
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
      )}

      {/* All Teams Section */}
      <section id="teams" className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                All Teams
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Discover teams and projects looking for collaborators
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/jobs/build-teams/my-teams">
                <Button 
                  variant="outline" 
                  size="md"
                  className="hover:bg-primary/10 hover:border-primary/30 transition-all duration-200"
                >
                  <Users className="w-4 h-4 mr-2" />
                  My Teams
                </Button>
              </Link>
              <Link href="/jobs/build-teams/hackathons">
                <Button 
                  variant="outline" 
                  size="md"
                  className="hover:bg-primary/10 hover:border-primary/30 transition-all duration-200"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Hackathons
                </Button>
              </Link>
              <Link href="/jobs/build-teams/ai-advisor">
                <Button 
                  variant="outline" 
                  size="md"
                  className="hover:bg-primary/10 hover:border-primary/30 transition-all duration-200"
                >
                  <Bot className="w-4 h-4 mr-2" />
                  AI Advisor
                </Button>
              </Link>
              <Link href="/jobs/build-teams/create">
                <Button 
                  variant="primary" 
                  size="md"
                  className="hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Team
                </Button>
              </Link>
            </div>
          </div>
          <TeamCardGrid teams={teams} />
        </div>
      </section>

      {/* Startup Spotlight */}
      <StartupSpotlight />

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Building a team has never been easier. Follow these simple steps to get started.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/30">
              <CardHeader>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary-dark/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-xl mb-3">1. Create or Browse</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Create your team card with project goals and open positions, or browse existing teams looking for collaborators.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/30">
              <CardHeader>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary-dark/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-xl mb-3">2. Connect & Apply</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Apply to teams that match your skills and interests, or invite talented individuals to join your project.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/30">
              <CardHeader>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary-dark/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-xl mb-3">3. Collaborate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Work together in project spaces with chat, task management, file sharing, and milestone tracking.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

