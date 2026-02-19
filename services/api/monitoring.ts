/**
 * API Monitoring and Performance Tracking
 * Tracks API performance, errors, and usage metrics
 */

interface ApiMetric {
  endpoint: string;
  method: string;
  duration: number;
  status: number;
  timestamp: number;
  error?: string;
  requestSize?: number;
  responseSize?: number;
}

interface PerformanceMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  errorRate: number;
  requestsPerSecond: number;
}

class ApiMonitor {
  private metrics: ApiMetric[] = [];
  private readonly MAX_METRICS = 10000; // Keep last 10k metrics
  private readonly WINDOW_SIZE = 60000; // 1 minute window

  recordMetric(metric: ApiMetric) {
    this.metrics.push(metric);
    
    // Keep only recent metrics
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS);
    }

    // Log to analytics service in production
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      this.sendToAnalytics(metric);
    }
  }

  getMetrics(windowMs: number = this.WINDOW_SIZE): PerformanceMetrics {
    const now = Date.now();
    const windowStart = now - windowMs;
    const recentMetrics = this.metrics.filter(m => m.timestamp >= windowStart);

    if (recentMetrics.length === 0) {
      return {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        p95ResponseTime: 0,
        p99ResponseTime: 0,
        errorRate: 0,
        requestsPerSecond: 0,
      };
    }

    const durations = recentMetrics.map(m => m.duration).sort((a, b) => a - b);
    const successful = recentMetrics.filter(m => m.status >= 200 && m.status < 300);
    const failed = recentMetrics.filter(m => m.status >= 400 || m.error);

    const averageResponseTime = durations.reduce((a, b) => a + b, 0) / durations.length;
    const p95Index = Math.floor(durations.length * 0.95);
    const p99Index = Math.floor(durations.length * 0.99);

    return {
      totalRequests: recentMetrics.length,
      successfulRequests: successful.length,
      failedRequests: failed.length,
      averageResponseTime,
      p95ResponseTime: durations[p95Index] || 0,
      p99ResponseTime: durations[p99Index] || 0,
      errorRate: failed.length / recentMetrics.length,
      requestsPerSecond: (recentMetrics.length / windowMs) * 1000,
    };
  }

  getEndpointMetrics(endpoint: string, windowMs: number = this.WINDOW_SIZE) {
    const now = Date.now();
    const windowStart = now - windowMs;
    const endpointMetrics = this.metrics.filter(
      m => m.endpoint === endpoint && m.timestamp >= windowStart
    );

    return this.calculateMetrics(endpointMetrics);
  }

  private calculateMetrics(metrics: ApiMetric[]): PerformanceMetrics {
    if (metrics.length === 0) {
      return {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        p95ResponseTime: 0,
        p99ResponseTime: 0,
        errorRate: 0,
        requestsPerSecond: 0,
      };
    }

    const durations = metrics.map(m => m.duration).sort((a, b) => a - b);
    const successful = metrics.filter(m => m.status >= 200 && m.status < 300);
    const failed = metrics.filter(m => m.status >= 400 || m.error);

    const averageResponseTime = durations.reduce((a, b) => a + b, 0) / durations.length;
    const p95Index = Math.floor(durations.length * 0.95);
    const p99Index = Math.floor(durations.length * 0.99);

    const windowMs = metrics.length > 0 
      ? Math.max(...metrics.map(m => m.timestamp)) - Math.min(...metrics.map(m => m.timestamp))
      : 60000;

    return {
      totalRequests: metrics.length,
      successfulRequests: successful.length,
      failedRequests: failed.length,
      averageResponseTime,
      p95ResponseTime: durations[p95Index] || 0,
      p99ResponseTime: durations[p99Index] || 0,
      errorRate: failed.length / metrics.length,
      requestsPerSecond: (metrics.length / windowMs) * 1000,
    };
  }

  private sendToAnalytics(metric: ApiMetric) {
    // Send to analytics service (e.g., Google Analytics, Mixpanel, etc.)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'api_request', {
        endpoint: metric.endpoint,
        method: metric.method,
        status: metric.status,
        duration: metric.duration,
      });
    }
  }

  clear() {
    this.metrics = [];
  }
}

export const apiMonitor = new ApiMonitor();

/**
 * Track API request
 */
export function trackApiRequest(
  endpoint: string,
  method: string,
  duration: number,
  status: number,
  error?: string,
  requestSize?: number,
  responseSize?: number
) {
  apiMonitor.recordMetric({
    endpoint,
    method,
    duration,
    status,
    timestamp: Date.now(),
    error,
    requestSize,
    responseSize,
  });
}

/**
 * Get current performance metrics
 */
export function getPerformanceMetrics(windowMs?: number): PerformanceMetrics {
  return apiMonitor.getMetrics(windowMs);
}

/**
 * Get metrics for specific endpoint
 */
export function getEndpointMetrics(endpoint: string, windowMs?: number): PerformanceMetrics {
  return apiMonitor.getEndpointMetrics(endpoint, windowMs);
}

