'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  Code, 
  Search, 
  Briefcase, 
  User, 
  TrendingUp, 
  Clock, 
  DollarSign,
  MapPin,
  Star,
  ArrowRight,
  Plus,
  CheckCircle2,
  BarChart3,
  MessageSquare,
  FileText,
  Heart,
  Users,
} from 'lucide-react';
import { useSearchFreelancers, useProjects } from '@/hooks/useFreelancer';
import { FreelancerGridSkeleton, ProjectGridSkeleton } from '@/components/freelancer/LoadingSkeleton';
import { PaymentProtectionBadge, VerificationBadge, JobSuccessScoreBadge } from '@/components/freelancer/PaymentProtectionBadge';

export default function FreelancerPage() {
  const { data: freelancersData, isLoading: freelancersLoading } = useSearchFreelancers({ limit: 4, sortBy: 'rating' });
  const { data: projectsData, isLoading: projectsLoading } = useProjects({ limit: 3, status: 'open', sortBy: 'newest' });

  const featuredFreelancers = freelancersData?.items || [];
  const featuredProjects = projectsData?.items || [];
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pt-20 lg:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#1E293B] dark:text-white mb-4">
              Freelancer Marketplace
            </h1>
            <p className="text-lg text-[#64748B] dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Connect with skilled freelancers or discover exciting projects. Build your startup with top talent.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/jobs/freelancer/find">
                <Button size="lg" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Find Freelancers
                </Button>
              </Link>
              <Link href="/jobs/freelancer/post-project">
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Post a Project
                </Button>
              </Link>
              <Link href="/jobs/freelancer/projects">
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Browse Projects
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#1E293B] dark:text-white mb-1">1,247</div>
              <div className="text-sm text-[#64748B] dark:text-gray-400">Active Freelancers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#1E293B] dark:text-white mb-1">892</div>
              <div className="text-sm text-[#64748B] dark:text-gray-400">Open Projects</div>
              </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#1E293B] dark:text-white mb-1">$2.4M</div>
              <div className="text-sm text-[#64748B] dark:text-gray-400">Total Earned</div>
              </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#1E293B] dark:text-white mb-1">4.8</div>
              <div className="text-sm text-[#64748B] dark:text-gray-400">Avg Rating</div>
              </div>
              </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* For Clients */}
          <Card className="border border-gray-200 dark:border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-[#1E293B] dark:text-white">For Clients</h2>
              </div>
              <p className="text-sm text-[#64748B] dark:text-gray-400 mb-6">
                Find skilled freelancers to bring your projects to life. Post projects, review proposals, and hire the best talent.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  'Post projects (fixed-price or hourly)',
                  'Browse freelancer profiles',
                  'Review proposals and portfolios',
                  'Secure milestone payments',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-[#64748B] dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-3 mb-4">
                <Link href="/jobs/freelancer/post-project" className="flex-1">
                  <Button className="w-full" size="sm">
                    <Plus className="w-4 h-4" />
                    Post Project
                  </Button>
                </Link>
                <Link href="/jobs/freelancer/find" className="flex-1">
                  <Button variant="outline" className="w-full" size="sm">
                    <Search className="w-4 h-4" />
                    Find Talent
                  </Button>
                </Link>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-1">
                <Link href="/jobs/dashboard?tab=client">
                  <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
                    <TrendingUp className="w-4 h-4" />
                    Client Dashboard
                  </Button>
                </Link>
                <Link href="/jobs/freelancer/compare">
                  <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
                    <BarChart3 className="w-4 h-4" />
                    Compare Items
                  </Button>
                </Link>
                <Link href="/jobs/freelancer/talent-pools">
                  <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
                    <Users className="w-4 h-4" />
                    Talent Pools
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* For Freelancers */}
          <Card className="border border-gray-200 dark:border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-[#1E293B] dark:text-white">For Freelancers</h2>
              </div>
              <p className="text-sm text-[#64748B] dark:text-gray-400 mb-6">
                Find exciting projects, build your portfolio, and grow your freelance career with startups in the Growth Lab community.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  'Browse open projects',
                  'Create your freelancer profile',
                  'Submit proposals',
                  'Get paid securely',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-[#64748B] dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-3 mb-4">
                <Link href="/jobs/freelancer/projects" className="flex-1">
                  <Button className="w-full" size="sm">
                    <Briefcase className="w-4 h-4" />
                    Browse Projects
                  </Button>
                </Link>
                <Link href="/jobs/freelancer/profile" className="flex-1">
                  <Button variant="outline" className="w-full" size="sm">
                    <User className="w-4 h-4" />
                    Create Profile
                  </Button>
                </Link>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-1">
                <Link href="/jobs/dashboard?tab=freelancer">
                  <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
                    <TrendingUp className="w-4 h-4" />
                    Freelancer Dashboard
                  </Button>
                </Link>
                <Link href="/jobs/freelancer/proposals">
                  <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
                    <FileText className="w-4 h-4" />
                    My Proposals
                  </Button>
                </Link>
                <Link href="/jobs/freelancer/proposal-insights">
                  <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
                    <BarChart3 className="w-4 h-4" />
                    Proposal Insights
                  </Button>
                </Link>
                <Link href="/jobs/freelancer/saved">
                  <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
                    <Heart className="w-4 h-4" />
                    Saved Items
                  </Button>
                </Link>
                <Link href="/jobs/freelancer/contests">
                  <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
                    <Star className="w-4 h-4" />
                    Contests
                  </Button>
                </Link>
                <Link href="/jobs/freelancer/membership">
                  <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Membership Plans
                  </Button>
                </Link>
                <Link href="/jobs/freelancer/talent-pools">
                  <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
                    <Users className="w-4 h-4" />
                    Talent Pools
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Projects */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#1E293B] dark:text-white mb-2">Featured Projects</h2>
              <p className="text-sm text-[#64748B] dark:text-gray-400">Handpicked projects from top startups</p>
            </div>
            <Link href="/jobs/freelancer/projects">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsLoading ? (
              <ProjectGridSkeleton count={3} />
            ) : featuredProjects.length > 0 ? (
              featuredProjects.map((project: any) => (
                <Card key={project.id} className="border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                  <CardContent className="p-6">
                    <div className="mb-4">
                        <Link href={`/jobs/freelancer/projects/${project.id}`}>
                        <h3 className="text-lg font-bold text-[#1E293B] dark:text-white mb-2 hover:text-primary transition-colors">
                            {project.title}
                          </h3>
                        </Link>
                      <p className="text-sm text-[#64748B] dark:text-gray-400 mb-4 line-clamp-2">
                          {project.description}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-[#64748B] dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-medium">
                          {project.type === 'fixed-price'
                            ? `$${project.budget?.toLocaleString() || 'Negotiable'}`
                            : `$${project.hourlyRate?.min || 0}-${project.hourlyRate?.max || '∞'}/hr`}
                        </span>
                      </div>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span className="capitalize">{project.type.replace('-', ' ')}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {project.skills.slice(0, 3).map((skill: any) => (
                        <span key={skill} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-[#64748B] dark:text-gray-300 rounded-md text-xs">
                          {skill}
                        </span>
                      ))}
                      {project.skills.length > 3 && (
                        <span className="px-2 py-1 text-[#64748B] dark:text-gray-400 text-xs">
                          +{project.skills.length - 3} more
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                      <span className="text-xs text-[#64748B] dark:text-gray-400">{project.proposalsCount} proposals</span>
                      <Link href={`/jobs/freelancer/projects/${project.id}`}>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="lg:col-span-3 text-center py-12 text-[#64748B] dark:text-gray-400">
                No featured projects available. <Link href="/jobs/freelancer/post-project" className="text-primary hover:underline">Post a project</Link> to get started.
              </div>
            )}
          </div>
        </div>

        {/* Top Freelancers */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#1E293B] dark:text-white mb-2">Top Freelancers</h2>
              <p className="text-sm text-[#64748B] dark:text-gray-400">Highly rated professionals ready to work</p>
            </div>
            <Link href="/jobs/freelancer/find">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {freelancersLoading ? (
              <FreelancerGridSkeleton count={4} />
            ) : featuredFreelancers.length > 0 ? (
              featuredFreelancers.map((freelancer: any) => (
                <Card key={freelancer.id} className="border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold">
                      {freelancer.title.charAt(0).toUpperCase()}
                    </div>
                    <Link href={`/jobs/freelancer/freelancers/${freelancer.id}`}>
                      <h3 className="font-bold text-[#1E293B] dark:text-white mb-1 hover:text-primary transition-colors">
                        {freelancer.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-[#64748B] dark:text-gray-400 mb-3 line-clamp-2">{freelancer.description}</p>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <VerificationBadge 
                        verified={freelancer.verified} 
                        identityVerified={freelancer.identityVerified}
                        variant="compact"
                      />
                      {freelancer.jobSuccessScore && (
                        <JobSuccessScoreBadge score={freelancer.jobSuccessScore} variant="compact" />
                      )}
                    </div>
                    <div className="flex items-center justify-center gap-1 mb-3">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-[#1E293B] dark:text-white">{freelancer.rating.toFixed(1)}</span>
                      <span className="text-xs text-[#64748B] dark:text-gray-400">({freelancer.totalReviews} reviews)</span>
                    </div>
                    {freelancer.hourlyRate && (
                      <div className="text-sm text-[#64748B] dark:text-gray-400 mb-4">
                        <DollarSign className="w-4 h-4 inline mr-1" />
                        ${freelancer.hourlyRate}/hr
                      </div>
                    )}
                    <Link href={`/jobs/freelancer/freelancers/${freelancer.id}`} className="block">
                      <Button size="sm" variant="outline" className="w-full">
                        View Profile
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="lg:col-span-4 text-center py-12 text-[#64748B] dark:text-gray-400">
                No freelancers available yet. <Link href="/jobs/freelancer/profile" className="text-primary hover:underline">Create your profile</Link> to get started.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

