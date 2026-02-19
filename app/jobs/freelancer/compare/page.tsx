'use client';

import { useState } from 'react';
import { useProjects, useSearchFreelancers } from '@/hooks/useFreelancer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Briefcase, 
  DollarSign, 
  Clock, 
  MapPin,
  User,
  Star,
  CheckCircle2,
  X,
  Plus,
  ArrowRight,
  TrendingUp,
  ArrowLeft,
  Home,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ComparisonItem = {
  id: string;
  type: 'project' | 'freelancer';
  title: string;
  data: any;
};

export default function ComparePage() {
  const router = useRouter();
  const [comparisonItems, setComparisonItems] = useState<ComparisonItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'project' | 'freelancer'>('project');

  const { data: projectsData } = useProjects({ search: searchQuery, limit: 10 });
  const { data: freelancersData } = useSearchFreelancers({ search: searchQuery, limit: 10 });

  const addToComparison = (item: any, type: 'project' | 'freelancer') => {
    if (comparisonItems.length >= 3) {
      alert('You can compare up to 3 items at a time');
      return;
    }
    if (comparisonItems.some(i => i.id === item.id && i.type === type)) {
      alert('Item already in comparison');
      return;
    }
    setComparisonItems([...comparisonItems, {
      id: item.id,
      type,
      title: item.title || item.name,
      data: item,
    }]);
  };

  const removeFromComparison = (id: string) => {
    setComparisonItems(comparisonItems.filter(item => item.id !== id));
  };

  const clearComparison = () => {
    setComparisonItems([]);
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Compare Items</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Compare projects or freelancers side by side
          </p>
        </div>

        {/* Search Section */}
        <Card className="border-2 border-gray-200 dark:border-gray-700 mb-8">
          <CardHeader>
            <CardTitle>Add Items to Compare</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button
                  variant={searchType === 'project' ? 'primary' : 'outline'}
                  onClick={() => setSearchType('project')}
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Projects
                </Button>
                <Button
                  variant={searchType === 'freelancer' ? 'primary' : 'outline'}
                  onClick={() => setSearchType('freelancer')}
                >
                  <User className="w-4 h-4 mr-2" />
                  Freelancers
                </Button>
              </div>
              <input
                type="text"
                placeholder={`Search ${searchType}s...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
              {searchType === 'project' && projectsData?.items && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {projectsData.items.map((project: any) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{project.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{project.description}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addToComparison(project, 'project')}
                        disabled={comparisonItems.some(i => i.id === project.id) || comparisonItems.length >= 3}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              {searchType === 'freelancer' && freelancersData?.items && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {freelancersData.items.map((freelancer: any) => (
                    <div
                      key={freelancer.id}
                      className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{freelancer.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{freelancer.description}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addToComparison(freelancer, 'freelancer')}
                        disabled={comparisonItems.some(i => i.id === freelancer.id) || comparisonItems.length >= 3}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Comparison Table */}
        {comparisonItems.length > 0 && (
          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Comparison ({comparisonItems.length}/3)</CardTitle>
              <Button variant="outline" size="sm" onClick={clearComparison}>
                Clear All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left p-4 font-semibold text-gray-900 dark:text-gray-100">Feature</th>
                      {comparisonItems.map((item) => (
                        <th key={item.id} className="text-left p-4 relative">
                          <button
                            onClick={() => removeFromComparison(item.id)}
                            className="absolute top-2 right-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                          >
                            <X className="w-4 h-4 text-gray-500" />
                          </button>
                          <div className="pr-8">
                            <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{item.title}</div>
                            <Badge variant="outline" className="text-xs">
                              {item.type}
                            </Badge>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonItems[0]?.type === 'project' ? (
                      <>
                        <ComparisonRow label="Type" values={comparisonItems.map(i => i.data.type || 'N/A')} />
                        <ComparisonRow label="Budget" values={comparisonItems.map(i => {
                          if (i.data.type === 'fixed-price' && i.data.budget) {
                            return `$${i.data.budget.toLocaleString()}`;
                          }
                          if (i.data.type === 'hourly' && i.data.hourlyRate) {
                            return `$${i.data.hourlyRate.min || 0}-${i.data.hourlyRate.max || 0}/hr`;
                          }
                          return 'N/A';
                        })} />
                        <ComparisonRow label="Proposals" values={comparisonItems.map(i => String(i.data.proposalsCount || 0))} />
                        <ComparisonRow label="Status" values={comparisonItems.map(i => i.data.status || 'N/A')} />
                        <ComparisonRow label="Skills" values={comparisonItems.map(i => {
                          const skills = i.data.skills || [];
                          return skills.slice(0, 3).join(', ') + (skills.length > 3 ? '...' : '');
                        })} />
                      </>
                    ) : (
                      <>
                        <ComparisonRow label="Rating" values={comparisonItems.map(i => {
                          const rating = i.data.rating || 0;
                          return `${rating.toFixed(1)} ⭐ (${i.data.totalReviews || 0} reviews)`;
                        })} />
                        <ComparisonRow label="Hourly Rate" values={comparisonItems.map(i => {
                          return i.data.hourlyRate ? `$${i.data.hourlyRate}/hr` : 'N/A';
                        })} />
                        <ComparisonRow label="Experience" values={comparisonItems.map(i => {
                          return i.data.experienceLevel || 'N/A';
                        })} />
                        <ComparisonRow label="Availability" values={comparisonItems.map(i => {
                          return i.data.availability || 'N/A';
                        })} />
                        <ComparisonRow label="Jobs Completed" values={comparisonItems.map(i => String(i.data.totalJobs || 0))} />
                        <ComparisonRow label="Completion Rate" values={comparisonItems.map(i => `${i.data.completionRate || 0}%`)} />
                      </>
                    )}
                    <tr>
                      <td className="p-4 font-semibold text-gray-900 dark:text-gray-100">Actions</td>
                      {comparisonItems.map((item) => (
                        <td key={item.id} className="p-4">
                          <Link href={item.type === 'project' 
                            ? `/jobs/freelancer/projects/${item.id}`
                            : `/jobs/freelancer/freelancers/${item.id}`
                          }>
                            <Button variant="outline" size="sm" className="w-full">
                              View Details
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {comparisonItems.length === 0 && (
          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardContent className="p-12 text-center">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Items to Compare</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Search and add up to 3 projects or freelancers to compare them side by side
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function ComparisonRow({ label, values }: { label: string; values: string[] }) {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-700">
      <td className="p-4 font-semibold text-gray-900 dark:text-gray-100">{label}</td>
      {values.map((value, idx) => (
        <td key={idx} className="p-4 text-gray-700 dark:text-gray-300">{value}</td>
      ))}
    </tr>
  );
}

