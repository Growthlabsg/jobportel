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

export function JobsNavigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 100);
      setIsVisible(scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      {/* Initial Header - Static, scrolls with page */}
      <header className="relative z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/jobs" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                  GrowthLab Jobs
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Find your next opportunity</p>
              </div>
            </Link>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex items-center gap-1">
                <NotificationBell />
                <ThemeToggle />
                <ProfileDropdown />
              </div>
              
              {/* Mobile Menu Button - Initial Header */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200/50 dark:border-gray-700 rounded-full shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center justify-center transition-all"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Navigation - Shows after scroll */}
      {isVisible && (
        <>
          {/* Desktop Floating Nav */}
          <nav className="hidden lg:flex fixed top-4 left-0 right-0 z-50 animate-fade-in justify-center pointer-events-none">
            <div className="flex items-center gap-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl dark:shadow-2xl dark:shadow-black/20 rounded-full px-2 py-1.5 border border-gray-200/50 dark:border-gray-700/50 pointer-events-auto">
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

          {/* Tablet Floating Nav - Compact */}
          <nav className="hidden md:flex lg:hidden fixed top-4 left-0 right-0 z-50 animate-fade-in justify-center pointer-events-none">
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
        </>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-14 h-14 bg-gradient-to-r from-primary to-primary-dark text-white rounded-full shadow-xl flex items-center justify-center hover:opacity-90 transition-all"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="absolute bottom-16 right-0 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-slide-up z-50">
              <div className="p-2 max-h-[70vh] overflow-y-auto">
                {/* Mobile Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-800 px-2">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Navigation</h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
                <div className="h-px bg-gray-200 dark:bg-gray-700 mx-2 my-2" />
                <div className="flex items-center justify-center gap-2 px-4 py-2">
                  <NotificationBell />
                  <ThemeToggle />
                  <ProfileDropdown />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Scroll to Top Button */}
      {isScrolled && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 left-4 w-12 h-12 bg-gray-800 dark:bg-gray-700 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-gray-700 dark:hover:bg-gray-600 transition-all z-50 animate-fade-in"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </>
  );
}
