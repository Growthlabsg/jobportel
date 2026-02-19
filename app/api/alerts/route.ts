/**
 * Job Alerts API Routes
 * GET /api/alerts - List job alerts
 * POST /api/alerts - Create job alert
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

    return forwardToMainPlatform('/alerts', modifiedRequest);
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, context) => {
    const body = await request.json();
    
    // Add user context
    const alertData = {
      ...body,
      userId: context.userId,
      profileId: context.profileId,
      email: context.email,
    };

    return forwardToMainPlatform('/alerts', request, {
      method: 'POST',
      body: alertData,
    });
  });
}

