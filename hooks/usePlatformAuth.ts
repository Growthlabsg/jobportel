/**
 * React Hook for Growth Lab Platform Authentication
 */

import { useState, useEffect } from 'react';
import { AuthUser, UserProfile } from '@/types/platform';
import { getCurrentUser, getActiveJobProfile, switchProfile, createJobProfile } from '@/services/platform/auth';

export function usePlatformAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const authUser = await getCurrentUser();
      setUser(authUser);
      
      if (authUser) {
        const profile = await getActiveJobProfile();
        setActiveProfile(profile);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load user'));
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchProfile = async (profileId: string) => {
    try {
      const success = await switchProfile(profileId);
      if (success) {
        await loadUser(); // Reload to get updated active profile
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to switch profile'));
      return false;
    }
  };

  const handleCreateJobProfile = async (
    profileType: 'job_management' | 'job_seeker',
    displayName: string,
    metadata?: Record<string, unknown>
  ) => {
    try {
      const profile = await createJobProfile(profileType, displayName, metadata);
      if (profile) {
        await loadUser(); // Reload to get new profile
      }
      return profile;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create profile'));
      return null;
    }
  };

  return {
    user,
    activeProfile,
    loading,
    error,
    refresh: loadUser,
    switchProfile: handleSwitchProfile,
    createJobProfile: handleCreateJobProfile,
    isAuthenticated: !!user,
  };
}

