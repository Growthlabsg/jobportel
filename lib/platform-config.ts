/**
 * Growth Lab Platform Configuration
 * Centralized configuration for main platform integration
 */

export const PLATFORM_CONFIG = {
  // Main Platform Base URL
  MAIN_PLATFORM_URL: process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL || 'http://localhost:3001',
  
  // API Endpoints
  API_BASE_URL: process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL 
    ? `${process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL}/api`
    : 'http://localhost:3001/api',
  
  // Authentication
  AUTH_ENDPOINT: process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL
    ? `${process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL}/api/auth`
    : 'http://localhost:3001/api/auth',
  
  // Startup Directory
  STARTUP_DIRECTORY_ENDPOINT: process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL
    ? `${process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL}/api/startup-directory`
    : 'http://localhost:3001/api/startup-directory',
  
  // Jobs API
  JOBS_ENDPOINT: process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL
    ? `${process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL}/api/jobs`
    : 'http://localhost:3001/api/jobs',
  
  // Build Teams Service (External)
  BUILD_TEAMS_URL: process.env.NEXT_PUBLIC_BUILD_TEAMS_URL || 'http://localhost:3002',
  
  // Login URL
  LOGIN_URL: process.env.NEXT_PUBLIC_MAIN_PLATFORM_LOGIN_URL || 
    (process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL 
      ? `${process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL}/login`
      : 'http://localhost:3001/login'),
  
  // Storage Keys
  STORAGE_KEYS: {
    TOKEN: 'growthlab_token',
    REFRESH_TOKEN: 'growthlab_refresh_token',
    USER: 'growthlab_user',
    ACTIVE_PROFILE: 'growthlab_active_profile',
  },
  
  // Feature Flags
  FEATURES: {
    PROFILE_SWITCHING: true,
    STARTUP_DIRECTORY_SYNC: true,
    MULTI_PROFILE: true,
  },
} as const;

