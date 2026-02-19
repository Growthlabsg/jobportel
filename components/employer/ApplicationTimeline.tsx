'use client';

import { Application } from '@/types/application';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { 
  FileText, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Mail, 
  MessageSquare,
  Star,
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface TimelineEvent {
  id: string;
  type: 'submitted' | 'reviewed' | 'shortlisted' | 'interview' | 'offered' | 'hired' | 'rejected' | 'note' | 'rating';
  title: string;
  description?: string;
  timestamp: string;
  user?: string;
  metadata?: Record<string, any>;
}

interface ApplicationTimelineProps {
  application: Application;
  events?: TimelineEvent[];
}

const getEventIcon = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'submitted':
      return FileText;
    case 'reviewed':
      return Eye;
    case 'shortlisted':
      return CheckCircle;
    case 'interview':
      return Calendar;
    case 'offered':
      return CheckCircle;
    case 'hired':
      return CheckCircle;
    case 'rejected':
      return XCircle;
    case 'note':
      return MessageSquare;
    case 'rating':
      return Star;
    default:
      return Clock;
  }
};

const getEventColor = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'submitted':
      return 'bg-gray-100 text-gray-600';
    case 'reviewed':
      return 'bg-blue-100 text-blue-600';
    case 'shortlisted':
      return 'bg-purple-100 text-purple-600';
    case 'interview':
      return 'bg-yellow-100 text-yellow-600';
    case 'offered':
      return 'bg-green-100 text-green-600';
    case 'hired':
      return 'bg-primary text-white';
    case 'rejected':
      return 'bg-red-100 text-red-600';
    case 'note':
      return 'bg-gray-100 text-gray-600';
    case 'rating':
      return 'bg-yellow-100 text-yellow-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

export const ApplicationTimeline = ({ application, events }: ApplicationTimelineProps) => {
  // Generate timeline events from application history
  const defaultEvents: TimelineEvent[] = [
    {
      id: '1',
      type: 'submitted',
      title: 'Application Submitted',
      description: `${application.applicant.name} submitted their application`,
      timestamp: application.createdAt,
    },
    ...(application.status !== 'Submitted'
      ? [
          {
            id: '2',
            type: 'reviewed',
            title: 'Application Reviewed',
            description: 'Application has been reviewed',
            timestamp: application.updatedAt,
          } as TimelineEvent,
        ]
      : []),
    ...(application.status === 'Shortlisted' || application.status === 'Interviewing' || application.status === 'Offered' || application.status === 'Hired'
      ? [
          {
            id: '3',
            type: 'shortlisted',
            title: 'Candidate Shortlisted',
            description: 'Candidate has been shortlisted',
            timestamp: application.updatedAt,
          } as TimelineEvent,
        ]
      : []),
    ...(application.status === 'Interviewing'
      ? [
          {
            id: '4',
            type: 'interview',
            title: 'Interview Scheduled',
            description: 'Interview has been scheduled',
            timestamp: application.updatedAt,
          } as TimelineEvent,
        ]
      : []),
    ...(application.status === 'Offered'
      ? [
          {
            id: '5',
            type: 'offered',
            title: 'Offer Extended',
            description: 'Job offer has been extended to candidate',
            timestamp: application.updatedAt,
          } as TimelineEvent,
        ]
      : []),
    ...(application.status === 'Hired'
      ? [
          {
            id: '6',
            type: 'hired',
            title: 'Candidate Hired',
            description: 'Candidate has accepted the offer',
            timestamp: application.updatedAt,
          } as TimelineEvent,
        ]
      : []),
    ...(application.status === 'Rejected'
      ? [
          {
            id: '7',
            type: 'rejected',
            title: 'Application Rejected',
            description: 'Application has been rejected',
            timestamp: application.updatedAt,
          } as TimelineEvent,
        ]
      : []),
  ];

  const timelineEvents = events || defaultEvents;
  const sortedEvents = [...timelineEvents].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Application Timeline</h3>
        <Badge variant="default" size="sm">
          {sortedEvents.length} Events
        </Badge>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

        <div className="space-y-6">
          {sortedEvents.map((event, index) => {
            const Icon = getEventIcon(event.type);
            const isLast = index === sortedEvents.length - 1;

            return (
              <div key={event.id} className="relative flex gap-4">
                {/* Icon */}
                <div
                  className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getEventColor(
                    event.type
                  )}`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{event.title}</h4>
                        {event.description && (
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                        {formatRelativeTime(event.timestamp)}
                      </span>
                    </div>

                    {event.metadata && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        {event.metadata.rating && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Rating:</span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < (event.metadata?.rating || 0)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        {event.metadata.note && (
                          <p className="text-sm text-gray-600 mt-2">{event.metadata.note}</p>
                        )}
                        {event.metadata.interviewDate && (
                          <p className="text-sm text-gray-600 mt-2">
                            Interview Date: {formatDate(event.metadata.interviewDate)}
                          </p>
                        )}
                      </div>
                    )}

                    {event.user && (
                      <p className="text-xs text-gray-500 mt-2">by {event.user}</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1 ml-1">
                    {formatDate(event.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

