# API Integration Guide for Main GrowthLab Platform

This guide explains how the Jobs Portal integrates with the main GrowthLab platform API for high-scale production use.

## Architecture

The Jobs Portal acts as a microservice that integrates with the main GrowthLab platform. All data operations are performed through the main platform's API.

## Base Configuration

### Environment Variables

```env
# Main Platform URL (required)
NEXT_PUBLIC_MAIN_PLATFORM_URL=https://api.growthlab.sg

# API Version (optional, defaults to 1.0)
NEXT_PUBLIC_API_VERSION=1.0

# Enable Enhanced Features (optional)
NEXT_PUBLIC_ENABLE_ENHANCED_CLIENT=true
NEXT_PUBLIC_ENABLE_MONITORING=true
```

### API Endpoints

All endpoints are prefixed with the main platform URL:

- **Base URL**: `${NEXT_PUBLIC_MAIN_PLATFORM_URL}/api`
- **Jobs**: `/api/jobs`
- **Auth**: `/api/auth`
- **Applications**: `/api/applications`
- **Freelancer**: `/api/freelancer`
- **Messaging**: `/api/messaging`
- **Analytics**: `/api/analytics`
- **Notifications**: `/api/notifications`

## Authentication

### Token Management

The portal uses JWT tokens from the main platform:

```typescript
// Token is stored in localStorage
localStorage.setItem('growthlab_token', token);
localStorage.setItem('growthlab_refresh_token', refreshToken);

// Token is automatically included in all API requests
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Token Refresh

Automatic token refresh is handled by the API client:

1. On 401 response, attempt to refresh token
2. If refresh succeeds, retry original request
3. If refresh fails, redirect to main platform login

## API Client Options

### Standard Client (`services/api/client.ts`)

Basic axios client with:
- Automatic token injection
- Token refresh on 401
- Error handling
- Performance monitoring

**Usage:**
```typescript
import { apiClient } from '@/services/api/client';

const response = await apiClient.get('/jobs');
```

### Enhanced Client (`services/api/enhanced-client.ts`)

Production-ready client with:
- Request queuing and throttling
- Automatic retries with exponential backoff
- Circuit breaker pattern
- Request caching
- Request deduplication
- Rate limiting

**Usage:**
```typescript
import { enhancedRequest } from '@/services/api/enhanced-client';

const response = await enhancedRequest({
  method: 'GET',
  url: '/jobs',
  params: { page: 1, limit: 20 },
}, {
  useCache: true,
  useDeduplication: true,
  skipRetry: false,
});
```

## Request Patterns

### Pagination

All list endpoints support pagination:

```typescript
// Cursor-based pagination (recommended)
GET /api/jobs?cursor=abc123&limit=20

// Page-based pagination
GET /api/jobs?page=1&limit=20
```

**Response Format:**
```typescript
{
  items: Job[],
  total: number,
  page: number,
  limit: number,
  totalPages: number,
  cursor?: string, // For cursor-based pagination
  hasMore: boolean
}
```

### Filtering

Filters are passed as query parameters:

```typescript
GET /api/jobs?search=developer&location=remote&jobType=full-time
```

### Sorting

Sorting is specified with `sortBy` parameter:

```typescript
GET /api/jobs?sortBy=newest
GET /api/jobs?sortBy=salary-desc
```

## Error Handling

### Standard Error Response

```typescript
{
  error: {
    message: string,
    code: string,
    details?: any
  }
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (token refresh attempted)
- `403` - Forbidden
- `404` - Not Found
- `429` - Rate Limited (retry after delay)
- `500` - Server Error
- `503` - Service Unavailable

### Error Handling Best Practices

```typescript
try {
  const response = await apiClient.get('/jobs');
  return response.data;
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 429) {
      // Rate limited - wait and retry
      const retryAfter = error.response.headers['retry-after'];
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      return apiClient.get('/jobs'); // Retry
    }
    if (error.response?.status === 401) {
      // Token refresh handled automatically
      // Redirect to login if refresh fails
    }
  }
  throw error;
}
```

## Rate Limiting

The enhanced client handles rate limiting automatically:

- **Default**: 100 requests/second
- **429 Response**: Automatically retries after `Retry-After` header
- **Queue**: Requests are queued if rate limit exceeded

## Caching Strategy

### Client-Side Caching

1. **React Query Cache** (5 minutes stale time)
2. **Enhanced Client Cache** (5 minutes TTL)
3. **Browser Cache** (via Cache-Control headers)

### Cache Invalidation

```typescript
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

// Invalidate specific query
queryClient.invalidateQueries({ queryKey: ['jobs'] });

// Invalidate all queries
queryClient.invalidateQueries();
```

## Batch Requests

For multiple requests, use the batch endpoint:

```typescript
import { batchRequest } from '@/services/api/batch-client';

const result = await batchRequest([
  { id: '1', method: 'GET', url: '/jobs/1' },
  { id: '2', method: 'GET', url: '/jobs/2' },
  { id: '3', method: 'GET', url: '/jobs/3' },
]);
```

## Performance Monitoring

### Track API Calls

```typescript
import { getPerformanceMetrics } from '@/services/api/monitoring';

const metrics = getPerformanceMetrics();
console.log('Average response time:', metrics.averageResponseTime);
console.log('Error rate:', metrics.errorRate);
```

### Endpoint-Specific Metrics

```typescript
import { getEndpointMetrics } from '@/services/api/monitoring';

const jobMetrics = getEndpointMetrics('/api/jobs');
```

## Best Practices

### 1. Use React Query for Data Fetching

```typescript
import { useOptimizedQuery } from '@/lib/api-optimization';

const { data, isLoading } = useOptimizedQuery({
  queryKey: ['jobs', filters],
  queryFn: () => getJobs(filters),
});
```

### 2. Implement Request Debouncing

```typescript
import { debounce } from '@/lib/api-optimization';

const debouncedSearch = debounce((searchTerm: string) => {
  // API call
}, 300);
```

### 3. Use Pagination

Always use pagination for list endpoints:

```typescript
const jobs = await getJobs({
  page: 1,
  limit: 20, // Reasonable page size
});
```

### 4. Handle Loading States

```typescript
const { data, isLoading, isError } = useQuery({
  queryKey: ['jobs'],
  queryFn: getJobs,
});

if (isLoading) return <Loading />;
if (isError) return <Error />;
return <JobsList data={data} />;
```

### 5. Optimize for Mobile

- Use smaller page sizes on mobile
- Implement infinite scroll
- Lazy load images
- Compress requests

## Backend Requirements

For optimal integration, the main platform API should:

1. **Support HTTP/2** - For connection multiplexing
2. **Implement Pagination** - Cursor-based preferred
3. **Add Rate Limiting** - Return 429 with Retry-After
4. **Support Compression** - Gzip/Brotli
5. **Batch Endpoint** - `/api/batch` for batch requests
6. **Caching Headers** - ETag, Last-Modified, Cache-Control
7. **Connection Pooling** - Keep-alive connections
8. **Health Checks** - `/health` endpoint
9. **API Versioning** - Support version in headers/URL
10. **CORS** - Proper CORS headers for cross-origin requests

## Testing

### Mock API for Development

```typescript
// Use MSW (Mock Service Worker) for API mocking
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/jobs', (req, res, ctx) => {
    return res(ctx.json({ data: { items: [], total: 0 } }));
  }),
];
```

### Load Testing

Test with tools like k6 or Artillery:

```javascript
import http from 'k6/http';

export default function () {
  const response = http.get('https://api.growthlab.sg/api/jobs');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

## Migration Guide

### From Standard to Enhanced Client

1. Update imports:
```typescript
// Before
import { apiClient } from '@/services/api/client';

// After
import { enhancedRequest } from '@/services/api/enhanced-client';
```

2. Update API calls:
```typescript
// Before
const response = await apiClient.get('/jobs');

// After
const response = await enhancedRequest({
  method: 'GET',
  url: '/jobs',
});
```

3. Enable optimizations:
```typescript
const response = await enhancedRequest({
  method: 'GET',
  url: '/jobs',
}, {
  useCache: true,
  useDeduplication: true,
});
```

## Support

For API integration issues:
1. Check the main platform API documentation
2. Review error logs in browser console
3. Check network tab for request/response details
4. Verify environment variables are set correctly
5. Ensure authentication tokens are valid

