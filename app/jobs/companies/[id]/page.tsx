'use client';

import { useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Job } from '@/types/job';
import { formatCurrency, formatDate } from '@/lib/utils';
import { 
  Building, 
  MapPin, 
  Users, 
  TrendingUp, 
  Star,
  Globe,
  Calendar,
  Briefcase,
  ArrowLeft,
  Share2,
  Mail,
  Linkedin,
  Twitter,
  Facebook,
  CheckCircle,
  MessageSquare,
  Clock,
  XCircle,
  DollarSign,
} from 'lucide-react';
import Link from 'next/link';

interface Company {
  id: string;
  name: string;
  logo?: string;
  description: string;
  website?: string;
  industry: string;
  size: string;
  founded?: string;
  location: string;
  fundingStage?: string;
  totalFunding?: string;
  employees: number;
  headquarters: string;
  benefits: string[];
  values: string[];
  culture: string;
  rating?: number;
  reviewCount?: number;
}

interface Review {
  id: string;
  author: string;
  role: string;
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  createdAt: string;
  helpful: number;
}

// Mock data
const mockCompany: Company = {
  id: '1',
  name: 'TechNova Solutions',
  description: 'TechNova Solutions is a leading technology company specializing in AI and machine learning solutions for enterprises. We are building the future of intelligent automation.',
  website: 'https://technova.com',
  industry: 'Technology',
  size: '50-100',
  founded: '2018',
  location: 'Singapore',
  fundingStage: 'Series B',
  totalFunding: '$15M',
  employees: 75,
  headquarters: 'Singapore',
  benefits: [
    'Health Insurance',
    'Stock Options',
    'Learning Budget',
    'Flexible Work Hours',
    'Remote Work Options',
    'Gym Membership',
  ],
  values: ['Innovation', 'Collaboration', 'Growth', 'Diversity'],
  culture: 'We foster a culture of innovation, collaboration, and continuous learning. Our team is passionate about solving complex problems and making a positive impact.',
  rating: 4.5,
  reviewCount: 23,
};

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Full Stack Developer',
    company: {
      id: '1',
      name: 'TechNova Solutions',
      logo: undefined,
    },
    location: 'Singapore',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    salary: {
      min: 8000,
      max: 12000,
      currency: 'USD',
    },
    description: 'We\'re looking for an experienced full stack developer...',
    requirements: ['5+ years experience', 'Strong in React and Node.js'],
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
    benefits: ['Health Insurance', 'Stock Options', 'Learning Budget'],
    remoteWork: 'Remote',
    visaSponsorship: true,
    featured: true,
    urgency: 'High',
    status: 'Published',
    matchScore: 95,
    applicationsCount: 15,
    viewsCount: 320,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Product Manager',
    company: {
      id: '1',
      name: 'TechNova Solutions',
      logo: undefined,
    },
    location: 'Singapore',
    jobType: 'Full-time',
    experienceLevel: 'Mid',
    salary: {
      min: 7000,
      max: 10000,
      currency: 'USD',
    },
    description: 'Drive product strategy and development...',
    requirements: ['3+ years product management'],
    skills: ['Product Strategy', 'Agile', 'Analytics'],
    benefits: ['Health Insurance', 'Stock Options'],
    remoteWork: 'Hybrid',
    visaSponsorship: false,
    featured: false,
    urgency: 'Medium',
    status: 'Published',
    matchScore: 85,
    applicationsCount: 8,
    viewsCount: 156,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockReviews: Review[] = [
  {
    id: '1',
    author: 'John Doe',
    role: 'Software Engineer',
    rating: 5,
    title: 'Great company culture and growth opportunities',
    content: 'I\'ve been working here for 2 years and I love the collaborative environment. The team is supportive and there are plenty of opportunities to learn and grow.',
    pros: ['Great team', 'Learning opportunities', 'Flexible work'],
    cons: ['Fast-paced environment'],
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    helpful: 12,
  },
  {
    id: '2',
    author: 'Jane Smith',
    role: 'Product Manager',
    rating: 4,
    title: 'Innovative company with exciting projects',
    content: 'The projects are challenging and interesting. Management is supportive of new ideas.',
    pros: ['Interesting projects', 'Supportive management'],
    cons: ['Sometimes long hours'],
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    helpful: 8,
  },
];

function CompanyProfileContent() {
  const params = useParams();
  const companyId = params.id as string;
  const [company] = useState<Company>(mockCompany);
  const [jobs] = useState<Job[]>(mockJobs);
  const [reviews] = useState<Review[]>(mockReviews);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      if (navigator.share) {
        navigator.share({
          title: `${company.name} - Company Profile`,
          text: `Check out ${company.name} on GrowthLab Jobs`,
          url,
        }).catch(() => {
          navigator.clipboard.writeText(url);
          alert('Link copied to clipboard!');
        });
      } else {
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/jobs/find-startup-jobs">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
        </div>

        {/* Company Header */}
        <Card className="border-gray-200 mb-6">
          <CardContent className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 shadow-lg">
                  {company.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">{company.name}</h1>
                  <p className="text-lg text-gray-600 mb-4">{company.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{company.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <span>{company.industry}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{company.size} employees</span>
                    </div>
                    {company.fundingStage && (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        <span>{company.fundingStage}</span>
                      </div>
                    )}
                    {company.rating && (
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold">{company.rating}</span>
                        <span className="text-gray-500 dark:text-gray-400">({company.reviewCount} reviews)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <Globe className="h-4 w-4 mr-2" />
                      Website
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">
              Open Jobs ({jobs.length})
            </TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({reviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle>About {company.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed mb-4">{company.description}</p>
                    <p className="text-gray-700 leading-relaxed">{company.culture}</p>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle>Company Values</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {company.values.map((value, idx) => (
                        <Badge key={idx} variant="primary" size="md">
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle>Company Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Industry</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{company.industry}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Company Size</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{company.size}</p>
                      </div>
                      {company.founded && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Founded</p>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">{company.founded}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Headquarters</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{company.headquarters}</p>
                      </div>
                      {company.fundingStage && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Funding Stage</p>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">{company.fundingStage}</p>
                        </div>
                      )}
                      {company.totalFunding && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Total Funding</p>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">{company.totalFunding}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle>Benefits & Perks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {company.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Open Positions</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{jobs.length}</p>
                      </div>
                      {company.rating && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Company Rating</p>
                          <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{company.rating}</p>
                            <span className="text-sm text-gray-500 dark:text-gray-400">/ 5.0</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <Card key={job.id} className="border-gray-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{job.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{job.jobType}</span>
                          </div>
                          {job.salary && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              <span>
                                {formatCurrency(job.salary.min, job.salary.currency)} - {formatCurrency(job.salary.max, job.salary.currency)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                          <Badge variant="default">{job.experienceLevel}</Badge>
                          <Badge variant="default">{job.remoteWork}</Badge>
                          {job.visaSponsorship && (
                            <Badge variant="success">Visa Sponsorship</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2 mb-4">{job.description}</p>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Link href={`/jobs/find-startup-jobs?job=${job.id}`}>
                          <Button size="sm">View Details</Button>
                        </Link>
                        <Link href={`/jobs/find-startup-jobs?job=${job.id}&action=apply`}>
                          <Button variant="outline" size="sm">Apply Now</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-gray-200 dark:border-gray-700">
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500 mb-4">No open positions at the moment.</p>
                  <Button variant="outline">Follow Company</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <Card key={review.id} className="border-gray-200 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-900 dark:text-gray-100">{review.author}</h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">• {review.role}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{review.title}</h4>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{review.content}</p>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-semibold text-green-700 mb-2">Pros</p>
                        <ul className="space-y-1">
                          {review.pros.map((pro, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-red-700 mb-2">Cons</p>
                        <ul className="space-y-1">
                          {review.cons.map((con, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <button className="flex items-center gap-1 hover:text-primary">
                        <MessageSquare className="h-4 w-4" />
                        Helpful ({review.helpful})
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-gray-200 dark:border-gray-700">
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500 mb-4">No reviews yet.</p>
                  <Button variant="outline">Write a Review</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function CompanyProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading company profile...</p>
        </div>
      </div>
    }>
      <CompanyProfileContent />
    </Suspense>
  );
}

