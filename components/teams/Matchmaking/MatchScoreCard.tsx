'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MatchScore } from '@/types/platform';
import { CheckCircle2, TrendingUp } from 'lucide-react';

interface MatchScoreCardProps {
  match: MatchScore;
  showDetails?: boolean;
}

export function MatchScoreCard({ match, showDetails = false }: MatchScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'info';
    if (score >= 40) return 'warning';
    return 'outline';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Low Match';
  };

  return (
    <Card className="border-l-4 border-l-primary">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary">{match.score}%</div>
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {getScoreLabel(match.score)}
              </div>
              <Badge variant={getScoreColor(match.score)} size="sm">
                Match Score
              </Badge>
            </div>
          </div>
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>

        {/* Match Reasons */}
        {match.reasons && match.reasons.length > 0 && (
          <div className="space-y-2 mb-3">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Why you match:
            </p>
            <div className="flex flex-wrap gap-1">
              {match.reasons.map((reason, index) => (
                <Badge key={index} variant="info" size="sm" className="text-xs">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {reason}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Breakdown */}
        {showDetails && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Skills</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {match.skillMatch}%
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Interests</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {match.interestMatch}%
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Experience</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {match.experienceMatch}%
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

