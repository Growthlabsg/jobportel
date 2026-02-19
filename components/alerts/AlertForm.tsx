'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { X, Plus } from 'lucide-react';
import { JobAlert, CreateAlertData, AlertFrequency } from '@/types/alert';
import { JOB_TYPES, EXPERIENCE_LEVELS, LOCATIONS } from '@/lib/constants';
import { getCurrencyForLocation, getCurrencyForUser } from '@/lib/currency-region';

interface AlertFormProps {
  initialData?: JobAlert;
  onSubmit: (data: CreateAlertData) => void;
  onCancel: () => void;
}

export const AlertForm = ({ initialData, onSubmit, onCancel }: AlertFormProps) => {
  const [formData, setFormData] = useState<CreateAlertData>({
    name: initialData?.name || '',
    keywords: initialData?.keywords || [],
    locations: initialData?.locations || [],
    jobTypes: initialData?.jobTypes || [],
    experienceLevels: initialData?.experienceLevels || [],
    salaryMin: initialData?.salaryMin,
    salaryMax: initialData?.salaryMax,
    salaryCurrency: initialData?.salaryCurrency || (typeof window !== 'undefined' ? getCurrencyForUser() : 'USD'),
    remoteWork: initialData?.remoteWork || [],
    industries: initialData?.industries || [],
    skills: initialData?.skills || [],
    frequency: initialData?.frequency || 'Daily',
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [skillInput, setSkillInput] = useState('');

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()],
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== keyword),
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills?.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills?.filter((s) => s !== skill) || [],
    }));
  };

  const toggleArrayItem = (field: keyof CreateAlertData, value: string) => {
    setFormData((prev) => {
      const current = (prev[field] as string[]) || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  // Auto-detect currency based on selected locations
  useEffect(() => {
    if (formData.locations && formData.locations.length > 0) {
      // Use the first location to determine currency
      const detectedCurrency = getCurrencyForLocation(formData.locations[0]);
      if (detectedCurrency !== formData.salaryCurrency) {
        setFormData((prev) => ({
          ...prev,
          salaryCurrency: detectedCurrency,
        }));
      }
    }
  }, [formData.locations]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter an alert name');
      return;
    }
    if (formData.keywords.length === 0 && formData.locations.length === 0) {
      alert('Please add at least one keyword or location');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Alert Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alert Name *
        </label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Software Engineer Jobs in Singapore"
          required
        />
      </div>

      {/* Keywords */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Keywords *
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addKeyword();
              }
            }}
            placeholder="e.g., React, Python, Product Manager"
            className="flex-1"
          />
          <Button type="button" onClick={addKeyword} variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {formData.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.keywords.map((keyword) => (
              <Badge
                key={keyword}
                variant="default"
                size="sm"
                className="flex items-center gap-1"
              >
                {keyword}
                <button
                  type="button"
                  onClick={() => removeKeyword(keyword)}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Locations */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Locations *
        </label>
        <div className="flex flex-wrap gap-2">
          {LOCATIONS.slice(0, 10).map((location) => (
            <Badge
              key={location}
              variant={formData.locations.includes(location) ? 'primary' : 'default'}
              size="sm"
              className="cursor-pointer"
              onClick={() => toggleArrayItem('locations', location)}
            >
              {location}
            </Badge>
          ))}
        </div>
      </div>

      {/* Job Types */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Types
        </label>
        <div className="flex flex-wrap gap-2">
          {JOB_TYPES.map((type) => (
            <Badge
              key={type}
              variant={formData.jobTypes.includes(type) ? 'primary' : 'default'}
              size="sm"
              className="cursor-pointer"
              onClick={() => toggleArrayItem('jobTypes', type)}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>

      {/* Experience Levels */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Experience Levels
        </label>
        <div className="flex flex-wrap gap-2">
          {EXPERIENCE_LEVELS.map((level) => (
            <Badge
              key={level}
              variant={formData.experienceLevels?.includes(level) ? 'primary' : 'default'}
              size="sm"
              className="cursor-pointer"
              onClick={() => toggleArrayItem('experienceLevels', level)}
            >
              {level}
            </Badge>
          ))}
        </div>
      </div>

      {/* Remote Work */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Remote Work Options
        </label>
        <div className="flex flex-wrap gap-2">
          {['Remote', 'Hybrid', 'On-site'].map((option) => (
            <Badge
              key={option}
              variant={formData.remoteWork?.includes(option as any) ? 'primary' : 'default'}
              size="sm"
              className="cursor-pointer"
              onClick={() => toggleArrayItem('remoteWork', option)}
            >
              {option}
            </Badge>
          ))}
        </div>
      </div>

      {/* Salary Range */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Salary
          </label>
          <Input
            type="number"
            value={formData.salaryMin || ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                salaryMin: e.target.value ? parseInt(e.target.value) : undefined,
              }))
            }
            placeholder="5000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Salary
          </label>
          <Input
            type="number"
            value={formData.salaryMax || ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                salaryMax: e.target.value ? parseInt(e.target.value) : undefined,
              }))
            }
            placeholder="15000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            value={formData.salaryCurrency}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, salaryCurrency: e.target.value }))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="SGD">SGD</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Required Skills
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
              }
            }}
            placeholder="e.g., React, Node.js, AWS"
            className="flex-1"
          />
          <Button type="button" onClick={addSkill} variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {formData.skills && formData.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.skills.map((skill) => (
              <Badge
                key={skill}
                variant="default"
                size="sm"
                className="flex items-center gap-1"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Frequency */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alert Frequency *
        </label>
        <div className="flex gap-2">
          {(['Daily', 'Weekly', 'Monthly'] as AlertFrequency[]).map((freq) => (
            <Badge
              key={freq}
              variant={formData.frequency === freq ? 'primary' : 'default'}
              size="md"
              className="cursor-pointer px-4 py-2"
              onClick={() => setFormData((prev) => ({ ...prev, frequency: freq }))}
            >
              {freq}
            </Badge>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Alert' : 'Create Alert'}
        </Button>
      </div>
    </form>
  );
};

