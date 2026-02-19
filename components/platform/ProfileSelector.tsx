/**
 * Profile Selector Component
 * Allows users to switch between different profiles or create a new job profile
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { usePlatformAuth } from '@/hooks/usePlatformAuth';
import { UserProfile } from '@/types/platform';
import { User, Plus, Check, Briefcase, Search } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';

interface ProfileSelectorProps {
  onProfileChange?: (profile: UserProfile) => void;
  showCreateOption?: boolean;
}

export const ProfileSelector = ({ onProfileChange, showCreateOption = true }: ProfileSelectorProps) => {
  const { user, activeProfile, loading, switchProfile, createJobProfile } = usePlatformAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileType, setNewProfileType] = useState<'job_management' | 'job_seeker'>('job_seeker');
  const [creating, setCreating] = useState(false);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-600 dark:text-gray-400">Please log in to access job features.</p>
        </CardContent>
      </Card>
    );
  }

  const jobProfiles = user.profiles.filter(
    (p) => p.profileType === 'job_management' || p.profileType === 'job_seeker'
  );

  const handleSwitchProfile = async (profileId: string) => {
    const success = await switchProfile(profileId);
    if (success && onProfileChange) {
      const profile = user.profiles.find((p) => p.id === profileId);
      if (profile) {
        onProfileChange(profile);
      }
    }
  };

  const handleCreateProfile = async () => {
    if (!newProfileName.trim()) return;

    setCreating(true);
    try {
      const profile = await createJobProfile(newProfileType, newProfileName);
      if (profile) {
        setShowCreateModal(false);
        setNewProfileName('');
        if (onProfileChange) {
          onProfileChange(profile);
        }
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Active Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeProfile ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{activeProfile.displayName}</p>
                    <p className="text-sm text-gray-600 capitalize">
                      {activeProfile.profileType.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <Badge variant="success">Active</Badge>
              </div>

              {jobProfiles.length > 1 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Switch Profile:</p>
                  <div className="space-y-2">
                    {jobProfiles
                      .filter((p) => p.id !== activeProfile.id)
                      .map((profile) => (
                        <button
                          key={profile.id}
                          onClick={() => handleSwitchProfile(profile.id)}
                          className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <Briefcase className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium text-gray-900 dark:text-gray-100">{profile.displayName}</p>
                              <p className="text-xs text-gray-500 capitalize">
                                {profile.profileType.replace('_', ' ')}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {showCreateOption && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Profile
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-600 mb-4">No job profile found. Create one to get started.</p>
              {showCreateOption && (
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Job Profile
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Profile Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Job Profile"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Name
            </label>
            <Input
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              placeholder="e.g., My Job Seeker Profile"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Type
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:bg-gray-800">
                <input
                  type="radio"
                  name="profileType"
                  value="job_seeker"
                  checked={newProfileType === 'job_seeker'}
                  onChange={() => setNewProfileType('job_seeker')}
                  className="text-primary"
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Job Seeker</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Looking for job opportunities</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:bg-gray-800">
                <input
                  type="radio"
                  name="profileType"
                  value="job_management"
                  checked={newProfileType === 'job_management'}
                  onChange={() => setNewProfileType('job_management')}
                  className="text-primary"
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Job Management</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Post jobs and manage hiring</p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleCreateProfile}
              disabled={!newProfileName.trim() || creating}
            >
              {creating ? 'Creating...' : 'Create Profile'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

