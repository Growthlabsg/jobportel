'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { InterviewFeedback } from '@/types/interview';
import { Star, Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface InterviewFeedbackFormProps {
  initialData?: InterviewFeedback;
  onSubmit: (feedback: InterviewFeedback) => void;
  onCancel: () => void;
}

export const InterviewFeedbackForm = ({
  initialData,
  onSubmit,
  onCancel,
}: InterviewFeedbackFormProps) => {
  const [feedback, setFeedback] = useState<Partial<InterviewFeedback>>({
    id: initialData?.id || '',
    interviewId: initialData?.interviewId || '',
    overallRating: initialData?.overallRating || 0,
    technicalSkills: initialData?.technicalSkills || 0,
    communication: initialData?.communication || 0,
    culturalFit: initialData?.culturalFit || 0,
    problemSolving: initialData?.problemSolving || 0,
    notes: initialData?.notes || '',
    strengths: initialData?.strengths || [],
    areasForImprovement: initialData?.areasForImprovement || [],
    recommendation: initialData?.recommendation || 'Maybe',
    submittedBy: initialData?.submittedBy || '',
    submittedAt: initialData?.submittedAt || new Date().toISOString(),
  });

  const [strengthInput, setStrengthInput] = useState('');
  const [weaknessInput, setWeaknessInput] = useState('');

  const addStrength = () => {
    if (strengthInput.trim() && !feedback.strengths?.includes(strengthInput.trim())) {
      setFeedback((prev) => ({
        ...prev,
        strengths: [...(prev.strengths || []), strengthInput.trim()],
      }));
      setStrengthInput('');
    }
  };

  const removeStrength = (strength: string) => {
    setFeedback((prev) => ({
      ...prev,
      strengths: prev.strengths?.filter((s) => s !== strength) || [],
    }));
  };

  const addWeakness = () => {
    if (weaknessInput.trim() && !feedback.areasForImprovement?.includes(weaknessInput.trim())) {
      setFeedback((prev) => ({
        ...prev,
        areasForImprovement: [...(prev.areasForImprovement || []), weaknessInput.trim()],
      }));
      setWeaknessInput('');
    }
  };

  const removeWeakness = (weakness: string) => {
    setFeedback((prev) => ({
      ...prev,
      areasForImprovement: prev.areasForImprovement?.filter((w) => w !== weakness) || [],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.overallRating || feedback.overallRating === 0) {
      alert('Please provide an overall rating');
      return;
    }
    if (!feedback.id || !feedback.interviewId) {
      alert('Missing required fields');
      return;
    }
    onSubmit(feedback as InterviewFeedback);
  };

  const StarRating = ({
    value,
    onChange,
    label,
  }: {
    value: number;
    onChange: (value: number) => void;
    label: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 ${
                star <= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{value}/5</span>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Overall Rating */}
      <StarRating
        value={feedback.overallRating || 0}
        onChange={(value) => setFeedback((prev) => ({ ...prev, overallRating: value }))}
        label="Overall Rating *"
      />

      {/* Detailed Ratings */}
      <div className="grid md:grid-cols-2 gap-4">
        <StarRating
          value={feedback.technicalSkills || 0}
          onChange={(value) => setFeedback((prev) => ({ ...prev, technicalSkills: value }))}
          label="Technical Skills"
        />
        <StarRating
          value={feedback.communication || 0}
          onChange={(value) => setFeedback((prev) => ({ ...prev, communication: value }))}
          label="Communication"
        />
        <StarRating
          value={feedback.culturalFit || 0}
          onChange={(value) => setFeedback((prev) => ({ ...prev, culturalFit: value }))}
          label="Cultural Fit"
        />
        <StarRating
          value={feedback.problemSolving || 0}
          onChange={(value) => setFeedback((prev) => ({ ...prev, problemSolving: value }))}
          label="Problem Solving"
        />
      </div>

      {/* Strengths */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Strengths</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={strengthInput}
            onChange={(e) => setStrengthInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addStrength();
              }
            }}
            placeholder="Add a strength..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <Button type="button" onClick={addStrength} variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {feedback.strengths && feedback.strengths.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {feedback.strengths.map((strength, idx) => (
              <Badge key={idx} variant="success" size="sm" className="flex items-center gap-1">
                {strength}
                <button
                  type="button"
                  onClick={() => removeStrength(strength)}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Weaknesses */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Areas for Improvement</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={weaknessInput}
            onChange={(e) => setWeaknessInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addWeakness();
              }
            }}
            placeholder="Add an area for improvement..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <Button type="button" onClick={addWeakness} variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {feedback.areasForImprovement && feedback.areasForImprovement.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {feedback.areasForImprovement.map((weakness, idx) => (
              <Badge key={idx} variant="warning" size="sm" className="flex items-center gap-1">
                {weakness}
                <button
                  type="button"
                  onClick={() => removeWeakness(weakness)}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Recommendation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Recommendation *</label>
        <div className="flex flex-wrap gap-2">
          {(['Strong Yes', 'Yes', 'Maybe', 'No', 'Strong No'] as const).map((rec) => (
            <Badge
              key={rec}
              variant={feedback.recommendation === rec ? 'primary' : 'default'}
              size="md"
              className="cursor-pointer px-4 py-2"
              onClick={() => setFeedback((prev) => ({ ...prev, recommendation: rec }))}
            >
              {rec}
            </Badge>
          ))}
        </div>
      </div>

      {/* Overall Comments */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Overall Comments</label>
        <textarea
          value={feedback.notes || ''}
          onChange={(e) => setFeedback((prev) => ({ ...prev, notes: e.target.value }))}
          placeholder="Provide detailed feedback about the interview..."
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
        />
      </div>

      {/* Next Steps */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Next Steps</label>
        <textarea
          value={feedback.notes || ''}
          onChange={(e) => setFeedback((prev) => ({ ...prev, notes: e.target.value }))}
          placeholder="What are the recommended next steps for this candidate?"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Feedback</Button>
      </div>
    </form>
  );
};

