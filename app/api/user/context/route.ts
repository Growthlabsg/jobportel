/**
 * User Context API
 * Returns current user information from main platform
 * GET /api/user/context
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, getTokenFromRequest, getUserContext } from '@/lib/api-middleware';

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, context) => {
    try {
      const token = getTokenFromRequest(request);
      if (!token) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      // Fetch full user data from main platform
      const response = await fetch(`${process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL || 'http://localhost:3001'}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch user data' },
          { status: response.status }
        );
      }

      const data = await response.json();
      const authUser = data.data;

      // Return user context for job portal
      return NextResponse.json({
        success: true,
        data: {
          user: {
            id: authUser.user.id,
            email: authUser.user.email,
            name: authUser.user.name,
            avatar: authUser.user.avatar,
          },
          activeProfile: {
            id: context.profileId,
            profileType: context.profileType,
            displayName: authUser.activeProfile?.displayName || authUser.user.name,
            avatar: authUser.activeProfile?.avatar,
            metadata: authUser.activeProfile?.metadata || {},
          },
          profiles: authUser.profiles.map((profile: any) => ({
            id: profile.id,
            profileType: profile.profileType,
            displayName: profile.displayName,
            isActive: profile.isActive,
            isDefault: profile.isDefault,
          })),
          permissions: {
            canPostJobs: ['job_management', 'startup_owner'].includes(context.profileType),
            canApplyJobs: ['job_seeker', 'job_management'].includes(context.profileType),
            canManageApplications: ['job_management', 'startup_owner'].includes(context.profileType),
            canViewAnalytics: ['job_management', 'startup_owner'].includes(context.profileType),
          },
        },
      });
    } catch (error) {
      console.error('Error fetching user context:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to fetch user context' },
        { status: 500 }
      );
    }
  });
}

