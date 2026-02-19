'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MatchResult } from '@/types/cofounder';
import { Sparkles, TrendingUp, Users, Target, ArrowRight, X } from 'lucide-react';

interface MatchRecommendationsProps {
  recommendations: MatchResult[];
  onViewMatch: (match: MatchResult) => void;
  onDismiss?: (matchId: string) => void;
}

export function MatchRecommendations({
  recommendations,
  onViewMatch,
  onDismiss,
}: MatchRecommendationsProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const handleDismiss = (matchId: string) => {
    setDismissed(new Set([...dismissed, matchId]));
    onDismiss?.(matchId);
  };

  const visible = recommendations.filter((r) => !dismissed.has(r.profile.id));

  if (visible.length === 0) return null;

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Recommended Matches
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          AI-powered suggestions based on your profile
        </p>
      </div>

      <div className="space-y-3">
        {visible.slice(0, 3).map((match) => (
          <div
            key={match.profile.id}
            className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold">
                {match.profile.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {match.profile.name}
                  </h4>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {match.compatibilityScore}%
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  {match.matchReasons.slice(0, 2).map((reason, idx) => (
                    <span key={idx} className="flex items-center gap-1">
                      {reason}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewMatch(match)}
                className="flex items-center gap-1.5"
              >
                View
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
              {onDismiss && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDismiss(match.profile.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {visible.length > 3 && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-4 text-sm"
          onClick={() => {
            document.getElementById('matches-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          View all {visible.length} recommendations
        </Button>
      )}
    </div>
  );
}

