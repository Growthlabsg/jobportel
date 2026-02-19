/**
 * Single Job Alert API Routes
 * GET /api/alerts/[alertId] - Get alert by ID
 * PUT /api/alerts/[alertId] - Update alert
 * DELETE /api/alerts/[alertId] - Delete alert
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, forwardToMainPlatform } from '@/lib/api-middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ alertId: string }> }
) {
  return withAuth(request, async (req) => {
    const { alertId } = await params;
    return forwardToMainPlatform(`/alerts/${alertId}`, request);
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ alertId: string }> }
) {
  return withAuth(request, async (req, context) => {
    const { alertId } = await params;
    
    const body = await request.json();
    
    return forwardToMainPlatform(`/alerts/${alertId}`, request, {
      method: 'PUT',
      body: {
        ...body,
        updatedBy: context.userId,
      },
    });
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ alertId: string }> }
) {
  return withAuth(request, async (req, context) => {
    const { alertId } = await params;
    
    return forwardToMainPlatform(`/alerts/${alertId}`, request, {
      method: 'DELETE',
    });
  });
}

