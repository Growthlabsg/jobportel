/**
 * My Jobs API Route
 * GET /api/jobs/my - Get jobs posted by current user
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, forwardToMainPlatform } from '@/lib/api-middleware';

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, context) => {
    // Check permission
    if (!['job_management', 'startup_owner'].includes(context.profileType)) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'You do not have permission to view your jobs' },
        { status: 403 }
      );
    }

    // Add user filter to query params
    const url = new URL(request.url);
    url.searchParams.set('postedBy', context.userId);
    url.searchParams.set('profileId', context.profileId);

    const modifiedRequest = new NextRequest(url, {
      method: request.method,
      headers: request.headers,
    });

    return forwardToMainPlatform('/jobs', modifiedRequest);
  });
}

