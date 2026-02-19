'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
// JobCard is not needed here as we're rendering custom cards
import { Sparkles, TrendingUp, Target, Zap } from 'lucide-react';
import { JobRecommendation } from '@/types/recommendation';
import { Job } from '@/types/job';

interface JobRecommendationsProps {
  userId?: string;
  limit?: number;
}

export function JobRecommendations({ userId, limit = 5 }: JobRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock AI-powered recommendations
    const fetchRecommendations = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock recommendations with match scores
      const mockRecommendations: JobRecommendation[] = [
        {
          id: '1',
          title: 'Senior Full Stack Developer',
          company: {
            id: '1',
            name: 'TechNova Solutions',
          },
          location: 'Singapore',
          jobType: 'Full-time',
          experienceLevel: 'Senior',
          salary: {
            min: 10000,
            max: 15000,
            currency: 'USD',
          },
          description: 'Join our AI research team...',
          requirements: ['5+ years experience', 'Strong in React and Node.js'],
          skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
          benefits: ['Health Insurance', 'Stock Options'],
          remoteWork: 'Remote',
          visaSponsorship: true,
          featured: true,
          urgency: 'High',
          status: 'Published',
          recommendationScore: 95,
          matchReasons: [
            'Strong match with your React and TypeScript skills',
            'Remote work matches your preferences',
            'Salary range aligns with your expectations',
            'Company culture fits your values',
          ],
          whyMatch: {
            skills: 98,
            experience: 92,
            location: 100,
            salary: 88,
            culture: 95,
          },
          matchScore: 95,
          applicationsCount: 12,
          viewsCount: 245,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Product Marketing Manager',
          company: {
            id: '2',
            name: 'GreenTech Solutions',
          },
          location: 'London',
          jobType: 'Full-time',
          experienceLevel: 'Mid',
          salary: {
            min: 6000,
            max: 9000,
            currency: 'GBP',
          },
          description: 'Drive product marketing strategy...',
          requirements: ['MBA preferred', '3+ years B2B marketing'],
          skills: ['Product Marketing', 'B2B Marketing', 'Analytics'],
          benefits: ['Health Insurance', 'Flexible Work'],
          remoteWork: 'Hybrid',
          visaSponsorship: false,
          featured: true,
          urgency: 'Medium',
          status: 'Published',
          recommendationScore: 82,
          matchReasons: [
            'Your marketing experience aligns well',
            'Hybrid work model available',
            'Growing company with great opportunities',
          ],
          whyMatch: {
            skills: 85,
            experience: 80,
            location: 75,
            salary: 82,
            culture: 88,
          },
          matchScore: 82,
          applicationsCount: 8,
          viewsCount: 156,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      setRecommendations(mockRecommendations);
      setLoading(false);
    };

    fetchRecommendations();
  }, [userId]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">AI-Powered Recommendations</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading personalized job matches...</p>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">AI-Powered Recommendations</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Jobs matched to your profile</p>
          </div>
        </div>
        <Badge className="bg-primary/10 text-primary border-primary/20">
          {recommendations.length} matches
        </Badge>
      </div>

      <div className="space-y-4">
        {recommendations.slice(0, limit).map((job) => (
          <Card key={job.id} className="p-4 border-2 border-gray-200 hover:border-primary/30 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100">{job.title}</h4>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    {job.recommendationScore}% match
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{job.company.name}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {job.matchReasons.slice(0, 2).map((reason, idx) => (
                    <Badge key={idx} variant="default" className="text-xs">
                      {reason}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3 text-xs">
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3 text-primary" />
                <span className="text-gray-600 dark:text-gray-400">Skills: {job.whyMatch.skills}%</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-primary" />
                <span className="text-gray-600 dark:text-gray-400">Exp: {job.whyMatch.experience}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-primary" />
                <span className="text-gray-600 dark:text-gray-400">Culture: {job.whyMatch.culture}%</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" className="flex-1">
                View Details
              </Button>
              <Button size="sm" variant="outline">
                Save
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {recommendations.length > limit && (
        <div className="mt-4 text-center">
          <Button variant="outline" size="sm">
            View All Recommendations
          </Button>
        </div>
      )}
    </Card>
  );
}

