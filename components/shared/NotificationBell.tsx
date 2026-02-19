/**
 * Notification Bell Component
 * Displays notification count and opens notification dropdown
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useUnreadNotificationCount, useMarkNotificationAsRead } from '@/hooks/useNotifications';
import { NotificationDropdown } from './NotificationDropdown';
import { Badge } from '@/components/ui/Badge';

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: unreadCount = 0 } = useUnreadNotificationCount();

  useEffect(() => {
    setMounted(true);
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
        className="relative p-2"
        aria-label="Notifications"
        type="button"
        disabled={!mounted}
      >
        <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        {mounted && unreadCount > 0 && (
          <Badge
            variant="error"
            size="sm"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>
      {mounted && isOpen && <NotificationDropdown onClose={() => setIsOpen(false)} />}
    </div>
  );
};

