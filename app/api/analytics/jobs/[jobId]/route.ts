/**
 * Job Analytics API Route
 * GET /api/analytics/jobs/[jobId] - Get analytics for specific job
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, forwardToMainPlatform } from '@/lib/api-middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  return withAuth(request, async (req, context) => {
    // Check permission
    if (!['job_management', 'startup_owner'].includes(context.profileType)) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'You do not have permission to view job analytics' },
        { status: 403 }
      );
    }

    const { jobId } = await params;
    return forwardToMainPlatform(`/analytics/jobs/${jobId}`, request);
  });
}

