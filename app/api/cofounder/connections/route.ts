/**
 * Co-Founder Connections API Routes
 * GET /api/cofounder/connections - List connection requests
 * POST /api/cofounder/connections - Send connection request
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, forwardToMainPlatform } from '@/lib/api-middleware';

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, context) => {
    // Filter by user
    const url = new URL(request.url);
    url.searchParams.set('userId', context.userId);

    const modifiedRequest = new NextRequest(url, {
      method: request.method,
      headers: request.headers,
    });

    return forwardToMainPlatform('/cofounder/connections', modifiedRequest);
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, context) => {
    const body = await request.json();
    
    // Add sender context
    const connectionData = {
      ...body,
      fromUserId: context.userId,
      fromProfileId: context.profileId,
      fromEmail: context.email,
    };

    return forwardToMainPlatform('/cofounder/connections', request, {
      method: 'POST',
      body: connectionData,
    });
  });
}

