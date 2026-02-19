'use client';

import { useState, useEffect } from 'react';
import { useSearchFreelancers, useProjects } from '@/hooks/useFreelancer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { 
  Heart, 
  User, 
  Briefcase,
  Star,
  DollarSign,
  MapPin,
  Clock,
  Trash2,
  Eye,
  ArrowRight,
  FileText,
  ArrowLeft,
  Home,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SavedItemsPage() {
  const router = useRouter();
  const [savedFreelancers, setSavedFreelancers] = useState<string[]>([]);
  const [savedProjects, setSavedProjects] = useState<string[]>([]);

  // Load saved items from localStorage
  useEffect(() => {
    const savedFreelancersData = localStorage.getItem('saved_freelancers');
    const savedProjectsData = localStorage.getItem('saved_projects');
    
    if (savedFreelancersData) {
      setSavedFreelancers(JSON.parse(savedFreelancersData));
    }
    if (savedProjectsData) {
      setSavedProjects(JSON.parse(savedProjectsData));
    }
  }, []);

  // Fetch freelancers and projects data
  const { data: freelancersData } = useSearchFreelancers({ 
    limit: 100,
    page: 1 
  });
  const { data: projectsData } = useProjects({ 
    limit: 100,
    page: 1 
  });

  const savedFreelancersList = freelancersData?.items?.filter((f: any) => savedFreelancers.includes(f.id)) || [];
  const savedProjectsList = projectsData?.items?.filter((p: any) => savedProjects.includes(p.id)) || [];

  const removeFreelancer = (id: string) => {
    const newList = savedFreelancers.filter(f => f !== id);
    setSavedFreelancers(newList);
    localStorage.setItem('saved_freelancers', JSON.stringify(newList));
  };

  const removeProject = (id: string) => {
    const newList = savedProjects.filter(p => p !== id);
    setSavedProjects(newList);
    localStorage.setItem('saved_projects', JSON.stringify(newList));
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Saved Items</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your saved freelancers and projects
          </p>
        </div>

        <Tabs defaultValue="freelancers" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="freelancers">
              Freelancers ({savedFreelancersList.length})
            </TabsTrigger>
            <TabsTrigger value="projects">
              Projects ({savedProjectsList.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="freelancers" className="space-y-4">
            {savedFreelancersList.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedFreelancersList.map((freelancer: any) => (
                  <Card key={freelancer.id} className="border-2 border-gray-200 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/50 hover:shadow-xl transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                          {freelancer.title.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Link href={`/jobs/freelancer/freelancers/${freelancer.id}`} className="flex-1">
                              <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate hover:text-primary transition-colors">
                                {freelancer.title}
                              </h3>
                            </Link>
                            <button
                              onClick={() => removeFreelancer(freelancer.id)}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                              title="Remove from saved"
                            >
                              <Heart className="w-4 h-4 fill-red-500 text-red-500" />
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
                      <Link href={`/jobs/freelancer/freelancers/${freelancer.id}`}>
                        <Button className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p className="mb-4">No saved freelancers yet</p>
                <Link href="/jobs/freelancer/find">
                  <Button>
                    <User className="w-4 h-4 mr-2" />
                    Browse Freelancers
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            {savedProjectsList.length > 0 ? (
              <div className="space-y-4">
                {savedProjectsList.map((project: any) => (
                  <Card key={project.id} className="border-2 border-gray-200 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/50 hover:shadow-xl transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Link href={`/jobs/freelancer/projects/${project.id}`} className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-primary transition-colors">
                                {project.title}
                              </h3>
                            </Link>
                            <button
                              onClick={() => removeProject(project.id)}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                              title="Remove from saved"
                            >
                              <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {project.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            {project.type === 'fixed-price' && project.budget && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                <span className="font-semibold">${project.budget.toLocaleString()}</span>
                              </div>
                            )}
                            {project.type === 'hourly' && project.hourlyRate && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span className="font-semibold">
                                  ${project.hourlyRate.min || 0}-${project.hourlyRate.max || 0}/hr
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              <span>{project.proposalsCount || 0} proposals</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Link href={`/jobs/freelancer/projects/${project.id}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p className="mb-4">No saved projects yet</p>
                <Link href="/jobs/freelancer/projects">
                  <Button>
                    <Briefcase className="w-4 h-4 mr-2" />
                    Browse Projects
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

