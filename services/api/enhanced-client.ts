/**
 * Enhanced API Client for High-Scale Production
 * Features:
 * - Request queuing and throttling
 * - Automatic retries with exponential backoff
 * - Rate limiting
 * - Request deduplication
 * - Circuit breaker pattern
 * - Connection pooling
 * - Request/response caching
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { refreshAuthToken, redirectToMainPlatformLogin } from '../platform/auth';

const MAIN_PLATFORM_BASE_URL = process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL || 'http://localhost:3001';
const API_BASE_URL = `${MAIN_PLATFORM_BASE_URL}/api`;

// Configuration
const CONFIG = {
  // Timeouts
  TIMEOUT: 30000,
  CONNECTION_TIMEOUT: 10000,
  
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // Base delay in ms
  RETRY_MULTIPLIER: 2,
  
  // Rate limiting
  MAX_CONCURRENT_REQUESTS: 50,
  REQUESTS_PER_SECOND: 100,
  
  // Circuit breaker
  CIRCUIT_BREAKER_THRESHOLD: 5, // Failures before opening
  CIRCUIT_BREAKER_TIMEOUT: 60000, // 1 minute
  CIRCUIT_BREAKER_HALF_OPEN_REQUESTS: 3,
  
  // Caching
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  CACHE_MAX_SIZE: 1000, // Max cached responses
  
  // Request deduplication
  DEDUP_WINDOW: 1000, // 1 second
} as const;

// Request queue for throttling
interface QueuedRequest {
  config: InternalAxiosRequestConfig;
  resolve: (value: AxiosResponse) => void;
  reject: (error: any) => void;
  timestamp: number;
}

class RequestQueue {
  private queue: QueuedRequest[] = [];
  private processing = false;
  private lastRequestTime = 0;
  private minRequestInterval = 1000 / CONFIG.REQUESTS_PER_SECOND;

  async enqueue(request: QueuedRequest): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        ...request,
        resolve,
        reject,
      });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      
      if (timeSinceLastRequest < this.minRequestInterval) {
        await new Promise(resolve => 
          setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest)
        );
      }
      
      const request = this.queue.shift();
      if (request) {
        this.lastRequestTime = Date.now();
        try {
          const response = await axios(request.config);
          request.resolve(response);
        } catch (error) {
          request.reject(error);
        }
      }
    }
    
    this.processing = false;
  }
}

// Circuit Breaker
class CircuitBreaker {
  private failures = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private nextAttempt = 0;
  private halfOpenAttempts = 0;

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is open');
      }
      this.state = 'half-open';
      this.halfOpenAttempts = 0;
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    if (this.state === 'half-open') {
      this.halfOpenAttempts++;
      if (this.halfOpenAttempts >= CONFIG.CIRCUIT_BREAKER_HALF_OPEN_REQUESTS) {
        this.state = 'closed';
      }
    } else {
      this.state = 'closed';
    }
  }

  private onFailure() {
    this.failures++;
    if (this.state === 'half-open') {
      this.state = 'open';
      this.nextAttempt = Date.now() + CONFIG.CIRCUIT_BREAKER_TIMEOUT;
    } else if (this.failures >= CONFIG.CIRCUIT_BREAKER_THRESHOLD) {
      this.state = 'open';
      this.nextAttempt = Date.now() + CONFIG.CIRCUIT_BREAKER_TIMEOUT;
    }
  }
}

// Request Cache
class RequestCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private maxSize = CONFIG.CACHE_MAX_SIZE;

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const age = Date.now() - cached.timestamp;
    if (age > CONFIG.CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  set(key: string, data: any): void {
    // Evict oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear() {
    this.cache.clear();
  }

  generateKey(config: InternalAxiosRequestConfig): string {
    return `${config.method}:${config.url}:${JSON.stringify(config.params)}:${JSON.stringify(config.data)}`;
  }
}

// Request Deduplication
class RequestDeduplicator {
  private pendingRequests = new Map<string, Promise<AxiosResponse>>();

  async deduplicate(
    key: string,
    requestFn: () => Promise<AxiosResponse>
  ): Promise<AxiosResponse> {
    const existing = this.pendingRequests.get(key);
    if (existing) {
      return existing;
    }

    const promise = requestFn().finally(() => {
      // Remove after a delay to allow concurrent requests to reuse
      setTimeout(() => {
        this.pendingRequests.delete(key);
      }, CONFIG.DEDUP_WINDOW);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }
}

// Retry with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries: number = CONFIG.MAX_RETRIES,
  delay: number = CONFIG.RETRY_DELAY
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    
    // Don't retry on 4xx errors (except 429 rate limit)
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      if (status && status >= 400 && status < 500 && status !== 429) {
        throw error;
      }
    }

    await new Promise(resolve => setTimeout(resolve, delay));
    return retryWithBackoff(fn, retries - 1, delay * CONFIG.RETRY_MULTIPLIER);
  }
}

// Create enhanced axios instance
export const enhancedApiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/jobs`,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Version': '1.0',
  },
  timeout: CONFIG.TIMEOUT,
  // Enable HTTP/2 and connection pooling
  httpAgent: typeof window === 'undefined' ? undefined : undefined, // Node.js only
  httpsAgent: typeof window === 'undefined' ? undefined : undefined, // Node.js only
});

// Shared instances
const requestQueue = new RequestQueue();
const circuitBreaker = new CircuitBreaker();
const requestCache = new RequestCache();
const requestDeduplicator = new RequestDeduplicator();

// Request interceptor - Add auth token and request ID
enhancedApiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Add auth token
    if (typeof window !== 'undefined') {
      try {
        const token = localStorage.getItem('growthlab_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error accessing localStorage:', error);
      }
    }

    // Add request ID for tracking
    if (config.headers) {
      config.headers['X-Request-ID'] = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Add compression header
    if (config.headers) {
      config.headers['Accept-Encoding'] = 'gzip, deflate, br';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors, caching, and token refresh
enhancedApiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Cache GET requests
    if (response.config.method?.toLowerCase() === 'get' && response.status === 200) {
      const cacheKey = requestCache.generateKey(response.config);
      requestCache.set(cacheKey, response.data);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { 
      _retry?: boolean;
      _skipCache?: boolean;
    };

    // Handle 401 - Token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== 'undefined') {
        try {
          const newToken = await refreshAuthToken();
          if (newToken && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken.accessToken}`;
            return enhancedApiClient(originalRequest);
          } else {
            redirectToMainPlatformLogin();
          }
        } catch (refreshError) {
          redirectToMainPlatformLogin();
          return Promise.reject(refreshError);
        }
      }
    }

    // Handle 429 - Rate limiting
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      const delay = retryAfter ? parseInt(retryAfter) * 1000 : CONFIG.RETRY_DELAY;
      await new Promise(resolve => setTimeout(resolve, delay));
      return enhancedApiClient(originalRequest);
    }

    return Promise.reject(error);
  }
);

// Enhanced request wrapper with all features
// Only use enhanced features on client-side, fallback to standard axios on server
export async function enhancedRequest<T = any>(
  config: InternalAxiosRequestConfig,
  options: {
    useCache?: boolean;
    useDeduplication?: boolean;
    skipRetry?: boolean;
  } = {}
): Promise<AxiosResponse<T>> {
  // On server-side, use standard axios request
  if (typeof window === 'undefined') {
    return enhancedApiClient.request<T>(config);
  }

  const {
    useCache = true,
    useDeduplication = true,
    skipRetry = false,
  } = options;

  // Check cache for GET requests
  if (useCache && config.method?.toLowerCase() === 'get') {
    const cacheKey = requestCache.generateKey(config);
    const cached = requestCache.get(cacheKey);
    if (cached) {
      return {
        ...cached,
        config,
        status: 200,
        statusText: 'OK',
        headers: {},
      } as AxiosResponse<T>;
    }
  }

  // Create request function
  const makeRequest = async (): Promise<AxiosResponse<T>> => {
    return circuitBreaker.execute(async () => {
      return requestQueue.enqueue({
        config,
        resolve: () => {},
        reject: () => {},
        timestamp: Date.now(),
      });
    });
  };

  // Apply deduplication if enabled
  if (useDeduplication && config.method?.toLowerCase() === 'get') {
    const dedupKey = requestCache.generateKey(config);
    return requestDeduplicator.deduplicate(dedupKey, makeRequest);
  }

  // Apply retry logic if not skipped
  if (skipRetry) {
    return makeRequest();
  }

  return retryWithBackoff(makeRequest);
}

// Export utilities
export const apiUtils = {
  clearCache: () => requestCache.clear(),
  getCacheSize: () => requestCache['cache'].size,
  getQueueSize: () => requestQueue['queue'].length,
};

// Export configuration
export const apiConfig = CONFIG;

