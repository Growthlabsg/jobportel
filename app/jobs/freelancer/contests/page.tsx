'use client';

import { useState, useEffect } from 'react';
import { useProjects } from '@/hooks/useFreelancer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useRouter } from 'next/navigation';
import { Trophy, Calendar, Users, DollarSign, ArrowLeft, Home, Search, Filter } from 'lucide-react';
import { Project } from '@/types/freelancer';
import Link from 'next/link';

export default function ContestsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const { data: contestsData, isLoading } = useProjects({
    type: 'contest',
    status: 'open',
    limit: 50,
    page: 1,
  });

  const contests = contestsData?.items?.filter((contest: any) => 
    contest.type === 'contest' && 
    (searchTerm === '' || contest.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     contest.description.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const categories = ['all', 'Design', 'Writing', 'Marketing', 'Web Development', 'Other'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/jobs/freelancer')}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Contests</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Participate in contests and showcase your skills. Winners get prizes!
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search contests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'primary' : 'outline'}
                  onClick={() => setSelectedCategory(cat)}
                  className="whitespace-nowrap"
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Contests Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="border-2 border-gray-200 dark:border-gray-700 animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : contests.length === 0 ? (
          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardContent className="p-12 text-center">
              <Trophy className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No contests found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm ? 'Try adjusting your search terms' : 'Check back later for new contests'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contests.map((contest: any) => (
              <Card
                key={contest.id}
                className="border-2 border-gray-200 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/50 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => router.push(`/jobs/freelancer/contests/${contest.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg text-gray-900 dark:text-gray-100 line-clamp-2">
                      {contest.title}
                    </CardTitle>
                    <Trophy className="w-6 h-6 text-yellow-500 flex-shrink-0 ml-2" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>{contest.clientName}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                    {contest.description}
                  </p>
                  
                  <div className="space-y-3 mb-4">
                    {contest.contestPrize && (
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          ${contest.contestPrize.toLocaleString()} Prize Pool
                        </span>
                      </div>
                    )}
                    {contest.contestWinners && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {contest.contestWinners} Winner{contest.contestWinners > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                    {contest.contestEndDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        <span className="text-gray-700 dark:text-gray-300">
                          Ends: {new Date(contest.contestEndDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {contest.contestEntries && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {contest.contestEntries.length} Entries
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {contest.skills?.slice(0, 3).map((skill: string) => (
                      <Badge key={skill} variant="primary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {contest.skills?.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{contest.skills.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/jobs/freelancer/contests/${contest.id}`);
                    }}
                  >
                    View Contest
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

