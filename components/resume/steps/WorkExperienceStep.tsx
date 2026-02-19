'use client';

import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { WorkExperience } from '@/types/resume';

interface WorkExperienceStepProps {
  data: WorkExperience[];
  onChange: (data: WorkExperience[]) => void;
}

export const WorkExperienceStep = ({ data, onChange }: WorkExperienceStepProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const addExperience = () => {
    const newExp: WorkExperience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
    };
    onChange([...data, newExp]);
    setEditingId(newExp.id);
  };

  const removeExperience = (id: string) => {
    onChange(data.filter((exp) => exp.id !== id));
  };

  const updateExperience = (id: string, updates: Partial<WorkExperience>) => {
    onChange(
      data.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp))
    );
  };

  const addAchievement = (id: string) => {
    const exp = data.find((e) => e.id === id);
    if (exp) {
      updateExperience(id, {
        achievements: [...(exp.achievements || []), ''],
      });
    }
  };

  const updateAchievement = (id: string, index: number, value: string) => {
    const exp = data.find((e) => e.id === id);
    if (exp) {
      const achievements = [...(exp.achievements || [])];
      achievements[index] = value;
      updateExperience(id, { achievements });
    }
  };

  const removeAchievement = (id: string, index: number) => {
    const exp = data.find((e) => e.id === id);
    if (exp) {
      const achievements = exp.achievements?.filter((_, i) => i !== index) || [];
      updateExperience(id, { achievements });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Add your work experience, starting with the most recent
        </p>
        <Button onClick={addExperience} size="sm" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Experience
        </Button>
      </div>

      {data.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-4">No work experience added yet</p>
          <Button onClick={addExperience} variant="outline">
            Add Your First Experience
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {data.map((exp, index) => (
          <div key={exp.id} className="border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Experience #{index + 1}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeExperience(exp.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <Input
                    value={exp.title}
                    onChange={(e) => updateExperience(exp.id, { title: e.target.value })}
                    placeholder="Senior Software Engineer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company *
                  </label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                    placeholder="Tech Company Inc."
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <Input
                    value={exp.location}
                    onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                    placeholder="Singapore"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <Input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <Input
                      type="month"
                      value={exp.endDate || ''}
                      onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                      disabled={exp.current}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`current-${exp.id}`}
                  checked={exp.current}
                  onChange={(e) => {
                    updateExperience(exp.id, {
                      current: e.target.checked,
                      endDate: e.target.checked ? undefined : exp.endDate,
                    });
                  }}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor={`current-${exp.id}`} className="text-sm text-gray-700 dark:text-gray-300">
                  I currently work here
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                  placeholder="Describe your role and responsibilities..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Key Achievements
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addAchievement(exp.id)}
                    className="flex items-center gap-1 text-xs"
                  >
                    <Plus className="h-3 w-3" />
                    Add Achievement
                  </Button>
                </div>
                <div className="space-y-2">
                  {exp.achievements?.map((achievement, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        value={achievement}
                        onChange={(e) => updateAchievement(exp.id, idx, e.target.value)}
                        placeholder="e.g., Increased revenue by 30%"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAchievement(exp.id, idx)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

