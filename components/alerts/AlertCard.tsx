'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { JobAlert, AlertFrequency } from '@/types/alert';
import { Edit, Trash2, Bell, BellOff, Calendar } from 'lucide-react';

interface AlertCardProps {
  alert: JobAlert;
  onEdit: (alert: JobAlert) => void;
  onDelete: (alertId: string) => void;
  onToggle: (alertId: string, enabled: boolean) => void;
}

export const AlertCard = ({ alert, onEdit, onDelete, onToggle }: AlertCardProps) => {
  const getFrequencyColor = (frequency: AlertFrequency) => {
    switch (frequency) {
      case 'Daily':
        return 'success';
      case 'Weekly':
        return 'info';
      case 'Monthly':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Card className={`border-gray-200 ${!alert.enabled ? 'opacity-60' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{alert.name}</h3>
              <Badge
                variant={alert.enabled ? 'success' : 'default'}
                size="sm"
                className="flex items-center gap-1"
              >
                {alert.enabled ? (
                  <>
                    <Bell className="h-3 w-3" />
                    Active
                  </>
                ) : (
                  <>
                    <BellOff className="h-3 w-3" />
                    Paused
                  </>
                )}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>{alert.frequency} alerts</span>
              {alert.lastSent && (
                <>
                  <span>•</span>
                  <span>Last sent: {new Date(alert.lastSent).toLocaleDateString()}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggle(alert.id, !alert.enabled)}
            >
              {alert.enabled ? (
                <BellOff className="h-4 w-4" />
              ) : (
                <Bell className="h-4 w-4" />
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={() => onEdit(alert)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (confirm('Are you sure you want to delete this alert?')) {
                  onDelete(alert.id);
                }
              }}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Keywords */}
          {alert.keywords.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Keywords</p>
              <div className="flex flex-wrap gap-1">
                {alert.keywords.slice(0, 5).map((keyword, idx) => (
                  <Badge key={idx} variant="default" size="sm">
                    {keyword}
                  </Badge>
                ))}
                {alert.keywords.length > 5 && (
                  <Badge variant="default" size="sm">
                    +{alert.keywords.length - 5} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Locations */}
          {alert.locations.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Locations</p>
              <div className="flex flex-wrap gap-1">
                {alert.locations.slice(0, 3).map((location, idx) => (
                  <Badge key={idx} variant="default" size="sm">
                    {location}
                  </Badge>
                ))}
                {alert.locations.length > 3 && (
                  <Badge variant="default" size="sm">
                    +{alert.locations.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Job Types */}
          {alert.jobTypes.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Job Types</p>
              <div className="flex flex-wrap gap-1">
                {alert.jobTypes.map((type, idx) => (
                  <Badge key={idx} variant="default" size="sm">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Salary Range */}
          {(alert.salaryMin || alert.salaryMax) && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Salary Range</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {alert.salaryMin && alert.salaryMax
                  ? `${alert.salaryMin.toLocaleString()} - ${alert.salaryMax.toLocaleString()} ${alert.salaryCurrency}`
                  : alert.salaryMin
                    ? `Min: ${alert.salaryMin.toLocaleString()} ${alert.salaryCurrency}`
                    : `Max: ${alert.salaryMax?.toLocaleString()} ${alert.salaryCurrency}`}
              </p>
            </div>
          )}

          {/* Frequency Badge */}
          <div>
            <Badge variant={getFrequencyColor(alert.frequency) as any} size="sm">
              {alert.frequency} Frequency
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

