/**
 * Startup Jobs API Route
 * GET /api/startups/[startupId]/jobs - Get jobs for a startup
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, forwardToMainPlatform } from '@/lib/api-middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ startupId: string }> }
) {
  return withAuth(request, async (req) => {
    const { startupId } = await params;
    return forwardToMainPlatform(`/startup-directory/startups/${startupId}/jobs`, request);
  });
}

