'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  AlertCircle,
  Shield,
  Calendar,
} from 'lucide-react';
import { Milestone } from '@/types/freelancer';

interface MilestoneTrackerProps {
  milestones: Milestone[];
  canManage?: boolean;
  onMarkComplete?: (milestoneId: string) => void;
  onReleasePayment?: (milestoneId: string) => void;
  onDispute?: (milestoneId: string) => void;
}

export function MilestoneTracker({ 
  milestones, 
  canManage = false,
  onMarkComplete,
  onReleasePayment,
  onDispute,
}: MilestoneTrackerProps) {
  const totalAmount = milestones.reduce((sum, m) => sum + m.amount, 0);
  const paidAmount = milestones
    .filter(m => m.paymentStatus === 'released')
    .reduce((sum, m) => sum + m.amount, 0);
  const escrowAmount = milestones
    .filter(m => m.paymentStatus === 'in-escrow')
    .reduce((sum, m) => sum + m.amount, 0);
  const progress = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;

  const getStatusBadge = (milestone: Milestone) => {
    if (milestone.status === 'paid') {
      return <Badge variant="success" className="flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3" />
        Paid
      </Badge>;
    }
    if (milestone.status === 'completed') {
      return <Badge variant="primary" className="flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3" />
        Completed
      </Badge>;
    }
    if (milestone.status === 'disputed') {
      return <Badge variant="error" className="flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        Disputed
      </Badge>;
    }
    if (milestone.status === 'in-progress') {
      return <Badge variant="warning" className="flex items-center gap-1">
        <Clock className="w-3 h-3" />
        In Progress
      </Badge>;
    }
    return <Badge variant="outline">Pending</Badge>;
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'released':
        return <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'in-escrow':
        return <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      default:
        return null;
    }
  };

  return (
    <Card className="border-2 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Payment Milestones</CardTitle>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            ${paidAmount.toLocaleString()} / ${totalAmount.toLocaleString()}
          </div>
        </div>
        <div className="mt-2">
          <Progress value={progress} className="h-2" />
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            <span>${escrowAmount.toLocaleString()} in escrow</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" />
            <span>${paidAmount.toLocaleString()} released</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary/30 dark:hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">{milestone.title}</h4>
                    {getStatusBadge(milestone)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{milestone.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        ${milestone.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Due {new Date(milestone.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {getPaymentStatusIcon(milestone.paymentStatus)}
                      <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {milestone.paymentStatus.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {canManage && (
                <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                  {milestone.status === 'in-progress' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onMarkComplete?.(milestone.id)}
                    >
                      Mark Complete
                    </Button>
                  )}
                  {milestone.status === 'completed' && milestone.paymentStatus === 'in-escrow' && (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => onReleasePayment?.(milestone.id)}
                    >
                      Release Payment
                    </Button>
                  )}
                  {milestone.status !== 'disputed' && milestone.status !== 'paid' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700 border-red-300 dark:border-red-700"
                      onClick={() => onDispute?.(milestone.id)}
                    >
                      Dispute
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

