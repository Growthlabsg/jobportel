'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Calendar,
  CheckCircle2,
  XCircle,
  Camera,
} from 'lucide-react';
import { TimeEntry } from '@/types/freelancer';

interface TimeTrackerProps {
  contractId: string;
  entries: TimeEntry[];
  isTracking: boolean;
  onStartTracking: () => void;
  onStopTracking: () => void;
  onPauseTracking: () => void;
  onResumeTracking: () => void;
  onAddManualEntry?: (hours: number, description: string) => void;
  canApprove?: boolean;
  onApprove?: (entryId: string) => void;
  onReject?: (entryId: string) => void;
}

export function TimeTracker({
  contractId,
  entries,
  isTracking,
  onStartTracking,
  onStopTracking,
  onPauseTracking,
  onResumeTracking,
  onAddManualEntry,
  canApprove = false,
  onApprove,
  onReject,
}: TimeTrackerProps) {
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualHours, setManualHours] = useState('');
  const [manualDescription, setManualDescription] = useState('');

  const totalHours = entries
    .filter(e => e.status === 'approved')
    .reduce((sum, e) => sum + e.hours, 0);
  const pendingHours = entries
    .filter(e => e.status === 'pending')
    .reduce((sum, e) => sum + e.hours, 0);

  const handleAddManualEntry = () => {
    const hours = parseFloat(manualHours);
    if (hours > 0 && manualDescription.trim()) {
      onAddManualEntry?.(hours, manualDescription);
      setManualHours('');
      setManualDescription('');
      setShowManualEntry(false);
    }
  };

  return (
    <Card className="border-2 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Time Tracking</CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Total: </span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{totalHours.toFixed(1)}h</span>
            </div>
            {pendingHours > 0 && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Pending: </span>
                <span className="font-semibold text-yellow-600 dark:text-yellow-400">{pendingHours.toFixed(1)}h</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Timer Controls */}
        <div className="flex items-center gap-3 mb-6">
          {!isTracking ? (
            <Button onClick={onStartTracking} className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Start Timer
            </Button>
          ) : (
            <>
              <Button onClick={onPauseTracking} variant="outline" className="flex items-center gap-2">
                <Pause className="w-4 h-4" />
                Pause
              </Button>
              <Button onClick={onStopTracking} variant="outline" className="flex items-center gap-2">
                <Square className="w-4 h-4" />
                Stop
              </Button>
            </>
          )}
          {onAddManualEntry && (
            <Button
              variant="outline"
              onClick={() => setShowManualEntry(!showManualEntry)}
            >
              Add Manual Entry
            </Button>
          )}
        </div>

        {/* Manual Entry Form */}
        {showManualEntry && (
          <Card className="mb-6 border border-gray-200 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="space-y-3">
                <Input
                  type="number"
                  label="Hours"
                  placeholder="0.0"
                  value={manualHours}
                  onChange={(e) => setManualHours(e.target.value)}
                  min="0"
                  step="0.25"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <Textarea
                    placeholder="What did you work on?"
                    value={manualDescription}
                    onChange={(e) => setManualDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddManualEntry} size="sm">
                    Add Entry
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowManualEntry(false);
                      setManualHours('');
                      setManualDescription('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Time Entries */}
        <div className="space-y-3">
          {entries.length > 0 ? (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {entry.hours}h
                        </span>
                      </div>
                      <Badge
                        variant={
                          entry.status === 'approved'
                            ? 'success'
                            : entry.status === 'rejected'
                            ? 'error'
                            : 'warning'
                        }
                        className="text-xs"
                      >
                        {entry.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{entry.description}</p>
                    {entry.screenshots && entry.screenshots.length > 0 && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <Camera className="w-3 h-3" />
                        <span>{entry.screenshots.length} screenshot(s)</span>
                      </div>
                    )}
                  </div>
                  {canApprove && entry.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => onApprove?.(entry.id)}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-300 dark:border-red-700"
                        onClick={() => onReject?.(entry.id)}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
              <p>No time entries yet</p>
              <p className="text-sm mt-1">Start tracking your time to get paid</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

