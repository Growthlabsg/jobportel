'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Hackathon } from '@/types/platform';
import { Calendar, Users, Trophy, MapPin, Clock, TrendingUp } from 'lucide-react';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface HackathonCardProps {
  hackathon: Hackathon;
  className?: string;
}

export function HackathonCard({ hackathon, className }: HackathonCardProps) {
  const getStatusColor = (status: Hackathon['status']) => {
    switch (status) {
      case 'upcoming':
        return 'info';
      case 'open':
        return 'primary';
      case 'in-progress':
        return 'warning';
      case 'judging':
        return 'info';
      case 'completed':
        return 'success';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: Hackathon['status']) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'open':
        return 'Registration Open';
      case 'in-progress':
        return 'In Progress';
      case 'judging':
        return 'Judging';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const isRegistrationOpen = new Date(hackathon.registrationDeadline) > new Date();
  const isActive = hackathon.status === 'open' || hackathon.status === 'in-progress';

  return (
    <Card hover className={cn('relative', className)}>
      {/* Featured Badge */}
      {hackathon.spotlightEligible && (
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="primary" size="sm" className="shadow-md">
            <TrendingUp className="w-3 h-3 mr-1" />
            Spotlight Eligible
          </Badge>
        </div>
      )}

      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <Link href={`/jobs/build-teams/hackathons/${hackathon.slug}`}>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-primary transition-colors mb-2">
                {hackathon.name}
              </h3>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
              {hackathon.description}
            </p>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant={getStatusColor(hackathon.status)} size="sm">
                {getStatusLabel(hackathon.status)}
              </Badge>
              <Badge variant="outline" size="sm">{hackathon.theme}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Key Info */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>
              {formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>{hackathon.location}</span>
            {hackathon.remoteParticipation && (
              <Badge variant="outline" size="sm">Remote</Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4" />
            <span>
              {hackathon.currentParticipants}
              {hackathon.maxParticipants && ` / ${hackathon.maxParticipants}`} participants
            </span>
          </div>
          {hackathon.totalPrizePool && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Trophy className="w-4 h-4" />
              <span className="font-semibold text-primary">{hackathon.totalPrizePool} in prizes</span>
            </div>
          )}
        </div>

        {/* Registration Deadline */}
        {isRegistrationOpen && (
          <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <Clock className="w-3 h-3" />
              <span>
                Registration closes {formatRelativeTime(hackathon.registrationDeadline)}
              </span>
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {hackathon.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" size="sm">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link href={`/jobs/build-teams/hackathons/${hackathon.slug}`} className="flex-1">
            <Button variant="primary" size="md" className="w-full">
              View Details
            </Button>
          </Link>
          {isRegistrationOpen && isActive && (
            <Link href={`/jobs/build-teams/hackathons/${hackathon.slug}#register`}>
              <Button variant="outline" size="md">
                Register
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

