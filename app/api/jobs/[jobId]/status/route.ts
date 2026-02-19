/**
 * Job Status API Route
 * PATCH /api/jobs/[jobId]/status - Update job status
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, forwardToMainPlatform } from '@/lib/api-middleware';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  return withAuth(request, async (req, context) => {
    const { jobId } = await params;
    
    // Check permission
    if (!['job_management', 'startup_owner'].includes(context.profileType)) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'You do not have permission to update job status' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    return forwardToMainPlatform(`/jobs/${jobId}/status`, request, {
      method: 'PATCH',
      body: {
        ...body,
        updatedBy: context.userId,
      },
    });
  });
}

