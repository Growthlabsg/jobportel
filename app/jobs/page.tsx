'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardTitle, CardFooter } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { 
  Search, 
  Briefcase, 
  Users, 
  TrendingUp, 
  ArrowRight, 
  MapPin, 
  Clock, 
  DollarSign,
  Star,
  Bookmark,
  Eye,
  Zap,
  FileText,
  MessageSquare,
  Building,
  Globe,
  Brain,
  BarChart3,
  Award,
  BookOpen,
  FileText as FileTextIcon,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function JobsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (locationFilter) params.set('location', locationFilter);
    router.push(`/jobs/find-startup-jobs?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSaveJob = (jobId: string) => {
    if (typeof window !== 'undefined') {
      try {
        const savedJobsStr = localStorage.getItem('savedJobs');
        let savedJobs: string[] = [];
        
        if (savedJobsStr && savedJobsStr.trim() !== '') {
          try {
            const parsed = JSON.parse(savedJobsStr);
            if (Array.isArray(parsed)) {
              savedJobs = parsed;
            }
          } catch (parseError) {
            console.error('Error parsing savedJobs:', parseError);
            localStorage.removeItem('savedJobs');
          }
        }
        
        if (!savedJobs.includes(jobId)) {
          savedJobs.push(jobId);
          localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
          alert('Job saved!');
        } else {
          alert('Job already saved!');
        }
      } catch (error) {
        console.error('Error accessing localStorage:', error);
        alert('Unable to save job. Please try again.');
      }
    }
  };

  const featuredJobs = [
    {
      id: '1',
      title: 'Senior Full Stack Developer',
      company: 'TechNova Solutions',
      location: 'Singapore',
      type: 'Full-time',
      salary: '$6,000 - $8,000',
      skills: ['React', 'Node.js', 'TypeScript'],
      icon: Building,
    },
    {
      id: '2',
      title: 'Growth Marketing Manager',
      company: 'StartupX',
      location: 'Remote',
      type: 'Full-time',
      salary: '$5,000 - $7,000',
      skills: ['Digital Marketing', 'Analytics', 'Growth'],
      icon: TrendingUp,
    },
    {
      id: '3',
      title: 'Product Designer',
      company: 'DesignHub',
      location: 'Hybrid',
      type: 'Full-time',
      salary: '$4,500 - $6,500',
      skills: ['UI/UX', 'Figma', 'Prototyping'],
      icon: Globe,
    },
  ];

  const resources = [
    { icon: FileText, title: 'Resume Builder', desc: 'Create a professional resume that stands out', href: '/jobs/resume-builder' },
    { icon: FileTextIcon, title: 'Cover Letter Builder', desc: 'Craft compelling cover letters with AI assistance', href: '/jobs/cover-letter' },
    { icon: Briefcase, title: 'My Applications', desc: 'Track all your job applications in one place', href: '/jobs/my-applications' },
    { icon: BarChart3, title: 'Application Analytics', desc: 'Track your application performance and success rates', href: '/jobs/application-analytics' },
    { icon: Bookmark, title: 'Saved Jobs', desc: 'Manage your favorite job opportunities with notes and tags', href: '/jobs/saved-jobs' },
    { icon: Search, title: 'Saved Searches', desc: 'Save your search filters and get job alerts', href: '/jobs/saved-searches' },
    { icon: TrendingUp, title: 'Compare Jobs', desc: 'Compare up to 3 jobs side-by-side', href: '/jobs/compare' },
    { icon: Building, title: 'Company Profiles', desc: 'Explore companies, read reviews, and insights', href: '/jobs/companies' },
    { icon: MessageSquare, title: 'Interview Preparation', desc: 'Tips and practice for acing your interviews', href: '/jobs/interview-prep' },
    { icon: DollarSign, title: 'Salary Guide', desc: 'Benchmark salaries for tech roles globally', href: '/jobs/salary-guide' },
    { icon: DollarSign, title: 'Salary Negotiation', desc: 'Master the art of negotiating your compensation', href: '/jobs/salary-negotiation' },
    { icon: Brain, title: 'Skills Assessment', desc: 'Test your technical skills and get certified', href: '/jobs/skills-assessment' },
    { icon: BarChart3, title: 'Career Insights', desc: 'Market trends, salary data, and career paths', href: '/jobs/career-insights' },
    { icon: Award, title: 'Portfolio Showcase', desc: 'Build and showcase your projects and achievements', href: '/jobs/portfolio' },
    { icon: BookOpen, title: 'Learning Resources', desc: 'Access courses, tutorials, and upskilling materials', href: '/jobs/learning' },
    { icon: Users, title: 'Networking', desc: 'Connect with professionals and attend events', href: '/jobs/networking' },
    { icon: FileTextIcon, title: 'Application Templates', desc: 'Download professional templates for resumes and emails', href: '/jobs/application-templates' },
    { icon: Star, title: 'Job Recommendations', desc: 'AI-powered personalized job recommendations', href: '/jobs/recommendations' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F5F9] via-white to-[#F1F5F9] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Clean Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-900 border-b border-gray-200/60 pt-20 lg:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-6 py-8 sm:py-12 max-w-7xl">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in">
            {/* Clean Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-4 sm:mb-6">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary">GrowthLab Jobs</span>
            </div>
            
            {/* Clean Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1E293B] mb-3 sm:mb-4 gradient-text px-2">
              Find Your Dream Job
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-[#64748B] max-w-2xl mx-auto px-4">
              Connect with top startup talent or find your next opportunity. We welcome applications from anywhere in the world.
            </p>

            {/* Clean Search Bar */}
            <div className="max-w-4xl mx-auto mt-8 sm:mt-10">
              <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200/60 dark:border-gray-700/60">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for jobs, companies, or skills..."
                    className="w-full pl-12 pr-4 h-12 text-base border-0 bg-transparent focus:outline-none focus:ring-0 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <select 
                  className="h-12 w-full sm:w-48 border-0 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-primary/30 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 font-medium cursor-pointer"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                >
                  <option value="">All Locations</option>
                  <optgroup label="Work Type">
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  </optgroup>
                  <optgroup label="Major Cities">
                    <option value="singapore">Singapore</option>
                    <option value="san-francisco">San Francisco</option>
                    <option value="new-york">New York</option>
                    <option value="london">London</option>
                    <option value="berlin">Berlin</option>
                    <option value="tokyo">Tokyo</option>
                    <option value="sydney">Sydney</option>
                    <option value="toronto">Toronto</option>
                    <option value="dubai">Dubai</option>
                    <option value="bangalore">Bangalore</option>
                    <option value="hong-kong">Hong Kong</option>
                    <option value="seoul">Seoul</option>
                    <option value="amsterdam">Amsterdam</option>
                    <option value="paris">Paris</option>
                    <option value="tel-aviv">Tel Aviv</option>
                    <option value="austin">Austin</option>
                    <option value="boston">Boston</option>
                    <option value="seattle">Seattle</option>
                  </optgroup>
                  <optgroup label="Regions">
                    <option value="asia-pacific">Asia Pacific</option>
                    <option value="europe">Europe</option>
                    <option value="north-america">North America</option>
                    <option value="south-america">South America</option>
                    <option value="middle-east">Middle East</option>
                    <option value="africa">Africa</option>
                    <option value="oceania">Oceania</option>
                  </optgroup>
                </select>
                <Button 
                  size="lg" 
                  className="h-12 px-6"
                  onClick={handleSearch}
                  leftIcon={<Search className="w-4 h-4" />}
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Stats Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-6 py-8 sm:py-12 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { value: '2,847', label: 'Active Jobs', icon: Briefcase, gradient: 'from-primary to-accent' },
            { value: '156', label: 'Companies', icon: Building, gradient: 'from-info to-info-light' },
            { value: '12.4k', label: 'Candidates', icon: Users, gradient: 'from-success to-success-light' },
            { value: '89%', label: 'Hire Rate', icon: TrendingUp, gradient: 'from-warning to-warning-light' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={index} 
                className="text-center group relative overflow-hidden border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800 transition-all duration-500 ease-out card-hover"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs font-medium text-[#64748B] mb-2 uppercase tracking-wide">{stat.label}</p>
                      <p className="text-3xl font-bold text-[#1E293B] dark:text-white transition-transform duration-300 group-hover:scale-105">
                  {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      <Icon className="h-6 w-6" />
                </div>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-6 py-8 sm:py-12 max-w-7xl">
        <Tabs defaultValue="overview" className="w-full">
          <div className="mb-8 flex justify-center">
            <TabsList className="bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-lg">
              <TabsTrigger value="overview" className="px-4 py-2 rounded-md text-sm font-medium">Overview</TabsTrigger>
              <TabsTrigger value="hire" className="px-4 py-2 rounded-md text-sm font-medium">Hire Talent</TabsTrigger>
              <TabsTrigger value="find" className="px-4 py-2 rounded-md text-sm font-medium">Find Jobs</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview">
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
              {/* Featured Jobs */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-heading text-gray-900 dark:text-white mb-1">Featured Jobs</h2>
                    <p className="text-gray-500 dark:text-gray-400">Handpicked opportunities from top startups</p>
                  </div>
                  <Link
                    href="/jobs/find-startup-jobs"
                    className="text-primary hover:text-primary-dark font-semibold text-sm flex items-center gap-2 transition-colors group"
                  >
                    View All
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {featuredJobs.map((job) => {
                    const Icon = job.icon;
                    return (
                      <Card 
                        key={job.id} 
                        className="group relative overflow-hidden border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-500 ease-out card-hover"
                      >
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                        <CardContent className="p-5 sm:p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
                          </div>
                          <div className="flex-1 min-w-0">
                                <CardTitle className="text-base sm:text-lg md:text-xl mb-1 group-hover:text-primary transition-colors duration-300 font-bold">
                                  {job.title}
                            </CardTitle>
                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3 font-medium">{job.company}</p>
                                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3">
                              <div className="flex items-center gap-1.5">
                                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>{job.location}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>{job.type}</span>
                              </div>
                            </div>
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                  {job.skills.map((skill) => (
                                    <Badge key={skill} variant="outline" size="sm" className="text-xs">
                                      {skill}
                              </Badge>
                                  ))}
                            </div>
                                <div className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">
                              <DollarSign className="w-4 h-4 text-primary" />
                                  <span>{job.salary} / month</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.preventDefault();
                                handleSaveJob(job.id);
                              }}
                            >
                              <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
                          </Button>
                          </div>
                        </CardContent>
                        <CardFooter className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 border-0 gap-3">
                        <Link href="/jobs/find-startup-jobs" className="flex-1">
                            <Button variant="outline" size="sm" fullWidth leftIcon={<Eye className="w-4 h-4" />}>
                            View Details
                          </Button>
                        </Link>
                        <Link href="/jobs/find-startup-jobs" className="flex-1">
                            <Button size="sm" fullWidth>
                            Apply Now
                          </Button>
                        </Link>
                        </CardFooter>
                  </Card>
                    );
                  })}
                </div>
              </div>

              {/* Clean Quick Actions */}
              <div className="space-y-4">
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#1E293B] dark:text-white mb-1">Get Started</h2>
                  <p className="text-sm text-[#64748B] dark:text-gray-400">Choose your path to success</p>
                </div>
                <div className="space-y-3">
                  <Link href="/jobs/find-startup-jobs">
                    <Card className="cursor-pointer group relative overflow-hidden border-2 border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-500 ease-out card-hover">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <CardContent className="flex items-center gap-4 p-4 sm:p-5">
                        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                          <Briefcase className="h-6 w-6 sm:h-8 sm:w-8" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm sm:text-base md:text-lg text-[#1E293B] dark:text-white mb-1 group-hover:text-primary transition-colors duration-300">
                            For Job Seekers
                          </h3>
                          <p className="text-xs sm:text-sm text-[#64748B] dark:text-gray-400 line-clamp-2">
                            Browse thousands of startup jobs
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/jobs/hire-talents">
                    <Card className="cursor-pointer group relative overflow-hidden border-2 border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800 hover:border-secondary/50 dark:hover:border-secondary/50 transition-all duration-500 ease-out card-hover">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary to-secondary-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <CardContent className="flex items-center gap-4 p-4 sm:p-5">
                        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-secondary to-secondary-dark text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                          <Users className="h-6 w-6 sm:h-8 sm:w-8" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm sm:text-base md:text-lg text-[#1E293B] dark:text-white mb-1 group-hover:text-secondary transition-colors duration-300">
                            For Employers
                          </h3>
                          <p className="text-xs sm:text-sm text-[#64748B] dark:text-gray-400 line-clamp-2">
                            Find the best talent for your startup
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-secondary group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/jobs/build-teams">
                    <Card className="cursor-pointer group relative overflow-hidden border-2 border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800 hover:border-accent/50 dark:hover:border-accent/50 transition-all duration-500 ease-out card-hover">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-accent-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <CardContent className="flex items-center gap-4 p-4 sm:p-5">
                        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-accent to-accent-dark text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                          <Sparkles className="h-6 w-6 sm:h-8 sm:w-8" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm sm:text-base md:text-lg text-[#1E293B] dark:text-white mb-1 group-hover:text-accent transition-colors duration-300">
                            Build Teams
                          </h3>
                          <p className="text-xs sm:text-sm text-[#64748B] dark:text-gray-400 line-clamp-2">
                            Form micro-teams & find co-founders
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hire">
            <div className="text-center py-20 max-w-3xl mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-secondary to-secondary-dark rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl animate-pulse-glow">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
                Hire Top Talent
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 leading-relaxed font-light">
                Access our curated pool of skilled professionals and find the perfect fit for your startup. 
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <Link href="/jobs/hire-talents">
                  <Button size="lg" className="px-8 py-6 text-base font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all" leftIcon={<Briefcase className="w-5 h-5" />}>
                    Post a Job
                  </Button>
                </Link>
                <Link href="/jobs/applications">
                  <Button variant="outline" size="lg" className="px-8 py-6 text-base font-bold border-2 hover:border-primary hover:bg-primary/5 transition-all">
                    View Applications
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="find">
            <div className="text-center py-20 max-w-3xl mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-dark rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl animate-pulse-glow">
                <Search className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
                Find Your Next Opportunity
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 leading-relaxed font-light">
                Discover exciting opportunities at innovative startups worldwide. Applications welcome from any region.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <Link href="/jobs/find-startup-jobs">
                  <Button size="lg" className="px-8 py-6 text-base font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all" leftIcon={<Search className="w-5 h-5" />}>
                    Browse Jobs
                  </Button>
                </Link>
                <Link href="/jobs/resume-builder">
                  <Button variant="outline" size="lg" className="px-8 py-6 text-base font-bold border-2 hover:border-primary hover:bg-primary/5 transition-all">
                    Update Profile
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Clean Resources Section */}
      <section className="bg-white dark:bg-gray-900 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-6 max-w-7xl">
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1E293B] dark:text-white">Resources for Job Seekers</h2>
            </div>
            <p className="text-sm sm:text-base text-[#64748B] dark:text-gray-400 mb-6">
                Helpful guides and tools to advance your career
              </p>
            </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
            {resources.map((resource, index) => {
                const IconComponent = resource.icon;
                return (
                <Link key={index} href={resource.href}>
                  <Card className="h-full group relative overflow-hidden border-2 border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-500 ease-out card-hover">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardContent className="p-4 sm:p-6 text-center relative z-10">
                      <div className="inline-flex p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-accent text-white mb-3 sm:mb-4 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                        <IconComponent className="h-6 w-6 sm:h-8 sm:w-8" />
                    </div>
                      <h3 className="font-bold text-sm sm:text-base md:text-lg text-[#1E293B] dark:text-white mb-1 group-hover:text-primary transition-colors duration-300">
                        {resource.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#64748B] dark:text-gray-400 mb-2 sm:mb-3 line-clamp-2">
                        {resource.desc}
                      </p>
                  </CardContent>
                </Card>
                </Link>
                );
              })}
          </div>
        </div>
      </section>

      {/* Chat Button */}
    </div>
  );
}

// Force dynamic rendering to avoid SSR serialization issues
export const dynamic = 'force-dynamic';
