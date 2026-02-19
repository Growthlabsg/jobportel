# Growth Lab Jobs Portal - Main Platform Integration

This document describes how the Jobs Portal integrates with the main Growth Lab platform as a microservice.

## Architecture Overview

The Jobs Portal is a microservice that integrates with the main Growth Lab platform. Users access it through the main platform's sidebar by clicking the "Jobs" button.

### Key Integration Points

1. **Authentication**: Uses main platform's user authentication system
2. **User Profiles**: Supports multiple profiles under one account (job_management, job_seeker, etc.)
3. **Startup Directory**: Jobs sync automatically to the Startup Directory section
4. **Data Flow**: All data is retrieved from and stored in the main platform

## API Integration

### Base URLs

- **Main Platform**: `NEXT_PUBLIC_MAIN_PLATFORM_URL` (default: `http://localhost:3001`)
- **API Base**: `${MAIN_PLATFORM_URL}/api`

### Authentication

All API requests include the authentication token from the main platform:

```typescript
Authorization: Bearer <token>
```

The token is stored in `localStorage` as `growthlab_token` and is automatically included in all requests via the API client interceptors.

### Endpoints

#### Authentication
- `GET /api/auth/me` - Get current user and profiles
- `POST /api/auth/profiles` - Create new profile
- `POST /api/auth/profiles/:id/activate` - Switch active profile
- `POST /api/auth/refresh` - Refresh access token

#### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `PATCH /api/jobs/:id/status` - Update job status
- `GET /api/jobs/my` - Get jobs posted by current user

#### Startup Directory
- `GET /api/startup-directory/startups` - Get all startups
- `GET /api/startup-directory/startups/my` - Get user's startups
- `GET /api/startup-directory/startups/:id` - Get startup by ID
- `GET /api/startup-directory/startups/:id/jobs` - Get jobs for startup
- `POST /api/startup-directory/startups/:id/jobs` - Sync job to startup directory
- `PUT /api/startup-directory/startups/:id/jobs/:jobId` - Update job in startup directory
- `DELETE /api/startup-directory/startups/:id/jobs/:jobId` - Remove job from startup directory
- `PATCH /api/startup-directory/startups/:id/jobs/:jobId/status` - Update job status

## User Profiles

Users can have multiple profiles under one account:

- **job_management**: For employers posting and managing jobs
- **job_seeker**: For candidates looking for opportunities
- **sports**: For sports-related activities (separate microservice)
- **cofounder**: For finding co-founders (separate microservice)
- **investor**: For investors (separate microservice)

Each profile has its own metadata and settings. Users can switch between profiles, and the active profile determines permissions and data access.

## Startup Directory Integration

When a job is created or updated in the Jobs Portal:

1. The job is saved to the main platform's jobs database
2. If a `startupId` is provided, the job is automatically synced to the Startup Directory
3. The job appears in the startup's profile in the Startup Directory section
4. Job status changes (Published, Draft, Closed) are reflected in both systems

### Job Sync Flow

```
Job Created/Updated in Jobs Portal
    ↓
Save to Main Platform Jobs API
    ↓
If startupId exists:
    ↓
Sync to Startup Directory
    ↓
Job appears in Startup Directory
```

## Environment Variables

Required environment variables:

```env
# Main Platform URL
NEXT_PUBLIC_MAIN_PLATFORM_URL=http://localhost:3001

# Main Platform Login URL (optional)
NEXT_PUBLIC_MAIN_PLATFORM_LOGIN_URL=http://localhost:3001/login
```

## Services

### Platform Services

- **`services/platform/auth.ts`**: Authentication and profile management
- **`services/platform/startupDirectory.ts`**: Startup Directory integration
- **`services/platform/jobs.ts`**: Jobs API integration

### Hooks

- **`hooks/usePlatformAuth.ts`**: React hook for authentication and profiles
- **`hooks/useStartups.ts`**: React hooks for startup directory data

### Components

- **`components/platform/ProfileSelector.tsx`**: Profile switching UI
- **`components/platform/StartupSelector.tsx`**: Startup selection for job posting

## Data Models

See `types/platform.ts` for complete type definitions:

- `GrowthLabUser`: Main platform user account
- `UserProfile`: Profile under user account
- `JobManagementProfile`: Extended profile for jobs portal
- `Startup`: Startup from directory
- `StartupJob`: Job synced to startup directory

## Usage Examples

### Get Current User

```typescript
import { getCurrentUser } from '@/services/platform/auth';

const user = await getCurrentUser();
```

### Create Job with Startup Sync

```typescript
import { createJob } from '@/services/platform/jobs';

const job = await createJob(jobData, startupId);
// Job is automatically synced to startup directory
```

### Switch Profile

```typescript
import { switchProfile } from '@/services/platform/auth';

await switchProfile(profileId);
```

### Use Platform Auth Hook

```typescript
import { usePlatformAuth } from '@/hooks/usePlatformAuth';

function MyComponent() {
  const { user, activeProfile, switchProfile } = usePlatformAuth();
  // ...
}
```

## Error Handling

The API client automatically handles:

- **401 Unauthorized**: Attempts token refresh, redirects to login if failed
- **403 Forbidden**: Logs error (user doesn't have permission)
- **500+ Server Errors**: Logs error for debugging

## Security

- All API requests require authentication token
- Tokens are stored securely in localStorage
- Token refresh is handled automatically
- Failed authentication redirects to main platform login

## Future Enhancements

- Real-time job sync with WebSockets
- Batch job operations
- Advanced profile permissions
- Cross-microservice notifications

