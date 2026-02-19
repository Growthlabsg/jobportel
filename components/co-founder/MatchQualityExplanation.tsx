'use client';

import { MatchResult } from '@/types/cofounder';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TrendingUp, Target, Users, CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface MatchQualityExplanationProps {
  match: MatchResult;
  compact?: boolean;
}

export function MatchQualityExplanation({ match, compact = false }: MatchQualityExplanationProps) {
  const { matchQuality, matchReasons, detailedBreakdown } = match;

  const qualityInfo = {
    excellent: {
      icon: CheckCircle2,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20',
      title: 'Excellent Match',
      description: 'Strong compatibility across all factors. Highly recommended for co-founding.',
    },
    good: {
      icon: TrendingUp,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      title: 'Good Match',
      description: 'Solid compatibility with some areas to discuss. Worth exploring further.',
    },
    fair: {
      icon: AlertCircle,
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      title: 'Fair Match',
      description: 'Some compatibility but may require more alignment discussions.',
    },
    poor: {
      icon: Info,
      color: 'text-gray-600 dark:text-gray-400',
      bg: 'bg-gray-50 dark:bg-gray-900/20',
      title: 'Limited Match',
      description: 'Lower compatibility. Consider if specific factors are critical.',
    },
  };

  const info = qualityInfo[matchQuality];
  const Icon = info.icon;

  if (compact) {
    return (
      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-2">
          <Icon className={`w-4 h-4 ${info.color}`} />
          <span className={`text-sm font-medium ${info.color}`}>{info.title}</span>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{info.description}</p>
        {matchReasons.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Key Strengths:</p>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              {matchReasons.slice(0, 2).map((reason, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className="border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800">
      <CardContent className="p-5">
        <div className={`p-4 rounded-lg ${info.bg} mb-4`}>
          <div className="flex items-center gap-3 mb-2">
            <Icon className={`w-5 h-5 ${info.color}`} />
            <div>
              <h4 className={`font-semibold ${info.color}`}>{info.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{info.description}</p>
            </div>
          </div>
        </div>

        {matchReasons.length > 0 && (
          <div className="mb-4">
            <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Why This Match Works
            </h5>
            <ul className="space-y-2">
              {matchReasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Skills Fit</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {detailedBreakdown.skillFit}%
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Values Alignment</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {detailedBreakdown.valueAlignment}%
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Goals Match</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {detailedBreakdown.goalAlignment}%
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Experience Fit</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {detailedBreakdown.experienceFit}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

