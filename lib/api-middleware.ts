/**
 * API Middleware for GrowthLab Platform Integration
 * Handles authentication, user context, and request forwarding to main platform
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '@/services/platform/auth';

const MAIN_PLATFORM_BASE_URL = process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL || 'http://localhost:3001';
const API_BASE_URL = `${MAIN_PLATFORM_BASE_URL}/api`;

export interface AuthenticatedRequest extends NextRequest {
  userId?: string;
  profileId?: string;
  profileType?: string;
}

/**
 * Get authentication token from request
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  // Try Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Try cookie (for SSR)
  const cookieToken = request.cookies.get('growthlab_token')?.value;
  if (cookieToken) {
    return cookieToken;
  }

  // For client-side, token should be in localStorage (handled by client)
  return null;
}

/**
 * Get user context from main platform
 */
export async function getUserContext(token: string): Promise<{
  userId: string;
  profileId: string;
  profileType: string;
  email: string;
} | null> {
  try {
    const response = await fetch(`${MAIN_PLATFORM_BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const authUser = data.data;

    if (!authUser?.user || !authUser?.profiles?.length) {
      return null;
    }

    const activeProfile = authUser.activeProfile || 
                         authUser.profiles.find((p: any) => p.isActive) ||
                         authUser.profiles.find((p: any) => p.isDefault) ||
                         authUser.profiles[0];

    return {
      userId: authUser.user.id,
      profileId: activeProfile.id,
      profileType: activeProfile.profileType,
      email: authUser.user.email,
    };
  } catch (error) {
    console.error('Error fetching user context:', error);
    return null;
  }
}

/**
 * Authentication middleware
 */
export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: {
    userId: string;
    profileId: string;
    profileType: string;
    email: string;
  }) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication token required' },
        { status: 401 }
      );
    }

    const userContext = await getUserContext(token);
    
    if (!userContext) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.userId = userContext.userId;
    authenticatedRequest.profileId = userContext.profileId;
    authenticatedRequest.profileType = userContext.profileType;

    return handler(authenticatedRequest, userContext);
  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Authentication failed' },
      { status: 500 }
    );
  }
}

/**
 * Forward request to main platform API
 */
export async function forwardToMainPlatform(
  endpoint: string,
  request: NextRequest,
  options: {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
  } = {}
): Promise<NextResponse> {
  const token = getTokenFromRequest(request);
  
  const url = `${API_BASE_URL}${endpoint}`;
  const method = options.method || request.method;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Forward query parameters
  const searchParams = request.nextUrl.searchParams.toString();
  const fullUrl = searchParams ? `${url}?${searchParams}` : url;

  let body: string | undefined;
  if (options.body) {
    body = JSON.stringify(options.body);
  } else if (method !== 'GET' && method !== 'HEAD') {
    try {
      body = await request.text();
    } catch (error) {
      // No body
    }
  }

  try {
    const response = await fetch(fullUrl, {
      method,
      headers,
      body,
    });

    const data = await response.json().catch(() => ({}));
    
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error forwarding to main platform:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to connect to main platform' },
      { status: 500 }
    );
  }
}

/**
 * Check if user has required permission
 */
export async function checkPermission(
  request: NextRequest,
  requiredPermission: string
): Promise<boolean> {
  const token = getTokenFromRequest(request);
  if (!token) return false;

  try {
    const userContext = await getUserContext(token);
    if (!userContext) return false;

    // Check profile type permissions
    const profilePermissions: Record<string, string[]> = {
      'job_management': ['post_jobs', 'view_applications', 'manage_jobs', 'view_analytics'],
      'job_seeker': ['apply_jobs', 'view_jobs', 'manage_applications'],
      'startup_owner': ['post_jobs', 'view_applications', 'manage_jobs', 'view_analytics'],
    };

    const permissions = profilePermissions[userContext.profileType] || [];
    return permissions.includes(requiredPermission);
  } catch (error) {
    return false;
  }
}

/**
 * Get user's active profile from main platform
 */
export async function getActiveProfile(token: string): Promise<any> {
  try {
    const response = await fetch(`${MAIN_PLATFORM_BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const authUser = data.data;

    return authUser.activeProfile || 
           authUser.profiles?.find((p: any) => p.isActive) ||
           authUser.profiles?.find((p: any) => p.isDefault) ||
           authUser.profiles?.[0] ||
           null;
  } catch (error) {
    console.error('Error fetching active profile:', error);
    return null;
  }
}

