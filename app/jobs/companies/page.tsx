'use client';

import { useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { 
  Building, 
  Search, 
  Star, 
  MapPin, 
  Users, 
  TrendingUp,
  Globe,
  Briefcase,
  Award,
  MessageSquare,
  ExternalLink,
  Filter,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';

interface Company {
  id: string;
  name: string;
  logo?: string;
  description: string;
  industry: string;
  size: string;
  location: string;
  website?: string;
  fundingStage?: string;
  founded?: number;
  rating: number;
  reviewCount: number;
  openJobs: number;
  benefits: string[];
  techStack: string[];
  culture: {
    workLifeBalance: number;
    careerGrowth: number;
    compensation: number;
    diversity: number;
  };
}

// Mock companies data
const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'TechNova Solutions',
    description: 'Leading AI and machine learning solutions provider for enterprise clients across Asia.',
    industry: 'Technology',
    size: '50-100',
    location: 'Singapore',
    website: 'https://technova.com',
    fundingStage: 'Series B',
    founded: 2018,
    rating: 4.5,
    reviewCount: 127,
    openJobs: 12,
    benefits: ['Health Insurance', 'Stock Options', 'Learning Budget', 'Flexible Work'],
    techStack: ['React', 'Node.js', 'Python', 'AWS', 'Kubernetes'],
    culture: {
      workLifeBalance: 4.2,
      careerGrowth: 4.6,
      compensation: 4.4,
      diversity: 4.3,
    },
  },
  {
    id: '2',
    name: 'GreenTech Solutions',
    description: 'Sustainable technology solutions for enterprise clients, focusing on renewable energy and carbon reduction.',
    industry: 'CleanTech',
    size: '100-500',
    location: 'London',
    website: 'https://greentech.com',
    fundingStage: 'Series C',
    founded: 2015,
    rating: 4.7,
    reviewCount: 89,
    openJobs: 8,
    benefits: ['Health Insurance', 'Flexible Work', 'Wellness Programs', 'Stock Options'],
    techStack: ['React', 'TypeScript', 'Python', 'Docker', 'PostgreSQL'],
    culture: {
      workLifeBalance: 4.5,
      careerGrowth: 4.4,
      compensation: 4.6,
      diversity: 4.5,
    },
  },
  {
    id: '3',
    name: 'StartupX',
    description: 'Fast-growing fintech startup revolutionizing digital payments in Southeast Asia.',
    industry: 'FinTech',
    size: '20-50',
    location: 'Singapore',
    website: 'https://startupx.com',
    fundingStage: 'Series A',
    founded: 2020,
    rating: 4.3,
    reviewCount: 45,
    openJobs: 15,
    benefits: ['Health Insurance', 'Stock Options', 'Remote Work', 'Learning Budget'],
    techStack: ['Vue.js', 'Node.js', 'MongoDB', 'AWS', 'GraphQL'],
    culture: {
      workLifeBalance: 3.9,
      careerGrowth: 4.7,
      compensation: 4.2,
      diversity: 4.1,
    },
  },
];

function CompaniesContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'jobs' | 'reviews'>('rating');

  const industries = Array.from(new Set(mockCompanies.map(c => c.industry)));
  const sizes = Array.from(new Set(mockCompanies.map(c => c.size)));

  const filteredCompanies = mockCompanies
    .filter(company => {
      const matchesSearch = !searchQuery || 
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesIndustry = selectedIndustry === 'all' || company.industry === selectedIndustry;
      const matchesSize = selectedSize === 'all' || company.size === selectedSize;
      return matchesSearch && matchesIndustry && matchesSize;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'jobs':
          return b.openJobs - a.openJobs;
        case 'reviews':
          return b.reviewCount - a.reviewCount;
        default:
          return 0;
      }
    });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : i < rating
            ? 'fill-yellow-200 text-yellow-200'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-primary-600 to-primary-dark text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Building className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-semibold tracking-wide uppercase">Company Directory</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
              Explore Companies
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-3xl leading-relaxed">
              Discover top startups and scale-ups, read reviews, and find your next opportunity
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Search and Filters */}
        <Card className="border-2 border-gray-200 mb-6">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <Input
                  placeholder="Search companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                >
                  <option value="all">All Industries</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                >
                  <option value="all">All Sizes</option>
                  {sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                >
                  <option value="rating">Sort by Rating</option>
                  <option value="jobs">Sort by Open Jobs</option>
                  <option value="reviews">Sort by Reviews</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Companies Grid */}
        {filteredCompanies.length === 0 ? (
          <Card className="border-2 border-gray-200 text-center py-12">
            <CardContent>
              <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Companies Found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCompanies.map((company) => (
              <Card
                key={company.id}
                className="border-2 border-gray-200 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <Building className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
                            {company.name}
                          </h3>
                          <div className="flex items-center gap-1">
                            {renderStars(company.rating)}
                            <span className="text-sm font-semibold text-gray-700 ml-1">
                              {company.rating}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{company.description}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{company.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{company.size} employees</span>
                          </div>
                          {company.fundingStage && (
                            <Badge variant="default" className="bg-primary/10 text-primary border-primary/20 text-xs">
                              {company.fundingStage}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Culture Scores */}
                  <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Work-Life Balance</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: `${(company.culture.workLifeBalance / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          {company.culture.workLifeBalance.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Career Growth</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{ width: `${(company.culture.careerGrowth / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          {company.culture.careerGrowth.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Compensation</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-500"
                            style={{ width: `${(company.culture.compensation / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          {company.culture.compensation.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Diversity</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500"
                            style={{ width: `${(company.culture.diversity / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          {company.culture.diversity.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Tech Stack</p>
                    <div className="flex flex-wrap gap-2">
                      {company.techStack.slice(0, 4).map((tech, idx) => (
                        <Badge key={idx} variant="default" className="bg-gray-100 text-gray-700 border-gray-200 text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {company.techStack.length > 4 && (
                        <Badge variant="default" className="bg-gray-100 text-gray-700 border-gray-200 text-xs">
                          +{company.techStack.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Reviews Summary */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Overall Rating</span>
                      <div className="flex items-center gap-1">
                        {renderStars(company.rating)}
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100 ml-1">{company.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{company.reviewCount} reviews</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <Link href={`/jobs/companies/${company.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        View Reviews
                      </Button>
                    </Link>
                    <Link href={`/jobs/find-startup-jobs?company=${company.id}`} className="flex-1">
                      <Button size="sm" className="w-full bg-primary hover:bg-primary-dark">
                        <Briefcase className="h-4 w-4 mr-2" />
                        {company.openJobs} Jobs
                      </Button>
                    </Link>
                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';

export default function CompaniesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading companies...</p>
          </div>
        </div>
      }
    >
      <CompaniesContent />
    </Suspense>
  );
}

