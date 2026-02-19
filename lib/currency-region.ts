/**
 * Currency and Region Mapping
 * Maps regions and locations to appropriate default currencies
 */

export const REGION_CURRENCY_MAP: Record<string, string> = {
  // Asia Pacific
  'singapore': 'SGD',
  'malaysia': 'MYR',
  'indonesia': 'IDR',
  'thailand': 'THB',
  'philippines': 'PHP',
  'vietnam': 'VND',
  'hong kong': 'HKD',
  'japan': 'JPY',
  'china': 'CNY',
  'south korea': 'KRW',
  'india': 'INR',
  'bangalore': 'INR',
  'australia': 'AUD',
  'sydney': 'AUD',
  'melbourne': 'AUD',
  'new zealand': 'NZD',
  'auckland': 'NZD',
  
  // North America
  'united states': 'USD',
  'usa': 'USD',
  'san francisco': 'USD',
  'new york': 'USD',
  'austin': 'USD',
  'boston': 'USD',
  'seattle': 'USD',
  'los angeles': 'USD',
  'chicago': 'USD',
  'canada': 'CAD',
  'toronto': 'CAD',
  'vancouver': 'CAD',
  'montreal': 'CAD',
  'mexico': 'MXN',
  'mexico city': 'MXN',
  
  // Europe
  'united kingdom': 'GBP',
  'uk': 'GBP',
  'london': 'GBP',
  'germany': 'EUR',
  'berlin': 'EUR',
  'france': 'EUR',
  'paris': 'EUR',
  'spain': 'EUR',
  'italy': 'EUR',
  'netherlands': 'EUR',
  'amsterdam': 'EUR',
  'switzerland': 'CHF',
  'zurich': 'CHF',
  'poland': 'PLN',
  'warsaw': 'PLN',
  
  // Middle East
  'united arab emirates': 'AED',
  'uae': 'AED',
  'dubai': 'AED',
  'abu dhabi': 'AED',
  'saudi arabia': 'SAR',
  'riyadh': 'SAR',
  'israel': 'ILS',
  'tel aviv': 'ILS',
  
  // South America
  'brazil': 'BRL',
  'são paulo': 'BRL',
  'rio de janeiro': 'BRL',
  'argentina': 'ARS',
  'buenos aires': 'ARS',
  'chile': 'CLP',
  'santiago': 'CLP',
  'colombia': 'COP',
  'bogotá': 'COP',
  
  // Africa
  'south africa': 'ZAR',
  'cape town': 'ZAR',
  'johannesburg': 'ZAR',
  
  // Default regions
  'asia pacific': 'SGD',
  'europe': 'EUR',
  'north america': 'USD',
  'south america': 'USD',
  'middle east': 'USD',
  'africa': 'USD',
  'oceania': 'AUD',
};

/**
 * Get default currency based on location string
 */
export function getCurrencyForLocation(location: string | null | undefined): string {
  if (!location) return getCurrencyForUser();
  
  const locationLower = location.toLowerCase();
  
  // Check for exact matches first
  for (const [key, currency] of Object.entries(REGION_CURRENCY_MAP)) {
    if (locationLower.includes(key)) {
      return currency;
    }
  }
  
  // Default to user's currency if no match found
  return getCurrencyForUser();
}

/**
 * Get default currency based on user's browser locale or timezone
 */
export function getCurrencyForUser(): string {
  if (typeof window === 'undefined') return 'USD';
  
  try {
    // Try to get from browser locale
    if (typeof navigator === 'undefined') return 'USD';
    const locale = navigator.language || (navigator.languages && navigator.languages[0]) || 'en-US';
    const countryCode = locale.split('-')[1]?.toUpperCase();
    
    if (countryCode) {
      const countryCurrencyMap: Record<string, string> = {
        'SG': 'SGD', 'MY': 'MYR', 'ID': 'IDR', 'TH': 'THB', 'PH': 'PHP',
        'VN': 'VND', 'HK': 'HKD', 'JP': 'JPY', 'CN': 'CNY', 'KR': 'KRW',
        'IN': 'INR', 'AU': 'AUD', 'NZ': 'NZD',
        'US': 'USD', 'CA': 'CAD', 'MX': 'MXN',
        'GB': 'GBP', 'DE': 'EUR', 'FR': 'EUR', 'ES': 'EUR', 'IT': 'EUR',
        'NL': 'EUR', 'CH': 'CHF', 'PL': 'PLN',
        'AE': 'AED', 'SA': 'SAR', 'IL': 'ILS',
        'BR': 'BRL', 'AR': 'ARS', 'CL': 'CLP', 'CO': 'COP',
        'ZA': 'ZAR',
      };
      
      if (countryCurrencyMap[countryCode]) {
        return countryCurrencyMap[countryCode];
      }
    }
    
    // Try timezone-based detection
    if (typeof Intl === 'undefined' || !Intl.DateTimeFormat) return 'USD';
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezoneLower = timezone.toLowerCase();
    
    if (timezoneLower.includes('singapore') || timezoneLower.includes('asia/singapore')) {
      return 'SGD';
    }
    if (timezoneLower.includes('tokyo') || timezoneLower.includes('asia/tokyo')) {
      return 'JPY';
    }
    if (timezoneLower.includes('hong_kong') || timezoneLower.includes('asia/hong_kong')) {
      return 'HKD';
    }
    if (timezoneLower.includes('sydney') || timezoneLower.includes('australia/sydney')) {
      return 'AUD';
    }
    if (timezoneLower.includes('london') || timezoneLower.includes('europe/london')) {
      return 'GBP';
    }
    if (timezoneLower.includes('berlin') || timezoneLower.includes('europe/berlin')) {
      return 'EUR';
    }
    if (timezoneLower.includes('paris') || timezoneLower.includes('europe/paris')) {
      return 'EUR';
    }
    if (timezoneLower.includes('dubai') || timezoneLower.includes('asia/dubai')) {
      return 'AED';
    }
  } catch (error) {
    console.warn('Error detecting user currency:', error);
  }
  
  return 'USD'; // Default fallback
}

/**
 * Get currency for a job based on its location
 */
export function getCurrencyForJob(jobLocation: string | null | undefined): string {
  return getCurrencyForLocation(jobLocation);
}
