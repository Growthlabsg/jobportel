/**
 * Single Job API Routes
 * GET /api/jobs/[jobId] - Get job by ID
 * PUT /api/jobs/[jobId] - Update job
 * DELETE /api/jobs/[jobId] - Delete job
 * PATCH /api/jobs/[jobId]/status - Update job status
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, forwardToMainPlatform } from '@/lib/api-middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  return withAuth(request, async (req) => {
    const { jobId } = await params;
    return forwardToMainPlatform(`/jobs/${jobId}`, request);
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  return withAuth(request, async (req, context) => {
    const { jobId } = await params;
    
    // Check permission
    if (!['job_management', 'startup_owner'].includes(context.profileType)) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'You do not have permission to update jobs' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Add user context
    const jobData = {
      ...body,
      updatedBy: context.userId,
    };

    return forwardToMainPlatform(`/jobs/${jobId}`, request, {
      method: 'PUT',
      body: jobData,
    });
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  return withAuth(request, async (req, context) => {
    const { jobId } = await params;
    
    // Check permission
    if (!['job_management', 'startup_owner'].includes(context.profileType)) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'You do not have permission to delete jobs' },
        { status: 403 }
      );
    }

    return forwardToMainPlatform(`/jobs/${jobId}`, request, {
      method: 'DELETE',
    });
  });
}

