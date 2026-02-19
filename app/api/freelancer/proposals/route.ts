/**
 * Freelancer Proposals API Routes
 * GET /api/freelancer/proposals - List proposals
 * POST /api/freelancer/proposals - Create new proposal
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, forwardToMainPlatform } from '@/lib/api-middleware';

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, context) => {
    // Add user filter
    const url = new URL(request.url);
    url.searchParams.set('freelancerId', context.userId);
    url.searchParams.set('freelancerProfileId', context.profileId);

    const modifiedRequest = new NextRequest(url, {
      method: request.method,
      headers: request.headers,
    });

    return forwardToMainPlatform('/freelancer/proposals', modifiedRequest);
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, context) => {
    const body = await request.json();
    
    // Add freelancer context
    const proposalData = {
      ...body,
      freelancerId: context.userId,
      freelancerProfileId: context.profileId,
      freelancerEmail: context.email,
    };

    return forwardToMainPlatform('/freelancer/proposals', request, {
      method: 'POST',
      body: proposalData,
    });
  });
}

