# Build Teams Service Integration Guide

This guide explains how to set up and connect a separate Build Teams service to the main job portal application.

## Architecture Overview

The Build Teams feature is hosted as a **separate application** to reduce load on the main job portal hosting. The integration uses:

- **Redirect-based SSO**: Authentication token passed via URL parameters
- **Return URL**: Seamless navigation back to the main app
- **Environment-based configuration**: Easy deployment across environments

## Setup Instructions

### 1. Environment Configuration

Add the Build Teams service URL to your `.env.local` or production environment variables:

```bash
# .env.local
NEXT_PUBLIC_BUILD_TEAMS_URL=https://build-teams.yourdomain.com
```

If not set, it defaults to `http://localhost:3002` for local development.

### 2. Main Application Setup (This Repo)

The integration is already configured in:
- **Configuration**: `lib/platform-config.ts` - Contains `BUILD_TEAMS_URL`
- **UI Component**: `app/jobs/hire-talents/page.tsx` - Contains the "Build Teams" button

The button automatically:
- Retrieves the authentication token from localStorage
- Redirects to the Build Teams service with the token
- Includes a return URL for navigation back

### 3. Build Teams Service Setup (Separate Repo)

Your separate Build Teams application should:

#### 3.1 Accept Authentication Token

```typescript
// Example: pages/index.tsx or app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function BuildTeamsPage() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [returnUrl, setReturnUrl] = useState<string | null>(null);

  useEffect(() => {
    // Get token from URL parameters
    const authToken = searchParams.get('token');
    const returnUrlParam = searchParams.get('returnUrl');
    
    if (authToken) {
      setToken(authToken);
      // Store token for API calls
      localStorage.setItem('growthlab_token', authToken);
    }
    
    if (returnUrlParam) {
      setReturnUrl(returnUrlParam);
    }
  }, [searchParams]);

  // Verify token with main platform API
  useEffect(() => {
    if (token) {
      verifyToken(token);
    }
  }, [token]);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL}/api/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        // Redirect to login if token invalid
        window.location.href = `${process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL}/login?redirect=${encodeURIComponent(window.location.href)}`;
      }
    } catch (error) {
      console.error('Token verification failed:', error);
    }
  };

  const handleBackToMain = () => {
    if (returnUrl) {
      window.location.href = returnUrl;
    } else {
      window.location.href = process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL || 'http://localhost:3001';
    }
  };

  return (
    <div>
      {/* Your Build Teams UI */}
      <button onClick={handleBackToMain}>Back to Job Portal</button>
    </div>
  );
}
```

#### 3.2 API Integration

Make authenticated API calls to the main platform:

```typescript
// lib/api-client.ts
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('growthlab_token');
  }
  return null;
};

export const apiClient = {
  async get(endpoint: string) {
    const token = getAuthToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL}/api${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (response.status === 401) {
      // Token expired, redirect to login
      window.location.href = `${process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL}/login?redirect=${encodeURIComponent(window.location.href)}`;
      throw new Error('Unauthorized');
    }
    
    return response.json();
  },
  
  async post(endpoint: string, data: any) {
    const token = getAuthToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL}/api${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (response.status === 401) {
      window.location.href = `${process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL}/login?redirect=${encodeURIComponent(window.location.href)}`;
      throw new Error('Unauthorized');
    }
    
    return response.json();
  },
};
```

#### 3.3 Team Member Data Structure

Use the same types as the main platform:

```typescript
// types/team.ts
export interface TeamMember {
  id: string;
  startupId: string;
  userId?: string; // If linked to Growth Lab user
  name: string;
  role: string;
  title: string;
  bio?: string;
  avatar?: string;
  linkedinUrl?: string;
  isFounder: boolean;
  joinedDate?: string;
  createdAt: string;
}
```

### 4. Security Considerations

#### 4.1 Token Validation

Always validate tokens on the server side:

```typescript
// API route: app/api/verify-token/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }
  
  // Verify token with your auth service
  const isValid = await verifyTokenWithAuthService(token);
  
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
  
  return NextResponse.json({ valid: true });
}
```

#### 4.2 HTTPS in Production

Always use HTTPS in production to protect tokens in transit.

#### 4.3 Token Expiration

Handle token expiration gracefully:

```typescript
// lib/auth.ts
export const handleTokenExpiration = () => {
  const returnUrl = encodeURIComponent(window.location.href);
  const loginUrl = `${process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL}/login?redirect=${returnUrl}`;
  window.location.href = loginUrl;
};
```

### 5. Deployment

#### 5.1 Main Application

Deploy as usual. Ensure `NEXT_PUBLIC_BUILD_TEAMS_URL` is set in production.

#### 5.2 Build Teams Service

Deploy to a separate hosting service (Vercel, Netlify, AWS, etc.):

```bash
# Example: Deploy to Vercel
vercel --prod

# Set environment variable
vercel env add NEXT_PUBLIC_MAIN_PLATFORM_URL production
```

### 6. Testing

#### 6.1 Local Development

1. Start main app: `npm run dev` (port 3001)
2. Start build-teams app: `npm run dev` (port 3002)
3. Set `.env.local`:
   ```bash
   NEXT_PUBLIC_BUILD_TEAMS_URL=http://localhost:3002
   NEXT_PUBLIC_MAIN_PLATFORM_URL=http://localhost:3001
   ```

#### 6.2 Integration Test

1. Login to main app
2. Navigate to `/jobs/hire-talents`
3. Click "Build Teams" button
4. Verify redirect to build-teams service
5. Verify authentication works
6. Test navigation back

### 7. Alternative Integration Methods

#### Option A: Iframe Embedding (Not Recommended)

If you prefer embedding instead of redirect:

```typescript
// Not recommended due to security and UX concerns
<iframe 
  src={`${PLATFORM_CONFIG.BUILD_TEAMS_URL}?token=${token}&embedded=true`}
  className="w-full h-screen"
/>
```

**Issues:**
- Token in iframe URL is less secure
- Poor mobile experience
- Navigation complexity

#### Option B: PostMessage API

For better iframe communication:

```typescript
// Main app
const iframeRef = useRef<HTMLIFrameElement>(null);

useEffect(() => {
  const handleMessage = (event: MessageEvent) => {
    if (event.origin !== PLATFORM_CONFIG.BUILD_TEAMS_URL) return;
    
    if (event.data.type === 'NAVIGATE_BACK') {
      router.push(event.data.url);
    }
  };
  
  window.addEventListener('message', handleMessage);
  return () => window.removeEventListener('message', handleMessage);
}, []);

// Build Teams app
window.parent.postMessage({ 
  type: 'NAVIGATE_BACK', 
  url: '/jobs/hire-talents' 
}, '*');
```

### 8. Troubleshooting

#### Issue: Token not passed
- Check localStorage for `growthlab_token`
- Verify `PLATFORM_CONFIG.STORAGE_KEYS.TOKEN` matches

#### Issue: CORS errors
- Add Build Teams URL to CORS whitelist in main platform
- Check API headers configuration

#### Issue: Redirect loop
- Verify token validation logic
- Check return URL format

### 9. Best Practices

1. **Token Refresh**: Implement token refresh mechanism
2. **Error Handling**: Graceful error handling for network issues
3. **Loading States**: Show loading indicators during redirect
4. **Analytics**: Track usage of Build Teams feature
5. **Monitoring**: Monitor authentication failures

## Summary

The Build Teams service is connected via:
- ✅ Configuration in `lib/platform-config.ts`
- ✅ Button in `app/jobs/hire-talents/page.tsx`
- ✅ Token-based SSO via URL parameters
- ✅ Return URL for seamless navigation

Your separate Build Teams application should:
- ✅ Accept token from URL parameters
- ✅ Verify token with main platform API
- ✅ Use token for authenticated API calls
- ✅ Provide navigation back to main app


