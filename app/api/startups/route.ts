/**
 * Startups API Routes (from Startup Directory)
 * GET /api/startups - List startups
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, forwardToMainPlatform } from '@/lib/api-middleware';

export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    // Forward to startup directory API
    return forwardToMainPlatform('/startup-directory/startups', request);
  });
}

