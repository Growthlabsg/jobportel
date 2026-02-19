/**
 * Co-Founder Connection API Routes
 * PATCH /api/cofounder/connections/[connectionId] - Accept/reject connection
 * DELETE /api/cofounder/connections/[connectionId] - Cancel connection
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, forwardToMainPlatform } from '@/lib/api-middleware';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ connectionId: string }> }
) {
  return withAuth(request, async (req, context) => {
    const { connectionId } = await params;
    
    const body = await request.json();
    
    return forwardToMainPlatform(`/cofounder/connections/${connectionId}`, request, {
      method: 'PATCH',
      body: {
        ...body,
        updatedBy: context.userId,
      },
    });
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ connectionId: string }> }
) {
  return withAuth(request, async (req, context) => {
    const { connectionId } = await params;
    
    return forwardToMainPlatform(`/cofounder/connections/${connectionId}`, request, {
      method: 'DELETE',
    });
  });
}

