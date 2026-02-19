/**
 * Co-Founder Profiles API Routes
 * GET /api/cofounder/profiles - List co-founder profiles
 * POST /api/cofounder/profiles - Create/update co-founder profile
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, forwardToMainPlatform } from '@/lib/api-middleware';

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, context) => {
    // Exclude current user's profile from matches
    const url = new URL(request.url);
    url.searchParams.set('excludeUserId', context.userId);

    const modifiedRequest = new NextRequest(url, {
      method: request.method,
      headers: request.headers,
    });

    return forwardToMainPlatform('/cofounder/profiles', modifiedRequest);
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, context) => {
    const body = await request.json();
    
    // Add user context
    const profileData = {
      ...body,
      userId: context.userId,
      profileId: context.profileId,
      email: context.email,
    };

    return forwardToMainPlatform('/cofounder/profiles', request, {
      method: 'POST',
      body: profileData,
    });
  });
}

export async function PUT(request: NextRequest) {
  return withAuth(request, async (req, context) => {
    const body = await request.json();
    
    // Add user context
    const profileData = {
      ...body,
      userId: context.userId,
      profileId: context.profileId,
      updatedBy: context.userId,
    };

    return forwardToMainPlatform('/cofounder/profiles', request, {
      method: 'PUT',
      body: profileData,
    });
  });
}

