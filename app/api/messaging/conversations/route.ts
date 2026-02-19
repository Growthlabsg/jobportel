/**
 * Messaging Conversations API Routes
 * GET /api/messaging/conversations - List conversations
 * POST /api/messaging/conversations - Create new conversation
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, forwardToMainPlatform } from '@/lib/api-middleware';

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, context) => {
    // Filter by user
    const url = new URL(request.url);
    url.searchParams.set('userId', context.userId);
    url.searchParams.set('profileId', context.profileId);

    const modifiedRequest = new NextRequest(url, {
      method: request.method,
      headers: request.headers,
    });

    return forwardToMainPlatform('/messaging/conversations', modifiedRequest);
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, context) => {
    const body = await request.json();
    
    // Add user context
    const conversationData = {
      ...body,
      createdBy: context.userId,
      profileId: context.profileId,
    };

    return forwardToMainPlatform('/messaging/conversations', request, {
      method: 'POST',
      body: conversationData,
    });
  });
}

