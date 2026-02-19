'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { 
  DollarSign, 
  TrendingUp, 
  BarChart3,
  MapPin,
  Briefcase,
  ArrowRight,
  Info,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

function SalaryGuideContent() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Salary Guide</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Comprehensive salary benchmarks for tech roles worldwide. Select your region and currency to see relevant data.
          </p>
        </div>

        {/* Info Card */}
        <Card className="border-blue-200 bg-blue-50 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  About This Salary Guide
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  This guide is based on market data from 2024 and includes salary ranges for various 
                  tech roles across global markets. Salaries may vary based on location, company size, funding stage, 
                  experience level, and specific skills. Select your preferred currency and region to see relevant benchmarks. 
                  For the most up-to-date insights, visit our Salary Insights page.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="roles" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="roles">By Role</TabsTrigger>
            <TabsTrigger value="experience">By Experience</TabsTrigger>
            <TabsTrigger value="location">By Location</TabsTrigger>
          </TabsList>

          <TabsContent value="roles" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { role: 'Software Engineer', entry: '4,000-6,000', mid: '6,000-10,000', senior: '10,000-15,000' },
                { role: 'Full Stack Developer', entry: '4,500-6,500', mid: '7,000-11,000', senior: '11,000-16,000' },
                { role: 'Frontend Developer', entry: '4,000-6,000', mid: '6,500-10,000', senior: '10,000-14,000' },
                { role: 'Backend Developer', entry: '4,500-6,500', mid: '7,000-11,000', senior: '11,000-16,000' },
                { role: 'Product Manager', entry: '5,000-7,000', mid: '7,500-12,000', senior: '12,000-18,000' },
                { role: 'Data Scientist', entry: '5,500-7,500', mid: '8,000-12,000', senior: '12,000-18,000' },
                { role: 'DevOps Engineer', entry: '5,000-7,000', mid: '8,000-12,000', senior: '12,000-17,000' },
                { role: 'UI/UX Designer', entry: '4,000-6,000', mid: '6,500-10,000', senior: '10,000-14,000' },
              ].map((salary, idx) => (
                <Card key={idx} className="border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg">{salary.role}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Entry Level</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">${salary.entry}/month</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Mid Level</p>
                        <p className="font-semibold text-primary">${salary.mid}/month</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Senior Level</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">${salary.senior}/month</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="experience" className="space-y-4">
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Salary by Experience Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="p-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Experience</th>
                        <th className="p-4 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">Years</th>
                        <th className="p-4 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">Avg. Salary Range</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { level: 'Entry Level', years: '0-2', salary: '$3,000 - $5,000' },
                        { level: 'Junior', years: '2-4', salary: '$4,500 - $7,000' },
                        { level: 'Mid Level', years: '4-6', salary: '$6,000 - $9,000' },
                        { level: 'Senior', years: '6-10', salary: '$8,500 - $13,000' },
                        { level: 'Lead/Principal', years: '10+', salary: '$12,000 - $18,000+' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-100">
                          <td className="p-4">
                            <span className="font-semibold text-gray-900 dark:text-gray-100">{row.level}</span>
                          </td>
                          <td className="p-4 text-center text-sm text-gray-600 dark:text-gray-400">{row.years}</td>
                          <td className="p-4 text-center">
                            <span className="font-semibold text-primary">{row.salary}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="location" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { location: 'Major Tech Hubs (SF, NYC, London)', multiplier: '100%', note: 'Base rate' },
                { location: 'Secondary Markets (Austin, Berlin, etc.)', multiplier: '85-95%', note: 'Slightly lower' },
                { location: 'Remote (Same Country)', multiplier: '90-100%', note: 'Similar to local' },
                { location: 'Remote (International)', multiplier: '60-120%', note: 'Varies by company & location' },
                { location: 'Emerging Markets', multiplier: '40-80%', note: 'Lower cost of living' },
              ].map((loc, idx) => (
                <Card key={idx} className="border-gray-200 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{loc.location}</h3>
                        <p className="text-sm text-gray-600 mb-2">{loc.note}</p>
                        <Badge variant="primary" size="sm">
                          {loc.multiplier} of base
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="border-primary/20 bg-primary/5 mt-8">
          <CardContent className="p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Get Real-Time Salary Insights
              </h2>
              <p className="text-gray-700 mb-6">
                Access detailed salary trends, market analysis, and personalized salary recommendations 
                based on your profile and experience.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/jobs/salary-insights">
                  <Button size="lg">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    View Salary Insights
                  </Button>
                </Link>
                <Link href="/jobs/find-startup-jobs">
                  <Button variant="outline" size="lg">
                    <ArrowRight className="h-5 w-5 mr-2" />
                    Browse Jobs
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SalaryGuidePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading salary guide...</p>
        </div>
      </div>
    }>
      <SalaryGuideContent />
    </Suspense>
  );
}

