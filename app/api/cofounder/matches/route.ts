/**
 * Co-Founder Matches API Route
 * GET /api/cofounder/matches - Get matched co-founder profiles
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, forwardToMainPlatform } from '@/lib/api-middleware';

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, context) => {
    // Add user context for matching
    const url = new URL(request.url);
    url.searchParams.set('userId', context.userId);
    url.searchParams.set('excludeUserId', context.userId); // Exclude self

    const modifiedRequest = new NextRequest(url, {
      method: request.method,
      headers: request.headers,
    });

    return forwardToMainPlatform('/cofounder/matches', modifiedRequest);
  });
}

