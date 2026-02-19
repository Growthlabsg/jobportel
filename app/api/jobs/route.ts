/**
 * Jobs API Routes
 * Handles all job-related operations
 * GET /api/jobs - List jobs with filters
 * POST /api/jobs - Create new job
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, forwardToMainPlatform } from '@/lib/api-middleware';

export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    // Forward to main platform jobs API
    return forwardToMainPlatform('/jobs', request);
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, context) => {
    try {
      // Check permission
      if (!['job_management', 'startup_owner'].includes(context.profileType)) {
        return NextResponse.json(
          { error: 'Forbidden', message: 'You do not have permission to post jobs' },
          { status: 403 }
        );
      }

      const body = await request.json();
      
      // Add user context to job data
      const jobData = {
        ...body,
        postedBy: context.userId,
        profileId: context.profileId,
        companyId: body.companyId || context.profileId, // Use profileId as fallback
      };

      // Forward to main platform
      return forwardToMainPlatform('/jobs', request, {
        method: 'POST',
        body: jobData,
      });
    } catch (error) {
      console.error('Error creating job:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to create job' },
        { status: 500 }
      );
    }
  });
}

