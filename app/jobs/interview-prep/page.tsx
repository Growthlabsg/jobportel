'use client';

import { InterviewPreparation } from '@/components/job-seeker/InterviewPreparation';

export default function InterviewPrepPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Interview Preparation</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Get ready for your interviews with research, questions, and practice
          </p>
        </div>
        <InterviewPreparation />
      </div>
    </div>
  );
}
