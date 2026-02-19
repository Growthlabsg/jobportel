/**
 * Environment Variable Validation
 * Validates required environment variables on startup
 */

export function validateEnvironmentVariables(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check if main platform URL is set
  const mainPlatformUrl = process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL;
  if (!mainPlatformUrl) {
    errors.push('NEXT_PUBLIC_MAIN_PLATFORM_URL is not set. Jobs portal requires connection to main Growth Lab platform.');
  } else {
    // Validate URL format
    try {
      new URL(mainPlatformUrl);
    } catch {
      errors.push('NEXT_PUBLIC_MAIN_PLATFORM_URL is not a valid URL.');
    }
  }

  // Optional: Check if login URL is set (warns if not)
  const loginUrl = process.env.NEXT_PUBLIC_MAIN_PLATFORM_LOGIN_URL;
  if (!loginUrl && mainPlatformUrl) {
    console.warn('NEXT_PUBLIC_MAIN_PLATFORM_LOGIN_URL is not set. Will use default login URL.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get environment configuration with validation
 */
export function getEnvironmentConfig() {
  const validation = validateEnvironmentVariables();

  if (!validation.valid) {
    console.error('Environment validation failed:', validation.errors);
  }

  return {
    mainPlatformUrl: process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL || 'http://localhost:3001',
    loginUrl: process.env.NEXT_PUBLIC_MAIN_PLATFORM_LOGIN_URL || 
      (process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL 
        ? `${process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL}/login`
        : 'http://localhost:3001/login'),
    validation,
  };
}

