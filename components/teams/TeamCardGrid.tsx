'use client';

import { useState, useMemo } from 'react';
import { TeamCard } from './TeamCard';
import { TeamCard as TeamCardType } from '@/types/platform';
import { MatchScore } from '@/types/platform';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Search, Filter, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { getTopMatches, defaultUserProfile } from '@/lib/teams/matchmaking';
import { sortByTrending, sortByNewest, sortByPopular } from '@/lib/teams/team-utils';

interface TeamCardGridProps {
  teams: TeamCardType[];
  showMatchScores?: boolean;
}

export function TeamCardGrid({ teams, showMatchScores = false }: TeamCardGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedCommitment, setSelectedCommitment] = useState<string>('all');
  const [selectedRemoteWork, setSelectedRemoteWork] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'trending' | 'newest' | 'popular' | 'none'>('trending');

  // Safety check - ensure teams is an array (memoized to avoid dependency issues)
  const safeTeams = useMemo(() => {
    return Array.isArray(teams) ? teams : [];
  }, [teams]);

  // Calculate match scores for all teams
  const teamsWithMatches = useMemo(() => {
    if (!showMatchScores) return safeTeams.map((team) => ({ team, match: null }));
    
    const matches = getTopMatches(defaultUserProfile, safeTeams, safeTeams.length);
    const matchMap = new Map(matches.map((m) => [m.team.id, m.match]));
    
    return safeTeams.map((team) => ({
      team,
      match: matchMap.get(team.id) || null,
    }));
  }, [safeTeams, showMatchScores]);

  // Get unique industries
  const industries = useMemo(() => {
    const unique = Array.from(new Set(safeTeams.map((t) => t.industry).filter(Boolean)));
    return unique.sort();
  }, [safeTeams]);

  // Filter teams
  const filteredTeams = useMemo(() => {
    const filtered = teamsWithMatches.filter(({ team }) => {
      if (!team) return false;
      
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        (team.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (team.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (team.requiredSkills || []).some((skill) =>
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        (team.tags || []).some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // Industry filter
      const matchesIndustry = selectedIndustry === 'all' || team.industry === selectedIndustry;

      // Stage filter
      const matchesStage = selectedStage === 'all' || team.stage === selectedStage;

      // Commitment filter
      const matchesCommitment =
        selectedCommitment === 'all' || team.commitmentLevel === selectedCommitment;

      // Remote work filter
      const matchesRemoteWork =
        selectedRemoteWork === 'all' || team.remoteWork === selectedRemoteWork;

      return (
        matchesSearch &&
        matchesIndustry &&
        matchesStage &&
        matchesCommitment &&
        matchesRemoteWork
      );
    }).map(({ team, match }) => ({ team, match }));

    // Apply sorting
    let sorted = filtered;
    if (sortBy === 'trending') {
      sorted = sortByTrending(filtered.map((f) => f.team)).map((team) => ({
        team,
        match: filtered.find((f) => f.team.id === team.id)?.match || null,
      }));
    } else if (sortBy === 'newest') {
      sorted = sortByNewest(filtered.map((f) => f.team)).map((team) => ({
        team,
        match: filtered.find((f) => f.team.id === team.id)?.match || null,
      }));
    } else if (sortBy === 'popular') {
      sorted = sortByPopular(filtered.map((f) => f.team)).map((team) => ({
        team,
        match: filtered.find((f) => f.team.id === team.id)?.match || null,
      }));
    }

    return sorted;
  }, [teamsWithMatches, searchQuery, selectedIndustry, selectedStage, selectedCommitment, selectedRemoteWork, sortBy]);

  // Count active filters
  const activeFiltersCount =
    (selectedIndustry !== 'all' ? 1 : 0) +
    (selectedStage !== 'all' ? 1 : 0) +
    (selectedCommitment !== 'all' ? 1 : 0) +
    (selectedRemoteWork !== 'all' ? 1 : 0);

  const clearFilters = () => {
    setSelectedIndustry('all');
    setSelectedStage('all');
    setSelectedCommitment('all');
    setSelectedRemoteWork('all');
    setSearchQuery('');
  };

  // Safety check - after all hooks
  if (!safeTeams || safeTeams.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-gray-600 dark:text-gray-400">No teams available.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary transition-colors duration-200" />
          <Input
            placeholder="Search teams, skills, or industries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="primary" size="sm" className="ml-1">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          {activeFiltersCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors duration-200"
            >
              <X className="w-4 h-4 mr-1" />
              Clear all
            </Button>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="p-6 shadow-lg border-2 border-primary/10 animate-slide-down">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Industry Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Industry
                </label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All Industries</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stage Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Stage
                </label>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All Stages</option>
                  <option value="idea">Idea</option>
                  <option value="mvp">MVP</option>
                  <option value="early">Early</option>
                  <option value="growth">Growth</option>
                </select>
              </div>

              {/* Commitment Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Commitment
                </label>
                <select
                  value={selectedCommitment}
                  onChange={(e) => setSelectedCommitment(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All</option>
                  <option value="part-time">Part-time</option>
                  <option value="full-time">Full-time</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              {/* Remote Work Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Work Type
                </label>
                <select
                  value={selectedRemoteWork}
                  onChange={(e) => setSelectedRemoteWork(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="on-site">On-site</option>
                </select>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Results Count and Sort */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredTeams.length} {filteredTeams.length === 1 ? 'team' : 'teams'} found
        </p>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="trending">Trending</option>
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
            <option value="none">No Sorting</option>
          </select>
        </div>
      </div>

      {/* Team Cards Grid */}
      {filteredTeams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map(({ team, match }, index) => (
            <div 
              key={team.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TeamCard
                team={team}
                showMatchScore={showMatchScores}
                matchScore={match?.score}
              />
            </div>
          ))}
        </div>
      ) : (
        <Card className="p-16 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
          <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No teams found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            No teams match your current search and filter criteria. Try adjusting your filters or search terms.
          </p>
          <Button 
            variant="outline" 
            onClick={clearFilters}
            className="hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
          >
            <X className="w-4 h-4 mr-2" />
            Clear All Filters
          </Button>
        </Card>
      )}
    </div>
  );
}

