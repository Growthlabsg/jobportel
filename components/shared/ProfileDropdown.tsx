/**
 * Profile Dropdown Component
 * User profile menu with account options
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, ChevronDown, Briefcase, FileText, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Link from 'next/link';
import { getActiveJobProfile } from '@/services/platform/auth';

export const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState<string>('User');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userInitials, setUserInitials] = useState<string>('U');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadUserProfile = async () => {
      try {
        const profile = await getActiveJobProfile();
        if (profile) {
          const name = profile.displayName || 'User';
          setUserName(name);
          
          // Try to get email from metadata or use displayName
          const email = (profile.metadata?.email as string) || '';
          setUserEmail(email);
          
          // Generate initials from displayName
          const initials = name
            .split(' ')
            .map((word) => word[0])
            .filter(Boolean)
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'U';
          setUserInitials(initials);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        // Set defaults on error
        setUserName('User');
        setUserInitials('U');
      }
    };
    
    loadUserProfile();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('growthlab_token');
        localStorage.removeItem('growthlab_refresh_token');
        localStorage.removeItem('growthlab_user');
        localStorage.removeItem('growthlab_active_profile');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userProfile');
        localStorage.removeItem('jobProfile');
      }
      // Redirect to login or home
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  // Always render the same structure to prevent hydration mismatch
  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={mounted ? handleToggle : undefined}
        className="flex items-center gap-2 p-2"
        aria-label="Profile menu"
        type="button"
        disabled={!mounted}
      >
        {mounted ? (
          <>
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
              {userInitials}
            </div>
            <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        ) : (
          <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        )}
      </Button>
      
      {mounted && isOpen && (
        <Card className="absolute right-0 top-full mt-2 w-64 z-[100] shadow-2xl border-2 border-gray-200 dark:border-gray-700">
          <CardContent className="p-0">
            {/* User Info */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-semibold">
                  {userInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{userName}</p>
                  {userEmail && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userEmail}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Link
                href="/jobs/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <BarChart3 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                Dashboard
              </Link>
              <Link
                href="/jobs/my-applications"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                My Applications
              </Link>
              <Link
                href="/jobs/hire-talents"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Briefcase className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                Hire Talent
              </Link>
              <Link
                href="/jobs/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Settings className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                Settings
              </Link>
            </div>

            {/* Logout */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-2">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleLogout();
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-lg"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

