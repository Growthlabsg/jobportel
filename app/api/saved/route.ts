/**
 * Saved Items API Routes
 * GET /api/saved - Get saved jobs/profiles
 * POST /api/saved - Save job/profile
 * DELETE /api/saved - Unsave job/profile
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, forwardToMainPlatform } from '@/lib/api-middleware';

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, context) => {
    // Filter by user
    const url = new URL(request.url);
    url.searchParams.set('userId', context.userId);
    url.searchParams.set('profileId', context.profileId);

    const modifiedRequest = new NextRequest(url, {
      method: request.method,
      headers: request.headers,
    });

    return forwardToMainPlatform('/saved', modifiedRequest);
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, context) => {
    const body = await request.json();
    
    // Add user context
    const saveData = {
      ...body,
      userId: context.userId,
      profileId: context.profileId,
    };

    return forwardToMainPlatform('/saved', request, {
      method: 'POST',
      body: saveData,
    });
  });
}

export async function DELETE(request: NextRequest) {
  return withAuth(request, async (req, context) => {
    const body = await request.json();
    
    // Add user context
    const unsaveData = {
      ...body,
      userId: context.userId,
      profileId: context.profileId,
    };

    return forwardToMainPlatform('/saved', request, {
      method: 'DELETE',
      body: unsaveData,
    });
  });
}

