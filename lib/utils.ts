import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getCurrencyForLocation, getCurrencyForUser } from './currency-region';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  // Map currencies to appropriate locales
  const currencyLocaleMap: Record<string, string> = {
    'USD': 'en-US',
    'EUR': 'en-GB', // or 'de-DE', 'fr-FR', etc. - using en-GB as neutral
    'GBP': 'en-GB',
    'SGD': 'en-SG',
    'JPY': 'ja-JP',
    'CNY': 'zh-CN',
    'HKD': 'en-HK',
    'AUD': 'en-AU',
    'CAD': 'en-CA',
    'INR': 'en-IN',
    'MYR': 'en-MY',
    'THB': 'en-TH',
    'IDR': 'en-ID',
    'PHP': 'en-PH',
    'VND': 'en-VN',
    'KRW': 'ko-KR',
    'AED': 'en-AE',
    'SAR': 'en-SA',
    'ILS': 'he-IL',
    'BRL': 'pt-BR',
    'ARS': 'es-AR',
    'CLP': 'es-CL',
    'COP': 'es-CO',
    'MXN': 'es-MX',
    'ZAR': 'en-ZA',
    'CHF': 'de-CH',
    'PLN': 'pl-PL',
    'NZD': 'en-NZ',
  };
  
  const locale = currencyLocaleMap[currency] || 'en-US';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  // Use browser's locale or default to en-US for global compatibility
  const locale = typeof window !== 'undefined' ? navigator.language : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatRelativeTime(date: Date | string): string {
  try {
    if (!date) return 'Recently';
    const now = new Date();
    const then = new Date(date);
    
    // Check if date is valid
    if (isNaN(then.getTime())) return 'Recently';
    
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return formatDate(date);
  } catch (error) {
    return 'Recently';
  }
}

export function formatDateTime(date: Date | string): string {
  // Use browser's locale or default to en-US for global compatibility
  const locale = typeof window !== 'undefined' ? navigator.language : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatTime(date: Date | string): string {
  // Use browser's locale or default to en-US for global compatibility
  const locale = typeof window !== 'undefined' ? navigator.language : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}

