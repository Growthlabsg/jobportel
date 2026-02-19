'use client';

import { useState } from 'react';
import { Interview } from '@/types/interview';
import { InterviewCard } from './InterviewCard';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

interface InterviewCalendarProps {
  interviews: Interview[];
  onInterviewClick?: (interview: Interview) => void;
  onEdit?: (interview: Interview) => void;
  onCancel?: (interview: Interview) => void;
  onComplete?: (interview: Interview) => void;
}

export const InterviewCalendar = ({
  interviews,
  onInterviewClick,
  onEdit,
  onCancel,
  onComplete,
}: InterviewCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const days: (Date | null)[] = [];
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }

  const getInterviewsForDate = (date: Date | null): Interview[] => {
    if (!date) return [];
    const dateStr = date.toDateString();
    return interviews.filter((interview) => {
      const interviewDate = new Date(interview.scheduledAt);
      return interviewDate.toDateString() === dateStr && interview.status === 'Scheduled';
    });
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {monthNames[month]} {year}
          </h2>
          <Button variant="outline" size="sm" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={goToToday}>
          <CalendarIcon className="h-4 w-4 mr-2" />
          Today
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {dayNames.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {days.map((date, index) => {
          const dayInterviews = getInterviewsForDate(date);
          const isToday = date && date.toDateString() === new Date().toDateString();
          const isPast = date && date < new Date() && !isToday;

          return (
            <div
              key={index}
              className={`min-h-[100px] p-2 border border-gray-200 rounded ${
                isToday ? 'bg-primary/5 border-primary' : ''
              } ${isPast ? 'bg-gray-50' : 'bg-white'}`}
            >
              {date && (
                <>
                  <div
                    className={`text-sm font-medium mb-1 ${
                      isToday ? 'text-primary' : isPast ? 'text-gray-400' : 'text-gray-900'
                    }`}
                  >
                    {date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayInterviews.slice(0, 2).map((interview) => (
                      <div
                        key={interview.id}
                        className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded cursor-pointer hover:bg-primary/20 truncate"
                        onClick={() => onInterviewClick?.(interview)}
                        title={`${interview.candidateName} - ${interview.type}`}
                      >
                        {interview.candidateName}
                      </div>
                    ))}
                    {dayInterviews.length > 2 && (
                      <div className="text-xs text-gray-500 px-2">
                        +{dayInterviews.length - 2} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

