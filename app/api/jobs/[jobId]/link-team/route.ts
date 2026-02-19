import { NextRequest, NextResponse } from 'next/server';
import { withAuth, forwardToMainPlatform } from '@/lib/api-middleware';

/**
 * POST /api/jobs/[jobId]/link-team
 * Link a job to a team (auto-linking when job is posted)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  return withAuth(request, async (req, context) => {
    const { jobId } = await params;
    const body = await request.json();
    const { teamCardId, companyId } = body;

    if (!teamCardId) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'teamCardId is required' },
        { status: 400 }
      );
    }

    // Forward to main platform
    return forwardToMainPlatform(`/jobs/${jobId}/link-team`, request, {
      method: 'POST',
      body: {
        teamCardId,
        companyId,
        updatedBy: context.userId,
      },
    });
  });
}

/**
 * DELETE /api/jobs/[jobId]/link-team
 * Unlink a job from a team
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  return withAuth(request, async (req, context) => {
    const { jobId } = await params;

    // Forward to main platform
    return forwardToMainPlatform(`/jobs/${jobId}/link-team`, request, {
      method: 'DELETE',
    });
  });
}

