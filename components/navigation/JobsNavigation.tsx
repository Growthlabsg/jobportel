'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Briefcase,
  Search,
  Settings,
  FileText,
  Bell,
  BarChart3,
  Users,
  BookOpen,
  MessageSquare,
  ChevronRight,
  Menu,
  X,
  Code,
  UserPlus,
  ChevronUp,
  UserCheck,
  Briefcase as BriefcaseIcon,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { ProfileDropdown } from '@/components/shared/ProfileDropdown';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  matchPattern?: (path: string) => boolean;
  isExternal?: boolean;
  onClick?: () => void;
}

const navItems: NavItem[] = [
  {
    href: '/jobs',
    label: 'Home',
    icon: Home,
    matchPattern: (path) => path === '/jobs' || path === '/jobs/',
  },
  {
    href: '/jobs/find-startup-jobs',
    label: 'Find Jobs',
    icon: Search,
    matchPattern: (path) => path === '/jobs/find-startup-jobs' || path?.startsWith('/jobs/find-startup-jobs'),
  },
  {
    href: '/jobs/hire-talents',
    label: 'Hire Talent',
    icon: BriefcaseIcon,
    matchPattern: (path) => path === '/jobs/hire-talents' || path?.startsWith('/jobs/hire-talents'),
  },
  {
    href: '/jobs/build-teams',
    label: 'Build Teams',
    icon: UserPlus,
    matchPattern: (path) => path === '/jobs/build-teams' || path?.startsWith('/jobs/build-teams'),
  },
  {
    href: '/jobs/find-cofounder',
    label: 'Find Co-Founder',
    icon: UserCheck,
    matchPattern: (path) => path === '/jobs/find-cofounder' || path?.startsWith('/jobs/find-cofounder'),
  },
  {
    href: '/jobs/freelancer',
    label: 'Freelancer',
    icon: Code,
    matchPattern: (path) => path === '/jobs/freelancer' || path?.startsWith('/jobs/freelancer'),
  },
  {
    href: '/jobs/my-applications',
    label: 'Applications',
    icon: FileText,
    matchPattern: (path) => path === '/jobs/my-applications' || path?.startsWith('/jobs/my-applications'),
  },
  {
    href: '/jobs/dashboard',
    label: 'Dashboard',
    icon: BarChart3,
    matchPattern: (path) => path === '/jobs/dashboard' || path?.startsWith('/jobs/dashboard'),
  },
];

const jobSeekerNavItems: NavItem[] = [
  { label: 'My Applications', href: '/jobs/my-applications', icon: FileText },
  { label: 'Saved Jobs', href: '/jobs/saved-jobs', icon: BookOpen },
  { label: 'Job Alerts', href: '/jobs/alerts', icon: Bell },
  { label: 'Resume Builder', href: '/jobs/resume-builder', icon: FileText },
  { label: 'Dashboard', href: '/jobs/dashboard', icon: BarChart3 },
];

const employerNavItems: NavItem[] = [
  { label: 'Manage Jobs', href: '/jobs/manage', icon: Briefcase },
  { label: 'Applications', href: '/jobs/applications', icon: FileText },
  { label: 'Analytics', href: '/jobs/analytics', icon: BarChart3 },
];

const otherNavItems: NavItem[] = [
  { label: 'Settings', href: '/jobs/settings', icon: Settings },
  { label: 'Networking', href: '/jobs/networking', icon: Users },
  { label: 'Learning', href: '/jobs/learning', icon: BookOpen },
];

/** App-style bottom nav: 5 key items on mobile */
const bottomNavItems: NavItem[] = [
  { href: '/jobs', label: 'Home', icon: Home, matchPattern: (path) => path === '/jobs' || path === '/jobs/' },
  { href: '/jobs/find-startup-jobs', label: 'Jobs', icon: Search, matchPattern: (path) => path?.startsWith('/jobs/find-startup-jobs') },
  { href: '/jobs/my-applications', label: 'Applications', icon: FileText, matchPattern: (path) => path?.startsWith('/jobs/my-applications') },
  { href: '/jobs/dashboard', label: 'Dashboard', icon: BarChart3, matchPattern: (path) => path?.startsWith('/jobs/dashboard') },
  { href: '#', label: 'Menu', icon: Menu, matchPattern: () => false },
];

export function JobsNavigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open (app-like)
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isMobileMenuOpen]);

  const isActive = (item: NavItem) => {
    if (!pathname || !isMounted) return false;
    if (item.matchPattern) {
      return item.matchPattern(pathname);
    }
    return pathname === item.href;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generateBreadcrumbs = () => {
    if (!pathname || !isMounted) {
      return [{ label: 'Home', href: '/jobs' }];
    }

    if (pathname === '/jobs' || pathname === '/jobs/') {
      return [{ label: 'Home', href: '/jobs' }];
    }

    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Home', href: '/jobs' }];

    let currentPath = '/jobs';
    paths.forEach((path, index) => {
      if (path !== 'jobs') {
        currentPath += `/${path}`;
        const label = path
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        breadcrumbs.push({ label, href: currentPath });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <>
      {/* Header: only on mobile/tablet; desktop uses floating nav only */}
      <header className="lg:hidden sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 safe-area-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-3">
          <div className="flex items-center justify-between min-h-[48px] md:min-h-0">
            <Link href="/jobs" className="flex items-center gap-2 md:gap-3 group shrink-0">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-md">
                <Briefcase className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
              <div>
                <h1 className="text-base md:text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                  GrowthLab Jobs
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Find your next opportunity</p>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <div className="hidden lg:flex items-center gap-1">
                <NotificationBell />
                <ThemeToggle />
                <ProfileDropdown />
              </div>
              {/* On mobile: only show Notifications + Theme in header; Menu is in bottom nav */}
              <div className="flex lg:hidden items-center gap-1">
                <NotificationBell />
                <ThemeToggle />
                <ProfileDropdown />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop/Tablet: Floating nav always visible (no sticky header) */}
      {/* Desktop Floating Nav - always from top */}
      <nav className="hidden lg:flex fixed top-4 left-0 right-0 z-50 justify-center pointer-events-none">
        <div className="flex items-center gap-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl dark:shadow-2xl dark:shadow-black/20 rounded-full pl-3 pr-2 py-1.5 border border-gray-200/50 dark:border-gray-700/50 pointer-events-auto">
              <Link href="/jobs" className="flex items-center gap-2 shrink-0 mr-1">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                  <Briefcase className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent hidden xl:inline">GrowthLab Jobs</span>
              </Link>
              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 shrink-0" />
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item);

                if (item.isExternal && item.onClick) {
                  return (
                    <button
                      key={item.label}
                      onClick={item.onClick}
                      className={cn(
                        'flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap',
                        active
                          ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className={active ? '' : 'hidden xl:inline'}>{item.label}</span>
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap',
                      active
                        ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className={active ? '' : 'hidden xl:inline'}>{item.label}</span>
                  </Link>
                );
              })}

              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

              {/* Action buttons in nav */}
              <div className="flex items-center gap-0.5 pl-1">
                <NotificationBell />
                <ThemeToggle />
                <ProfileDropdown />
              </div>
            </div>
          </nav>

      {/* Tablet Floating Nav - always from top */}
      <nav className="hidden md:flex lg:hidden fixed top-4 left-0 right-0 z-50 justify-center pointer-events-none">
        <div className="flex items-center gap-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl rounded-full px-3 py-1.5 border border-gray-200/50 dark:border-gray-700/50 pointer-events-auto">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = isActive(item);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'p-2.5 rounded-full transition-all',
                  active
                    ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                <Icon className="h-4 w-4" />
              </Link>
            );
          })}

          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

          <NotificationBell />
          <ThemeToggle />
          <ProfileDropdown />
        </div>
      </nav>

      {/* Mobile: App-style bottom navigation bar - always visible, solid background */}
      <nav
        className="md:hidden fixed left-0 right-0 bottom-0 z-[60] bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
        style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))', paddingTop: 8 }}
      >
        <div className="flex items-center justify-around h-14 px-2">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const active = item.label === 'Menu' ? false : isActive(item);

            if (item.label === 'Menu') {
              return (
                <button
                  key="menu"
                  type="button"
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="flex flex-col items-center justify-center gap-0.5 min-h-[44px] min-w-[56px] text-gray-600 dark:text-gray-400 active:text-primary dark:active:text-primary"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6 shrink-0" />
                  <span className="text-[10px] font-medium">Menu</span>
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-0.5 min-h-[44px] min-w-[56px] transition-colors active:opacity-80 ${
                  active
                    ? 'text-primary dark:text-primary'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Icon className="h-6 w-6 shrink-0" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile: Full-screen bottom sheet menu (opened from bottom nav "Menu") */}
      {isMobileMenuOpen && (
          <>
            <div
              role="button"
              tabIndex={0}
              className="fixed inset-0 bg-black/60 z-[100]"
              onClick={() => setIsMobileMenuOpen(false)}
              onKeyDown={(e) => e.key === 'Escape' && setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            />
            <div
              className="fixed left-0 right-0 bottom-0 z-[110] bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl overflow-hidden flex flex-col animate-slide-up"
              style={{
                maxHeight: '90vh',
                paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
              }}
            >
              {/* Handle bar (app-style) */}
              <div className="flex justify-center pt-2 pb-1 shrink-0">
                <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
              </div>
              <div className="flex-1 overflow-y-auto overscroll-contain px-2 pb-2">
                {/* Sheet header with close */}
                <div className="flex items-center justify-between py-3 px-2 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Menu</h2>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 -m-2"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                {/* Breadcrumbs */}
                {breadcrumbs.length > 1 && (
                  <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-800 px-2">
                    <div className="flex items-center gap-1.5 flex-wrap text-xs">
                      {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={crumb.href}>
                          {index > 0 && (
                            <ChevronRight className="h-3 w-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                          )}
                          <Link
                            href={crumb.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              'font-medium transition-colors',
                              index === breadcrumbs.length - 1
                                ? 'text-gray-900 dark:text-gray-100 font-semibold'
                                : 'text-gray-600 dark:text-gray-400'
                            )}
                          >
                            {crumb.label}
                          </Link>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}

                {/* Main Navigation */}
                <div className="mb-3">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item);

                    if (item.isExternal && item.onClick) {
                      return (
                        <button
                          key={item.label}
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            item.onClick?.();
                          }}
                          className={cn(
                            'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                            active
                              ? 'bg-primary/10 dark:bg-primary/20 text-primary font-semibold'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          {item.label}
                        </button>
                      );
                    }

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                          active
                            ? 'bg-primary/10 dark:bg-primary/20 text-primary font-semibold'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>

                {/* Separator */}
                <div className="h-px bg-gray-200 dark:bg-gray-700 mx-2 my-2" />

                {/* Job Seeker Section */}
                <div className="mb-2">
                  <h3 className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    For Job Seekers
                  </h3>
                  {jobSeekerNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all',
                          isActive(item)
                            ? 'bg-primary/10 dark:bg-primary/20 text-primary font-medium'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>

                {/* Employer Section */}
                <div className="mb-2">
                  <h3 className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    For Employers
                  </h3>
                  {employerNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all',
                          isActive(item)
                            ? 'bg-primary/10 dark:bg-primary/20 text-primary font-medium'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>

                {/* Other Links */}
                <div>
                  <h3 className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    More
                  </h3>
                  {otherNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all',
                          isActive(item)
                            ? 'bg-primary/10 dark:bg-primary/20 text-primary font-medium'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>

                {/* Actions Row */}
                <div className="h-px bg-gray-200 dark:bg-gray-700 my-3" />
                <div className="flex items-center justify-center gap-2 px-4 py-3">
                  <NotificationBell />
                  <ThemeToggle />
                  <ProfileDropdown />
                </div>
              </div>
            </div>
          </>
        )}

      {/* Scroll to Top - above bottom nav on mobile, z above nav */}
      {isScrolled && !isMobileMenuOpen && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed left-4 bottom-24 md:bottom-4 w-12 h-12 min-h-[48px] min-w-[48px] bg-gray-800 dark:bg-gray-700 text-white rounded-full shadow-xl flex items-center justify-center active:opacity-90 z-[70]"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </>
  );
}
