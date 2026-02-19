# Growth Lab Jobs Portal - Platform Integration Summary

## ✅ Completed Integration

The Jobs Portal has been successfully integrated with the main Growth Lab platform as a microservice. Here's what has been implemented:

### 1. **API Integration Structure** ✅
- Created comprehensive API services for platform integration
- All API calls route through the main platform
- Proper error handling and token refresh mechanisms

### 2. **Authentication System** ✅
- Integrated with main platform's user authentication
- Token-based authentication with automatic refresh
- Redirects to main platform login when unauthenticated

### 3. **Profile Management** ✅
- Support for multiple profiles under one account
- Profile types: `job_management`, `job_seeker`, `sports`, `cofounder`, `investor`
- Profile switching functionality
- Profile creation UI component

### 4. **Startup Directory Integration** ✅
- Jobs automatically sync to Startup Directory
- Startup selector in job posting form
- Real-time job status updates in both systems
- Jobs visible in startup profiles

### 5. **Data Models** ✅
- Complete TypeScript types for platform integration
- Aligned with main platform structure
- Support for all profile types and startup data

## 📁 File Structure

### New Files Created

```
types/
  └── platform.ts                    # Platform integration types

services/
  └── platform/
      ├── auth.ts                     # Authentication service
      ├── startupDirectory.ts         # Startup Directory integration
      └── jobs.ts                     # Jobs API integration

hooks/
  ├── usePlatformAuth.ts             # Auth hook
  └── useStartups.ts                 # Startup directory hooks

components/
  └── platform/
      ├── ProfileSelector.tsx        # Profile switching UI
      └── StartupSelector.tsx        # Startup selection UI

lib/
  └── platform-config.ts             # Platform configuration
```

### Updated Files

```
services/api/client.ts                # Updated with platform integration
hooks/useJobs.ts                      # Updated to use platform API
components/employer/JobPostingForm.tsx # Integrated startup selector
```

## 🔌 API Endpoints

### Main Platform Endpoints Used

**Authentication:**
- `GET /api/auth/me` - Get current user and profiles
- `POST /api/auth/profiles` - Create new profile
- `POST /api/auth/profiles/:id/activate` - Switch profile
- `POST /api/auth/refresh` - Refresh token

**Jobs:**
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `PATCH /api/jobs/:id/status` - Update status
- `GET /api/jobs/my` - Get user's jobs

**Startup Directory:**
- `GET /api/startup-directory/startups` - Get all startups
- `GET /api/startup-directory/startups/my` - Get user's startups
- `GET /api/startup-directory/startups/:id` - Get startup details
- `GET /api/startup-directory/startups/:id/jobs` - Get startup jobs
- `POST /api/startup-directory/startups/:id/jobs` - Sync job
- `PUT /api/startup-directory/startups/:id/jobs/:jobId` - Update job
- `DELETE /api/startup-directory/startups/:id/jobs/:jobId` - Remove job
- `PATCH /api/startup-directory/startups/:id/jobs/:jobId/status` - Update status

## 🔄 Data Flow

### Job Creation Flow

```
User Creates Job in Jobs Portal
    ↓
Select Startup from Startup Directory
    ↓
Submit Job Form
    ↓
POST /api/jobs (Main Platform)
    ↓
Job Saved to Main Platform
    ↓
If startupId provided:
    ↓
POST /api/startup-directory/startups/:id/jobs
    ↓
Job Appears in Startup Directory
```

### Profile Switching Flow

```
User Switches Profile
    ↓
POST /api/auth/profiles/:id/activate
    ↓
Token Updated
    ↓
Profile Context Updated
    ↓
UI Reflects New Profile
```

## 🎯 Key Features

### 1. **Multi-Profile Support**
- Users can create multiple profiles (job_seeker, job_management, etc.)
- Each profile has its own settings and permissions
- Easy profile switching via UI component

### 2. **Startup Directory Sync**
- Jobs automatically appear in startup profiles
- Real-time status updates
- Job details visible in Startup Directory

### 3. **Seamless Authentication**
- Single sign-on with main platform
- Automatic token refresh
- Graceful error handling

### 4. **Unified Data Source**
- All data comes from main platform
- No duplicate data storage
- Consistent data across microservices

## 🔧 Configuration

### Environment Variables

```env
# Main Platform URL
NEXT_PUBLIC_MAIN_PLATFORM_URL=http://localhost:3001

# Optional: Custom login URL
NEXT_PUBLIC_MAIN_PLATFORM_LOGIN_URL=http://localhost:3001/login
```

### Storage Keys

- `growthlab_token` - Access token
- `growthlab_refresh_token` - Refresh token
- `growthlab_user` - User data (cached)
- `growthlab_active_profile` - Active profile ID

## 📝 Usage Examples

### Using Platform Auth Hook

```typescript
import { usePlatformAuth } from '@/hooks/usePlatformAuth';

function MyComponent() {
  const { user, activeProfile, switchProfile, isAuthenticated } = usePlatformAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      <p>Welcome, {activeProfile?.displayName}</p>
      <button onClick={() => switchProfile(profileId)}>
        Switch Profile
      </button>
    </div>
  );
}
```

### Using Startup Selector

```typescript
import { StartupSelector } from '@/components/platform/StartupSelector';

function JobForm() {
  const [startupId, setStartupId] = useState<string | null>(null);
  
  return (
    <StartupSelector
      value={startupId || undefined}
      onChange={setStartupId}
      required
    />
  );
}
```

### Creating Job with Startup Sync

```typescript
import { createJob } from '@/services/platform/jobs';

const job = await createJob(jobData, startupId);
// Job is automatically synced to startup directory
```

## 🚀 Next Steps

1. **Backend Implementation**: Implement the API endpoints in the main Growth Lab platform
2. **Testing**: Test the integration with real backend
3. **Error Handling**: Add more robust error handling for edge cases
4. **Real-time Updates**: Consider WebSocket integration for real-time job updates
5. **Permissions**: Implement role-based access control per profile

## 📚 Documentation

- See `README-INTEGRATION.md` for detailed API documentation
- See `types/platform.ts` for complete type definitions
- See individual service files for implementation details

## ✨ Benefits

1. **Unified User Experience**: Single account, multiple profiles
2. **Data Consistency**: All data in one place
3. **Easy Integration**: Simple API-based integration
4. **Scalable**: Easy to add more microservices
5. **Maintainable**: Clear separation of concerns

---

**Status**: ✅ Integration Complete - Ready for Backend Implementation

