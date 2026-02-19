'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import {
  X,
  Bookmark,
  Share2,
  MapPin,
  Clock,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Mail,
  Calendar,
  Award,
  Target,
  Users,
  Briefcase,
  CheckCircle2,
  XCircle,
  Lightbulb,
  TrendingUp,
  FileText,
  ExternalLink,
  Video,
  Star,
  Zap,
  Heart,
  Building2,
  GraduationCap,
  Rocket,
  Instagram,
} from 'lucide-react';
import { MatchResult, CoFounderProfile } from '@/types/cofounder';
import { useCofounder } from '@/contexts/CofounderContext';

interface ProfileDetailModalProps {
  match: MatchResult;
  isOpen: boolean;
  onClose: () => void;
  onShowAnalysis?: () => void;
}

export function ProfileDetailModal({ match, isOpen, onClose, onShowAnalysis }: ProfileDetailModalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const profile = match.profile;
  
  // Access context - hooks must be called unconditionally
  const { saveProfile, unsaveProfile, isProfileSaved, sendConnectionRequest } = useCofounder();
  const isSaved = isProfileSaved(profile.id);

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 w-full sm:max-w-5xl sm:rounded-2xl shadow-2xl sm:my-8 min-h-screen sm:min-h-0 sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header - Simplified */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-lg sm:text-xl font-bold flex-shrink-0">
                {profile.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg sm:text-xl font-bold text-[#1E293B] dark:text-white truncate">{profile.name}</h2>
                  {profile.isVerified && (
                    <Badge variant="success" size="sm" className="flex-shrink-0">Verified</Badge>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-[#64748B] dark:text-gray-400 truncate">
                  {profile.location}
                  {profile.timezone && ` • ${profile.timezone}`}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="flex-shrink-0 ml-2">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Compatibility Score - Simplified */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div>
              <p className="text-xs text-[#64748B] dark:text-gray-400 mb-1">Compatibility</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl sm:text-4xl font-bold text-[#1E293B] dark:text-white">
                  {match.compatibilityScore}%
                </p>
                <Badge className={getMatchQualityColor(match.matchQuality)} size="sm">
                  {match.matchQuality}
                </Badge>
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${match.compatibilityScore}%` }}
            />
          </div>
          {match.matchReasons && match.matchReasons.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {match.matchReasons.slice(0, 2).map((reason, idx) => (
                <span key={idx} className="text-xs text-[#64748B] dark:text-gray-400">
                  • {reason}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6">
              <TabsList className="w-full sm:w-auto bg-transparent border-b-0 h-auto p-0 gap-1">
                <TabsTrigger value="overview" className="text-sm px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Overview</TabsTrigger>
                <TabsTrigger value="skills" className="text-sm px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Skills</TabsTrigger>
                <TabsTrigger value="values" className="text-sm px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Values</TabsTrigger>
                <TabsTrigger value="goals" className="text-sm px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Goals</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="p-4 sm:p-6 space-y-6">
              {/* About Section */}
              <div>
                <h3 className="text-sm font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wide mb-3">About</h3>
                <p className="text-sm text-[#1E293B] dark:text-white leading-relaxed">
                  {profile.bio || 'No bio provided'}
                </p>
              </div>

              {profile.lookingFor && (
                <div>
                  <h3 className="text-sm font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wide mb-3">Looking For</h3>
                  <p className="text-sm text-[#1E293B] dark:text-white leading-relaxed">{profile.lookingFor}</p>
                </div>
              )}

              {/* Startup Status & Details */}
              {profile.startupIdeaStatus && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wide mb-3">Startup Status</h3>
                    <p className="text-sm text-[#1E293B] dark:text-white leading-relaxed mb-4">
                      {profile.startupIdeaStatus === 'committed' 
                        ? "Yes, I'm committed to an idea and I want a co-founder who can help me build it"
                        : profile.startupIdeaStatus === 'exploring'
                        ? "I have some ideas, but I'm also open to exploring other ideas"
                        : "No, I could help a co-founder with their existing idea or explore new ideas together"}
                    </p>
                  </div>
                  {profile.companyName && (
                    <div>
                      <p className="text-xs font-medium text-[#64748B] dark:text-gray-400 mb-1">Company/Project</p>
                      <p className="text-sm text-[#1E293B] dark:text-white">{profile.companyName}</p>
                    </div>
                  )}
                  {profile.companyDescription && (
                    <div>
                      <p className="text-xs font-medium text-[#64748B] dark:text-gray-400 mb-1">Description</p>
                      <p className="text-sm text-[#1E293B] dark:text-white leading-relaxed">{profile.companyDescription}</p>
                    </div>
                  )}
                  {profile.progressDescription && (
                    <div>
                      <p className="text-xs font-medium text-[#64748B] dark:text-gray-400 mb-1">Progress</p>
                      <p className="text-sm text-[#1E293B] dark:text-white leading-relaxed">{profile.progressDescription}</p>
                    </div>
                  )}
                  {profile.fundingRaised && (
                    <div>
                      <p className="text-xs font-medium text-[#64748B] dark:text-gray-400 mb-1">Funding</p>
                      <p className="text-sm text-[#1E293B] dark:text-white">{profile.fundingRaised}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Key Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {profile.fullTimeTiming && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wide mb-2">Full-Time Timing</h3>
                    <p className="text-sm text-[#1E293B] dark:text-white">{profile.fullTimeTiming}</p>
                  </div>
                )}

                {profile.responsibilityAreas && profile.responsibilityAreas.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wide mb-2">Responsibility Areas</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.responsibilityAreas.map((area) => (
                        <Badge key={area} variant="outline" size="sm" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#1E293B] dark:text-white mb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Experience & Background
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-100 text-purple-800" size="sm">
                      {profile.experience}
                    </Badge>
                    <span className="text-sm text-[#64748B] dark:text-gray-400">
                      Experience Level
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#64748B]" />
                    <span className="text-sm text-[#64748B] dark:text-gray-400 capitalize">
                      {profile.availability} availability
                    </span>
                  </div>
                  {profile.technicalStatus !== undefined && (
                    <div className="flex items-center gap-2">
                      <Badge className={profile.technicalStatus ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"} size="sm">
                        {profile.technicalStatus ? 'Technical' : 'Non-Technical'}
                      </Badge>
                    </div>
                  )}
                  {profile.fundingStage && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Funding Stage: </span>
                      <Badge variant="outline" size="sm" className="capitalize">
                        {profile.fundingStage}
                      </Badge>
                    </div>
                  )}
                  {profile.teamSize && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Team Size: </span>
                      <Badge variant="outline" size="sm">
                        {profile.teamSize}
                      </Badge>
                    </div>
                  )}
                  {profile.commitment && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Commitment: </span>
                      <Badge variant="outline" size="sm" className="capitalize">
                        {profile.commitment}
                      </Badge>
                    </div>
                  )}
                  {profile.riskTolerance && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Risk Tolerance: </span>
                      <Badge variant="outline" size="sm" className="capitalize">
                        {profile.riskTolerance}
                      </Badge>
                    </div>
                  )}
                  {profile.workStyle && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Work Style: </span>
                      <Badge variant="outline" size="sm" className="capitalize">
                        {profile.workStyle}
                      </Badge>
                    </div>
                  )}
                  {profile.communication && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Communication: </span>
                      <Badge variant="outline" size="sm" className="capitalize">
                        {profile.communication}
                      </Badge>
                    </div>
                  )}
                  {profile.previousStartups > 0 && (
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#64748B]" />
                      <span className="text-sm text-[#64748B] dark:text-gray-400">
                        {profile.previousStartups} previous startup{profile.previousStartups > 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                  {profile.education && (
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#64748B]" />
                      <span className="text-sm text-[#64748B] dark:text-gray-400">
                        {profile.education}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {profile.achievements && profile.achievements.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wide mb-3">Achievements</h3>
                  <ul className="space-y-2">
                    {profile.achievements.map((achievement, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-[#1E293B] dark:text-white">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wide mb-3">Industry Focus</h3>
                <div className="flex flex-wrap gap-1.5">
                  {profile.industry.map((ind) => (
                    <Badge key={ind} variant="outline" size="sm" className="text-xs">
                      {ind}
                    </Badge>
                  ))}
                </div>
              </div>

              {profile.employmentHistory && profile.employmentHistory.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wide mb-3">Employment History</h3>
                  <div className="space-y-2">
                    {profile.employmentHistory.map((emp, idx) => (
                      <div key={idx} className="text-sm text-[#1E293B] dark:text-white p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        {emp}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Personal Information - Simplified */}
              <div className="space-y-6">
                {profile.equityExpectations && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wide mb-2">Equity Expectations</h3>
                    <p className="text-sm text-[#1E293B] dark:text-white">{profile.equityExpectations}</p>
                  </div>
                )}

                {profile.freeTimeDescription && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wide mb-2">Free Time Activities</h3>
                    <p className="text-sm text-[#1E293B] dark:text-white leading-relaxed">{profile.freeTimeDescription}</p>
                  </div>
                )}

                {profile.lifePathStory && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wide mb-2">Life Path Story</h3>
                    <p className="text-sm text-[#1E293B] dark:text-white leading-relaxed">{profile.lifePathStory}</p>
                  </div>
                )}

                {profile.additionalInfo && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wide mb-2">Additional Information</h3>
                    <p className="text-sm text-[#1E293B] dark:text-white leading-relaxed">{profile.additionalInfo}</p>
                  </div>
                )}
              </div>

              {/* Social Links & Contact */}
              {(profile.linkedin || profile.github || profile.twitter || profile.portfolio || profile.schedulingUrl || profile.instagram || profile.videoIntroduction) && (
                <div>
                  <h3 className="text-sm font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wide mb-3">Links & Contact</h3>
                  <div className="flex flex-wrap gap-2">
                        {profile.linkedin && (
                          <a 
                            href={profile.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm text-[#1E293B] dark:text-white"
                          >
                            <Linkedin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span>LinkedIn</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {profile.github && (
                          <a 
                            href={profile.github} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm text-[#1E293B] dark:text-white"
                          >
                            <Github className="w-4 h-4" />
                            <span>GitHub</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {profile.twitter && (
                          <a 
                            href={profile.twitter} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm text-[#1E293B] dark:text-white"
                          >
                            <Twitter className="w-4 h-4 text-blue-400" />
                            <span>Twitter</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {profile.instagram && (
                          <a 
                            href={profile.instagram} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm text-[#1E293B] dark:text-white"
                          >
                            <Instagram className="w-4 h-4 text-pink-500" />
                            <span>Instagram</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {profile.portfolio && (
                          <a 
                            href={profile.portfolio} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm text-[#1E293B] dark:text-white"
                          >
                            <Globe className="w-4 h-4" />
                            <span>Portfolio</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {profile.videoIntroduction && (
                          <a 
                            href={profile.videoIntroduction} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm text-[#1E293B] dark:text-white"
                          >
                            <Video className="w-4 h-4 text-red-500" />
                            <span>Video</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {profile.schedulingUrl && (
                          <a 
                            href={profile.schedulingUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors text-sm font-medium text-primary"
                          >
                            <Calendar className="w-4 h-4" />
                            <span>Schedule Meeting</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                  </div>
                </div>
              )}

              {/* Co-Founder Preferences */}
              {(profile.whatLookingFor || profile.ideaPreference || profile.technicalPreference || profile.timingPreference || profile.locationPreference || profile.agePreference || (profile.preferredResponsibilityAreas && profile.preferredResponsibilityAreas.length > 0)) && (
                <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                  <h3 className="text-sm font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wide mb-4">Co-Founder Preferences</h3>
                  <div className="space-y-4">
                    {profile.whatLookingFor && (
                      <div>
                        <p className="text-xs text-[#64748B] dark:text-gray-400 mb-1">What They&apos;re Looking For</p>
                        <p className="text-sm text-[#1E293B] dark:text-white leading-relaxed">{profile.whatLookingFor}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {profile.ideaPreference && (
                        <div>
                          <p className="text-xs text-[#64748B] dark:text-gray-400 mb-1">Idea Preference</p>
                          <p className="text-sm text-[#1E293B] dark:text-white">
                            {profile.ideaPreference === 'specific' 
                              ? "Specific idea"
                              : profile.ideaPreference === 'open'
                              ? "Open to ideas"
                              : "No preference"}
                            {profile.ideaPreferenceImportance && (
                              <span className="ml-2 text-xs text-[#64748B] dark:text-gray-400">
                                ({profile.ideaPreferenceImportance === 'high' ? 'Required' : profile.ideaPreferenceImportance === 'medium' ? 'Preferred' : 'Flexible'})
                              </span>
                            )}
                          </p>
                        </div>
                      )}

                      {profile.technicalPreference && (
                        <div>
                          <p className="text-xs text-[#64748B] dark:text-gray-400 mb-1">Technical Preference</p>
                          <p className="text-sm text-[#1E293B] dark:text-white">
                            {profile.technicalPreference === 'technical' 
                              ? "Technical"
                              : profile.technicalPreference === 'non-technical'
                              ? "Non-technical"
                              : "No preference"}
                            {profile.technicalPreferenceImportance && (
                              <span className="ml-2 text-xs text-[#64748B] dark:text-gray-400">
                                ({profile.technicalPreferenceImportance === 'high' ? 'Required' : profile.technicalPreferenceImportance === 'medium' ? 'Preferred' : 'Flexible'})
                              </span>
                            )}
                          </p>
                        </div>
                      )}

                      {profile.timingPreference && (
                        <div>
                          <p className="text-xs text-[#64748B] dark:text-gray-400 mb-1">Timing Preference</p>
                          <p className="text-sm text-[#1E293B] dark:text-white">
                            {profile.timingPreference === 'match-only' 
                              ? "Must match timing"
                              : profile.timingPreference === 'prefer-match'
                              ? "Prefer matching timing"
                              : "No preference"}
                          </p>
                        </div>
                      )}

                      {profile.locationPreference && (
                        <div>
                          <p className="text-xs text-[#64748B] dark:text-gray-400 mb-1">Location Preference</p>
                          <p className="text-sm text-[#1E293B] dark:text-white">
                            {profile.locationPreference === 'distance' 
                              ? "Within distance"
                              : profile.locationPreference === 'country'
                              ? "Same country"
                              : profile.locationPreference === 'region'
                              ? "Same region"
                              : "No preference"}
                            {profile.locationPreferenceImportance && (
                              <span className="ml-2 text-xs text-[#64748B] dark:text-gray-400">
                                ({profile.locationPreferenceImportance === 'high' ? 'Required' : profile.locationPreferenceImportance === 'medium' ? 'Preferred' : 'Flexible'})
                              </span>
                            )}
                          </p>
                        </div>
                      )}

                      {profile.agePreference && (
                        <div>
                          <p className="text-xs text-[#64748B] dark:text-gray-400 mb-1">Age Preference</p>
                          <p className="text-sm text-[#1E293B] dark:text-white">
                            {profile.agePreference[0]} - {profile.agePreference[1]} years
                          </p>
                        </div>
                      )}
                    </div>

                    {profile.preferredResponsibilityAreas && profile.preferredResponsibilityAreas.length > 0 && (
                      <div>
                        <p className="text-xs text-[#64748B] dark:text-gray-400 mb-2">Preferred Responsibility Areas</p>
                        <div className="flex flex-wrap gap-1.5">
                          {profile.preferredResponsibilityAreas.map((area) => (
                            <Badge key={area} variant="outline" size="sm" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="skills" className="p-4 sm:p-6">
              <h3 className="text-sm font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wide mb-4">
                Skills Breakdown
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
                        Complementary Skills
                      </h4>
                      <div className="space-y-2">
                        {match.breakdown.skills.complementary.length > 0 ? (
                          match.breakdown.skills.complementary.map((skill) => (
                            <Badge key={skill} variant="success" size="sm" className="block w-fit text-xs">
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-xs text-[#64748B]">None</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">
                        Overlapping Skills
                      </h4>
                      <div className="space-y-2">
                        {match.breakdown.skills.overlapping.length > 0 ? (
                          match.breakdown.skills.overlapping.map((skill) => (
                            <Badge key={skill} variant="info" size="sm" className="block w-fit text-xs">
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-xs text-[#64748B]">None</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-orange-700 dark:text-orange-400 mb-2">
                        Missing Skills
                      </h4>
                      <div className="space-y-2">
                        {match.breakdown.skills.missing.length > 0 ? (
                          match.breakdown.skills.missing.map((skill) => (
                            <Badge key={skill} variant="warning" size="sm" className="block w-fit text-xs">
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-xs text-[#64748B]">None</p>
                        )}
                      </div>
                    </div>
                  </div>
            </TabsContent>

            <TabsContent value="values" className="p-4 sm:p-6">
              <h3 className="text-sm font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wide mb-4">
                Values Alignment
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
                        Aligned Values
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {match.breakdown.values.aligned.length > 0 ? (
                          match.breakdown.values.aligned.map((value) => (
                            <Badge key={value} variant="success" size="sm" className="text-xs">
                              {value}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-xs text-[#64748B]">None</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
                        Potential Conflicts
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {match.breakdown.values.conflicting.length > 0 ? (
                          match.breakdown.values.conflicting.map((value) => (
                            <Badge key={value} variant="error" size="sm" className="text-xs">
                              {value}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-xs text-[#64748B]">None</p>
                        )}
                      </div>
                    </div>
                  </div>
            </TabsContent>

            <TabsContent value="goals" className="p-4 sm:p-6">
              <h3 className="text-sm font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wide mb-4">
                Goals Comparison
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
                        Shared Goals
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {match.breakdown.goals.shared.length > 0 ? (
                          match.breakdown.goals.shared.map((goal) => (
                            <Badge key={goal} variant="success" size="sm" className="text-xs">
                              {goal}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-xs text-[#64748B]">None</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-400 mb-2">
                        Different Goals
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {match.breakdown.goals.different.length > 0 ? (
                          match.breakdown.goals.different.map((goal) => (
                            <Badge key={goal} variant="outline" size="sm" className="text-xs">
                              {goal}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-xs text-[#64748B]">None</p>
                        )}
                      </div>
                    </div>
                  </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (isSaved) {
                    unsaveProfile(profile.id);
                  } else {
                    saveProfile(profile.id);
                  }
                }}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                <span className="ml-2">{isSaved ? 'Saved' : 'Save'}</span>
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4" />
                <span className="ml-2">Share</span>
              </Button>
            </div>
            <div className="flex gap-2">
              {onShowAnalysis && (
                <Button variant="outline" onClick={onShowAnalysis} size="sm">
                  View Analysis
                </Button>
              )}
              <Button variant="outline" onClick={onClose} size="sm">
                Close
              </Button>
              <Button
                onClick={() => {
                  sendConnectionRequest(profile.id);
                  onClose();
                }}
                size="sm"
              >
                Send Connection Request
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

