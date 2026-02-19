# Scalability Architecture

This document outlines the scalability features implemented to handle millions of concurrent users.

## Architecture Overview

The Jobs Portal is designed to scale horizontally and handle high traffic loads through:

1. **Enhanced API Client** - Request queuing, rate limiting, retries, circuit breakers
2. **Caching Strategy** - Multi-layer caching with React Query
3. **Request Optimization** - Batching, deduplication, and debouncing
4. **Performance Monitoring** - Real-time metrics and analytics
5. **Connection Pooling** - Efficient HTTP connection management

## Key Features

### 1. Enhanced API Client (`services/api/enhanced-client.ts`)

#### Request Queuing
- Queues requests to prevent overwhelming the server
- Configurable rate limiting (default: 100 requests/second)
- Automatic throttling based on server capacity

#### Retry Logic
- Exponential backoff retry strategy
- Configurable max retries (default: 3)
- Smart retry - doesn't retry on 4xx errors (except 429)

#### Circuit Breaker
- Prevents cascading failures
- Opens circuit after 5 consecutive failures
- Half-open state for gradual recovery
- 1-minute timeout before retry

#### Request Caching
- In-memory cache for GET requests
- 5-minute TTL (configurable)
- Max 1000 cached responses
- Automatic cache invalidation

#### Request Deduplication
- Prevents duplicate requests within 1 second window
- Shares response across concurrent identical requests
- Reduces unnecessary API calls

### 2. Batch API Client (`services/api/batch-client.ts`)

- Batches multiple requests into single HTTP call
- Reduces network overhead
- Max 20 requests per batch
- 50ms collection window
- Automatic fallback to individual requests if batch endpoint unavailable

### 3. API Optimization (`lib/api-optimization.ts`)

#### React Query Optimizations
- 5-minute stale time
- 30-minute cache time
- Smart refetching (only when stale)
- Optimistic updates

#### Request Utilities
- Debouncing for search inputs
- Throttling for scroll events
- Request prioritization
- Cache warming

### 4. Performance Monitoring (`services/api/monitoring.ts`)

- Tracks all API requests
- Calculates performance metrics:
  - Average response time
  - P95 and P99 response times
  - Error rates
  - Requests per second
- Endpoint-specific metrics
- Integration with analytics services

## Configuration

### Environment Variables

```env
# Main Platform URL
NEXT_PUBLIC_MAIN_PLATFORM_URL=https://api.growthlab.sg

# API Version
NEXT_PUBLIC_API_VERSION=1.0

# Monitoring
NEXT_PUBLIC_ENABLE_MONITORING=true
```

### API Client Configuration

```typescript
const CONFIG = {
  TIMEOUT: 30000,                    // 30 seconds
  MAX_RETRIES: 3,                    // Max retry attempts
  RETRY_DELAY: 1000,                 // Base retry delay (ms)
  MAX_CONCURRENT_REQUESTS: 50,       // Max parallel requests
  REQUESTS_PER_SECOND: 100,          // Rate limit
  CIRCUIT_BREAKER_THRESHOLD: 5,      // Failures before opening
  CIRCUIT_BREAKER_TIMEOUT: 60000,    // 1 minute
  CACHE_TTL: 5 * 60 * 1000,         // 5 minutes
  CACHE_MAX_SIZE: 1000,              // Max cached responses
};
```

## Usage Examples

### Using Enhanced API Client

```typescript
import { enhancedRequest } from '@/services/api/enhanced-client';

// Make request with all optimizations
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

### Using Batch Requests

```typescript
import { batchRequest } from '@/services/api/batch-client';

const result = await batchRequest([
  { id: '1', method: 'GET', url: '/jobs/1' },
  { id: '2', method: 'GET', url: '/jobs/2' },
  { id: '3', method: 'GET', url: '/jobs/3' },
]);
```

### Using Optimized Queries

```typescript
import { useOptimizedQuery } from '@/lib/api-optimization';

const { data, isLoading } = useOptimizedQuery({
  queryKey: ['jobs', filters],
  queryFn: () => getJobs(filters),
});
```

### Monitoring Performance

```typescript
import { getPerformanceMetrics, getEndpointMetrics } from '@/services/api/monitoring';

// Get overall metrics
const metrics = getPerformanceMetrics();

// Get endpoint-specific metrics
const jobMetrics = getEndpointMetrics('/api/jobs');
```

## Backend Requirements

For optimal performance, the backend should:

1. **Support HTTP/2** - For multiplexing and connection reuse
2. **Implement Pagination** - Cursor-based pagination preferred
3. **Add Rate Limiting** - Return 429 with Retry-After header
4. **Support Compression** - Gzip/Brotli compression
5. **Batch Endpoint** - `/api/batch` for batch requests
6. **Caching Headers** - ETag, Last-Modified, Cache-Control
7. **Connection Pooling** - Keep-alive connections
8. **Load Balancing** - Distribute load across instances
9. **CDN Integration** - Cache static and semi-static content
10. **Database Optimization** - Indexes, query optimization, read replicas

## Scaling Strategies

### Horizontal Scaling
- Stateless API design
- Load balancer with health checks
- Auto-scaling based on metrics
- Database read replicas

### Vertical Scaling
- Optimize database queries
- Add indexes for common queries
- Use connection pooling
- Implement database caching (Redis)

### Caching Strategy
1. **Browser Cache** - Static assets, CDN
2. **Application Cache** - React Query cache
3. **API Cache** - Enhanced client cache
4. **Database Cache** - Redis for hot data

### Database Optimization
- Index frequently queried fields
- Use pagination for all list endpoints
- Implement database connection pooling
- Use read replicas for read-heavy operations
- Implement query result caching

## Monitoring and Alerts

### Key Metrics to Monitor
- Request rate (requests/second)
- Response times (avg, p95, p99)
- Error rates (4xx, 5xx)
- Cache hit rates
- Circuit breaker state
- Queue depth
- Database connection pool usage

### Alert Thresholds
- Error rate > 5%
- P95 response time > 2 seconds
- Circuit breaker opens
- Queue depth > 1000
- Cache hit rate < 50%

## Performance Targets

- **Response Time**: P95 < 500ms, P99 < 1s
- **Error Rate**: < 0.1%
- **Availability**: 99.9% uptime
- **Throughput**: 10,000+ requests/second
- **Concurrent Users**: 1,000,000+

## Testing

### Load Testing
Use tools like:
- k6
- Apache JMeter
- Artillery
- Locust

### Stress Testing
- Test circuit breaker behavior
- Test rate limiting
- Test retry logic
- Test cache effectiveness

## Future Enhancements

1. **Service Workers** - Offline support and background sync
2. **GraphQL** - More efficient data fetching
3. **WebSockets** - Real-time updates
4. **Edge Computing** - Deploy to edge locations
5. **Machine Learning** - Predictive caching
6. **Request Prioritization** - QoS-based routing

