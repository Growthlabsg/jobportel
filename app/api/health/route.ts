/**
 * Health Check API Route
 * GET /api/health - Check API health and connection to main platform
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const MAIN_PLATFORM_BASE_URL = process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL || 'http://localhost:3001';
  
  try {
    // Check connection to main platform
    const response = await fetch(`${MAIN_PLATFORM_BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    }).catch(() => null);

    const isMainPlatformConnected = response?.ok || false;

    return NextResponse.json({
      status: 'ok',
      service: 'jobs-portal',
      timestamp: new Date().toISOString(),
      mainPlatform: {
        url: MAIN_PLATFORM_BASE_URL,
        connected: isMainPlatformConnected,
      },
      version: process.env.NEXT_PUBLIC_API_VERSION || '1.0',
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      service: 'jobs-portal',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
    }, { status: 500 });
  }
}

