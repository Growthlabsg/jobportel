/**
 * Single Application API Routes
 * GET /api/applications/[applicationId] - Get application by ID
 * PUT /api/applications/[applicationId] - Update application
 * PATCH /api/applications/[applicationId]/status - Update application status
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, forwardToMainPlatform } from '@/lib/api-middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  return withAuth(request, async (req) => {
    const { applicationId } = await params;
    return forwardToMainPlatform(`/applications/${applicationId}`, request);
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  return withAuth(request, async (req, context) => {
    const { applicationId } = await params;
    
    const body = await request.json();
    
    // Add user context
    const applicationData = {
      ...body,
      updatedBy: context.userId,
    };

    return forwardToMainPlatform(`/applications/${applicationId}`, request, {
      method: 'PUT',
      body: applicationData,
    });
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  return withAuth(request, async (req, context) => {
    const { applicationId } = await params;
    
    const body = await request.json();
    
    // Check if user can update status (only employers can change status)
    if (body.status && !['job_management', 'startup_owner'].includes(context.profileType)) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Only employers can update application status' },
        { status: 403 }
      );
    }

    return forwardToMainPlatform(`/applications/${applicationId}`, request, {
      method: 'PATCH',
      body: {
        ...body,
        updatedBy: context.userId,
      },
    });
  });
}

