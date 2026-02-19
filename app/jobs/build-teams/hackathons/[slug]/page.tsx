'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Hackathon, HackathonRegistration } from '@/types/platform';
import { mockHackathons } from '@/lib/teams/mock-hackathons';
import { getHackathonFromLumaById } from '@/lib/teams/luma-events-integration';
import { mockTeamCards } from '@/lib/teams/mock-data';
import {
  ArrowLeft,
  Calendar,
  Users,
  Trophy,
  MapPin,
  Clock,
  CheckCircle2,
  User,
  Award,
  Target,
} from 'lucide-react';
import { formatDate, formatDateTime, formatRelativeTime } from '@/lib/utils';

export default function HackathonDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadHackathon() {
      // First try to find in mock data
      let foundHackathon = mockHackathons.find((h) => h.slug === slug);
      
      // If not found, try to fetch from luma-clone
      if (!foundHackathon) {
        // Extract event ID from slug if it's from luma (format: hack-{eventId})
        const eventIdMatch = slug.match(/^hack-(.+)$/);
        if (eventIdMatch) {
          const lumaHackathon = await getHackathonFromLumaById(eventIdMatch[1]);
          if (lumaHackathon) {
            foundHackathon = lumaHackathon;
          }
        }
      }
      
      setHackathon(foundHackathon || null);
    }
    loadHackathon();
  }, [slug]);

  if (!hackathon) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Hackathon Not Found
          </h2>
          <Link href="/jobs/build-teams/hackathons">
            <Button variant="primary">Browse All Hackathons</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const isRegistrationOpen = new Date(hackathon.registrationDeadline) > new Date();
  const userTeams = mockTeamCards.filter((team) => team.members.some((m) => m.userId === 'current-user'));

  const handleRegister = async () => {
    if (!selectedTeam) return;
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsRegistrationModalOpen(false);
    setSelectedTeam('');
    alert('Registration submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Banner */}
      {hackathon.bannerUrl && (
        <div className="h-64 bg-gradient-to-r from-primary to-primary-dark relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex items-center">
            <div>
              <Badge variant="primary" size="md" className="mb-4">
                {hackathon.theme}
              </Badge>
              <h1 className="text-4xl font-bold text-white mb-2">{hackathon.name}</h1>
              <p className="text-xl text-primary-light">{hackathon.organizer}</p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/jobs/build-teams/hackathons">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hackathons
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Hackathon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {hackathon.longDescription || hackathon.description}
                </p>
              </CardContent>
            </Card>

            {/* Prizes */}
            {hackathon.prizes && hackathon.prizes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-primary" />
                    Prizes
                    {hackathon.totalPrizePool && (
                      <Badge variant="primary" size="md" className="ml-2">
                        {hackathon.totalPrizePool}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {hackathon.prizes
                      .sort((a, b) => (a.rank || 999) - (b.rank || 999))
                      .map((prize) => (
                        <div
                          key={prize.id}
                          className="flex items-start justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Award className="w-5 h-5 text-primary" />
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                {prize.title}
                              </h4>
                              {prize.rank > 0 && (
                                <Badge variant="outline" size="sm">
                                  #{prize.rank}
                                </Badge>
                              )}
                            </div>
                            {prize.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {prize.description}
                              </p>
                            )}
                            {prize.sponsor && (
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                Sponsored by {prize.sponsor}
                              </p>
                            )}
                          </div>
                          {prize.amount && (
                            <div className="text-xl font-bold text-primary">{prize.amount}</div>
                          )}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Judging Criteria */}
            {hackathon.criteria && hackathon.criteria.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-6 h-6 text-primary" />
                    Judging Criteria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {hackathon.criteria.map((criterion) => (
                      <div key={criterion.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {criterion.category}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {criterion.description}
                          </p>
                        </div>
                        <Badge variant="primary" size="md">
                          {criterion.weight}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Judges */}
            {hackathon.judges && hackathon.judges.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Judges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hackathon.judges.map((judge) => (
                      <div
                        key={judge.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold">
                          {judge.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {judge.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {judge.title}
                            {judge.company && ` at ${judge.company}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card>
              <CardHeader>
                <CardTitle>Registration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>
                      <strong>Starts:</strong> {formatDate(hackathon.startDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>
                      <strong>Ends:</strong> {formatDate(hackathon.endDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>
                      <strong>Deadline:</strong>{' '}
                      {formatRelativeTime(hackathon.registrationDeadline)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>
                      <strong>Team Size:</strong> {hackathon.teamSize.min} - {hackathon.teamSize.max}{' '}
                      members
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{hackathon.location}</span>
                  </div>
                </div>

                {isRegistrationOpen ? (
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={() => setIsRegistrationModalOpen(true)}
                  >
                    Register Your Team
                  </Button>
                ) : (
                  <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Registration is closed
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Participants</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {hackathon.currentParticipants}
                      {hackathon.maxParticipants && ` / ${hackathon.maxParticipants}`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {hackathon.requiredSkills && hackathon.requiredSkills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Required Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {hackathon.requiredSkills.map((skill) => (
                        <Badge key={skill} variant="outline" size="sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {hackathon.preferredIndustries && hackathon.preferredIndustries.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Preferred Industries
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {hackathon.preferredIndustries.map((industry) => (
                        <Badge key={industry} variant="info" size="sm">
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <Modal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        title="Register Your Team"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Select a team to register for this hackathon. Make sure your team meets the requirements.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Team *
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Choose a team...</option>
              {userTeams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name} ({team.members.length} members)
                </option>
              ))}
            </select>
          </div>
          {userTeams.length === 0 && (
            <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                You don&apos;t have any teams yet.
              </p>
              <Link href="/jobs/build-teams/create">
                <Button variant="primary" size="sm">
                  Create a Team
                </Button>
              </Link>
            </div>
          )}
          <div className="flex items-center gap-3 pt-4">
            <Button
              variant="primary"
              onClick={handleRegister}
              disabled={!selectedTeam || isSubmitting}
              isLoading={isSubmitting}
              className="flex-1"
            >
              Register Team
            </Button>
            <Button variant="outline" onClick={() => setIsRegistrationModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

