/**
 * React Hook for Startup Directory Integration
 */

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Startup, PaginatedResponse } from '@/types/platform';
import { getStartups, getMyStartups, getStartup } from '@/services/platform/startupDirectory';

export function useStartups(page: number = 1, limit: number = 50, search?: string) {
  return useQuery<PaginatedResponse<Startup>>({
    queryKey: ['startups', page, limit, search],
    queryFn: () => getStartups(page, limit, search),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: typeof window !== 'undefined',
  });
}

export function useMyStartups() {
  return useQuery<Startup[]>({
    queryKey: ['my-startups'],
    queryFn: getMyStartups,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: typeof window !== 'undefined',
  });
}

export function useStartup(startupId: string | null) {
  return useQuery<Startup | null>({
    queryKey: ['startup', startupId],
    queryFn: () => startupId ? getStartup(startupId) : null,
    enabled: !!startupId && typeof window !== 'undefined',
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

