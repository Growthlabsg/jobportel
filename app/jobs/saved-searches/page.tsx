'use client';

import { useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { JobFilters } from '@/types/job';
import { formatRelativeTime } from '@/lib/utils';
import { 
  Search, 
  Trash2, 
  Play, 
  Edit, 
  Bell,
  Filter,
  MapPin,
  Briefcase,
  TrendingUp,
  Plus,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SavedSearch {
  id: string;
  name: string;
  filters: JobFilters;
  lastRun?: string;
  resultsCount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock data
const mockSavedSearches: SavedSearch[] = [
  {
    id: '1',
    name: 'Senior React Developer - Singapore',
    filters: {
      search: 'React Developer',
      location: ['Singapore'],
      jobType: ['Full-time'],
      experienceLevel: ['Senior'],
      salaryMin: 8000,
      salaryMax: 15000,
    },
    lastRun: new Date(Date.now() - 2 * 86400000).toISOString(),
    resultsCount: 12,
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: '2',
    name: 'Remote Product Manager',
    filters: {
      search: 'Product Manager',
      remoteWork: ['Remote'],
      jobType: ['Full-time'],
      experienceLevel: ['Mid', 'Senior'],
    },
    lastRun: new Date(Date.now() - 5 * 86400000).toISOString(),
    resultsCount: 8,
    isActive: true,
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: '3',
    name: 'AI/ML Engineer - High Salary',
    filters: {
      search: 'AI Machine Learning',
      experienceLevel: ['Senior', 'Expert'],
      salaryMin: 10000,
      skills: ['Python', 'TensorFlow', 'Deep Learning'],
    },
    lastRun: new Date(Date.now() - 10 * 86400000).toISOString(),
    resultsCount: 5,
    isActive: false,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
];

function SavedSearchesContent() {
  const router = useRouter();
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(mockSavedSearches);

  const handleRunSearch = (search: SavedSearch) => {
    const params = new URLSearchParams();
    
    if (search.filters.search) params.set('q', search.filters.search);
    if (search.filters.location) {
      if (Array.isArray(search.filters.location)) {
        search.filters.location.forEach((loc) => params.append('location', loc));
      } else {
        params.set('location', search.filters.location as any);
      }
    }
    if (search.filters.jobType) {
      if (Array.isArray(search.filters.jobType)) {
        search.filters.jobType.forEach((type) => params.append('jobType', type));
      } else {
        params.set('jobType', search.filters.jobType as any);
      }
    }
    if (search.filters.experienceLevel) {
      if (Array.isArray(search.filters.experienceLevel)) {
        search.filters.experienceLevel.forEach((level) => params.append('experienceLevel', level));
      } else {
        params.set('experienceLevel', search.filters.experienceLevel as any);
      }
    }
    if (search.filters.salaryMin) params.set('salaryMin', search.filters.salaryMin.toString());
    if (search.filters.salaryMax) params.set('salaryMax', search.filters.salaryMax.toString());
    
    params.set('savedSearch', search.id);
    
    router.push(`/jobs/find-startup-jobs?${params.toString()}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this saved search?')) {
      setSavedSearches(savedSearches.filter((search) => search.id !== id));
      alert('Saved search deleted!');
    }
  };

  const handleToggleActive = (id: string) => {
    setSavedSearches(
      savedSearches.map((search) =>
        search.id === id ? { ...search, isActive: !search.isActive } : search
      )
    );
  };

  const activeSearches = savedSearches.filter((s) => s.isActive);
  const inactiveSearches = savedSearches.filter((s) => !s.isActive);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Saved Searches</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Save your search filters and get notified when new jobs match
            </p>
          </div>
          <Link href="/jobs/find-startup-jobs">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Search
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Searches</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{savedSearches.length}</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                <Search className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Alerts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{activeSearches.length}</p>
              </div>
              <div className="p-2 rounded-lg bg-green-100">
                <Bell className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Results</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {savedSearches.reduce((sum, s) => sum + (s.resultsCount || 0), 0)}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-blue-100">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Searches */}
        {activeSearches.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Active Searches</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeSearches.map((search) => (
                <Card key={search.id} className="border-gray-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{search.name}</CardTitle>
                      <Badge variant="success" size="sm">
                        <Bell className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      {search.filters.search && (
                        <div className="flex items-center gap-2 text-sm">
                          <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                          <span className="text-gray-700 dark:text-gray-300">{search.filters.search}</span>
                        </div>
                      )}
                      {search.filters.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {Array.isArray(search.filters.location)
                              ? search.filters.location.join(', ')
                              : search.filters.location}
                          </span>
                        </div>
                      )}
                      {search.filters.experienceLevel && (
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {Array.isArray(search.filters.experienceLevel)
                              ? search.filters.experienceLevel.join(', ')
                              : search.filters.experienceLevel}
                          </span>
                        </div>
                      )}
                      {search.filters.salaryMin && search.filters.salaryMax && (
                        <div className="flex items-center gap-2 text-sm">
                          <Briefcase className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                          <span className="text-gray-700 dark:text-gray-300">
                            ${search.filters.salaryMin.toLocaleString()} - ${search.filters.salaryMax.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>
                        {search.resultsCount || 0} results
                      </span>
                      {search.lastRun && (
                        <span>Last run {formatRelativeTime(search.lastRun)}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleRunSearch(search)}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Run Search
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(search.id)}
                      >
                        <Bell className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(search.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Inactive Searches */}
        {inactiveSearches.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Inactive Searches</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inactiveSearches.map((search) => (
                <Card key={search.id} className="border-gray-200 opacity-75 hover:opacity-100 transition-opacity">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{search.name}</CardTitle>
                      <Badge variant="default" size="sm">Inactive</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      {search.filters.search && (
                        <div className="flex items-center gap-2 text-sm">
                          <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                          <span className="text-gray-700 dark:text-gray-300">{search.filters.search}</span>
                        </div>
                      )}
                      {search.filters.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {Array.isArray(search.filters.location)
                              ? search.filters.location.join(', ')
                              : search.filters.location}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>
                        {search.resultsCount || 0} results
                      </span>
                      {search.lastRun && (
                        <span>Last run {formatRelativeTime(search.lastRun)}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleRunSearch(search)}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Run
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(search.id)}
                      >
                        <Bell className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(search.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {savedSearches.length === 0 && (
          <Card className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">No Saved Searches</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Save your search filters to quickly find jobs and get notified when new opportunities match your criteria.
              </p>
              <Link href="/jobs/find-startup-jobs">
                <Button size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Search
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function SavedSearchesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading saved searches...</p>
        </div>
      </div>
    }>
      <SavedSearchesContent />
    </Suspense>
  );
}

