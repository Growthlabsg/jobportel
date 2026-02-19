'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import {
  UserCheck,
  Search,
  Filter,
  Grid3x3,
  List,
  Settings,
  Plus,
  Bookmark,
  Share2,
  MapPin,
  Clock,
  TrendingUp,
  CheckCircle2,
  X,
  ChevronDown,
  Star,
  Users,
  Target,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { CoFounderProfile, FilterOptions, SortOption, ViewMode, MatchResult, MatchingStats } from '@/types/cofounder';
import { matchProfiles } from '@/lib/co-founder-matching-algorithm';
import { useCofounder } from '@/contexts/CofounderContext';
import { ProfileDetailModal } from '@/components/co-founder/ProfileDetailModal';
import { DetailedMatchAnalysisModal } from '@/components/co-founder/DetailedMatchAnalysisModal';
import { MatchRecommendations } from '@/components/co-founder/MatchRecommendations';
import { EnhancedFilters } from '@/components/co-founder/EnhancedFilters';
import { ActivityIndicator } from '@/components/co-founder/ActivityIndicator';
import { MatchQualityExplanation } from '@/components/co-founder/MatchQualityExplanation';
import { UnifiedChat } from '@/components/shared/UnifiedChat';
import { mockCofounderProfiles } from '@/lib/co-founder/mock-profiles';

export default function FindCofounderPage() {
  const { profiles, currentProfile, addProfile } = useCofounder();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortBy, setSortBy] = useState<SortOption>('best-matches');
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<MatchResult | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatProfile, setChatProfile] = useState<CoFounderProfile | null>(null);

  // Initialize with mock profiles if empty
  useEffect(() => {
    if (profiles.length === 0) {
      mockCofounderProfiles.forEach((profile) => addProfile(profile));
    }
  }, [profiles.length, addProfile]);

  // Current user profile - use context or fallback to mock
  const currentUserProfile = currentProfile || mockCofounderProfiles[0];
  const allProfiles = profiles.length > 0 ? profiles : mockCofounderProfiles;

  // Calculate matches
  const matches = useMemo(() => {
    if (!currentUserProfile) return [];
    
    // Convert filters to match algorithm format
    const algorithmFilters = {
      minCompatibility: filters.minCompatibility,
      location: filters.location,
      experience: filters.experience,
      availability: filters.availability,
      skills: filters.skills,
      values: filters.values,
      industry: filters.industry,
      commitment: filters.commitment,
      languages: filters.languages,
      timezone: filters.timezone,
    };
    
    const results = matchProfiles(currentUserProfile, allProfiles, algorithmFilters);
    
    // Filter out current user's profile and remove duplicates
    const seenIds = new Set<string>();
    let filtered = results.filter((match) => {
      const profileId = match.profile.id;
      // Exclude current user's profile
      if (profileId === currentUserProfile.id) return false;
      // Remove duplicates
      if (seenIds.has(profileId)) return false;
      seenIds.add(profileId);
      return true;
    });
    
    // Apply search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
      filtered = filtered.filter((match) => {
        const p = match.profile;
        return (
          p.name.toLowerCase().includes(query) ||
          p.skills.some((s) => s.toLowerCase().includes(query)) ||
          p.values.some((v) => v.toLowerCase().includes(query)) ||
          p.bio?.toLowerCase().includes(query) ||
          p.lookingFor?.toLowerCase().includes(query) ||
          p.industry.some((i) => i.toLowerCase().includes(query)) ||
          p.responsibilityAreas?.some((r) => r.toLowerCase().includes(query))
        );
      });
    }

    // Apply sorting (results are already sorted by compatibility, but we can override)
    if (sortBy !== 'best-matches') {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'recently-active':
            return b.profile.lastActive.getTime() - a.profile.lastActive.getTime();
          case 'name-az':
            return a.profile.name.localeCompare(b.profile.name);
          case 'nearby':
            // Simplified - would need location distance calculation
            return 0;
          default:
            return b.compatibilityScore - a.compatibilityScore;
        }
      });
    }

    return filtered;
  }, [currentUserProfile, filters, searchQuery, sortBy, allProfiles]);

  // Get top recommendations (excellent matches)
  const recommendations = useMemo(() => {
    return matches
      .filter((m) => m.matchQuality === 'excellent' && m.compatibilityScore >= 85)
      .slice(0, 5);
  }, [matches]);

  // Calculate stats
  const stats: MatchingStats = useMemo(() => {
    const excellent = matches.filter((m) => m.matchQuality === 'excellent').length;
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 3600000);
    const online = matches.filter((m) => m.profile.lastActive > oneHourAgo).length;
    const verified = matches.filter((m) => m.profile.isVerified).length;

    return {
      totalMatches: matches.length,
      excellentMatches: excellent,
      onlineNow: online,
      verifiedProfiles: verified,
    };
  }, [matches]);

  const getMatchQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getExperienceColor = (level: string) => {
    switch (level) {
      case 'expert':
        return 'bg-purple-100 text-purple-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  if (!currentUserProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F1F5F9] via-white to-[#F1F5F9] flex items-center justify-center pt-20 lg:pt-24">
        <Card className="border border-gray-200/60 max-w-md">
          <CardContent className="p-12 text-center">
            <UserCheck className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#1E293B] dark:text-white mb-2">Create Your Profile</h3>
            <p className="text-[#64748B] dark:text-gray-400 mb-6">
              Create your co-founder profile to start matching with compatible founders
            </p>
            <Link href="/jobs/find-cofounder/create-profile">
              <Button size="lg">Create Profile</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Elegant Header Section */}
      <div className="border-b border-gray-100 dark:border-gray-800 pt-20 lg:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
          <div className="max-w-4xl">
        <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#0F7377] dark:text-[#14B8A6] mb-4 tracking-tight">
                Find Your Co-Founder
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                Connect with compatible co-founders using AI-powered matching. Find partners who share your vision, values, and drive.
          </p>
        </div>

            <div className="flex items-center gap-3 mb-12">
              <Link href="/jobs/find-cofounder/create-profile">
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
              Create Profile
            </Button>
              </Link>
              <Link href="/jobs/find-cofounder/settings">
                <Button variant="outline" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
        </div>

            {/* Elegant Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.totalMatches}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Matches</div>
              </div>
                <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.excellentMatches}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Excellent</div>
              </div>
                <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.onlineNow}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Online Now</div>
              </div>
                <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.verifiedProfiles}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Verified</div>
              </div>
        </div>

            {/* Search and Controls */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search by name, skills, values..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 w-full border-gray-200 dark:border-gray-700"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                  </Button>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="best-matches">Best Matches</option>
                    <option value="recently-active">Recently Active</option>
                    <option value="nearby">Nearby</option>
                    <option value="name-az">Name A-Z</option>
                  </select>
                  <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-lg p-1 bg-white dark:bg-gray-800">
                    <Button
                      variant={viewMode === 'card' ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('card')}
                      className="p-2"
                    >
                      <Grid3x3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="p-2"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="lg:w-72 flex-shrink-0">
              <EnhancedFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClose={() => setShowFilters(false)}
              />
            </aside>
          )}

          {/* Results */}
          <main className="flex-1 min-w-0" id="matches-section">
            {/* Match Recommendations */}
            {recommendations.length > 0 && (
              <div className="mb-10">
                <MatchRecommendations
                  recommendations={recommendations}
                  onViewMatch={(match) => {
                    setSelectedProfile(match);
                    setShowDetailModal(true);
                  }}
                />
              </div>
            )}

            {matches.length === 0 ? (
              <div className="text-center py-20">
                <UserCheck className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No matches found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  {searchQuery || Object.keys(filters).length > 0
                    ? "Try adjusting your filters or search query to find more matches."
                    : "Create your profile to start matching with compatible co-founders."}
                </p>
                <div className="flex items-center justify-center gap-3">
                  {(searchQuery || Object.keys(filters).length > 0) && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery('');
                        setFilters({});
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                  <Link href="/jobs/find-cofounder/create-profile">
                    <Button>Create Your Profile</Button>
                  </Link>
                </div>
                  </div>
            ) : (
              <>
                {/* Results Header */}
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                    {matches.length} {matches.length === 1 ? 'Match' : 'Matches'}
                  </h2>
                  {recommendations.length > 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {recommendations.length} excellent matches recommended
                    </p>
                  )}
                </div>

                <div
                  className={
                    viewMode === 'card'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }
                >
                {matches.map((match, index) => (
                  <ProfileCard
                    key={`${match.profile.id}-${index}`}
                    match={match}
                    viewMode={viewMode}
                    onView={() => {
                      setSelectedProfile(match);
                      setShowDetailModal(true);
                    }}
                    onAnalyze={() => {
                      setSelectedProfile(match);
                      setShowAnalysisModal(true);
                    }}
                  />
                ))}
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      {/* Modals */}
      {showChat && chatProfile && (
        <UnifiedChat
          conversationId={null}
          chatType="cofounder-connection"
          participantName={chatProfile.name}
          isOpen={showChat}
          onClose={() => {
            setShowChat(false);
            setChatProfile(null);
          }}
          contextData={{
            cofounderProfileId: chatProfile.id,
          }}
        />
      )}
      {selectedProfile && (
        <>
          <ProfileDetailModal
            match={selectedProfile}
            isOpen={showDetailModal}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedProfile(null);
            }}
            onShowAnalysis={() => {
              setShowDetailModal(false);
              setShowAnalysisModal(true);
            }}
          />
          <DetailedMatchAnalysisModal
            match={selectedProfile}
            isOpen={showAnalysisModal}
            onClose={() => {
              setShowAnalysisModal(false);
              setSelectedProfile(null);
            }}
          />
        </>
      )}
    </div>
  );
}

function ProfileCard({
  match,
  viewMode,
  onView,
  onAnalyze,
  onMessage,
}: {
  match: MatchResult;
  viewMode: ViewMode;
  onView: () => void;
  onAnalyze: () => void;
  onMessage?: () => void;
}) {
  const { 
    saveProfile, 
    unsaveProfile, 
    isProfileSaved, 
    sendConnectionRequest, 
    hasConnectionRequest, 
    currentProfile,
    getConversation,
    createConversation,
  } = useCofounder();
  const isSaved = isProfileSaved(match.profile.id);
  const hasRequest = currentProfile ? hasConnectionRequest(currentProfile.id, match.profile.id) : false;
  const profile = match.profile;
  const conversation = currentProfile ? getConversation(profile.id) : null;
  
  const handleConnect = () => {
    if (!currentProfile) {
      alert('Please create your profile first');
      return;
    }
    sendConnectionRequest(profile.id, `Hi ${profile.name}, I think we'd make great co-founders!`);
    alert('Connection request sent!');
  };

  const handleMessage = () => {
    if (!currentProfile) {
      alert('Please create your profile first');
      return;
    }
    // Check if connection is accepted or create conversation
    const existingConv = getConversation(profile.id);
    if (!existingConv) {
      createConversation([currentProfile.id, profile.id]);
    }
    if (onMessage) {
      onMessage();
    }
  };
  const getMatchQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="group border-b border-gray-100 dark:border-gray-800 py-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 text-lg font-semibold flex-shrink-0">
            {profile.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{profile.name}</h3>
              {profile.isVerified && (
                <Badge variant="success" size="sm" className="text-xs">Verified</Badge>
              )}
              <ActivityIndicator profile={profile} showBadge={false} />
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {profile.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {profile.availability}
              </span>
                  </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {profile.skills.slice(0, 4).map((skill) => (
                <span key={skill} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md">
                        {skill}
                </span>
                    ))}
              {profile.skills.length > 4 && (
                <span className="text-xs text-gray-400">+{profile.skills.length - 4}</span>
              )}
                  </div>
                </div>
          <div className="flex items-center gap-6 flex-shrink-0">
            <div className="text-right">
              <div className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                {match.compatibilityScore}%
              </div>
              <Badge className={`${getMatchQualityColor(match.matchQuality)} text-xs`} size="sm">
                {match.matchQuality}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onView}>View</Button>
              <Button 
                size="sm" 
                onClick={handleConnect}
                disabled={hasRequest}
                variant="outline"
              >
                {hasRequest ? 'Sent' : 'Connect'}
              </Button>
              {conversation && (
                <Button
                  size="sm"
                  onClick={handleMessage}
                >
                  <MessageSquare className="w-4 h-4" />
              </Button>
              )}
            </div>
          </div>
        </div>
    </div>
  );
}

  return (
    <div className="group border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold">
              {profile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{profile.name}</h3>
                {profile.isVerified && (
                  <Badge variant="success" size="sm" className="text-xs">Verified</Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {profile.location}
                </span>
                <ActivityIndicator profile={profile} showBadge={false} />
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (isSaved) {
                  unsaveProfile(match.profile.id);
                } else {
                  saveProfile(match.profile.id);
                }
              }}
              className="h-8 w-8 p-0"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current text-primary' : 'text-gray-400'}`} />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Share2 className="w-4 h-4 text-gray-400" />
            </Button>
          </div>
        </div>

        {/* Compatibility Score */}
        <div className="mb-5 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Compatibility</span>
            <span className="text-2xl font-semibold text-gray-900 dark:text-white">{match.compatibilityScore}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-4">
            <div
              className="bg-primary h-1.5 rounded-full transition-all"
              style={{ width: `${match.compatibilityScore}%` }}
            />
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
            <Badge className={`${getMatchQualityColor(match.matchQuality)} text-xs`} size="sm">
              {match.matchQuality} match
            </Badge>
            <ActivityIndicator profile={profile} />
          </div>
        </div>

        {/* Profile Info */}
        <div className="space-y-4 mb-5">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Skills</p>
            <div className="flex flex-wrap gap-2">
              {profile.skills.slice(0, 4).map((skill) => (
                <span key={skill} className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md">
                  {skill}
                </span>
              ))}
              {profile.skills.length > 4 && (
                <span className="text-xs text-gray-400 self-center">+{profile.skills.length - 4}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium capitalize">
              {profile.experience}
            </span>
            <span className="text-gray-500 dark:text-gray-400">•</span>
            <span className="text-gray-500 dark:text-gray-400 capitalize">{profile.availability}</span>
          </div>
          {profile.bio && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">{profile.bio}</p>
          )}
          {profile.startupIdeaStatus && (
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">Startup Status</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {profile.startupIdeaStatus === 'committed' 
                  ? "Committed to an idea"
                  : profile.startupIdeaStatus === 'exploring'
                  ? "Open to exploring ideas"
                  : "Looking to help with existing idea"}
              </p>
            </div>
          )}
          {profile.fullTimeTiming && (
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">Timing</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">{profile.fullTimeTiming}</p>
            </div>
          )}
          {profile.lookingFor && (
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">Looking For</p>
              <p className="text-sm text-gray-900 dark:text-white line-clamp-1">{profile.lookingFor}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
          <Button variant="outline" className="flex-1" onClick={onView}>
            View Details
          </Button>
          <Button 
            className="flex-1"
            onClick={handleConnect}
            disabled={hasRequest}
            variant="outline"
          >
            {hasRequest ? 'Request Sent' : 'Connect'}
          </Button>
          {conversation && (
            <Button
              className="flex-1"
              onClick={handleMessage}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Message
            </Button>
          )}
        </div>
        <div className="flex gap-2 mt-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-sm"
            onClick={onAnalyze}
          >
            View Analysis
          </Button>
          {profile.schedulingUrl && (
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 text-sm"
              onClick={() => window.open(profile.schedulingUrl, '_blank')}
            >
              Schedule
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
