'use client';

import { useState, useEffect } from 'react';
import { useSearchFreelancers } from '@/hooks/useFreelancer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { FreelancerGridSkeleton } from '@/components/freelancer/LoadingSkeleton';
import { VerificationBadge, JobSuccessScoreBadge } from '@/components/freelancer/PaymentProtectionBadge';
import { 
  Search, 
  User, 
  Star, 
  DollarSign, 
  MapPin, 
  Clock,
  CheckCircle2,
  Filter,
  X,
  Heart,
  ArrowUpDown,
  Briefcase,
  ArrowLeft,
  Home,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FreelancerFilters } from '@/types/freelancer';

export default function FindFreelancersPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<FreelancerFilters>({
    page: 1,
    limit: 20,
    sortBy: 'rating',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [savedFreelancers, setSavedFreelancers] = useState<Set<string>>(new Set());

  // Load saved freelancers from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('saved_freelancers');
    if (saved) {
      setSavedFreelancers(new Set(JSON.parse(saved)));
    }
  }, []);

  const { data, isLoading } = useSearchFreelancers(filters);

  const toggleSaveFreelancer = (freelancerId: string) => {
    setSavedFreelancers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(freelancerId)) {
        newSet.delete(freelancerId);
      } else {
        newSet.add(freelancerId);
      }
      // Save to localStorage
      const savedArray = Array.from(newSet);
      localStorage.setItem('saved_freelancers', JSON.stringify(savedArray));
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
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Link href="/jobs/freelancer">
              <Button variant="ghost">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Find Freelancers</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Browse skilled professionals ready to work on your projects
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Search by name, skills, or expertise..."
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
                    Hourly Rate
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.hourlyRateMin || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, hourlyRateMin: e.target.value ? Number(e.target.value) : undefined }))}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.hourlyRateMax || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, hourlyRateMax: e.target.value ? Number(e.target.value) : undefined }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Experience Level
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    value={filters.experienceLevel || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, experienceLevel: e.target.value as any || undefined }))}
                  >
                    <option value="">All Levels</option>
                    <option value="entry">Entry</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Availability
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    value={filters.availability || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value as any || undefined }))}
                  >
                    <option value="">All</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="as-needed">As-needed</option>
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
            <p className="text-gray-600 dark:text-gray-400">Loading freelancers...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(data?.items || []).length > 0 ? (
              data?.items.map((freelancer: any) => (
                <Card key={freelancer.id} className="group border-2 border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow">
                        {freelancer.title.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Link href={`/jobs/freelancer/freelancers/${freelancer.id}`} className="flex-1">
                            <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate hover:text-primary transition-colors">
                              {freelancer.title}
                            </h3>
                          </Link>
                          <VerificationBadge 
                            verified={freelancer.verified} 
                            identityVerified={freelancer.identityVerified}
                            variant="compact"
                          />
                          {freelancer.jobSuccessScore && (
                            <JobSuccessScoreBadge score={freelancer.jobSuccessScore} variant="compact" />
                          )}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleSaveFreelancer(freelancer.id);
                            }}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                            title={savedFreelancers.has(freelancer.id) ? 'Remove from saved' : 'Save freelancer'}
                          >
                            <Heart
                              className={`w-4 h-4 transition-colors ${
                                savedFreelancers.has(freelancer.id)
                                  ? 'fill-red-500 text-red-500'
                                  : 'text-gray-400 hover:text-red-500'
                              }`}
                            />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                          {freelancer.description}
                        </p>
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {freelancer.rating.toFixed(1)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({freelancer.totalReviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {freelancer.hourlyRate && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold">${freelancer.hourlyRate}/hr</span>
                        </div>
                      )}
                      {freelancer.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{freelancer.location}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {freelancer.skills.slice(0, 3).map((skill: any) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {freelancer.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{freelancer.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <span>{freelancer.totalJobs} jobs completed</span>
                      <span>{freelancer.completionRate}% completion rate</span>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/jobs/freelancer/freelancers/${freelancer.id}`} className="flex-1">
                        <Button className="w-full">
                          View Profile
                        </Button>
                      </Link>
                      <Link href={`/jobs/freelancer/post-project`}>
                        <Button variant="outline" size="sm" title="Hire this freelancer">
                          <Briefcase className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <User className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">No freelancers found</p>
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

