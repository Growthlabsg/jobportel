/**
 * Applications API Routes
 * GET /api/applications - List applications with filters
 * POST /api/applications - Create new application
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, forwardToMainPlatform } from '@/lib/api-middleware';

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, context) => {
    // Add user context to query params
    const url = new URL(request.url);
    
    // If user is job seeker, filter by applicant
    if (context.profileType === 'job_seeker') {
      url.searchParams.set('applicantId', context.userId);
      url.searchParams.set('applicantProfileId', context.profileId);
    }
    // If user is employer, filter by job owner
    else if (['job_management', 'startup_owner'].includes(context.profileType)) {
      url.searchParams.set('employerId', context.userId);
      url.searchParams.set('employerProfileId', context.profileId);
    }

    const modifiedRequest = new NextRequest(url, {
      method: request.method,
      headers: request.headers,
    });

    return forwardToMainPlatform('/applications', modifiedRequest);
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, context) => {
    // Check permission
    if (!['job_seeker', 'job_management'].includes(context.profileType)) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'You do not have permission to apply for jobs' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Add applicant context
    const applicationData = {
      ...body,
      applicantId: context.userId,
      applicantProfileId: context.profileId,
      applicantEmail: context.email,
    };

    return forwardToMainPlatform('/applications', request, {
      method: 'POST',
      body: applicationData,
    });
  });
}

