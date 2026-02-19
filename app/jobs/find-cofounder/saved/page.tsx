'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import {
  UserCheck,
  Bookmark,
  Search,
  Trash2,
  Edit,
  ArrowRight,
  Filter,
  X,
  Tag,
  Plus,
} from 'lucide-react';
import { useCofounder } from '@/contexts/CofounderContext';
import { matchProfiles } from '@/lib/co-founder-matching-algorithm';
import { SortOption, MatchResult } from '@/types/cofounder';

export default function SavedProfilesPage() {
  const { savedProfiles, unsaveProfile, updateSavedProfile, currentProfile, profiles } = useCofounder();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recently-active');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [showNoteInput, setShowNoteInput] = useState<Record<string, boolean>>({});

  // Get all saved profile IDs
  const savedProfileIds = savedProfiles.map((sp) => sp.profileId);

  // Get full profile data for saved profiles
  const savedProfileData = useMemo(() => {
    if (!currentProfile) return [];

    const saved = profiles
      .filter((p) => savedProfileIds.includes(p.id))
      .map((profile) => {
        const savedProfile = savedProfiles.find((sp) => sp.profileId === profile.id);
        const match = matchProfiles(currentProfile, [profile])[0];
        return {
          profile,
          savedProfile,
          match,
        };
      });

    // Apply search
    let filtered = saved;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = saved.filter(({ profile }) =>
        profile.name.toLowerCase().includes(query) ||
        profile.skills.some((s) => s.toLowerCase().includes(query)) ||
        profile.industry.some((i) => i.toLowerCase().includes(query))
      );
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(({ savedProfile }) =>
        savedProfile?.tags?.some((tag) => selectedTags.includes(tag))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'best-matches':
          return (b.match?.compatibilityScore || 0) - (a.match?.compatibilityScore || 0);
        case 'recently-active':
          return b.profile.lastActive.getTime() - a.profile.lastActive.getTime();
        case 'name-az':
          return a.profile.name.localeCompare(b.profile.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [savedProfiles, profiles, currentProfile, searchQuery, sortBy, selectedTags]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    savedProfiles.forEach((sp) => {
      sp.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, [savedProfiles]);

  const handleSaveNote = (profileId: string) => {
    const note = editingNotes[profileId];
    if (note !== undefined) {
      updateSavedProfile(profileId, { notes: note });
      setShowNoteInput((prev) => ({ ...prev, [profileId]: false }));
    }
  };

  const handleAddTag = (profileId: string, tag: string) => {
    const savedProfile = savedProfiles.find((sp) => sp.profileId === profileId);
    const currentTags = savedProfile?.tags || [];
    if (!currentTags.includes(tag)) {
      updateSavedProfile(profileId, { tags: [...currentTags, tag] });
    }
  };

  const handleRemoveTag = (profileId: string, tag: string) => {
    const savedProfile = savedProfiles.find((sp) => sp.profileId === profileId);
    const currentTags = savedProfile?.tags || [];
    updateSavedProfile(profileId, { tags: currentTags.filter((t) => t !== tag) });
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

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F1F5F9] via-white to-[#F1F5F9] flex items-center justify-center">
        <Card className="border border-gray-200/60">
          <CardContent className="p-12 text-center">
            <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#1E293B] mb-2">No Profile Found</h3>
            <p className="text-[#64748B] mb-6">Please create your profile first</p>
            <Link href="/jobs/find-cofounder/create-profile">
              <Button>Create Profile</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F5F9] via-white to-[#F1F5F9] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200/60 pt-20 lg:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-6 py-8 sm:py-12 max-w-7xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-4">
                <Bookmark className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                <span className="text-xs sm:text-sm font-medium text-primary">Saved Profiles</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#1E293B] dark:text-white mb-3 gradient-text">
                Saved Co-Founders
              </h1>
              <p className="text-base text-[#64748B] dark:text-gray-400">
                Manage your saved profiles with notes and tags
              </p>
            </div>
            <Link href="/jobs/find-cofounder">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Browse More
              </Button>
            </Link>
          </div>

          {/* Search and Filters */}
          <Card className="border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800 mb-6">
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1 w-full relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search saved profiles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 w-full"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="recently-active">Recently Active</option>
                  <option value="best-matches">Best Matches</option>
                  <option value="name-az">Name A-Z</option>
                </select>
              </div>

              {/* Tags Filter */}
              {allTags.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200/60">
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() =>
                          setSelectedTags((prev) =>
                            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                          )
                        }
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          selectedTags.includes(tag)
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-[#64748B] hover:bg-primary/10'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-6 py-8 sm:py-12 max-w-7xl">
        {savedProfileData.length === 0 ? (
          <Card className="border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800">
            <CardContent className="p-12 text-center">
              <Bookmark className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#1E293B] dark:text-white mb-2">
                No saved profiles
              </h3>
              <p className="text-[#64748B] dark:text-gray-400 mb-6">
                Start saving profiles to keep track of potential co-founders
              </p>
              <Link href="/jobs/find-cofounder">
                <Button>Browse Profiles</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedProfileData.map(({ profile, savedProfile, match }) => (
              <Card
                key={profile.id}
                className="group relative overflow-hidden border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800 hover:border-primary/50 transition-all duration-500 ease-out card-hover"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardContent className="p-5 sm:p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-lg font-bold">
                        {profile.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#1E293B] dark:text-white">
                          {profile.name}
                        </h3>
                        <p className="text-xs text-[#64748B] dark:text-gray-400">
                          Saved {savedProfile?.savedAt ? new Date(savedProfile.savedAt).toLocaleDateString() : ''}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => unsaveProfile(profile.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Compatibility Score */}
                  {match && (
                    <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-[#64748B]">Compatibility</span>
                        <span className="text-xl font-bold text-primary">{match.compatibilityScore}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-2">
                        <div
                          className="bg-primary h-1.5 rounded-full"
                          style={{ width: `${match.compatibilityScore}%` }}
                        />
                      </div>
                      <Badge className={getMatchQualityColor(match.matchQuality)} size="sm">
                        {match.matchQuality}
                      </Badge>
                    </div>
                  )}

                  {/* Notes */}
                  {savedProfile?.notes && (
                    <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-start justify-between">
                        <p className="text-sm text-[#64748B] dark:text-gray-400 flex-1">
                          {savedProfile.notes}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingNotes((prev) => ({ ...prev, [profile.id]: savedProfile.notes || '' }));
                            setShowNoteInput((prev) => ({ ...prev, [profile.id]: true }));
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {showNoteInput[profile.id] && (
                    <div className="mb-4">
                      <textarea
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-700"
                        rows={2}
                        value={editingNotes[profile.id] || ''}
                        onChange={(e) =>
                          setEditingNotes((prev) => ({ ...prev, [profile.id]: e.target.value }))
                        }
                        placeholder="Add a note..."
                      />
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          onClick={() => handleSaveNote(profile.id)}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShowNoteInput((prev) => ({ ...prev, [profile.id]: false }));
                            setEditingNotes((prev) => {
                              const updated = { ...prev };
                              delete updated[profile.id];
                              return updated;
                            });
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {!savedProfile?.notes && !showNoteInput[profile.id] && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingNotes((prev) => ({ ...prev, [profile.id]: '' }));
                        setShowNoteInput((prev) => ({ ...prev, [profile.id]: true }));
                      }}
                      className="mb-4 text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Note
                    </Button>
                  )}

                  {/* Tags */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {savedProfile?.tags?.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(profile.id, tag)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add tag..."
                        className="text-xs h-8"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const input = e.currentTarget as HTMLInputElement;
                            if (input.value.trim()) {
                              handleAddTag(profile.id, input.value.trim());
                              input.value = '';
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Skills Preview */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="outline" size="sm">
                          {skill}
                        </Badge>
                      ))}
                      {profile.skills.length > 3 && (
                        <span className="text-xs text-[#64748B] self-center">
                          +{profile.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View
                    </Button>
                    <Button size="sm" className="flex-1">
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

