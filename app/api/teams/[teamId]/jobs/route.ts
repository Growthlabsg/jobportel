import { NextRequest, NextResponse } from 'next/server';
import { withAuth, forwardToMainPlatform } from '@/lib/api-middleware';

/**
 * GET /api/teams/[teamId]/jobs
 * Get all jobs posted by a specific team
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  return withAuth(request, async (req) => {
    const { teamId } = await params;

    if (!teamId) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Team ID is required' },
        { status: 400 }
      );
    }

    // Forward to main platform build-teams API
    return forwardToMainPlatform(`/build-teams/teams/${teamId}/jobs`, request);
  });
}

