/**
 * Single Startup API Routes
 * GET /api/startups/[startupId] - Get startup by ID
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, forwardToMainPlatform } from '@/lib/api-middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ startupId: string }> }
) {
  return withAuth(request, async (req) => {
    const { startupId } = await params;
    return forwardToMainPlatform(`/startup-directory/startups/${startupId}`, request);
  });
}

