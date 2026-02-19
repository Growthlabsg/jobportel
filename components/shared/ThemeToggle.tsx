/**
 * Theme Toggle Component
 * Switches between light and dark mode
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  const applyTheme = useCallback((newTheme: 'light' | 'dark') => {
    if (typeof window === 'undefined') return;
    
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    // Check if theme is already applied by the script in layout
    const htmlHasDark = document.documentElement.classList.contains('dark');
    const currentTheme = htmlHasDark ? 'dark' : 'light';
    
    // Use the theme from DOM if it exists, otherwise use calculated theme
    const themeToUse = savedTheme || currentTheme || initialTheme;
    
    setMounted(true);
    applyTheme(themeToUse);
  }, [applyTheme]);

  const handleToggle = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const newTheme = theme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
  }, [theme, applyTheme]);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="p-2"
        aria-label="Toggle theme"
        type="button"
      >
        <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className="p-2"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      type="button"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-gray-600 hover:text-primary transition-colors" />
      ) : (
        <Sun className="h-5 w-5 text-gray-600 hover:text-primary transition-colors" />
      )}
    </Button>
  );
};

