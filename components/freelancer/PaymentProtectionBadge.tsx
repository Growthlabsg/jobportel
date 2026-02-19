'use client';

import { Shield, Lock, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface PaymentProtectionBadgeProps {
  enabled: boolean;
  variant?: 'default' | 'compact';
}

export function PaymentProtectionBadge({ enabled, variant = 'default' }: PaymentProtectionBadgeProps) {
  if (!enabled) return null;

  if (variant === 'compact') {
    return (
      <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
    );
  }

  return (
    <Badge variant="success" className="flex items-center gap-1">
      <Shield className="w-3 h-3" />
      Payment Protected
    </Badge>
  );
}

interface VerificationBadgeProps {
  verified: boolean;
  identityVerified?: boolean;
  variant?: 'default' | 'compact';
}

export function VerificationBadge({ verified, identityVerified, variant = 'default' }: VerificationBadgeProps) {
  if (!verified && !identityVerified) return null;

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-1">
        {verified && (
          <CheckCircle2 className="w-4 h-4 text-primary" />
        )}
        {identityVerified && (
          <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {verified && (
        <Badge variant="primary" className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Verified
        </Badge>
      )}
      {identityVerified && (
        <Badge variant="info" className="flex items-center gap-1">
          <Lock className="w-3 h-3" />
          Identity Verified
        </Badge>
      )}
    </div>
  );
}

interface JobSuccessScoreBadgeProps {
  score: number;
  variant?: 'default' | 'compact';
}

export function JobSuccessScoreBadge({ score, variant = 'default' }: JobSuccessScoreBadgeProps) {
  const getColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 75) return 'text-blue-600 dark:text-blue-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getLabel = (score: number) => {
    if (score >= 90) return 'Top Rated';
    if (score >= 75) return 'Rising Talent';
    return 'New';
  };

  if (variant === 'compact') {
    return (
      <span className={`text-xs font-semibold ${getColor(score)}`}>
        JSS: {score}%
      </span>
    );
  }

  return (
    <Badge variant="outline" className={`${getColor(score)} border-current`}>
      {getLabel(score)} ({score}% JSS)
    </Badge>
  );
}

