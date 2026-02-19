'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TeamCard as TeamCardType } from '@/types/platform';
import { Users, MapPin, Clock, TrendingUp, Heart, Eye, Briefcase } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { TeamActions } from './TeamActions';

interface TeamCardProps {
  team: TeamCardType;
  showMatchScore?: boolean;
  matchScore?: number;
  className?: string;
}

export function TeamCard({ team, showMatchScore = false, matchScore, className }: TeamCardProps) {
  if (!team) return null;
  
  const openPositionsCount = (team.openPositions || []).filter((p) => p.status === 'open').length;
  const membersCount = (team.members || []).length;

  return (
    <Card
      hover
      className={cn(
        'relative group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 hover:border-primary/30',
        team.featured && 'ring-2 ring-primary/20',
        className
      )}
    >
      {/* Featured Badge */}
      {team.featured && (
        <div className="absolute top-4 right-4 z-10 animate-fade-in">
          <Badge variant="primary" size="sm" className="shadow-lg backdrop-blur-sm">
            <TrendingUp className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        </div>
      )}

      {/* Match Score Badge */}
      {showMatchScore && matchScore !== undefined && (
        <div className="absolute top-4 left-4 z-10 animate-fade-in">
          <Badge variant="success" size="sm" className="shadow-lg backdrop-blur-sm">
            {matchScore}% Match
          </Badge>
        </div>
      )}

      <CardHeader>
        <div className="flex items-start gap-4">
          {/* Founder Avatar */}
          <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
              {(team.founderName || 'T').charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Team Info */}
          <div className="flex-1 min-w-0">
            <Link href={`/jobs/build-teams/${team.slug}`}>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-primary transition-colors mb-1 group-hover:underline">
                {team.name}
              </h3>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2 leading-relaxed">
              {team.description}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 mb-2">
              <span className="font-medium">{team.founderName}</span>
              <span className="text-gray-400">•</span>
              <span className="text-primary font-medium">{team.industry}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Stage Badge */}
        <div className="flex items-center gap-2 mb-4">
          <Badge
            variant={
              team.stage === 'growth'
                ? 'success'
                : team.stage === 'early'
                ? 'info'
                : team.stage === 'mvp'
                ? 'primary'
                : 'outline'
            }
            size="sm"
          >
            {team.stage.toUpperCase()}
          </Badge>
          <Badge variant="outline" size="sm">
            {team.status}
          </Badge>
        </div>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(team.requiredSkills || []).slice(0, 4).map((skill) => (
            <Badge 
              key={skill} 
              variant="outline" 
              size="sm"
              className="hover:bg-primary/10 hover:border-primary/30 transition-colors duration-200"
            >
              {skill}
            </Badge>
          ))}
          {(team.requiredSkills || []).length > 4 && (
            <Badge 
              variant="outline" 
              size="sm"
              className="hover:bg-primary/10 hover:border-primary/30 transition-colors duration-200"
            >
              +{(team.requiredSkills || []).length - 4} more
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{membersCount} members</span>
          </div>
          <div className="flex items-center gap-1">
            <Briefcase className="w-4 h-4" />
            <span>{openPositionsCount} open roles</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span className="capitalize">{team.remoteWork}</span>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 mb-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{team.viewsCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>{team.likedBy?.length || team.likesCount || 0}</span>
            </div>
          </div>
          <span>{team.updatedAt ? formatRelativeTime(team.updatedAt) : 'Recently'}</span>
        </div>

        {/* Actions Row */}
        <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <TeamActions team={team} size="sm" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link href={`/jobs/build-teams/${team.slug}`} className="flex-1">
            <Button 
              variant="primary" 
              size="md" 
              className="w-full group-hover:shadow-lg transition-all duration-300"
            >
              View Details
            </Button>
          </Link>
          {openPositionsCount > 0 && (
            <Link href={`/jobs/build-teams/${team.slug}#apply`}>
              <Button 
                variant="outline" 
                size="md"
                className="hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
              >
                Apply
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

