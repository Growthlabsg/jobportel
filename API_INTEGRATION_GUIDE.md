# API Integration Guide

## Overview
This document outlines how the Job Portal integrates with the main Growth Lab platform via API.

## Authentication Flow

### 1. Token-Based Authentication
The job portal receives authentication tokens from the main Growth Lab platform.

```typescript
// Token structure expected
interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: 'Bearer';
}
```

### 2. Token Injection
Tokens are passed via:
- **Header**: `Authorization: Bearer <token>`
- **Cookie**: `growthlab_token` (if using cookie-based auth)
- **Context**: React Context API for token management

### 3. Token Refresh
- Automatically refresh expired tokens
- Handle 401 responses by requesting new token
- Fallback to main platform login if refresh fails

## API Client Setup

### Base Configuration
```typescript
// services/api/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.growthlab.sg';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/jobs`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken(); // From main platform
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      const newToken = await refreshToken();
      if (newToken) {
        return apiClient.request(error.config);
      }
      // Redirect to main platform login
      redirectToMainPlatformLogin();
    }
    return Promise.reject(error);
  }
);
```

## API Endpoints Structure

### Base Path
All job portal endpoints are prefixed: `/api/jobs/`

### Endpoint Categories

#### 1. Jobs
- `GET /api/jobs` - List jobs (with filters)
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create job (employer only)
- `PUT /api/jobs/:id` - Update job (employer only)
- `DELETE /api/jobs/:id` - Delete job (employer only)
- `POST /api/jobs/:id/apply` - Apply to job
- `POST /api/jobs/:id/save` - Save job
- `GET /api/jobs/saved` - Get saved jobs
- `DELETE /api/jobs/saved/:id` - Remove saved job

#### 2. Applications
- `GET /api/jobs/applications` - List applications
- `GET /api/jobs/applications/:id` - Get application details
- `PUT /api/jobs/applications/:id/status` - Update application status
- `POST /api/jobs/applications/:id/shortlist` - Shortlist candidate
- `GET /api/jobs/applications/:id/resume` - Download resume

#### 3. Employers
- `GET /api/jobs/employer/jobs` - Get employer's jobs
- `GET /api/jobs/employer/analytics` - Get employer analytics
- `GET /api/jobs/employer/applications` - Get employer's applications

#### 4. Interviews
- `GET /api/jobs/interviews` - List interviews
- `POST /api/jobs/interviews` - Schedule interview
- `PUT /api/jobs/interviews/:id` - Update interview
- `DELETE /api/jobs/interviews/:id` - Cancel interview

#### 5. Co-founders
- `GET /api/jobs/cofounders` - List co-founder profiles
- `GET /api/jobs/cofounders/:id` - Get co-founder profile
- `POST /api/jobs/cofounders` - Create co-founder profile
- `POST /api/jobs/cofounders/:id/connect` - Send connection request

#### 6. Alerts
- `GET /api/jobs/alerts` - List job alerts
- `POST /api/jobs/alerts` - Create job alert
- `PUT /api/jobs/alerts/:id` - Update job alert
- `DELETE /api/jobs/alerts/:id` - Delete job alert

#### 7. Resume
- `POST /api/jobs/resume/upload` - Upload resume
- `POST /api/jobs/resume/parse` - Parse resume
- `GET /api/jobs/resume/:id` - Get resume
- `POST /api/jobs/resume/generate-pdf` - Generate PDF

## User Context

### Getting User Information
```typescript
// Get user from main platform API
interface User {
  id: string;
  email: string;
  name: string;
  role: 'employer' | 'job_seeker' | 'both';
  profile: {
    companyId?: string;
    companyName?: string;
    location?: string;
    // ... other profile fields
  };
}

// Fetch user context
const getUser = async (): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/user/me`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return response.json();
};
```

## Error Handling

### Standard Error Response
```typescript
interface APIError {
  error: {
    code: string;
    message: string;
    details?: any;
  };
  status: number;
}
```

### Error Codes
- `UNAUTHORIZED` (401) - Invalid or expired token
- `FORBIDDEN` (403) - Insufficient permissions
- `NOT_FOUND` (404) - Resource not found
- `VALIDATION_ERROR` (400) - Invalid input
- `SERVER_ERROR` (500) - Internal server error

## Rate Limiting

### Limits
- Standard: 100 requests/minute
- Search: 30 requests/minute
- File upload: 10 requests/minute

### Handling Rate Limits
```typescript
// Response includes rate limit headers
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200

// Handle 429 Too Many Requests
if (error.response?.status === 429) {
  const resetTime = error.response.headers['x-ratelimit-reset'];
  showRateLimitMessage(resetTime);
}
```

## File Uploads

### Resume Upload
```typescript
const uploadResume = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('resume', file);
  
  const response = await apiClient.post('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data.resumeId;
};
```

### File Size Limits
- Resume: 5MB max
- Company logo: 2MB max
- Document attachments: 10MB max

## Webhooks (Optional)

### Events from Main Platform
- `user.updated` - User profile updated
- `company.updated` - Company information updated
- `auth.token_refreshed` - Token refreshed

### Events to Main Platform
- `job.created` - New job posted
- `application.submitted` - New application received
- `interview.scheduled` - Interview scheduled

## Testing

### Mock API for Development
```typescript
// Use MSW (Mock Service Worker) for local development
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/jobs', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        jobs: [...],
        total: 100,
        page: 1,
      })
    );
  }),
];
```

## Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api.growthlab.sg
NEXT_PUBLIC_API_VERSION=v1

# Authentication
NEXT_PUBLIC_AUTH_ENDPOINT=https://api.growthlab.sg/auth

# File Storage
NEXT_PUBLIC_STORAGE_BUCKET=https://storage.growthlab.sg

# Feature Flags
NEXT_PUBLIC_ENABLE_RESUME_PARSING=true
NEXT_PUBLIC_ENABLE_COFOUNDER_MATCHING=true
```

## Security Considerations

1. **Never expose API keys in frontend code**
2. **Always validate user permissions on backend**
3. **Sanitize all user inputs**
4. **Use HTTPS for all API calls**
5. **Implement CSRF protection**
6. **Validate file types and sizes**
7. **Rate limit sensitive endpoints**

## Integration Checklist

- [ ] API base URL configured
- [ ] Authentication token handling implemented
- [ ] Error handling for all API calls
- [ ] Loading states for async operations
- [ ] Retry logic for failed requests
- [ ] Rate limiting handled gracefully
- [ ] File upload functionality tested
- [ ] User context properly fetched
- [ ] Token refresh mechanism working
- [ ] Error messages user-friendly
- [ ] API responses properly typed
- [ ] Mock API for local development

