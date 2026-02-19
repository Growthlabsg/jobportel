'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Video,
  Lightbulb,
  Target,
  Clock,
  FileText,
} from 'lucide-react';
import { InterviewPreparation as InterviewPrepType } from '@/types/interview';

interface InterviewPreparationProps {
  interviewId?: string;
  jobId?: string;
  companyId?: string;
}

export function InterviewPreparation({ interviewId, jobId, companyId }: InterviewPreparationProps) {
  const [prep, setPrep] = useState<InterviewPrepType | null>(null);

  // Mock preparation data
  const mockPrep: InterviewPrepType = {
    id: '1',
    interviewId: interviewId || '1',
    jobId: jobId || '1',
    companyId: companyId || '1',
    research: {
      companyInfo: 'TechNova Solutions is a leading AI company focused on enterprise automation...',
      jobDescription: 'We are looking for a Senior Full Stack Developer...',
      keyRequirements: [
        '5+ years of experience in React and Node.js',
        'Strong understanding of TypeScript',
        'Experience with cloud platforms (AWS)',
      ],
      companyValues: ['Innovation', 'Collaboration', 'Excellence'],
      recentNews: [
        'Raised $50M Series B funding',
        'Launched new AI product line',
        'Expanded to 3 new markets',
      ],
    },
    questions: {
      common: [
        'Tell me about yourself',
        'Why do you want to work here?',
        'What are your strengths and weaknesses?',
        'Where do you see yourself in 5 years?',
      ],
      technical: [
        'Explain React hooks and when to use them',
        'How do you handle state management in large applications?',
        'Describe your experience with microservices architecture',
      ],
      behavioral: [
        'Tell me about a time you faced a difficult challenge',
        'Describe a situation where you had to work with a difficult team member',
        'How do you prioritize tasks when you have multiple deadlines?',
      ],
      companySpecific: [
        'What interests you about our AI products?',
        'How do you see yourself contributing to our mission?',
        'What questions do you have about our tech stack?',
      ],
    },
    answers: [],
    practice: {
      mockInterviews: 2,
      lastPracticeDate: new Date().toISOString(),
    },
    checklist: {
      resume: true,
      portfolio: true,
      research: true,
      questions: false,
      attire: false,
      location: true,
      technology: true,
    },
  };

  const displayPrep = prep || mockPrep;

  const checklistItems = [
    { key: 'resume' as const, label: 'Resume Updated', icon: FileText },
    { key: 'portfolio' as const, label: 'Portfolio Ready', icon: FileText },
    { key: 'research' as const, label: 'Company Research', icon: BookOpen },
    { key: 'questions' as const, label: 'Questions Prepared', icon: MessageSquare },
    { key: 'attire' as const, label: 'Interview Attire', icon: Target },
    { key: 'location' as const, label: 'Location Confirmed', icon: Target },
    { key: 'technology' as const, label: 'Tech Tested', icon: Video },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Interview Preparation</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Get ready for your upcoming interview</p>
          </div>
        </div>

        {/* Preparation Checklist */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Preparation Checklist</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {checklistItems.map((item) => {
              const checked = displayPrep.checklist[item.key];
              const Icon = item.icon;
              return (
                <div
                  key={item.key}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 ${
                    checked
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {checked ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  )}
                  <Icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className={`text-sm font-medium ${checked ? 'text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Company Research */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Company Research
          </h4>
          <Card className="p-4 bg-gray-50 border-gray-200 dark:border-gray-700">
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <div>
                <div className="font-medium mb-1">About the Company:</div>
                <p>{displayPrep.research.companyInfo}</p>
              </div>
              <div>
                <div className="font-medium mb-1">Key Requirements:</div>
                <ul className="list-disc list-inside space-y-1">
                  {displayPrep.research.keyRequirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-medium mb-1">Company Values:</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {displayPrep.research.companyValues.map((value, idx) => (
                    <Badge key={idx} className="bg-primary/10 text-primary border-primary/20">
                      {value}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Interview Questions */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Common Interview Questions
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 border-gray-200 dark:border-gray-700">
              <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">General Questions</h5>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {displayPrep.questions.common.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-4 border-gray-200 dark:border-gray-700">
              <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Technical Questions</h5>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {displayPrep.questions.technical.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-4 border-gray-200 dark:border-gray-700">
              <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Behavioral Questions</h5>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {displayPrep.questions.behavioral.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-4 border-gray-200 dark:border-gray-700">
              <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Company-Specific</h5>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {displayPrep.questions.companySpecific.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        {/* Practice Sessions */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Video className="h-4 w-4" />
            Practice Sessions
          </h4>
          <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  Mock Interviews Completed: {displayPrep.practice.mockInterviews}
                </div>
                {displayPrep.practice.lastPracticeDate && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Last practice: {new Date(displayPrep.practice.lastPracticeDate).toLocaleDateString()}
                  </div>
                )}
              </div>
              <Button>
                <Video className="h-4 w-4 mr-2" />
                Schedule Mock Interview
              </Button>
            </div>
          </Card>
        </div>

        <div className="flex gap-3">
          <Button className="flex-1">
            <FileText className="h-4 w-4 mr-2" />
            Download Preparation Guide
          </Button>
          <Button variant="outline" className="flex-1">
            <Clock className="h-4 w-4 mr-2" />
            View Interview Details
          </Button>
        </div>
      </Card>
    </div>
  );
}

