'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Interview } from '@/types/interview';
import { InterviewType } from '@/lib/constants';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Phone,
  Users,
  Briefcase,
  Edit,
  X,
  CheckCircle,
  MessageSquare,
} from 'lucide-react';
import { formatDate, formatTime } from '@/lib/utils';

interface InterviewCardProps {
  interview: Interview;
  onEdit?: (interview: Interview) => void;
  onCancel?: (interview: Interview) => void;
  onComplete?: (interview: Interview) => void;
  onView?: (interview: Interview) => void;
  view?: 'list' | 'card';
}

export const InterviewCard = ({
  interview,
  onEdit,
  onCancel,
  onComplete,
  onView,
  view = 'card',
}: InterviewCardProps) => {
  const getTypeIcon = (type: InterviewType) => {
    switch (type) {
      case 'Phone':
        return <Phone className="h-4 w-4" />;
      case 'Video':
        return <Video className="h-4 w-4" />;
      case 'In-person':
        return <MapPin className="h-4 w-4" />;
      case 'Technical':
        return <Briefcase className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'info';
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'error';
      case 'Rescheduled':
        return 'warning';
      default:
        return 'default';
    }
  };

  const scheduledDate = new Date(interview.scheduledAt);
  const isPast = scheduledDate < new Date();
  const isToday =
    scheduledDate.toDateString() === new Date().toDateString();

  if (view === 'list') {
    return (
      <Card className={`border-gray-200 ${isPast && interview.status === 'Scheduled' ? 'opacity-75' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              {/* Type Icon */}
              <div className="p-2 bg-primary/10 rounded-lg">
                {getTypeIcon(interview.type)}
              </div>

              {/* Candidate & Job Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{interview.candidateName}</h3>
                  <Badge variant={getStatusColor(interview.status) as any} size="sm">
                    {interview.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{interview.jobTitle}</p>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(interview.scheduledAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {interview.duration} min
                  </span>
                  {interview.interviewerName && (
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {interview.interviewerName}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {interview.status === 'Scheduled' && (
                <>
                  {onEdit && (
                    <Button variant="outline" size="sm" onClick={() => onEdit(interview)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {onComplete && isPast && (
                    <Button variant="outline" size="sm" onClick={() => onComplete(interview)}>
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                  {onCancel && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCancel(interview)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </>
              )}
              {onView && (
                <Button variant="outline" size="sm" onClick={() => onView(interview)}>
                  <MessageSquare className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Card View
  return (
    <Card className={`border-gray-200 ${isPast && interview.status === 'Scheduled' ? 'opacity-75' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              {getTypeIcon(interview.type)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{interview.candidateName}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{interview.jobTitle}</p>
            </div>
          </div>
          <Badge variant={getStatusColor(interview.status) as any} size="sm">
            {interview.status}
          </Badge>
        </div>
        {isToday && interview.status === 'Scheduled' && (
          <Badge variant="warning" size="sm" className="mt-2">
            Today
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Date & Time */}
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span>{formatDate(interview.scheduledAt)}</span>
            <Clock className="h-4 w-4 text-gray-500 ml-2" />
            <span>{formatTime(interview.scheduledAt)}</span>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span>{interview.duration} minutes</span>
          </div>

          {/* Location or Meeting Link */}
          {interview.type === 'In-person' && interview.location && (
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="truncate">{interview.location}</span>
            </div>
          )}
          {interview.type === 'Video' && interview.meetingLink && (
            <div className="flex items-center gap-2 text-sm">
              <Video className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <a
                href={interview.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline truncate"
              >
                Join Meeting
              </a>
            </div>
          )}

          {/* Interviewer */}
          {interview.interviewerName && (
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span>{interview.interviewerName}</span>
            </div>
          )}

          {/* Actions */}
          {interview.status === 'Scheduled' && (
            <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              {onEdit && (
                <Button variant="outline" size="sm" onClick={() => onEdit(interview)} className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
              {onComplete && isPast && (
                <Button variant="outline" size="sm" onClick={() => onComplete(interview)} className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Complete
                </Button>
              )}
              {onCancel && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCancel(interview)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

