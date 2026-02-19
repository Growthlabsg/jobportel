'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { TeamCard as TeamCardType, OpenPosition, MatchScore } from '@/types/platform';
import { mockTeamCards } from '@/lib/teams/mock-data';
import { calculateMatchScore, defaultUserProfile } from '@/lib/teams/matchmaking';
import { MatchScoreCard } from '@/components/teams/Matchmaking/MatchScoreCard';
import {
  Users,
  MapPin,
  Clock,
  TrendingUp,
  Briefcase,
  ArrowLeft,
  Send,
  CheckCircle,
  XCircle,
  UserPlus,
  MessageSquare,
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import { SimilarTeams } from '@/components/teams/SimilarTeams';
import { TeamAnalytics } from '@/components/teams/TeamAnalytics';
import { TeamActivityFeed } from '@/components/teams/TeamActivityFeed';
import { TeamJobsSection } from '@/components/teams/TeamJobsSection';

export default function TeamDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [team, setTeam] = useState<TeamCardType | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<OpenPosition | null>(null);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [matchScore, setMatchScore] = useState<MatchScore | null>(null);

  useEffect(() => {
    const foundTeam = mockTeamCards.find((t) => t.slug === slug);
    setTeam(foundTeam || null);
    
    // Calculate match score if team found
    if (foundTeam) {
      const match = calculateMatchScore(defaultUserProfile, foundTeam);
      setMatchScore(match);
    }
  }, [slug]);

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Team Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The team you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/jobs/build-teams">
            <Button variant="primary">Browse All Teams</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const openPositions = team.openPositions.filter((p) => p.status === 'open');

  const handleApply = (position?: OpenPosition) => {
    setSelectedPosition(position ?? null);
    setIsApplicationModalOpen(true);
  };

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsApplicationModalOpen(false);
    setApplicationMessage('');
    alert('Application submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/jobs/build-teams">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Teams
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Team Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {team.name}
                      </h1>
                      {team.featured && (
                        <Badge variant="primary" size="sm">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="capitalize">{team.location} • {team.remoteWork}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Updated {formatRelativeTime(team.updatedAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
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
                      <Badge variant="outline" size="sm">
                        {team.industry}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      About
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {team.description}
                    </p>
                  </div>

                  {/* Project Goals */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Project Goals
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {team.projectGoals}
                    </p>
                  </div>

                  {/* Required Skills */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      Required Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {team.requiredSkills.map((skill) => (
                        <Badge key={skill} variant="outline" size="md">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      Tags
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {team.tags.map((tag) => (
                        <Badge key={tag} variant="info" size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Team Members ({team.members.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {team.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {member.name}
                          </h3>
                          {member.isFounder && (
                            <Badge variant="primary" size="sm">
                              Founder
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{member.title}</p>
                        {member.bio && (
                          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                            {member.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Match Score Card */}
            {matchScore && matchScore.score > 0 && (
              <MatchScoreCard match={matchScore} showDetails={true} />
            )}

            {/* Project Space Card */}
            {team.projectSpaceId && team.chatEnabled && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Space</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Access the team&apos;s collaboration workspace with chat, tasks, files, and milestones.
                  </p>
                  <Link href={`/jobs/build-teams/${team.slug}/space`}>
                    <Button variant="primary" size="lg" className="w-full">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Open Project Space
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Apply Card */}
            <Card>
              <CardHeader>
                <CardTitle>Join This Team</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {openPositions.length > 0 ? (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {openPositions.length} open position{openPositions.length > 1 ? 's' : ''}{' '}
                      available
                    </p>
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full"
                      onClick={() => handleApply()}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Apply to Team
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No open positions at the moment. Check back later!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Team Activity Feed */}
            <TeamActivityFeed team={team} />

            {/* Open Positions */}
            {openPositions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Open Positions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {openPositions.map((position) => (
                    <div
                      key={position.id}
                      className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {position.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {position.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {position.requiredSkills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="outline" size="sm">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 mb-3">
                        <span className="capitalize">{position.commitment}</span>
                        <span className="capitalize">{position.experienceLevel}</span>
                        {position.equityOffered && (
                          <span>Equity: {position.equityOffered}</span>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleApply(position)}
                      >
                        Apply for this role
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Team Jobs from Jobs Portal */}
            <TeamJobsSection team={team} />
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <Modal
        isOpen={isApplicationModalOpen}
        onClose={() => {
          setIsApplicationModalOpen(false);
          setApplicationMessage('');
        }}
        title={selectedPosition ? `Apply for ${selectedPosition.title}` : 'Apply to Team'}
        size="lg"
      >
        <div className="space-y-4">
          {selectedPosition && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {selectedPosition.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedPosition.description}
              </p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Why do you want to join this team? *
            </label>
            <textarea
              value={applicationMessage}
              onChange={(e) => setApplicationMessage(e.target.value)}
              placeholder="Tell us about yourself, your skills, and why you&apos;re interested in this project..."
              rows={6}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
          <div className="flex items-center gap-3 pt-4">
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              onClick={handleSubmitApplication}
              disabled={!applicationMessage.trim() || isSubmitting}
              isLoading={isSubmitting}
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Application
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setIsApplicationModalOpen(false);
                setApplicationMessage('');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

