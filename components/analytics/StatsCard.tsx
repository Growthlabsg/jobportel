'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  change?: number; // percentage change
  subtitle?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
}

export const StatsCard = ({
  title,
  value,
  icon,
  change,
  subtitle,
  variant = 'default',
}: StatsCardProps) => {
  const variantStyles = {
    default: 'bg-white border-gray-200',
    primary: 'bg-primary/5 border-primary/20',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200',
  };

  const iconStyles = {
    default: 'bg-gray-100 text-gray-600',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-yellow-100 text-yellow-600',
    error: 'bg-red-100 text-red-600',
  };

  return (
    <Card className={`border ${variantStyles[variant]}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className={`text-2xl font-bold ${variant === 'primary' ? 'text-primary' : 'text-gray-900'}`}>
                {value}
              </p>
              {change !== undefined && (
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${
                    change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {change >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>{Math.abs(change)}%</span>
                </div>
              )}
            </div>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {icon && (
            <div className={`p-2 rounded-lg ${iconStyles[variant]}`}>{icon}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

