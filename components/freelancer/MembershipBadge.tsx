'use client';

import { Badge } from '@/components/ui/Badge';
import { Crown, Zap, Building2, Briefcase } from 'lucide-react';
import { MembershipTier } from '@/types/freelancer';

interface MembershipBadgeProps {
  tier: MembershipTier;
  variant?: 'default' | 'compact';
}

const tierConfig = {
  basic: {
    name: 'Basic',
    icon: Briefcase,
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    borderColor: 'border-gray-300 dark:border-gray-700',
  },
  plus: {
    name: 'Plus',
    icon: Zap,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    borderColor: 'border-blue-300 dark:border-blue-700',
  },
  business: {
    name: 'Business',
    icon: Building2,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    borderColor: 'border-purple-300 dark:border-purple-700',
  },
  enterprise: {
    name: 'Enterprise',
    icon: Crown,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    borderColor: 'border-yellow-300 dark:border-yellow-700',
  },
};

export function MembershipBadge({ tier, variant = 'default' }: MembershipBadgeProps) {
  const config = tierConfig[tier];
  const Icon = config.icon;

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1 ${config.color}`}>
        <Icon className="w-4 h-4" />
        <span className="text-xs font-semibold">{config.name}</span>
      </div>
    );
  }

  return (
    <Badge
      variant="outline"
      className={`${config.bgColor} ${config.borderColor} ${config.color} flex items-center gap-1.5`}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.name}
    </Badge>
  );
}

