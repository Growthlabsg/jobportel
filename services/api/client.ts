import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { refreshAuthToken, redirectToMainPlatformLogin } from '../platform/auth';
import { trackApiRequest } from './monitoring';

// Main Growth Lab Platform API Base URL
const MAIN_PLATFORM_BASE_URL = process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL || 'http://localhost:3001';
const API_BASE_URL = `${MAIN_PLATFORM_BASE_URL}/api`;

// Create axios instance for jobs microservice
export const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/jobs`,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Version': '1.0',
  },
  timeout: 30000,
  // Enable HTTP/2 and keep-alive for connection pooling
  maxRedirects: 5,
});

// Request interceptor - Add auth token and track start time
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Track request start time for performance monitoring
    (config as any).__startTime = Date.now();
    
    // Get token from localStorage (or cookie, context, etc.)
    // This will be integrated with main Growth Lab platform
    if (typeof window !== 'undefined') {
      try {
        const token = localStorage.getItem('growthlab_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add request ID for tracing
        if (config.headers) {
          config.headers['X-Request-ID'] = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
      } catch (error) {
        console.error('Error accessing localStorage:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors, token refresh, and monitoring
apiClient.interceptors.response.use(
  (response) => {
    // Track successful requests
    const startTime = (response.config as any).__startTime || Date.now();
    const duration = Date.now() - startTime;
    trackApiRequest(
      response.config.url || '',
      response.config.method?.toUpperCase() || 'GET',
      duration,
      response.status,
      undefined,
      JSON.stringify(response.config.data || {}).length,
      JSON.stringify(response.data || {}).length
    );
    return response;
  },
  async (error: AxiosError) => {
    // Track failed requests
    if (error.config) {
      const startTime = (error.config as any).__startTime || Date.now();
      const duration = Date.now() - startTime;
      trackApiRequest(
        error.config.url || '',
        error.config.method?.toUpperCase() || 'GET',
        duration,
        error.response?.status || 0,
        error.message,
        JSON.stringify(error.config.data || {}).length,
        0
      );
    }
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Unauthorized - try to refresh token
      originalRequest._retry = true;

      if (typeof window !== 'undefined') {
        try {
          const newToken = await refreshAuthToken();
          if (newToken && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken.accessToken}`;
            // Retry original request
            return apiClient(originalRequest);
          } else {
            // Refresh failed - redirect to main platform login
            redirectToMainPlatformLogin();
          }
        } catch (refreshError) {
          // Refresh failed - redirect to main platform login
          redirectToMainPlatformLogin();
          return Promise.reject(refreshError);
        }
      }
    }

    // Handle other errors
    const status = error.response?.status;
    if (status === 403) {
      // Forbidden - user doesn't have permission
      console.error('Access forbidden');
    } else if (status && status >= 500) {
      // Server error
      console.error('Server error:', error.response?.data);
    }

    return Promise.reject(error);
  }
);

// Helper function to get error message
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: { message?: string }; message?: string }>;
    return (
      axiosError.response?.data?.error?.message ||
      axiosError.response?.data?.message ||
      axiosError.message ||
      'An error occurred'
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}

