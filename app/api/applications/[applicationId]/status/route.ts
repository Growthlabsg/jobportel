/**
 * Application Status API Route
 * PATCH /api/applications/[applicationId]/status - Update application status
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, forwardToMainPlatform } from '@/lib/api-middleware';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  return withAuth(request, async (req, context) => {
    const { applicationId } = await params;
    
    // Check permission - only employers can change status
    if (!['job_management', 'startup_owner'].includes(context.profileType)) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Only employers can update application status' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    return forwardToMainPlatform(`/applications/${applicationId}/status`, request, {
      method: 'PATCH',
      body: {
        ...body,
        updatedBy: context.userId,
      },
    });
  });
}

