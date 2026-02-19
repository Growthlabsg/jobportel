/**
 * Analytics Dashboard API Route
 * GET /api/analytics/dashboard - Get dashboard analytics
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, forwardToMainPlatform } from '@/lib/api-middleware';

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, context) => {
    // Check permission
    if (!['job_management', 'startup_owner'].includes(context.profileType)) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'You do not have permission to view analytics' },
        { status: 403 }
      );
    }

    // Add user filter
    const url = new URL(request.url);
    url.searchParams.set('userId', context.userId);
    url.searchParams.set('profileId', context.profileId);

    const modifiedRequest = new NextRequest(url, {
      method: request.method,
      headers: request.headers,
    });

    return forwardToMainPlatform('/analytics/dashboard', modifiedRequest);
  });
}

