# Technical Architecture

## System Overview

The Growth Lab Job Portal is a **frontend application** that integrates with the main Growth Lab platform via RESTful APIs. It is designed as a modular, scalable, and maintainable system.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│              Growth Lab Main Platform                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Auth Service│  │  User Service│  │  API Gateway │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │
└─────────┼──────────────────┼──────────────────┼─────────┘
          │                  │                  │
          │  JWT Token       │  User Context    │  API Calls
          │                  │                  │
┌─────────┼──────────────────┼──────────────────┼─────────┐
│         │                  │                  │         │
│  ┌──────▼──────────────────▼──────────────────▼──────┐  │
│  │         Job Portal Frontend (Next.js)             │  │
│  │                                                    │  │
│  │  ┌──────────────┐  ┌──────────────┐             │  │
│  │  │   Pages      │  │  Components  │             │  │
│  │  │  (Routes)    │  │  (UI/Logic)  │             │  │
│  │  └──────┬───────┘  └──────┬───────┘             │  │
│  │         │                  │                      │  │
│  │  ┌──────▼──────────────────▼───────┐             │  │
│  │  │      Services Layer             │             │  │
│  │  │  - API Client                   │             │  │
│  │  │  - State Management             │             │  │
│  │  │  - Utilities                   │             │  │
│  │  └──────┬──────────────────────────┘             │  │
│  │         │                                         │  │
│  │  ┌──────▼──────────────────────────┐             │  │
│  │  │      API Integration            │             │  │
│  │  │  - HTTP Client (Axios)          │             │  │
│  │  │  - Request Interceptors         │             │  │
│  │  │  - Response Interceptors        │             │  │
│  │  │  - Error Handling               │             │  │
│  │  └─────────────────────────────────┘             │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend Framework
- **Next.js 14+** (App Router)
  - Server-side rendering
  - API routes (if needed)
  - File-based routing
  - Image optimization
  - Built-in performance optimizations

### Styling
- **Tailwind CSS**
  - Utility-first CSS
  - Custom theme configuration
  - Responsive design utilities
  - Dark mode support (if needed)

### State Management
- **Zustand** (Global state)
  - Lightweight
  - Simple API
  - TypeScript support
- **React Query** (Server state)
  - Caching
  - Background updates
  - Optimistic updates

### Forms & Validation
- **React Hook Form**
  - Performance optimized
  - Minimal re-renders
  - Easy validation
- **Zod**
  - TypeScript-first
  - Runtime validation
  - Schema inference

### API Client
- **Axios**
  - Interceptors
  - Request/response transformation
  - Error handling
  - Timeout configuration

### UI Components
- **Custom Components** (Primary)
  - Full control
  - Brand consistency
  - Lightweight
- **Radix UI** (Optional)
  - Accessible primitives
  - Unstyled components
  - Customizable

### Icons
- **Lucide React**
  - Consistent icon set
  - Tree-shakeable
  - TypeScript support

### File Handling
- **File Upload**
  - Native FormData
  - Progress tracking
  - File validation

### PDF Generation
- **jsPDF** + **html2canvas**
  - Client-side PDF generation
  - Template-based
  - Customizable styling

## Project Structure

```
growthlab-job-portal/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page (redirects to /jobs)
│   ├── jobs/                     # Job portal routes
│   │   ├── layout.tsx            # Jobs layout
│   │   ├── page.tsx              # Main jobs page
│   │   ├── find-startup-jobs/
│   │   ├── hire-talents/
│   │   ├── applications/
│   │   ├── resume-builder/
│   │   ├── find-cofounder/
│   │   ├── alerts/
│   │   ├── analytics/
│   │   ├── manage/
│   │   └── interviews/
│   └── api/                      # API routes (if needed)
│
├── components/
│   ├── ui/                       # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   ├── Tabs.tsx
│   │   └── ...
│   ├── jobs/                     # Job-specific components
│   │   ├── JobCard.tsx
│   │   ├── JobFilters.tsx
│   │   ├── JobSearch.tsx
│   │   ├── ApplicationForm.tsx
│   │   └── ...
│   ├── employer/                 # Employer components
│   │   ├── JobPostingForm.tsx
│   │   ├── ApplicationsTable.tsx
│   │   └── ...
│   └── shared/                   # Shared components
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── ...
│
├── services/
│   ├── api/                      # API services
│   │   ├── client.ts             # API client setup
│   │   ├── jobs.ts               # Job endpoints
│   │   ├── applications.ts       # Application endpoints
│   │   ├── employers.ts          # Employer endpoints
│   │   └── ...
│   └── utils/                    # Utility functions
│       ├── formatters.ts         # Date, currency formatters
│       ├── validators.ts         # Custom validators
│       └── ...
│
├── hooks/                        # Custom React hooks
│   ├── useJobs.ts
│   ├── useApplications.ts
│   ├── useAuth.ts
│   └── ...
│
├── store/                        # State management
│   ├── jobsStore.ts
│   ├── applicationsStore.ts
│   └── ...
│
├── types/                        # TypeScript types
│   ├── job.ts
│   ├── application.ts
│   ├── user.ts
│   └── ...
│
├── lib/                          # Library code
│   ├── constants.ts              # Constants
│   ├── utils.ts                  # Utility functions
│   └── ...
│
├── styles/                       # Global styles
│   ├── globals.css
│   └── theme.css
│
└── public/                       # Static assets
    ├── images/
    └── icons/
```

## Data Flow

### 1. User Action Flow
```
User Action
    ↓
Component Event Handler
    ↓
Service Function (API call)
    ↓
API Client (with interceptors)
    ↓
Growth Lab API
    ↓
Response Handler
    ↓
State Update (Zustand/React Query)
    ↓
UI Re-render
```

### 2. Authentication Flow
```
User logs in (Main Platform)
    ↓
Main Platform issues JWT token
    ↓
Token stored (localStorage/cookie)
    ↓
Token attached to API requests (interceptor)
    ↓
API validates token
    ↓
Request processed or 401 error
```

### 3. State Management Flow
```
Server State (React Query)
    - Jobs list
    - Applications
    - User data
    - Cached API responses

Client State (Zustand)
    - UI state (modals, filters)
    - Form state (temporary)
    - User preferences
    - Local settings
```

## Component Architecture

### Component Hierarchy
```
Page Component
    ↓
Layout Components
    ↓
Feature Components
    ↓
UI Components
```

### Component Patterns

#### 1. Container/Presentational Pattern
```typescript
// Container (logic)
const JobsContainer = () => {
  const { data, isLoading } = useJobs();
  return <JobsList jobs={data} loading={isLoading} />;
};

// Presentational (UI)
const JobsList = ({ jobs, loading }) => {
  // Pure UI rendering
};
```

#### 2. Compound Components
```typescript
<Modal>
  <Modal.Header>Title</Modal.Header>
  <Modal.Body>Content</Modal.Body>
  <Modal.Footer>Actions</Modal.Footer>
</Modal>
```

#### 3. Render Props
```typescript
<DataFetcher
  url="/api/jobs"
  render={(data, loading) => (
    <JobsList jobs={data} loading={loading} />
  )}
/>
```

## API Integration Pattern

### Service Layer
```typescript
// services/api/jobs.ts
export const jobsService = {
  getAll: (filters: JobFilters) => 
    apiClient.get('/jobs', { params: filters }),
  
  getById: (id: string) => 
    apiClient.get(`/jobs/${id}`),
  
  create: (data: CreateJobData) => 
    apiClient.post('/jobs', data),
  
  update: (id: string, data: UpdateJobData) => 
    apiClient.put(`/jobs/${id}`, data),
  
  delete: (id: string) => 
    apiClient.delete(`/jobs/${id}`),
};
```

### React Query Integration
```typescript
// hooks/useJobs.ts
export const useJobs = (filters: JobFilters) => {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => jobsService.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

## Error Handling Strategy

### API Errors
```typescript
// Centralized error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
    } else if (error.response?.status === 403) {
      // Handle forbidden
    } else if (error.response?.status >= 500) {
      // Handle server errors
    }
    return Promise.reject(error);
  }
);
```

### Component Error Boundaries
```typescript
<ErrorBoundary fallback={<ErrorFallback />}>
  <JobsList />
</ErrorBoundary>
```

## Performance Optimization

### 1. Code Splitting
- Route-based splitting (automatic with Next.js)
- Component lazy loading
- Dynamic imports

### 2. Caching
- React Query cache
- API response caching
- Static asset caching

### 3. Image Optimization
- Next.js Image component
- Lazy loading
- Responsive images

### 4. Bundle Size
- Tree shaking
- Dynamic imports
- Code splitting

## Security Considerations

### 1. Authentication
- Token-based authentication
- Secure token storage
- Token refresh mechanism

### 2. Input Validation
- Client-side validation (Zod)
- Server-side validation (API)
- Sanitization

### 3. XSS Prevention
- React's built-in escaping
- Sanitize user inputs
- Avoid dangerouslySetInnerHTML

### 4. CSRF Protection
- SameSite cookies
- CSRF tokens (if needed)

## Testing Strategy

### Unit Tests
- Utility functions
- Custom hooks
- Pure components

### Integration Tests
- API integration
- Component interactions
- Form submissions

### E2E Tests
- Critical user flows
- Cross-browser testing
- Mobile testing

## Deployment Architecture

### Build Process
```
Source Code
    ↓
TypeScript Compilation
    ↓
Next.js Build
    ↓
Static Assets Generation
    ↓
Optimization
    ↓
Production Bundle
```

### Deployment Options
1. **Vercel** (Recommended for Next.js)
   - Automatic deployments
   - Edge functions
   - CDN integration

2. **AWS Amplify**
   - Full-stack deployment
   - CI/CD integration

3. **Docker Container**
   - Containerized deployment
   - Kubernetes compatible

## Monitoring & Analytics

### Error Tracking
- Sentry or similar
- Error logging
- Performance monitoring

### Analytics
- User behavior tracking
- Feature usage
- Performance metrics

## Scalability Considerations

### Frontend
- Component lazy loading
- Virtual scrolling for long lists
- Pagination/infinite scroll
- Optimistic updates

### API Integration
- Request batching
- Response caching
- Rate limiting handling
- Retry logic

## Future Enhancements

### Real-time Features
- WebSocket integration
- Server-sent events
- Live updates

### Progressive Web App
- Service workers
- Offline support
- Push notifications

### Mobile App
- React Native version
- Shared business logic
- Platform-specific UI

