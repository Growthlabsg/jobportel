'use client';

import { useState, useEffect } from 'react';
import { useProjects } from '@/hooks/useFreelancer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ProjectGridSkeleton } from '@/components/freelancer/LoadingSkeleton';
import { PaymentProtectionBadge } from '@/components/freelancer/PaymentProtectionBadge';
import { 
  Search, 
  Briefcase, 
  DollarSign, 
  Clock, 
  MapPin,
  Filter,
  X,
  TrendingUp,
  Heart,
  ArrowUpDown,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProjectFilters, ProjectType } from '@/types/freelancer';

export default function BrowseProjectsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ProjectFilters>({
    page: 1,
    limit: 20,
    status: 'open',
    sortBy: 'newest',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [savedProjects, setSavedProjects] = useState<Set<string>>(new Set());

  // Load saved projects from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('saved_projects');
    if (saved) {
      setSavedProjects(new Set(JSON.parse(saved)));
    }
  }, []);

  const { data, isLoading } = useProjects(filters);

  const toggleSaveProject = (projectId: string) => {
    setSavedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      // Save to localStorage
      const savedArray = Array.from(newSet);
      localStorage.setItem('saved_projects', JSON.stringify(savedArray));
      return newSet;
    });
  };

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Browse Projects</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Find projects that match your skills and interests
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Search projects by title, skills, or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="mb-6 border-2 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Type
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    value={filters.type || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as ProjectType || undefined }))}
                  >
                    <option value="">All Types</option>
                    <option value="fixed-price">Fixed Price</option>
                    <option value="hourly">Hourly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Budget Range
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.budgetMin || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, budgetMin: e.target.value ? Number(e.target.value) : undefined }))}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.budgetMax || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, budgetMax: e.target.value ? Number(e.target.value) : undefined }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Remote Work
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    value={filters.remote === undefined ? '' : String(filters.remote)}
                    onChange={(e) => setFilters(prev => ({ ...prev, remote: e.target.value === '' ? undefined : e.target.value === 'true' }))}
                  >
                    <option value="">All</option>
                    <option value="true">Remote Only</option>
                    <option value="false">On-site Only</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading projects...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {(data?.items || []).length > 0 ? (
              data?.items.map((project: any) => (
                <Card key={project.id} className="group border-2 border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Link href={`/jobs/freelancer/projects/${project.id}`} className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-primary transition-colors">
                              {project.title}
                            </h3>
                          </Link>
                          {project.featured && (
                            <Badge variant="primary" className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Featured
                            </Badge>
                          )}
                          {project.paymentProtection && (
                            <PaymentProtectionBadge enabled={project.paymentProtection} variant="compact" />
                          )}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleSaveProject(project.id);
                            }}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                            title={savedProjects.has(project.id) ? 'Remove from saved' : 'Save project'}
                          >
                            <Heart
                              className={`w-4 h-4 transition-colors ${
                                savedProjects.has(project.id)
                                  ? 'fill-red-500 text-red-500'
                                  : 'text-gray-400 hover:text-red-500'
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            <span>{project.clientName}</span>
                          </div>
                          {project.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{project.location}</span>
                            </div>
                          )}
                          {project.remote && (
                            <Badge variant="outline" className="text-xs">Remote</Badge>
                          )}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex items-center gap-4 mb-4">
                          {project.type === 'fixed-price' && project.budget && (
                            <div className="flex items-center gap-1 text-gray-900 dark:text-gray-100">
                              <DollarSign className="w-4 h-4" />
                              <span className="font-semibold">${project.budget.toLocaleString()}</span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">Fixed Price</span>
                            </div>
                          )}
                          {project.type === 'hourly' && project.hourlyRate && (
                            <div className="flex items-center gap-1 text-gray-900 dark:text-gray-100">
                              <Clock className="w-4 h-4" />
                              <span className="font-semibold">
                                ${project.hourlyRate.min || 0}-${project.hourlyRate.max || 0}/hr
                              </span>
                            </div>
                          )}
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {project.proposalsCount} proposals
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                          {project.skills.slice(0, 5).map((skill: any) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {project.skills.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.skills.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Posted {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                      <Link href={`/jobs/freelancer/projects/${project.id}`}>
                        <Button>
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">No projects found</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              disabled={filters.page === 1}
              onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) - 1 }))}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {filters.page} of {data.totalPages}
            </span>
            <Button
              variant="outline"
              disabled={filters.page === data.totalPages}
              onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

