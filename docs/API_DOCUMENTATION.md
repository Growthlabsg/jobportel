# GrowthLab Job Portal - Comprehensive API Documentation

## Overview

The Job Portal API is a comprehensive REST API that integrates with the main GrowthLab platform. All user authentication and data are managed through the main platform, and this API acts as a proxy layer that adds job portal-specific context and permissions.

## Base URL

```
/api
```

All endpoints are prefixed with `/api` and are relative to the job portal's base URL.

## Authentication

All API requests require authentication via Bearer token from the main GrowthLab platform:

```
Authorization: Bearer <token>
```

The token is automatically included in requests made from the frontend via the API client interceptors.

## User Context

All authenticated requests automatically include:
- `userId`: Current user's ID from main platform
- `profileId`: Active profile ID
- `profileType`: Type of profile (`job_management`, `job_seeker`, `startup_owner`, etc.)
- `email`: User's email address

## API Endpoints

### User & Authentication

#### Get User Context
```
GET /api/user/context
```

Returns current user information and permissions.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "avatar": "https://..."
    },
    "activeProfile": {
      "id": "profile_456",
      "profileType": "job_management",
      "displayName": "John Doe - Employer",
      "avatar": "https://...",
      "metadata": {}
    },
    "profiles": [...],
    "permissions": {
      "canPostJobs": true,
      "canApplyJobs": true,
      "canManageApplications": true,
      "canViewAnalytics": true
    }
  }
}
```

---

### Jobs

#### List Jobs
```
GET /api/jobs?search=developer&location=remote&jobType=full-time&page=1&limit=20
```

**Query Parameters:**
- `search`: Search query
- `location`: Filter by location
- `jobType`: Filter by job type
- `experienceLevel`: Filter by experience level
- `salaryMin`: Minimum salary
- `salaryMax`: Maximum salary
- `currency`: Salary currency
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

#### Get Job by ID
```
GET /api/jobs/[jobId]
```

#### Create Job
```
POST /api/jobs
```

**Required Permissions:** `job_management` or `startup_owner` profile type

**Request Body:**
```json
{
  "title": "Senior Full Stack Developer",
  "companyId": "company_123",
  "description": "...",
  "location": "Remote",
  "jobType": "Full-time",
  "salary": {
    "min": 8000,
    "max": 12000,
    "currency": "USD"
  },
  "skills": ["React", "Node.js"],
  ...
}
```

#### Update Job
```
PUT /api/jobs/[jobId]
```

**Required Permissions:** `job_management` or `startup_owner` profile type

#### Delete Job
```
DELETE /api/jobs/[jobId]
```

**Required Permissions:** `job_management` or `startup_owner` profile type

#### Update Job Status
```
PATCH /api/jobs/[jobId]/status
```

**Request Body:**
```json
{
  "status": "Published" | "Draft" | "Closed"
}
```

#### Get My Jobs
```
GET /api/jobs/my
```

Returns jobs posted by the current user.

**Required Permissions:** `job_management` or `startup_owner` profile type

---

### Applications

#### List Applications
```
GET /api/applications?jobId=job_123&status=pending&page=1
```

**Query Parameters:**
- `jobId`: Filter by job ID
- `status`: Filter by status
- `applicantId`: Filter by applicant (for job seekers)
- `employerId`: Filter by employer (for employers)
- `page`: Page number
- `limit`: Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 45,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

#### Get Application by ID
```
GET /api/applications/[applicationId]
```

#### Create Application
```
POST /api/applications
```

**Required Permissions:** `job_seeker` or `job_management` profile type

**Request Body:**
```json
{
  "jobId": "job_123",
  "coverLetter": "...",
  "resumeUrl": "https://...",
  "portfolioUrl": "https://...",
  "answers": {}
}
```

#### Update Application
```
PUT /api/applications/[applicationId]
```

#### Update Application Status
```
PATCH /api/applications/[applicationId]/status
```

**Required Permissions:** `job_management` or `startup_owner` profile type (only employers can change status)

**Request Body:**
```json
{
  "status": "pending" | "reviewed" | "accepted" | "rejected"
}
```

---

### Freelancer

#### List Projects
```
GET /api/freelancer/projects
```

#### Create Project
```
POST /api/freelancer/projects
```

**Request Body:**
```json
{
  "title": "Website Redesign",
  "description": "...",
  "budget": {
    "min": 1000,
    "max": 5000,
    "currency": "USD"
  },
  "skills": ["React", "Design"],
  "deadline": "2024-12-31",
  ...
}
```

#### List Proposals
```
GET /api/freelancer/proposals
```

Returns proposals by the current user (freelancer).

#### Create Proposal
```
POST /api/freelancer/proposals
```

**Request Body:**
```json
{
  "projectId": "project_123",
  "proposal": "...",
  "bidAmount": 3000,
  "currency": "USD",
  "timeline": "4 weeks",
  "portfolioUrl": "https://..."
}
```

---

### Co-Founder Matching

#### List Co-Founder Profiles
```
GET /api/cofounder/profiles?location=remote&skills=React&experience=expert
```

**Query Parameters:**
- `location`: Filter by location
- `skills`: Filter by skills (comma-separated)
- `experience`: Filter by experience level
- `availability`: Filter by availability
- `industry`: Filter by industry
- `excludeUserId`: Automatically set to current user

#### Create/Update Co-Founder Profile
```
POST /api/cofounder/profiles
PUT /api/cofounder/profiles
```

**Request Body:**
```json
{
  "name": "John Doe",
  "location": "San Francisco, USA",
  "bio": "...",
  "skills": ["React", "Node.js"],
  "experience": "expert",
  "availability": "full-time",
  "industry": ["Tech", "SaaS"],
  ...
}
```

#### Get Matches
```
GET /api/cofounder/matches?minCompatibility=70&location=remote
```

Returns matched co-founder profiles based on compatibility algorithm.

**Query Parameters:**
- `minCompatibility`: Minimum compatibility score (0-100)
- `location`: Filter by location
- `skills`: Filter by skills
- `experience`: Filter by experience
- `sortBy`: Sort option (`best-matches`, `recently-active`, `name-az`)

#### List Connection Requests
```
GET /api/cofounder/connections
```

Returns connection requests (sent and received).

#### Send Connection Request
```
POST /api/cofounder/connections
```

**Request Body:**
```json
{
  "toProfileId": "profile_789",
  "message": "Hi, I'd like to connect..."
}
```

#### Accept/Reject Connection
```
PATCH /api/cofounder/connections/[connectionId]
```

**Request Body:**
```json
{
  "status": "accepted" | "rejected"
}
```

#### Cancel Connection
```
DELETE /api/cofounder/connections/[connectionId]
```

---

### Messaging

#### List Conversations
```
GET /api/messaging/conversations
```

Returns all conversations for the current user.

#### Create Conversation
```
POST /api/messaging/conversations
```

**Request Body:**
```json
{
  "type": "job-application" | "freelancer-proposal" | "cofounder-connection" | "direct",
  "participantId": "user_123",
  "contextData": {
    "jobId": "job_123",
    "applicationId": "app_456"
  }
}
```

#### Get Messages
```
GET /api/messaging/conversations/[conversationId]/messages?page=1&limit=50
```

#### Send Message
```
POST /api/messaging/conversations/[conversationId]/messages
```

**Request Body:**
```json
{
  "content": "Hello!",
  "attachments": ["https://..."],
  "type": "text" | "file" | "image"
}
```

---

### Analytics

#### Get Dashboard Analytics
```
GET /api/analytics/dashboard
```

**Required Permissions:** `job_management` or `startup_owner` profile type

**Response:**
```json
{
  "success": true,
  "data": {
    "totalJobs": 25,
    "activeJobs": 18,
    "totalApplications": 342,
    "pendingApplications": 45,
    "views": 1234,
    "applicationsByStatus": {...},
    "topPerformingJobs": [...],
    "recentActivity": [...]
  }
}
```

#### Get Job Analytics
```
GET /api/analytics/jobs/[jobId]
```

**Required Permissions:** `job_management` or `startup_owner` profile type

**Response:**
```json
{
  "success": true,
  "data": {
    "jobId": "job_123",
    "views": 456,
    "applications": 23,
    "applicationRate": 5.04,
    "viewsOverTime": [...],
    "applicationsOverTime": [...],
    "topSources": [...]
  }
}
```

---

### Saved Items

#### Get Saved Items
```
GET /api/saved?type=jobs
```

**Query Parameters:**
- `type`: Type of saved item (`jobs`, `profiles`, `projects`)

#### Save Item
```
POST /api/saved
```

**Request Body:**
```json
{
  "type": "job" | "profile" | "project",
  "itemId": "job_123"
}
```

#### Unsave Item
```
DELETE /api/saved
```

**Request Body:**
```json
{
  "type": "job",
  "itemId": "job_123"
}
```

---

### Job Alerts

#### List Job Alerts
```
GET /api/alerts
```

#### Create Job Alert
```
POST /api/alerts
```

**Request Body:**
```json
{
  "name": "React Developer Jobs",
  "keywords": ["React", "Frontend"],
  "locations": ["Remote", "San Francisco"],
  "jobTypes": ["Full-time"],
  "experienceLevels": ["Senior"],
  "salaryMin": 8000,
  "salaryMax": 15000,
  "salaryCurrency": "USD",
  "frequency": "Daily" | "Weekly"
}
```

#### Update Job Alert
```
PUT /api/alerts/[alertId]
```

#### Delete Job Alert
```
DELETE /api/alerts/[alertId]
```

---

### Startups (Startup Directory Integration)

#### List Startups
```
GET /api/startups?industry=Tech&size=11-50
```

#### Get Startup by ID
```
GET /api/startups/[startupId]
```

#### Get Startup Jobs
```
GET /api/startups/[startupId]/jobs
```

Returns all jobs posted by a specific startup.

---

### Health Check

#### Health Check
```
GET /api/health
```

Returns API health status and connection to main platform.

**Response:**
```json
{
  "status": "ok",
  "service": "jobs-portal",
  "timestamp": "2024-01-15T10:30:00Z",
  "mainPlatform": {
    "url": "http://localhost:3001",
    "connected": true
  },
  "version": "1.0"
}
```

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "details": {} // Optional additional error details
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Integration with Main Platform

All API requests are forwarded to the main GrowthLab platform API at:

```
${NEXT_PUBLIC_MAIN_PLATFORM_URL}/api
```

The job portal API adds:
1. **User Context**: Automatically includes `userId`, `profileId`, `profileType`, and `email`
2. **Permission Checks**: Validates user permissions before allowing operations
3. **Data Enrichment**: Adds job portal-specific metadata to requests
4. **Error Handling**: Provides consistent error responses

---

## Rate Limiting

Rate limiting is handled by the main platform API. Typical limits:
- **Authenticated requests**: 1000 requests/hour
- **Unauthenticated requests**: 100 requests/hour

---

## WebSocket Support

Real-time messaging is available via WebSocket connection to the main platform:

```
ws://${MAIN_PLATFORM_URL}/api/messaging/ws?conversationId={id}&token={token}
```

---

## Example Usage

### Frontend API Client

```typescript
import { apiClient } from '@/services/api/client';

// Get jobs
const jobs = await apiClient.get('/jobs', {
  params: {
    search: 'developer',
    location: 'remote',
    page: 1,
    limit: 20,
  },
});

// Create job
const newJob = await apiClient.post('/jobs', {
  title: 'Senior Developer',
  description: '...',
  location: 'Remote',
  // ... other fields
});

// Apply for job
const application = await apiClient.post('/applications', {
  jobId: 'job_123',
  coverLetter: '...',
});
```

### Direct API Calls

```typescript
const response = await fetch('/api/jobs', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

const data = await response.json();
```

---

## Notes

- All timestamps are in ISO 8601 format
- All monetary values should include currency code
- Pagination defaults: `page=1`, `limit=20`
- Maximum `limit` is 100 items per page
- All IDs are UUIDs or platform-specific identifiers

