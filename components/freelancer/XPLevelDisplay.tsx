'use client';

import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { Star, TrendingUp } from 'lucide-react';

interface XPLevelDisplayProps {
  xp: number;
  level: number;
  variant?: 'default' | 'compact';
}

// Calculate XP needed for next level (exponential growth)
function getXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

// Calculate XP needed for current level
function getXPForCurrentLevel(level: number): number {
  if (level === 1) return 0;
  return getXPForLevel(level - 1);
}

export function XPLevelDisplay({ xp, level, variant = 'default' }: XPLevelDisplayProps) {
  const xpForCurrentLevel = getXPForCurrentLevel(level);
  const xpForNextLevel = getXPForLevel(level);
  const xpInCurrentLevel = xp - xpForCurrentLevel;
  const xpNeededForNext = xpForNextLevel - xpForCurrentLevel;
  const progress = (xpInCurrentLevel / xpNeededForNext) * 100;

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-500" />
          <span className="text-xs font-semibold">Level {level}</span>
        </Badge>
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {xp.toLocaleString()} XP
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="font-semibold">Level {level}</span>
          </Badge>
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <TrendingUp className="w-4 h-4" />
            <span>{xp.toLocaleString()} XP</span>
          </div>
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {xpInCurrentLevel.toLocaleString()} / {xpNeededForNext.toLocaleString()} XP to Level {level + 1}
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}

