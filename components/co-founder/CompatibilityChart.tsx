'use client';

import { MatchResult } from '@/types/cofounder';
import { Card, CardContent } from '@/components/ui/Card';

interface CompatibilityChartProps {
  match: MatchResult;
  size?: 'sm' | 'md' | 'lg';
}

export function CompatibilityChart({ match, size = 'md' }: CompatibilityChartProps) {
  const { detailedBreakdown } = match;
  const factors = [
    { label: 'Skills', value: detailedBreakdown.skillFit, color: 'bg-primary' },
    { label: 'Values', value: detailedBreakdown.valueAlignment, color: 'bg-success' },
    { label: 'Goals', value: detailedBreakdown.goalAlignment, color: 'bg-info' },
    { label: 'Experience', value: detailedBreakdown.experienceFit, color: 'bg-warning' },
    { label: 'Availability', value: detailedBreakdown.availabilityMatch, color: 'bg-purple' },
    { label: 'Location', value: detailedBreakdown.locationCompatibility, color: 'bg-cyan' },
    { label: 'Communication', value: detailedBreakdown.communicationStyle, color: 'bg-pink' },
  ];

  const sizeClasses = {
    sm: 'h-2 text-xs',
    md: 'h-3 text-sm',
    lg: 'h-4 text-base',
  };

  return (
    <div className="space-y-2.5">
      {factors.map((factor) => (
        <div key={factor.label} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className={`text-gray-600 dark:text-gray-400 ${sizeClasses[size]}`}>
              {factor.label}
            </span>
            <span className={`font-medium text-gray-900 dark:text-white ${sizeClasses[size]}`}>
              {factor.value}%
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`${factor.color} rounded-full transition-all duration-500 ${sizeClasses[size]}`}
              style={{ width: `${factor.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

