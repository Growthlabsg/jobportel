'use client';

import { useState } from 'react';
import { Application, ApplicationStatus } from '@/types/application';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { User, Mail, Phone, FileText, Eye } from 'lucide-react';

interface ApplicationPipelineProps {
  applications: Application[];
  onStatusChange: (applicationId: string, status: ApplicationStatus) => void;
  onView: (application: Application) => void;
}

const PIPELINE_STAGES: { status: ApplicationStatus; label: string; color: string }[] = [
  { status: 'Submitted', label: 'Applied', color: 'bg-gray-100 text-gray-800' },
  { status: 'Reviewed', label: 'Under Review', color: 'bg-blue-100 text-blue-800' },
  { status: 'Shortlisted', label: 'Shortlisted', color: 'bg-purple-100 text-purple-800' },
  { status: 'Interviewing', label: 'Interview Scheduled', color: 'bg-yellow-100 text-yellow-800' },
  { status: 'Offered', label: 'Offer Extended', color: 'bg-green-100 text-green-800' },
  { status: 'Hired', label: 'Hired', color: 'bg-primary text-white' },
  { status: 'Rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
];

export const ApplicationPipeline = ({
  applications,
  onStatusChange,
  onView,
}: ApplicationPipelineProps) => {
  const [draggedApplication, setDraggedApplication] = useState<Application | null>(null);

  const getApplicationsByStatus = (status: ApplicationStatus) => {
    return applications.filter((app) => app.status === status);
  };

  const handleDragStart = (application: Application) => {
    setDraggedApplication(application);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: ApplicationStatus) => {
    e.preventDefault();
    if (draggedApplication && draggedApplication.status !== targetStatus) {
      onStatusChange(draggedApplication.id, targetStatus);
    }
    setDraggedApplication(null);
  };

  const handleDragEnd = () => {
    setDraggedApplication(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Application Pipeline</h2>
          <p className="text-gray-600 mt-1">Drag and drop applications to update their status</p>
        </div>
        <Badge variant="info" size="md">
          {applications.length} Total Applications
        </Badge>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {PIPELINE_STAGES.map((stage) => {
          const stageApplications = getApplicationsByStatus(stage.status);

          return (
            <div
              key={stage.status}
              className="flex-shrink-0 w-80"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.status)}
            >
              <div className="mb-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{stage.label}</h3>
                  <Badge variant="default" size="sm" className={stage.color}>
                    {stageApplications.length}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 min-h-[400px]">
                {stageApplications.map((application) => (
                  <Card
                    key={application.id}
                    className="cursor-move hover:shadow-md transition-shadow"
                    draggable
                    onDragStart={() => handleDragStart(application)}
                    onDragEnd={handleDragEnd}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {application.applicant.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()
                                .slice(0, 2)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">
                                {application.applicant.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {application.job.title}
                              </p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => onView(application)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{application.applicant.email}</span>
                        </div>
                        {application.applicant.phone && (
                          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <Phone className="h-3 w-3" />
                            <span>{application.applicant.phone}</span>
                          </div>
                        )}
                        {application.matchScore && (
                          <div className="flex items-center gap-2">
                            <Badge variant="info" size="sm">
                              {application.matchScore}% Match
                            </Badge>
                          </div>
                        )}
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Applied {formatDate(application.createdAt)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {stageApplications.length === 0 && (
                  <div className="h-32 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-sm text-gray-400 dark:text-gray-500">Drop applications here</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

