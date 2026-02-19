'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Job } from '@/types/job';
import { Upload, X } from 'lucide-react';
import { trackApplicationStart, trackApplicationCompletion } from '@/services/platform/analytics';
import { createApplication } from '@/services/platform/applications';

const applicationSchema = z.object({
  coverLetter: z.string().optional(),
  portfolio: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  github: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  expectedSalary: z.string().optional(),
  availabilityDate: z.string().optional(),
  noticePeriod: z.string().optional(),
  additionalInfo: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ApplicationFormData & { resume?: File }) => void;
}

export const ApplicationForm = ({ job, isOpen, onClose, onSubmit }: ApplicationFormProps) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  // Track application start when form opens
  useEffect(() => {
    if (isOpen && job?.id) {
      trackApplicationStart(job.id);
    }
  }, [isOpen, job?.id]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      if (file.type !== 'application/pdf' && !file.type.includes('word')) {
        alert('Please upload a PDF or Word document');
        return;
      }
      setResumeFile(file);
    }
  };

  const handleFormSubmit = async (data: ApplicationFormData) => {
    if (!job) return;
    
    setIsSubmitting(true);
    try {
      // Create application via platform API
      const applicationData = {
        jobId: job.id,
        coverLetter: data.coverLetter,
        portfolio: data.portfolio,
        linkedin: data.linkedin,
        github: data.github,
        expectedSalary: data.expectedSalary ? parseFloat(data.expectedSalary) : undefined,
        availabilityDate: data.availabilityDate,
        noticePeriod: data.noticePeriod,
        additionalInfo: data.additionalInfo,
      };

      const createdApplication = await createApplication(applicationData);
      
      if (createdApplication) {
        // Track application completion
        await trackApplicationCompletion(job.id, createdApplication.id);
        setApplicationId(createdApplication.id);
      }

      // Also call the onSubmit callback for backward compatibility
      await onSubmit({
        ...data,
        resume: resumeFile || undefined,
      });
      
      reset();
      setResumeFile(null);
      onClose();
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setResumeFile(null);
    onClose();
  };

  if (!job) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Apply to ${job.title}`} size="lg">
      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Global Applications Welcome:</strong> We accept applications from candidates worldwide. Your location does not limit your ability to apply.
        </p>
      </div>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Resume Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resume <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            {resumeFile ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{resumeFile.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(resumeFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setResumeFile(null)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PDF or Word (Max 5MB)</p>
                </div>
              </label>
            )}
          </div>
        </div>

        {/* Cover Letter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cover Letter
          </label>
          <textarea
            {...register('coverLetter')}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Tell us why you're a great fit for this role..."
          />
          {errors.coverLetter && (
            <p className="mt-1 text-sm text-red-600">{errors.coverLetter.message}</p>
          )}
        </div>

        {/* Portfolio Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Portfolio URL"
            {...register('portfolio')}
            placeholder="https://yourportfolio.com"
            error={errors.portfolio?.message}
          />
          <Input
            label="LinkedIn Profile"
            {...register('linkedin')}
            placeholder="https://linkedin.com/in/yourprofile"
            error={errors.linkedin?.message}
          />
        </div>

        <Input
          label="GitHub Profile"
          {...register('github')}
          placeholder="https://github.com/yourusername"
          error={errors.github?.message}
        />

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Expected Salary"
            type="number"
            {...register('expectedSalary')}
            placeholder="e.g., 8000"
            error={errors.expectedSalary?.message}
          />
          <Input
            label="Availability Date"
            type="date"
            {...register('availabilityDate')}
            error={errors.availabilityDate?.message}
          />
          <Input
            label="Notice Period"
            {...register('noticePeriod')}
            placeholder="e.g., 2 weeks"
            error={errors.noticePeriod?.message}
          />
        </div>

        {/* Additional Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Information
          </label>
          <textarea
            {...register('additionalInfo')}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Any additional information you'd like to share..."
          />
          {errors.additionalInfo && (
            <p className="mt-1 text-sm text-red-600">{errors.additionalInfo.message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!resumeFile || isSubmitting} isLoading={isSubmitting}>
            Submit Application
          </Button>
        </div>
      </form>
    </Modal>
  );
};

