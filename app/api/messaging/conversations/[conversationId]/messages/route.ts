/**
 * Messages API Routes
 * GET /api/messaging/conversations/[conversationId]/messages - Get messages
 * POST /api/messaging/conversations/[conversationId]/messages - Send message
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, forwardToMainPlatform } from '@/lib/api-middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  return withAuth(request, async (req) => {
    const { conversationId } = await params;
    return forwardToMainPlatform(`/messaging/conversations/${conversationId}/messages`, request);
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  return withAuth(request, async (req, context) => {
    const { conversationId } = await params;
    
    const body = await request.json();
    
    // Add sender context
    const messageData = {
      ...body,
      senderId: context.userId,
      senderProfileId: context.profileId,
      senderEmail: context.email,
    };

    return forwardToMainPlatform(`/messaging/conversations/${conversationId}/messages`, request, {
      method: 'POST',
      body: messageData,
    });
  });
}

