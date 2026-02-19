/**
 * Freelancer Projects API Routes
 * GET /api/freelancer/projects - List projects
 * POST /api/freelancer/projects - Create new project
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, forwardToMainPlatform } from '@/lib/api-middleware';

export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    return forwardToMainPlatform('/freelancer/projects', request);
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, context) => {
    const body = await request.json();
    
    // Add user context
    const projectData = {
      ...body,
      postedBy: context.userId,
      profileId: context.profileId,
    };

    return forwardToMainPlatform('/freelancer/projects', request, {
      method: 'POST',
      body: projectData,
    });
  });
}

