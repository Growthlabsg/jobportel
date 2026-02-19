'use client';

import { Briefcase, Star, Globe, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

interface JobStatsCardsProps {
  totalJobs: number;
  featuredJobs: number;
  remoteJobs: number;
  visaSponsorship: number;
}

export const JobStatsCards = ({
  totalJobs,
  featuredJobs,
  remoteJobs,
  visaSponsorship,
}: JobStatsCardsProps) => {
  const stats = [
    {
      label: 'Total Jobs',
      value: totalJobs,
      icon: Briefcase,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
    },
    {
      label: 'Featured Jobs',
      value: featuredJobs,
      icon: Star,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
    },
    {
      label: 'Remote Jobs',
      value: remoteJobs,
      icon: Globe,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      label: 'Visa Sponsorship',
      value: visaSponsorship,
      icon: CheckCircle2,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      borderColor: 'border-green-200 dark:border-green-800',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            hover
            className="border-2 border-gray-200 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/50 hover:shadow-xl transition-all duration-300 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm transform hover:scale-[1.02] group"
          >
            <CardContent className="p-5 md:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs md:text-sm font-bold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div className={`p-3 rounded-2xl ${stat.bgColor} border-2 ${stat.borderColor} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <Icon className={`h-6 w-6 ${stat.color} transition-transform duration-300 group-hover:scale-110`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
