'use client';

import { Coins, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface ConnectsDisplayProps {
  connects: number;
  onBuyConnects?: () => void;
  variant?: 'default' | 'compact' | 'card';
}

export function ConnectsDisplay({ connects, onBuyConnects, variant = 'default' }: ConnectsDisplayProps) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-1 text-sm">
        <Coins className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
        <span className="font-semibold text-gray-900 dark:text-gray-100">{connects}</span>
        <span className="text-gray-600 dark:text-gray-400">connects</span>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <Card className="border-2 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                <Coins className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Available Connects</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{connects}</p>
              </div>
            </div>
            {onBuyConnects && (
              <Button size="sm" variant="outline" onClick={onBuyConnects}>
                <Plus className="w-4 h-4 mr-1" />
                Buy More
              </Button>
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-yellow-200 dark:border-yellow-800">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Connects are used to submit proposals. Each proposal costs 1-5 connects depending on the project.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="flex items-center gap-1">
        <Coins className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
        {connects} Connects
      </Badge>
      {onBuyConnects && (
        <Button size="sm" variant="ghost" onClick={onBuyConnects}>
          <Plus className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}

