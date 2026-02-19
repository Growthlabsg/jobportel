'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { CreateInterviewData, Interview } from '@/types/interview';
import { InterviewType } from '@/lib/constants';
import { Calendar, Clock, MapPin, Video, Phone, Users, Briefcase } from 'lucide-react';

interface InterviewFormProps {
  initialData?: Interview;
  applicationId?: string;
  candidateName?: string;
  jobTitle?: string;
  onSubmit: (data: CreateInterviewData) => void;
  onCancel: () => void;
}

export const InterviewForm = ({
  initialData,
  applicationId,
  candidateName,
  jobTitle,
  onSubmit,
  onCancel,
}: InterviewFormProps) => {
  const [formData, setFormData] = useState<CreateInterviewData>({
    applicationId: initialData?.applicationId || applicationId || '',
    jobId: initialData?.jobId || '',
    candidateId: initialData?.candidateId || '',
    type: initialData?.type || 'Video',
    scheduledAt: initialData?.scheduledAt
      ? new Date(initialData.scheduledAt).toISOString().slice(0, 16)
      : '',
    duration: initialData?.duration || 60,
    location: initialData?.location || '',
    meetingLink: initialData?.meetingLink || '',
    interviewerId: initialData?.interviewerId || '',
    interviewerName: initialData?.interviewerName || '',
    interviewerEmail: initialData?.interviewerEmail || '',
    notes: initialData?.notes || '',
  });

  const interviewTypes: InterviewType[] = ['Phone', 'Video', 'In-person', 'Technical'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.applicationId) {
      alert('Application ID is required');
      return;
    }
    if (!formData.scheduledAt) {
      alert('Please select a date and time');
      return;
    }
    if (formData.type === 'Video' && !formData.meetingLink) {
      alert('Please provide a meeting link for video interviews');
      return;
    }
    if (formData.type === 'In-person' && !formData.location) {
      alert('Please provide a location for in-person interviews');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Candidate Info */}
      {candidateName && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{candidateName}</p>
              {jobTitle && <p className="text-sm text-gray-600 dark:text-gray-400">{jobTitle}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Interview Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Interview Type *
        </label>
        <div className="flex flex-wrap gap-2">
          {interviewTypes.map((type) => (
            <Badge
              key={type}
              variant={formData.type === type ? 'primary' : 'default'}
              size="md"
              className="cursor-pointer px-4 py-2 flex items-center gap-2"
              onClick={() => setFormData((prev) => ({ ...prev, type }))}
            >
              {type === 'Phone' && <Phone className="h-4 w-4" />}
              {type === 'Video' && <Video className="h-4 w-4" />}
              {type === 'In-person' && <MapPin className="h-4 w-4" />}
              {type === 'Technical' && <Briefcase className="h-4 w-4" />}
              {type}
            </Badge>
          ))}
        </div>
      </div>

      {/* Date and Time */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4 inline mr-1" />
            Date & Time *
          </label>
          <Input
            type="datetime-local"
            value={formData.scheduledAt}
            onChange={(e) => setFormData((prev) => ({ ...prev, scheduledAt: e.target.value }))}
            required
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="h-4 w-4 inline mr-1" />
            Duration (minutes) *
          </label>
          <Input
            type="number"
            value={formData.duration}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, duration: parseInt(e.target.value) || 60 }))
            }
            min="15"
            max="240"
            step="15"
            required
          />
        </div>
      </div>

      {/* Location (for In-person) */}
      {formData.type === 'In-person' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="h-4 w-4 inline mr-1" />
            Location *
          </label>
          <Input
            value={formData.location || ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
            placeholder="e.g., Office Address, Building Name, Room Number"
            required={formData.type === 'In-person'}
          />
        </div>
      )}

      {/* Meeting Link (for Video) */}
      {formData.type === 'Video' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Video className="h-4 w-4 inline mr-1" />
            Meeting Link *
          </label>
          <Input
            type="url"
            value={formData.meetingLink || ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, meetingLink: e.target.value }))}
            placeholder="https://zoom.us/j/..."
            required={formData.type === 'Video'}
          />
        </div>
      )}

      {/* Interviewer Info */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interviewer Name
          </label>
          <Input
            value={formData.interviewerName || ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, interviewerName: e.target.value }))}
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interviewer Email
          </label>
          <Input
            type="email"
            value={formData.interviewerEmail || ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, interviewerEmail: e.target.value }))}
            placeholder="john@company.com"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Interview Notes
        </label>
        <textarea
          value={formData.notes || ''}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
          placeholder="Add any special instructions, topics to cover, or preparation notes..."
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Interview' : 'Schedule Interview'}
        </Button>
      </div>
    </form>
  );
};

